import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { SortableList } from "~/components";
import React, { useState } from "react";


import { createRecipe } from "~/models/recipe.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const ingredients = formData.get("ingredients");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", ingredients: "Ingredients are required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string") {
    return json(
      { errors: { title: null, ingredients: "Body must be a string value" } },
      { status: 400 }
    );
  }
  if (typeof ingredients !== "string") {
    return json(
      { errors: { title: null, ingredients: "Ingredients are required" } },
      { status: 400 }
    );
  }

  const recipe = await createRecipe({ title, body, ingredients, userId });

  return redirect('/');
}

export default function NewRecipePage() {
  const [items, setItems] = useState([{id: 0, description: 'cebolla'}, {id: 1, description: 'pimiento'}, {id: 2, description: 'pollo'}]);
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const ingredientsRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.ingredients) {
      ingredientsRef.current?.focus();
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
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="input input-bordered input-sm w-full max-w-xs"
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

      <SortableList
        items={items}
        onChange={setItems}
        renderItem={(item) => (
          <SortableList.Item id={item.id}>
            {item.id}
            <SortableList.DragHandle />
          </SortableList.Item>
        )}
      />

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Ingredients: </span>
          <input
            ref={ingredientsRef}
            name="ingredients"
            placeholder="Type here"
            className="input input-bordered input-xs w-full max-w-xs"
            aria-invalid={actionData?.errors?.ingredients ? true : undefined}
            aria-errormessage={
              actionData?.errors?.ingredients ? "ingredients-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.ingredients && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.ingredients}
          </div>
        )}

        <label className="flex w-full flex-col gap-1">
          <span>Preparation (Optional): </span>
          <textarea
            name="body"
            rows={8}
            className="textarea textarea-bordered textarea-xs w-full max-w-xs"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
