import type { LoaderArgs } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useOptionalUser } from "~/utils";
import { getUserId } from "~/session.server";
import { getRecipeListItems } from "~/models/recipe.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const recipeListItems = await getRecipeListItems({ userId });
  return json({ recipeListItems });
}

export default function Index() {
  const user = useOptionalUser();
  const data = user ? useLoaderData<typeof loader>() : { recipeListItems: [] };

  return (
    <>
      <div className="w-full">
        <div className="container mx-auto mt-4">
          {data?.recipeListItems?.length === 0 ? (
            <p className="p-4">No recipes yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data?.recipeListItems?.map((recipe) => (
                <div className="card m-2 transform cursor-pointer rounded-lg border border-gray-400 transition-all duration-200 hover:-translate-y-1 hover:border-opacity-0 hover:shadow-md">
                  <div className="card-body">
                    <h2 className="card-title text-xl font-extrabold">
                      <div className="card-title flex items-center font-extrabold">
                        {recipe.title}
                        <NavLink to={"/recipe/edit/" + recipe.id}>
                          <div className="btn-ghost btn-xs btn-circle btn mx-1 inline-block text-info">
                            <svg
                              fill="none"
                              stroke="currentColor"
                              stroke-width="1.5"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              ></path>
                            </svg>
                          </div>
                        </NavLink>
                      </div>
                    </h2>

                    {recipe.ingredients?.map(
                      (ingredient: { id: number; description?: string }) => {
                        return (
                          ingredient?.description !== "" && (
                            <span className="label-text">
                              {ingredient?.description}
                            </span>
                          )
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/recipe/new" className="block p-4 text-xl text-blue-500">
            + Add recipes
          </Link>
        </div>
      </div>

      <div className="h-200 w-full border-r bg-gray-50">
        <Outlet />
      </div>
    </>
  );
}
