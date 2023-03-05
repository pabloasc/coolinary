import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { SortableList } from "~/components";
import React, { useState } from "react";
import { Recipe, Ingredient } from "~/types";
import invariant from "tiny-invariant";

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
    // remove ingredients with empty description and restore indexing
    var properIndex = 1;
    ingredients.forEach((i: Ingredient) => {
      if (i.description.trim() !== "") {
        properArray.push({ id: properIndex++, description: i.description });
      }
    });
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
          { id: 1, description: "" },
          { id: 2, description: "" },
          { id: 3, description: "" },
        ]
  );
  const addMoreIngredients = () => {
    setItems([...items, { id: items.length + 1, description: "" }]);
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

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.ingredients) {
      // ingredientsRef.current?.focus();
    }
  }, [actionData]);

  var SortKey = 1;

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
        <label className="flex w-full flex-col gap-1 font-bold text-gray-600">
          <span>Title: </span>
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event?.target.value)}
            className="flex-1 border-b-2 border-gray-400 py-2 text-gray-600 placeholder-gray-400 outline-none focus:border-green-400"
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
        <label className="flex w-full flex-col gap-1 font-bold text-gray-600">
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
                  className="flex-1 border-b-2 border-gray-400 py-2 text-gray-600 placeholder-gray-400 outline-none focus:border-green-400"
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

        <a onClick={addMoreIngredients}>Add more...</a>

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

        <label className="flex w-full flex-col gap-1 font-bold text-gray-600">
          <span>Preparation (Optional): </span>
          <textarea
            name="body"
            value={body}
            onChange={(event) => setBody(event?.target.value)}
            rows={2}
            className="flex-1 border-b-2 border-gray-400 py-2 text-gray-600 placeholder-gray-400 outline-none focus:border-green-400"
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
