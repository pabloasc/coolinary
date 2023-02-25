import { Form, Link, Outlet } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="flex h-full min-h-screen flex-col">
    <header className="flex items-center justify-between p-4">
        
        <div className="navbar rounded-box">
          <div className="flex-1 px-2 lg:flex-none">
            <h1 className="text-3xl font-bold">
              <Link to="/">coolinary</Link>
            </h1>
          </div> 
          <div className="flex justify-end flex-1 px-2">
            <div className="flex items-stretch">
              {user ?
                <>
                  <a className="btn btn-ghost rounded-btn">{user.email}</a>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost rounded-btn">
                      ...
                    </label>
                    <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                      <li><a>Settings</a></li>
                      <li> 
                        {user &&
                          <Form action="/logout" method="post">
                            <button
                              type="submit"
                              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                            >
                              Logout
                            </button>
                          </Form>
                        }
                      </li>
                    </ul>
                  </div>
                </>
              :
                <Link to="login">Login</Link>
              }
            </div>
          </div>
        </div>
      </header>
      
      <main className="h-200 w-full border-r">
        <Outlet />
      </main>
    </div>
  );
}
