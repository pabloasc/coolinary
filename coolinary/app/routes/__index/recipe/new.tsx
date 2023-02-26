import type { ActionArgs } from "@remix-run/node";
import { actionRequest, RecipeContainer } from "~/components/RecipeContainer"

export async function action({ request }: ActionArgs) {
  return actionRequest({ request })
}


export default function NewRecipePage() {
  return (
    <RecipeContainer />
  );
}
