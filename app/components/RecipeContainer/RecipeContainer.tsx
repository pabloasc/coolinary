import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { SortableList } from "~/components";
import React, { useState } from "react";
import { Recipe, Ingredient } from "~/types";
import { generateId } from "~/utils";
import {
  INPUT_STYLE,
  SORTABLE_ITEM_STYLE,
  LABEL_STYLE,
  TEXTAREA_STYLE,
  BUTTON_STYLE,
  TRANSPARENT,
} from "~/styles/tailwind";

import { deleteRecipe, createRecipe, editRecipe } from "~/models/recipe.server";
import { requireUserId } from "~/session.server";

interface Props {
  recipe?: Recipe;
}

export async function actionRequest({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const id = formData.get("id");
  const title = formData.get("title");
  const ingredientsList = formData.get("ingredients");
  const submit = formData.get("submit");
  const ingredients = JSON.parse(ingredientsList as string) as Ingredient[];
  const body = formData.get("body");

  if (submit === "delete") {
    if (typeof id === "string") {
      await deleteRecipe({ userId, id: id });
    }
    return redirect("/");
  }

  if (typeof title !== "string" || title.length === 0) {
    return json(
      {
        errors: {
          title: "Title is required",
          ingredients: "Ingredients are required",
        },
      },
      { status: 400 }
    );
  }

  if (typeof body !== "string") {
    return json(
      { errors: { title: null, ingredients: "Body must be a string value" } },
      { status: 400 }
    );
  }

  var properArray: Ingredient[] = [];
  if (ingredients.length === 0) {
    return json(
      { errors: { title: null, ingredients: "Ingredients are required" } },
      { status: 400 }
    );
  } else {
    // remove ingredients with empty description
    properArray = ingredients.filter(
      (i: Ingredient) => i.description.trim() !== ""
    );
  }

  const recipe =
    id && id !== ""
      ? await editRecipe({ id, title, body, ingredients: properArray })
      : await createRecipe({ title, body, ingredients: properArray, userId });

  return redirect("/");
}

export function RecipeContainer({ recipe }: Props) {
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(recipe?.title ? recipe?.title : "");
  const [body, setBody] = useState(recipe?.body ? recipe?.body : "");
  const [items, setItems] = useState(
    recipe?.ingredients
      ? recipe?.ingredients
      : [
          { id: generateId(), description: "" },
          { id: generateId(), description: "" },
          { id: generateId(), description: "" },
        ]
  );
  const addMoreIngredients = () => {
    setItems([...items, { id: generateId(), description: "" }]);
  };
  const updateIngredients = (newId: number, newDescription: string) =>
    setItems(
      items.map((ingredient) => {
        if (ingredient.id === newId) {
          // Create a *new* object with changes
          return { ...ingredient, description: newDescription };
        } else {
          // No changes
          return ingredient;
        }
      })
    );

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
        value={recipe?.id ? recipe?.id : ""}
      ></input>

      <div>
        <label className={LABEL_STYLE}>
          <span>Title: </span>
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event?.target.value)}
            className={INPUT_STYLE}
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
        <label className={LABEL_STYLE}>
          <span>Ingredients: </span>
          <SortableList
            items={items}
            onChange={setItems}
            renderItem={(ingredient) => (
              <SortableList.Item id={ingredient.id}>
                <input
                  value={ingredient.description}
                  onChange={(event) => {
                    updateIngredients(ingredient.id, event.target.value);
                  }}
                  name="ingredient"
                  className={`${SORTABLE_ITEM_STYLE} ${TRANSPARENT}`}
                  aria-invalid={
                    actionData?.errors?.ingredients ? true : undefined
                  }
                  aria-errormessage={
                    actionData?.errors?.ingredients
                      ? "ingredients-error"
                      : undefined
                  }
                />
                <SortableList.DragHandle />
              </SortableList.Item>
            )}
          />
        </label>

        <div className="mb-4 cursor-pointer pt-1 text-blue-700">
          <a onClick={addMoreIngredients}>Add more...</a>
        </div>

        {actionData?.errors?.ingredients && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.ingredients}
          </div>
        )}

        <input
          type="hidden"
          name="ingredients"
          value={JSON.stringify(items)}
        ></input>

        <label className={LABEL_STYLE}>
          <span>Preparation (Optional): </span>
          <textarea
            name="body"
            value={body}
            onChange={(event) => setBody(event?.target.value)}
            rows={2}
            className={TEXTAREA_STYLE}
          />
        </label>
      </div>

      <div className="text-right">
        {recipe && (
          <button
            name="submit"
            type="submit"
            value="delete"
            className={BUTTON_STYLE}
          >
            Delete
          </button>
        )}

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
  );
}
