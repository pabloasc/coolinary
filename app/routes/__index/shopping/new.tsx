import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData, useActionData } from "@remix-run/react";

import { ShoppingItem } from "~/types/shopping";
import { getRecipeListByIds } from "~/models/recipe.server";
import { createShopping } from "~/models/shopping.server";
import { requireUserId } from "~/session.server";
import { generateId } from "~/utils";
export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const recipes = formData.get("selectedRecipesList") as string;
  const recipeList = await getRecipeListByIds({
    userId,
    recipeList: recipes.split(","),
  });
  if (!recipeList) {
    throw new Response("Not Found", { status: 404 });
  }

  //Save shopping list
  const allItems: ShoppingItem[] = [];
  recipeList.map((recipe) => {
    recipe.ingredients.map((ingredient) => {
      ingredient.id = generateId();
      ingredient.recipe = recipe.title;
      ingredient.bought = false;
      allItems.push(ingredient);
    });
  });
  if (allItems.length) {
    const shoppingList = await createShopping({
      title: "",
      body: "",
      items: allItems,
      userId,
    });
  } else {
    throw new Response("Not Found", { status: 404 });
  }

  return redirect("/");
}

export default function AddShoppingListPage() {
  const actionData = useActionData<typeof action>();
  return;
}
