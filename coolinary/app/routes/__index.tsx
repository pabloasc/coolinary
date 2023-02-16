import { Form, Link, Outlet } from "@remix-run/react";

import Recipes from "~/routes/__index/recipes"
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="flex h-full min-h-screen flex-col">
    <header className="flex items-center justify-between p-4 text-black">
        
        <div className="navbar bg-white rounded-box">
          <div className="flex-1 px-2 lg:flex-none">
            <h1 className="text-3xl font-bold">
              <Link to="/">coolinary</Link>
            </h1>
          </div> 
          <div className="flex justify-end flex-1 px-2">
            <div className="flex items-stretch">
              <a className="btn btn-ghost rounded-btn">{user && user.email}</a>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost rounded-btn">
                  {user ?
                    <Form action="/logout" method="post">
                      <button
                        type="submit"
                        className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                      >
                        Logout
                      </button>
                    </Form>
                    :
                    <Link to="login">Login</Link>
                  }
                </label>
                <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                  <li><a>Item 1</a></li> 
                  <li><a>Item 2</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex h-full bg-white">
        {user &&
          <Outlet />
        }
      </main>
    </div>



  );
}
