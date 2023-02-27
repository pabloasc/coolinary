import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteRecipe, getRecipe } from "~/models/recipe.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  return formData.get("selectedRecipes");
}

export default function AddShoppingListPage() {
  return <div>Creating shopping list</div>;
}
