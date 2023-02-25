import type { LoaderArgs } from "@remix-run/node";
import { Link,  NavLink, Outlet, useLoaderData } from "@remix-run/react";
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
        {data?.recipeListItems?.length === 0 ? (
          <p className="p-4">No recipes yet</p>
        ) : (
          <div id="component-demo" className="flex w-full grid-flow-row grid-cols-12 items-center gap-4 overflow-y-hidden overflow-x-scroll pt-1 pb-10 xl:grid xl:overflow-x-auto xl:px-4">
            {data?.recipeListItems?.map((recipe) => (
              <div className="card bg-base-100 rounded-box col-span-3 row-span-3 mx-2 flex w-72 flex-shrink-0 flex-col justify-center gap-4 p-4 shadow-xl xl:mx-0 xl:w-full">
                
                <div className="card-body">
                  <h2 className="card-title">{recipe.title}</h2>


                  {recipe.ingredients?.map((ingredient: {id: number, description?: string}) => {
                    return ingredient?.description !== '' && <p>{ingredient?.description}</p>
                  })}


                  <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-block space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 stroke-current">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <NavLink
                        to={'/recipe/' + recipe.id}
                      >
                        <span>Editar</span>
                      </NavLink>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        
      <Link to="/recipe/new" className="block p-4 text-xl text-blue-500">
        + Add recipes
      </Link>

      <div className="h-200 w-full border-r bg-gray-50">
        <Outlet />
      </div>
    </>
  );
}
