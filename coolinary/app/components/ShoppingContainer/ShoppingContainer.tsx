import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { SortableList } from "~/components";
import React, { useState } from "react";
import { Shopping } from "~/types";
import {
  INPUT_STYLE,
  SORTABLE_ITEM_STYLE,
  LABEL_STYLE,
  TEXTAREA_STYLE,
  BUTTON_STYLE,
  TRANSPARENT,
} from "~/styles/tailwind";
import invariant from "tiny-invariant";

import { deleteShopping, editShopping } from "~/models/shopping.server";
import { requireUserId } from "~/session.server";

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
      await deleteShopping({ userId, id: id });
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

  if (typeof items !== "object") {
    return json(
      {
        errors: {
          title: null,
          items: "Items for the shopping list are required",
        },
      },
      { status: 400 }
    );
  }

  const shoppingList =
    id && id !== "" && (await editShopping({ id, title, body, items }));

  return redirect("/");
}

export function ShoppingContainer({ shopping }: Props) {
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(shopping?.title ? shopping?.title : "");
  const [body, setBody] = useState(shopping?.body ? shopping?.body : "");
  const [items, setItems] = useState(
    shopping?.items
      ? shopping?.items
      : [
          { id: 1, description: "", recipe: "" },
          { id: 2, description: "", recipe: "" },
          { id: 3, description: "", recipe: "" },
        ]
  );
  const addMoreItems = () => {
    setItems([...items, { id: items.length + 1, description: "", recipe: "" }]);
  };
  const updateItems = (newId: number, newDescription: string) =>
    setItems(
      items.map((item) => {
        if (item.id === newId) {
          // Create a *new* object with changes
          return { ...item, description: newDescription };
        } else {
          // No changes
          return item;
        }
      })
    );

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.items) {
      // itemsRef.current?.focus();
    }
  }, [actionData]);

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
              value={title ? title : "Your Shopping List"}
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
                    <div>
                      <input
                        type="checkbox"
                        name="bougthItem"
                        value={item.id}
                        className="checkbox-info checkbox"
                      />
                      <input
                        id={item.id.toString()}
                        value={item.description}
                        onChange={(event) => {
                          updateItems(item.id, event.target.value);
                        }}
                        name="item"
                        className={`${SORTABLE_ITEM_STYLE} ${TRANSPARENT} mx-2 py-0`}
                        aria-invalid={
                          actionData?.errors?.items ? true : undefined
                        }
                        aria-errormessage={
                          actionData?.errors?.items ? "items-error" : undefined
                        }
                      />
                    </div>
                  </>
                  <SortableList.DragHandle />
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
