import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getRecipeListByIds } from "~/models/recipe.server";
import { requireUserId } from "~/session.server";
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
  //return json({ recipeList });
  return json({ error: { title: null, recipes: recipeList } });
}

export default function AddShoppingListPage() {
  const actionData = useActionData<typeof action>();

  return (
    <>
      <>
        Creating shopping list with recipes:{" "}
        {actionData?.error.recipes.map((recipe) => {
          return <a>{recipe.title}</a>;
        })}
      </>
    </>
  );
}
