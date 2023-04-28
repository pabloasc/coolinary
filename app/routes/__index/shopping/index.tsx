import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useOptionalUser, createListTitle } from "~/utils";
import { getUserId } from "~/session.server";
import { ShoppingContainer } from "~/components/ShoppingContainer";
import { useState } from "react";
import { getAllShopping } from "~/models/shopping.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const allShopping = await getAllShopping({ userId });
  return json({ allShopping });
}

export default function ShoppingIndexPage() {
  const user = useOptionalUser();
  const data = user ? useLoaderData<typeof loader>() : { allShopping: [] };
  const [selectedShopping, setSelectedShopping] = useState(
    data.allShopping.length > 0 ? data.allShopping.at(-1) : []
  );
  return (
    <>
      {data.allShopping.map((shopping) => (
        <ul>
          <li onClick={() => setSelectedShopping(shopping)}>
            {shopping.title
              ? shopping.title
              : createListTitle(shopping.createdAt, user?.language)}
          </li>
        </ul>
      ))}

      <div key={selectedShopping?.id} className="container mx-auto mt-16">
        <ShoppingContainer shopping={selectedShopping}></ShoppingContainer>
      </div>

      <div className="container mx-auto mt-4">
        <Outlet />
      </div>
    </>
  );
}
