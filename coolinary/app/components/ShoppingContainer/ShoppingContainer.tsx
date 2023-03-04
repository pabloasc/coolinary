import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { SortableList } from "~/components";
import React, { useState } from "react";
import { Shopping } from "~/types";
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
      { errors: { title: null, items: "Items for the shopping list are required" } },
      { status: 400 }
    );
  }

  const shoppingList =
    id && id !== ""
      ? await editShopping({ id, title, body, items });

  return redirect("/");
}

export function RecipeContainer({ shopping }: Props) {
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(shopping?.title ? shopping?.title : "");
  const [body, setBody] = useState(shopping?.body ? shopping?.body : "");
  const [items, setItems] = useState(
    shopping?.items
      ? shopping?.items
      : [
          { id: 1, description: "" },
          { id: 2, description: "" },
          { id: 3, description: "" },
        ]
  );
  const addMoreItems = () => {
    setItems([...items, { id: items.length + 1, description: "" }]);
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
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <input
        type="hidden"
        name="id"
        value={shopping?.id ? shopping?.id : ""}
      ></input>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event?.target.value)}
            className="input-bordered input input-sm w-full max-w-xs"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
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
            <SortableList.Item id={item.id}>
              <input
                value={item.description}
                onChange={(event) => {
                  updateItems(item.id, event.target.value);
                }}
                name="item"
                className="input-bordered input input-xs w-full max-w-xs"
                aria-invalid={
                  actionData?.errors?.items ? true : undefined
                }
                aria-errormessage={
                  actionData?.errors?.items
                    ? "items-error"
                    : undefined
                }
              />
              <SortableList.DragHandle />
            </SortableList.Item>
          )}
        />

        <a onClick={addMoreItems}>Add more...</a>

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

        <label className="flex w-full flex-col gap-1">
          <span>Preparation (Optional): </span>
          <textarea
            name="body"
            value={body}
            onChange={(event) => setBody(event?.target.value)}
            rows={8}
            className="textarea-bordered textarea textarea-xs w-full max-w-xs"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          name="submit"
          type="submit"
          value="delete"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>

        <button
          name="submit"
          type="submit"
          value="add"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
