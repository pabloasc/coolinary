import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteRecipe, getRecipe } from "~/models/recipe.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const recipes = formData.get("selectedRecipesList");
  return json({ error: { title: null, recipes: recipes } });
}

export default function AddShoppingListPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div>Creating shopping list with recipes: {actionData?.error.recipes}</div>
  );
}
