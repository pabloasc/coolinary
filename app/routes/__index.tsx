import { Form, Link, Outlet } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import { useState, useRef, createRef, useCallback } from "react";
import { ShoppingContainer } from "~/components/ShoppingContainer";
import { generateId } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  const [contextList, setContextList] = useState({
    id: generateId(),
    title: '',
    body: '',
    items: [],
    createdAt: new Date(),
    userId: user?.id
  });
  
  const toggleDrawerRef = useRef(null)

  const handleOnClick = useCallback(() => {
    toggleDrawerRef.current.checked = !toggleDrawerRef.current.checked;
  }, [toggleDrawerRef]);
  
  return (
    <>
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/">
          <img alt="coolinary" src="./images/coolinary.png" width="200"></img>
        </Link>
      </div>
      <div className="flex-none">
        {user ?
          <>
            <div onClick={handleOnClick}>
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <span className="badge badge-sm indicator-item">{contextList.items.length}</span>
                </div>
              </label>
            </div>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt={user?.email} src={user?.image} />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <Link to="/shopping">Your lists</Link>
                </li>
                <li>
                  <Link to="/settings/edit">Settings</Link>
                </li>
                {user && (
                  <>
                    <li>
                      <hr></hr>
                    </li>
                    <li>{user.email}</li>
                    <li>
                      <Form action="/logout" method="post">
                        <button
                          type="submit"
                          className="w-full rounded-md border border-gray-300 bg-white"
                        >
                          Logout
                        </button>
                      </Form>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </>
      :  
                <Link to="/login">Login</Link>
      }
      </div>
    </div>

    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" ref={toggleDrawerRef} className="drawer-toggle" />
        {/* DRAWER - PAGE CONTENT */}
        <div className="drawer-content">
          <div className="align-center m-auto w-11/12">
            <main className="">
              <Outlet context={[contextList, setContextList]} />
            </main>
          </div>

          <footer className="footer footer-center mt-36 rounded bg-base-200 p-10 text-base-content">
            <div className="grid grid-flow-col gap-4"></div>
            <div>
              <div className="grid grid-flow-col gap-4">
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <Link to="/termsandconditions">Terms and conditions</Link>
            </div>
            <div>
              <p>Copyright © 2023 - Meristemo Labs</p>
            </div>
          </footer>
        </div>
        

        {/* DRAWER SIDE */}
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <div key={contextList.id}>
            <ShoppingContainer shopping={contextList}></ShoppingContainer>
          </div>
        </div>
    </div>
    </>
  );
}
