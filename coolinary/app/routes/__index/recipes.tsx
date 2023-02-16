import type { LoaderArgs } from "@remix-run/node";
import { Link,  NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useOptionalUser } from "~/utils";
import { getUserId } from "~/session.server";
import { getNoteListItems } from "~/models/note.server";
import Recipes from "~/routes/__index/recipes"


export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
}

export default function Index() {
  const user = useOptionalUser();
  const data = user ? useLoaderData<typeof loader>() : { noteListItems: [] };

  return (
    <div className="flex-1 p-6">
        <Outlet />
    </div>
  );
}
