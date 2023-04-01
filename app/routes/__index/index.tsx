import type { LoaderArgs } from "@remix-run/node";
import { Link, Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useOptionalUser } from "~/utils";
import { getUserId } from "~/session.server";
import { ShoppingContainer } from "~/components/ShoppingContainer";
import { useState } from "react";
import { getLatestShopping } from "~/models/shopping.server";
import { getRecipeListItems } from "~/models/recipe.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const recipeListItems = await getRecipeListItems({ userId });
  const latestShopping = await getLatestShopping({ userId });
  return json({ recipeListItems, latestShopping });
}

export default function Index() {
  const user = useOptionalUser();
  const data = user
    ? useLoaderData<typeof loader>()
    : { recipeListItems: [], latestShopping: null };
  const [userinfo, setUserInfo] = useState({ selectedRecipes: [] });
  const [collapsed, setCollapsed] = useState(true);

  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { selectedRecipes } = userinfo;

    if (checked) {
      setUserInfo({
        selectedRecipes: [...selectedRecipes, value],
      });
    } else {
      setUserInfo({
        selectedRecipes: selectedRecipes.filter((e) => e !== value),
      });
    }
  };
  return (
    <>
      {!user && (
        <div className="grid grid-cols-1 items-center justify-center md:grid-cols-2 ">
          <span>
            <h1 className="font-title mb-6 font-serif text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Turn your family recipes into grocery lists
            </h1>
            <h2 className="font-title mb-16 font-serif text-xl">
              Add your recipes and create yout lists with no effort
            </h2>
          </span>
          <img src="/images/shopping_illustration.png"></img>
        </div>
      )}
      {data?.recipeListItems?.length > 0 && (
        <>
          <div className="container mx-auto flex justify-end">
            <div className="w-64">
              <label className="label cursor-pointer">
                <span className="card-title">
                  {!collapsed ? (
                    <>Collapse Ingredients</>
                  ) : (
                    <>Show Ingredients</>
                  )}
                </span>
                <input
                  type="checkbox"
                  name="collapseIngredients"
                  value={collapsed}
                  className="checkbox-info checkbox"
                  onChange={() => setCollapsed(!collapsed)}
                />
              </label>
            </div>
          </div>
        </>
      )}
      <Form method="post" action="shopping/new">
        <div className="container mx-auto mt-4">
          {data?.recipeListItems?.length === 0 ? (
            <p className="card-title p-4">No recipes yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data?.recipeListItems?.map((recipe) => (
                <div className="card m-2 transform cursor-pointer rounded-lg border border-gray-400 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-opacity-0 hover:shadow-md">
                  <div className="card-body p-5">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          name="selectedRecipesCheckbox"
                          value={recipe.id}
                          className="checkbox-info checkbox"
                          onChange={handleChange}
                        />
                        <span className="mr-5 ml-5 font-bold">
                          {recipe.title}
                        </span>
                        <NavLink to={"/recipe/edit/" + recipe.id}>
                          <div className="btn-ghost btn-xs btn-circle btn float-right mx-1 inline-block text-info">
                            <svg
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              ></path>
                            </svg>
                          </div>
                        </NavLink>
                      </label>
                    </div>

                    <input
                      type="hidden"
                      name="selectedRecipesList"
                      value={userinfo.selectedRecipes}
                    ></input>
                    {!collapsed &&
                      recipe.ingredients?.map(
                        (ingredient: { id: number; description?: string }) => {
                          return (
                            ingredient?.description !== "" && (
                              <p className="font-serif text-sm font-light text-gray-700">
                                {ingredient?.description}
                              </p>
                            )
                          );
                        }
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/recipe/new" className="p-4 text-xl text-blue-500">
            + Add your own recipes
          </Link>
        </div>
        {userinfo.selectedRecipes && userinfo.selectedRecipes.length > 0 && (
          <div className="container mx-auto my-12 grid grid-cols-1">
            <button
              name="submit"
              type="submit"
              value="shopping"
              className="rounded bg-neutral-400 py-2 px-4 text-white hover:bg-neutral-600 focus:bg-neutral-400"
            >
              Create grocery list
            </button>
          </div>
        )}
      </Form>

      {data.latestShopping !== null && (
        <div key={data.latestShopping.id} className="container mx-auto mt-16">
          <ShoppingContainer shopping={data.latestShopping}></ShoppingContainer>
        </div>
      )}

      <div className="container mx-auto mt-4">
        <Outlet />
      </div>
    </>
  );
}
