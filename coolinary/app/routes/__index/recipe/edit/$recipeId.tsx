import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteRecipe, getRecipe } from "~/models/recipe.server";
import { requireUserId } from "~/session.server";

import { actionRequest, RecipeContainer } from "~/components/RecipeContainer"

export async function action({ request }: ActionArgs) {
  return actionRequest({ request })
}


export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.recipeId, "recipeId not found");

  const recipe = await getRecipe({ userId, id: params.recipeId });
  if (!recipe) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ recipe });
}

export default function RecipeEditPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <RecipeContainer recipe={data.recipe} />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Recipe not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
