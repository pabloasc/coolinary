import type { LoaderArgs } from "@remix-run/node";
import { Link, Form, NavLink, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { generateId, useOptionalUser } from "~/utils";
import { getUserId } from "~/session.server";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getRecipeListItems } from "~/models/recipe.server";
import { getTranslation } from "~/models/languages";
import type { Ingredient, Recipe } from "~/types";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  const recipeListItems = await getRecipeListItems({ userId });
  return json({ recipeListItems });
}

export default function Index() {
  const user = useOptionalUser();
  const data = user
    ? useLoaderData<typeof loader>()
    : { recipeListItems: [] };
  const [userInfo, setUserInfo] = useState({
    selectedRecipes: [],
    selectedIngredients: [],
  });

  const [contextList, setContextList] = useOutletContext();
  const [collapsed, setCollapsed] = useState(false);

  const addItemsToContext = (ingredients?: Ingredient[], recipe?: Recipe) => {
    const formattedItems = ingredients?.map((ing) => ({...ing, bought: false, recipe: recipe.title}))
    setContextList({ 
      ...contextList,
      id: generateId(),
      items: [...contextList.items, ...formattedItems]})
  }

  const removeItemsToContext = (ingredients: Ingredient[]) => {
    const arrayIngredients = [...ingredients?.map((ing) => ing.id)]
    let tempItems = contextList.items
    arrayIngredients?.forEach((ingId) => 
      tempItems = tempItems.filter((e) => e.id !== ingId)
    )
    setContextList({ 
      ...contextList,
      id: generateId(),
      items: tempItems
    })
  }

  const handleChangeRecipes = (recipe: Recipe) => (e) => {
    // Destructuring
    const { checked } = e.target;
    const { selectedRecipes, selectedIngredients } = userInfo;

    if (checked) {
      setUserInfo({
        selectedRecipes: [...selectedRecipes, recipe.id],
        selectedIngredients: [...selectedIngredients, ...recipe.ingredients?.map((ing) => ing.id)],
      });
      addItemsToContext(recipe.ingredients, recipe)
    } else {
      setUserInfo({
        selectedRecipes: selectedRecipes.filter((e) => e !== recipe.id),
        selectedIngredients: recipe.ingredients?.map((ing) => selectedIngredients.filter((e) => e !== ing.id)),
      });
      removeItemsToContext(recipe.ingredients)
    }
  };

  const handleChangeIngredients = (ingredient: Ingredient, recipe: Recipe) => (e) => {
    // Destructuring
    const { checked } = e.target;
    const { selectedRecipes, selectedIngredients } = userInfo;
  
    if (checked) {
      setUserInfo({
        selectedRecipes,
        selectedIngredients: [...selectedIngredients, ingredient.id],
      });
      addItemsToContext([ingredient], recipe)
    } else {
      setUserInfo({
        selectedRecipes,
        selectedIngredients: selectedIngredients.filter((e) => e !== ingredient.id),
      });
      removeItemsToContext([ingredient])
    }
    console.log('contextList', userInfo)
  };

  const handleSubmitNewList = (e: any) => {
    // e.preventDefault();
    setUserInfo({ selectedRecipes: [], selectedIngredients: [] });
  };

  return (
    <>
      {!user ? (
        <div className="grid grid-cols-1 items-center justify-center md:grid-cols-2 ">
          <span>
            <h1 className="font-title mb-6 font-serif text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Turn your family recipes into grocery lists
            </h1>
            <h2 className="font-title mb-16 font-serif text-xl">
              Add your recipes and create yout lists with no effort
            </h2>
          </span>
          <img alt="coolinary" src="/images/shopping_illustration.png"></img>
        </div>
      ) : (
      <>
        <div className="container mx-auto flex justify-end">
          <div className="w-64">
            <label className="label cursor-pointer">
            <span className="card-title">
              {!collapsed ? (
                <>{getTranslation("COLLAPSE_INGREDIENTS", user.language)}</>
              ) : (
                <>{getTranslation("SHOW_INGREDIENTS", user?.language)}</>
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
    
        <Form method="post" onSubmit={handleSubmitNewList} action="shopping/new">
          <div className="container mx-auto mt-4">
            {data?.recipeListItems?.length === 0 ? (
              <p className="card-title p-4">No recipes yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {data?.recipeListItems?.map((recipe) => (
                  <div key={recipe.id} className="m-2 transform cursor-pointer rounded-lg border border-gray-400 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-opacity-0 hover:shadow-md">
                    <div className="card-body p-5">
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            checked={userInfo.selectedRecipes.includes(recipe.id)}
                            type="checkbox"
                            name="selectedRecipesCheckbox"
                            value={recipe.id}
                            className="checkbox-info checkbox"
                            onChange={handleChangeRecipes(recipe)}
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
                        value={userInfo.selectedRecipes}
                      ></input>

                      {recipe.ingredients?.map(
                        (ingredient: { id: number; description?: string }) =>
                          ingredient?.description !== "" && !collapsed && (

                            <p key={ingredient.id} className="font-serif text-sm font-light text-gray-700">
                              <input
                                type="checkbox"
                                checked={userInfo.selectedIngredients.includes(ingredient.id)}
                                name="selectedIngredientCheckbox"
                                value={`${recipe.title}&|&${ingredient.description}`}
                                className="checkbox-info checkbox mr-2"
                                onChange={handleChangeIngredients(ingredient, recipe)}
                              />
                              {ingredient?.description}
                            </p>
                          )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/recipe/new" className="p-4 text-xl text-blue-500">
              + Add recipes
            </Link>
          </div>
          {userInfo.selectedRecipes && userInfo.selectedRecipes.length > 0 && (
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
      </>
      )}
    </>
  );
}
