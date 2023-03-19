import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getShopping } from "~/models/shopping.server";
import { requireUserId } from "~/session.server";

import {
  actionRequest,
  ShoppingContainer,
} from "~/components/ShoppingContainer";

export async function action({ request }: ActionArgs) {
  return actionRequest({ request });
}

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.shoppingId, "shoppingId not found");

  const shopping = await getShopping({ userId, id: params.shoppingId });
  if (!shopping) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ shopping });
}

export default function ShoppingEditPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <ShoppingContainer shopping={data.shopping} />
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
    return <div>Shopping not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
