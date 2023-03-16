import { Form, Link, Outlet } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <header className="m-2 mt-8 grid w-full grid-cols-6 ">
        <div className="col-span-6 ml-4 min-[420px]:col-span-3">
          <h1 className="text-3xl font-bold">
            <Link to="/">coolinary</Link>
          </h1>
        </div>
        <div className="col-span-6 mr-4 justify-self-end min-[420px]:col-span-3">
          {user ? (
            <>
              <a className="btn-ghost rounded-btn btn">{user.email}</a>
              <div className="dropdown-end dropdown">
                <label tabIndex={0} className="btn-ghost rounded-btn btn">
                  ...
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box mt-4 w-52 bg-base-100 p-2 shadow"
                >
                  <li>
                    <a>Settings</a>
                  </li>
                  <li>
                    {user && (
                      <Form action="/logout" method="post">
                        <button
                          type="submit"
                          className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                        >
                          Logout
                        </button>
                      </Form>
                    )}
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link to="login">Login</Link>
          )}
        </div>
      </header>

      <main className="">
        <Outlet />
      </main>
    </>
  );
}
