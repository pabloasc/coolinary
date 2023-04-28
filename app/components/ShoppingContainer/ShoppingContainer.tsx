import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { SortableList } from "~/components";
import { useOptionalUser, createListTitle } from "~/utils";
import React, { useState } from "react";
import { Shopping } from "~/types";
import { generateId } from "~/utils";
import {
  INPUT_STYLE,
  SORTABLE_ITEM_STYLE,
  LABEL_STYLE,
  TEXTAREA_STYLE,
  BUTTON_STYLE,
  TRANSPARENT,
} from "~/styles/tailwind";

import { deleteShopping, editShopping } from "~/models/shopping.server";
import { requireUserId } from "~/session.server";
import { Item } from "@prisma/client";

interface Props {
  shopping?: Shopping;
}

export async function actionRequest({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const id = formData.get("id");
  const title = formData.get("title");
  const itemList = formData.get("items");
  const submit = formData.get("submit");
  const items = JSON.parse(itemList as string);
  const body = formData.get("body");

  if (submit === "delete") {
    if (typeof id === "string") {
      await deleteShopping({ userId, id });
    }
    return redirect("/");
  }

  if (typeof id !== "string") {
    return json(
      { errors: { title: null, items: "Id must be a string" } },
      { status: 400 }
    );
  }

  if (typeof title !== "string") {
    return json(
      {
        errors: {
          title: "Title is required",
          items: "items are required",
        },
      },
      { status: 400 }
    );
  }

  if (typeof body !== "string") {
    return json(
      { errors: { title: null, items: "Body must be a string value" } },
      { status: 400 }
    );
  }

  var properArray: Item[] = [];
  if (items.length === 0) {
    return json(
      {
        errors: {
          title: null,
          items: "Items for the shopping list are required",
        },
      },
      { status: 400 }
    );
  } else {
    // remove items with empty description
    properArray = items.filter((i: Item) => i.description.trim() !== "");
  }

  const shoppingList =
    id &&
    id !== "" &&
    (await editShopping({ id, title, body, items: properArray }));

  return redirect("/");
}

export function ShoppingContainer({ shopping }: Props) {
  const user = useOptionalUser();
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(shopping?.title ? shopping?.title : "");
  const [body, setBody] = useState(shopping?.body ? shopping?.body : "");
  const [editing, setEditing] = useState(0);
  const [items, setItems] = useState(
    shopping?.items
      ? shopping?.items
      : [{ id: generateId(), description: "", bought: false, recipe: "" }]
  );
  const addMoreItems = () => {
    const newId = generateId();
    setItems([
      ...items,
      { id: newId, description: "", bought: false, recipe: "" },
    ]);
    setEditing(newId);
  };

  const deleteItem = (itemId: number) => {
    setItems(items.filter((obj) => obj.id !== itemId));
  };
  const updateItems = (
    newId: number,
    newDescription: string,
    newBought: boolean
  ) =>
    setItems(
      items.map((item) => {
        if (item.id === newId) {
          // Create a *new* object with changes
          return { ...item, description: newDescription, bought: newBought };
        } else {
          // No changes
          return item;
        }
      })
    );

  React.useEffect(() => {
    //TODO: focus proper input
    // titleRef.current?.focus();
  }, [setEditing]);

  return (
    <div className="card rounded-lg border border-gray-400 bg-white">
      <div className="card-body">
        <Form method="post" action={`/shopping/edit/${shopping?.id}`}>
          <input
            type="hidden"
            name="id"
            value={shopping?.id ? shopping?.id : ""}
          ></input>

          <div>
            <input
              name="title"
              value={
                title
                  ? title
                  : createListTitle(shopping?.createdAt, user?.language)
              }
              onChange={(event) => setTitle(event?.target.value)}
              className={`${INPUT_STYLE} ${TRANSPARENT} card-title text-xl font-extrabold`}
              aria-invalid={actionData?.errors?.title ? true : undefined}
              aria-errormessage={
                actionData?.errors?.title ? "title-error" : undefined
              }
            />
            {actionData?.errors?.title && (
              <div className="pt-1 text-red-700" id="title-error">
                {actionData.errors.title}
              </div>
            )}
          </div>
          <div>
            <SortableList
              items={items}
              onChange={setItems}
              renderItem={(item) => (
                <SortableList.Item id={item.id} recipe={item.recipe}>
                  <>
                    <SortableList.DragHandle />
                    <div key={item.id}>
                      <div className="flex flex-row">
                        <input
                          type="checkbox"
                          name="bougthItem"
                          value={item.id}
                          className="checkbox-info checkbox"
                          checked={item.bought}
                          onChange={() => {
                            updateItems(
                              item.id,
                              item.description,
                              !item.bought
                            );
                          }}
                        />
                        <input
                          id={item.id.toString()}
                          value={item.description}
                          onChange={(event) => {
                            updateItems(
                              item.id,
                              event.target.value,
                              item.bought
                            );
                          }}
                          onFocus={() => setEditing(item.id)}
                          name="item"
                          className={
                            item.bought
                              ? `${SORTABLE_ITEM_STYLE} ${TRANSPARENT} mx-2 py-0 line-through`
                              : `${SORTABLE_ITEM_STYLE} ${TRANSPARENT} mx-2 py-0`
                          }
                          aria-invalid={
                            actionData?.errors?.items ? true : undefined
                          }
                          aria-errormessage={
                            actionData?.errors?.items
                              ? "items-error"
                              : undefined
                          }
                        />
                        {editing === item.id && (
                          <div onClick={() => deleteItem(item.id)}>
                            <svg
                              fill="none"
                              stroke="currentColor"
                              stroke-width="1.5"
                              className="mr-2"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              width="20"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                </SortableList.Item>
              )}
            />

            <div className="mb-4 cursor-pointer pt-1 text-blue-700">
              <a onClick={addMoreItems}>Add more...</a>
            </div>

            {actionData?.errors?.items && (
              <div className="pt-1 text-red-700" id="body-error">
                {actionData.errors.items}
              </div>
            )}

            <input
              type="hidden"
              name="items"
              value={JSON.stringify(items)}
            ></input>

            <label className={LABEL_STYLE}>
              <span>Notes: </span>
              <textarea
                name="body"
                value={body}
                onChange={(event) => setBody(event?.target.value)}
                rows={2}
                className={`${TEXTAREA_STYLE} ${TRANSPARENT}`}
              />
            </label>
          </div>

          <div className="text-right">
            <button
              name="submit"
              type="submit"
              value="delete"
              className={BUTTON_STYLE}
            >
              Delete
            </button>

            <button
              name="submit"
              type="submit"
              value="add"
              className={BUTTON_STYLE}
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
