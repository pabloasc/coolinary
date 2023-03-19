import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { actionRequest, RecipeContainer } from "~/components/RecipeContainer";
import { getUserId } from "~/session.server";

export let loader = async ({ request }) => {
  let userId = await getUserId(request);
  if (!userId) return redirect("/login");
  return null;
};

export async function action({ request }: ActionArgs) {
  return actionRequest({ request });
}

export default function NewRecipePage() {
  return <RecipeContainer />;
}
