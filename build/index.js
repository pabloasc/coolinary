var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let callbackName = (0, import_isbot.default)(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, { context: remixContext, url: request.url }, void 0, !1, {
        fileName: "app/entry.server.tsx",
        lineNumber: 24,
        columnNumber: 7
      }, this),
      {
        [callbackName]: () => {
          let body = new import_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          ), pipe(body);
        },
        onShellError: (err) => {
          reject(err);
        },
        onError: (error) => {
          didError = !0, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_node3 = require("@remix-run/node"), import_react2 = require("@remix-run/react");

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-BAPYWUCB.css";

// app/styles/base.css
var base_default = "/build/_assets/base-AJV4P4VZ.css";

// app/styles/SortableList.css
var SortableList_default = "/build/_assets/SortableList-IZIN7MLI.css";

// app/session.server.ts
var import_node2 = require("@remix-run/node"), import_tiny_invariant = __toESM(require("tiny-invariant"));

// app/models/user.server.ts
var import_bson = require("bson"), import_bcryptjs = __toESM(require("bcryptjs"));

// app/db.server.ts
var import_client = require("@prisma/client"), prisma;
global.__db__ || (global.__db__ = new import_client.PrismaClient()), prisma = global.__db__, prisma.$connect();

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createUser(email, password) {
  let hashedPassword = await import_bcryptjs.default.hash(password, 10);
  return prisma.user.create({
    data: {
      id: new import_bson.ObjectId().toString(),
      email,
      password: {
        create: {
          id: new import_bson.ObjectId().toString(),
          hash: hashedPassword
        }
      }
    }
  });
}
async function verifyLogin(email, password) {
  let userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: !0
    }
  });
  if (!userWithPassword || !userWithPassword.password || !await import_bcryptjs.default.compare(
    password,
    userWithPassword.password.hash
  ))
    return null;
  let { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}

// app/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: !1
  }
}), USER_SESSION_KEY = "userId";
async function getSession(request) {
  let cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  return (await getSession(request)).get(USER_SESSION_KEY);
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (userId === void 0)
    return null;
  let user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = await getUserId(request);
  if (!userId) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node2.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  let session = await getSession(request);
  return session.set(USER_SESSION_KEY, userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  let session = await getSession(request);
  return (0, import_node2.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// app/root.tsx
var import_jsx_dev_runtime2 = require("react/jsx-dev-runtime"), links = () => [
  { rel: "stylesheet", href: tailwind_default },
  { rel: "stylesheet", href: base_default },
  { rel: "stylesheet", href: SortableList_default }
], meta = () => ({
  charset: "utf-8",
  title: "Coolinary",
  viewport: "width=device-width,initial-scale=1"
});
async function loader({ request }) {
  return (0, import_node3.json)({
    user: await getUser(request)
  });
}
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("html", { "data-theme": "myLight", lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 42,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 43,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("body", { className: "h-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 48,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 49,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 40,
    columnNumber: 5
  }, this);
}

// app/routes/__index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index
});
var import_react5 = require("@remix-run/react");

// app/utils.ts
var import_react3 = require("@remix-run/react"), import_react4 = require("react"), DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  return !to || typeof to != "string" || !to.startsWith("/") || to.startsWith("//") ? defaultRedirect : to;
}
function useMatchesData(id) {
  let matchingRoutes = (0, import_react3.useMatches)(), route = (0, import_react4.useMemo)(
    () => matchingRoutes.find((route2) => route2.id === id),
    [matchingRoutes, id]
  );
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user == "object" && typeof user.email == "string";
}
function useOptionalUser() {
  let data = useMatchesData("root");
  if (!(!data || !isUser(data.user)))
    return data.user;
}
function validateEmail(email) {
  return typeof email == "string" && email.length > 3 && email.includes("@");
}

// app/routes/__index.tsx
var import_jsx_dev_runtime3 = require("react/jsx-dev-runtime");
function Index() {
  let user = useOptionalUser();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_jsx_dev_runtime3.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "align-center m-auto w-11/12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("header", { className: "mb-12 mt-8 grid w-full grid-cols-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "col-span-4 ml-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react5.Link, { to: "/", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("img", { src: "./images/coolinary.png", width: "200" }, void 0, !1, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 12,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 11,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 10,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "col-span-2 mr-4 justify-self-end", children: user ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_jsx_dev_runtime3.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "dropdown-end dropdown", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("label", { tabIndex: 0, className: "btn-ghost rounded-btn btn", children: "..." }, void 0, !1, {
            fileName: "app/routes/__index.tsx",
            lineNumber: 19,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
            "ul",
            {
              tabIndex: 0,
              className: "dropdown-content menu rounded-box mt-4 w-52 bg-base-100 p-2 shadow",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("a", { children: "Settings" }, void 0, !1, {
                  fileName: "app/routes/__index.tsx",
                  lineNumber: 27,
                  columnNumber: 23
                }, this) }, void 0, !1, {
                  fileName: "app/routes/__index.tsx",
                  lineNumber: 26,
                  columnNumber: 21
                }, this),
                user && /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_jsx_dev_runtime3.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("hr", {}, void 0, !1, {
                    fileName: "app/routes/__index.tsx",
                    lineNumber: 32,
                    columnNumber: 27
                  }, this) }, void 0, !1, {
                    fileName: "app/routes/__index.tsx",
                    lineNumber: 31,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("li", { className: "m-2", children: user.email }, void 0, !1, {
                    fileName: "app/routes/__index.tsx",
                    lineNumber: 34,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("li", { className: "bg-red", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react5.Form, { action: "/logout", method: "post", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
                    "button",
                    {
                      type: "submit",
                      className: "w-full rounded-md border border-gray-300 bg-white",
                      children: "Logout"
                    },
                    void 0,
                    !1,
                    {
                      fileName: "app/routes/__index.tsx",
                      lineNumber: 37,
                      columnNumber: 29
                    },
                    this
                  ) }, void 0, !1, {
                    fileName: "app/routes/__index.tsx",
                    lineNumber: 36,
                    columnNumber: 27
                  }, this) }, void 0, !1, {
                    fileName: "app/routes/__index.tsx",
                    lineNumber: 35,
                    columnNumber: 25
                  }, this)
                ] }, void 0, !0, {
                  fileName: "app/routes/__index.tsx",
                  lineNumber: 30,
                  columnNumber: 23
                }, this)
              ]
            },
            void 0,
            !0,
            {
              fileName: "app/routes/__index.tsx",
              lineNumber: 22,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 18,
          columnNumber: 17
        }, this) }, void 0, !1, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 17,
          columnNumber: 15
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react5.Link, { to: "login", children: "Login" }, void 0, !1, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 51,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 15,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 9,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("main", { className: "", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_react5.Outlet, {}, void 0, !1, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 57,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 56,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index.tsx",
      lineNumber: 8,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("footer", { className: "footer footer-center mt-36 rounded bg-base-200 p-10 text-base-content", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "grid grid-flow-col gap-4" }, void 0, !1, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 61,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "grid grid-flow-col gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("a", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            className: "fill-current",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("path", { d: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" }, void 0, !1, {
              fileName: "app/routes/__index.tsx",
              lineNumber: 72,
              columnNumber: 17
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index.tsx",
            lineNumber: 65,
            columnNumber: 15
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 64,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("a", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            className: "fill-current",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("path", { d: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" }, void 0, !1, {
              fileName: "app/routes/__index.tsx",
              lineNumber: 83,
              columnNumber: 17
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index.tsx",
            lineNumber: 76,
            columnNumber: 15
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 75,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("a", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            class: "fill-current",
            children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("path", { d: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" }, void 0, !1, {
              fileName: "app/routes/__index.tsx",
              lineNumber: 94,
              columnNumber: 17
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index.tsx",
            lineNumber: 87,
            columnNumber: 15
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/__index.tsx",
          lineNumber: 86,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 63,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { children: "Copyright \xA9 2023 - Meristemo Labs" }, void 0, !1, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 99,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__index.tsx",
    lineNumber: 7,
    columnNumber: 5
  }, this);
}

// app/routes/__index/shopping/edit/$shoppingId.tsx
var shoppingId_exports = {};
__export(shoppingId_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  action: () => action,
  default: () => ShoppingEditPage,
  loader: () => loader2
});
var import_node6 = require("@remix-run/node"), import_react12 = require("@remix-run/react"), import_tiny_invariant2 = __toESM(require("tiny-invariant"));

// app/models/shopping.server.ts
var import_bson2 = require("bson");
function getShopping({
  id,
  userId
}) {
  return prisma.shopping.findFirst({
    select: {
      id: !0,
      body: !0,
      title: !0,
      items: !0,
      userId: !0
    },
    where: { id, userId }
  });
}
function getLatestShopping({ userId }) {
  return prisma.shopping.findFirst({
    select: {
      id: !0,
      body: !0,
      title: !0,
      items: !0,
      userId: !0
    },
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}
function createShopping({
  body,
  title,
  items = {},
  userId
}) {
  return prisma.shopping.create({
    data: {
      id: new import_bson2.ObjectId().toString(),
      title,
      body,
      items,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}
function editShopping({
  id,
  body,
  title,
  items = {}
}) {
  return prisma.shopping.update({
    where: {
      id
    },
    data: {
      title,
      body,
      items
    }
  });
}
function deleteShopping({
  id,
  userId
}) {
  return prisma.shopping.deleteMany({
    where: { id, userId }
  });
}

// app/components/ShoppingContainer/ShoppingContainer.tsx
var import_node5 = require("@remix-run/node"), import_react10 = require("@remix-run/react");

// app/components/SortableList/SortableList.tsx
var import_react7 = __toESM(require("react")), import_core2 = require("@dnd-kit/core"), import_sortable2 = require("@dnd-kit/sortable");

// app/components/SortableList/components/SortableItem/SortableItem.tsx
var import_react6 = require("react"), import_sortable = require("@dnd-kit/sortable"), import_utilities = require("@dnd-kit/utilities"), import_jsx_dev_runtime4 = require("react/jsx-dev-runtime"), SortableItemContext = (0, import_react6.createContext)({
  attributes: {},
  listeners: void 0,
  ref() {
  }
});
function SortableItem({
  children,
  id,
  recipe
}) {
  let {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = (0, import_sortable.useSortable)({ id }), context = (0, import_react6.useMemo)(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef
    }),
    [attributes, listeners, setActivatorNodeRef]
  ), style = {
    opacity: isDragging ? 0.4 : void 0,
    transform: import_utilities.CSS.Translate.toString(transform),
    transition
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(SortableItemContext.Provider, { value: context, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("li", { className: "SortableItemContainer", ref: setNodeRef, style, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "SortableItem", children }, void 0, !1, {
      fileName: "app/components/SortableList/components/SortableItem/SortableItem.tsx",
      lineNumber: 58,
      columnNumber: 9
    }, this),
    recipe && /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "container", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: "kbd kbd-xs", children: recipe }, void 0, !1, {
      fileName: "app/components/SortableList/components/SortableItem/SortableItem.tsx",
      lineNumber: 61,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/components/SortableList/components/SortableItem/SortableItem.tsx",
      lineNumber: 60,
      columnNumber: 11
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/SortableList/components/SortableItem/SortableItem.tsx",
    lineNumber: 57,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/components/SortableList/components/SortableItem/SortableItem.tsx",
    lineNumber: 56,
    columnNumber: 5
  }, this);
}
function DragHandle() {
  let { attributes, listeners, ref } = (0, import_react6.useContext)(SortableItemContext);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("button", { className: "DragHandle", ...attributes, ...listeners, ref, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
    "svg",
    {
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      width: "35",
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
        },
        void 0,
        !1,
        {
          fileName: "app/components/SortableList/components/SortableItem/SortableItem.tsx",
          lineNumber: 83,
          columnNumber: 9
        },
        this
      )
    },
    void 0,
    !1,
    {
      fileName: "app/components/SortableList/components/SortableItem/SortableItem.tsx",
      lineNumber: 74,
      columnNumber: 7
    },
    this
  ) }, void 0, !1, {
    fileName: "app/components/SortableList/components/SortableItem/SortableItem.tsx",
    lineNumber: 73,
    columnNumber: 5
  }, this);
}

// app/components/SortableList/components/SortableOverlay/SortableOverlay.tsx
var import_core = require("@dnd-kit/core"), import_jsx_dev_runtime5 = require("react/jsx-dev-runtime"), dropAnimationConfig = {
  sideEffects: (0, import_core.defaultDropAnimationSideEffects)({
    styles: {
      active: {
        opacity: "0.4"
      }
    }
  })
};
function SortableOverlay({ children }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(import_core.DragOverlay, { dropAnimation: dropAnimationConfig, children }, void 0, !1, {
    fileName: "app/components/SortableList/components/SortableOverlay/SortableOverlay.tsx",
    lineNumber: 19,
    columnNumber: 5
  }, this);
}

// app/components/SortableList/SortableList.tsx
var import_jsx_dev_runtime6 = require("react/jsx-dev-runtime");
function SortableList({
  items,
  onChange,
  renderItem
}) {
  let [active, setActive] = (0, import_react7.useState)(null), activeItem = (0, import_react7.useMemo)(
    () => items.find((item) => item.id === (active == null ? void 0 : active.id)),
    [active, items]
  ), sensors = (0, import_core2.useSensors)(
    (0, import_core2.useSensor)(import_core2.PointerSensor),
    (0, import_core2.useSensor)(import_core2.KeyboardSensor, {
      coordinateGetter: import_sortable2.sortableKeyboardCoordinates
    })
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(
    import_core2.DndContext,
    {
      sensors,
      onDragStart: ({ active: active2 }) => {
        setActive(active2);
      },
      onDragEnd: ({ active: active2, over }) => {
        if (over && active2.id !== (over == null ? void 0 : over.id)) {
          let activeIndex = items.findIndex(({ id }) => id === active2.id), overIndex = items.findIndex(({ id }) => id === over.id);
          onChange((0, import_sortable2.arrayMove)(items, activeIndex, overIndex));
        }
        setActive(null);
      },
      onDragCancel: () => {
        setActive(null);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_sortable2.SortableContext, { items, children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("ul", { className: "SortableList", role: "application", children: items.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(import_react7.default.Fragment, { children: renderItem(item) }, item.id, !1, {
          fileName: "app/components/SortableList/SortableList.tsx",
          lineNumber: 68,
          columnNumber: 13
        }, this)) }, void 0, !1, {
          fileName: "app/components/SortableList/SortableList.tsx",
          lineNumber: 66,
          columnNumber: 9
        }, this) }, void 0, !1, {
          fileName: "app/components/SortableList/SortableList.tsx",
          lineNumber: 65,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(SortableOverlay, { children: activeItem ? renderItem(activeItem) : null }, void 0, !1, {
          fileName: "app/components/SortableList/SortableList.tsx",
          lineNumber: 72,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/components/SortableList/SortableList.tsx",
      lineNumber: 47,
      columnNumber: 5
    },
    this
  );
}
SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;

// app/components/RecipeContainer/RecipeContainer.tsx
var import_node4 = require("@remix-run/node"), import_react8 = require("@remix-run/react");
var import_react9 = __toESM(require("react"));

// app/styles/tailwind.ts
var INPUT_STYLE = "block w-full flex-1 my-2 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6", SORTABLE_ITEM_STYLE = "flex-1 rounded-none my-1 rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6", LABEL_STYLE = "block text-sm font-medium leading-6 text-gray-900", TEXTAREA_STYLE = "mt-1 block w-full my-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6", BUTTON_STYLE = "ml-5 rounded-md border my-4 border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50", TRANSPARENT = "border-transparent bg-transparent ring-transparent";

// app/models/recipe.server.ts
var import_bson3 = require("bson");
function getRecipe({
  id,
  userId
}) {
  return prisma.recipe.findFirst({
    select: {
      id: !0,
      body: !0,
      title: !0,
      ingredients: !0,
      userId: !0
    },
    where: { id, userId }
  });
}
function getRecipeListItems({ userId }) {
  return prisma.recipe.findMany({
    where: { userId },
    select: { id: !0, title: !0, body: !0, ingredients: !0 },
    orderBy: { updatedAt: "desc" }
  });
}
function getRecipeListByIds({
  userId,
  recipeList
}) {
  return prisma.recipe.findMany({
    where: { userId, id: { in: recipeList } },
    select: { title: !0, ingredients: !0 },
    orderBy: { updatedAt: "desc" }
  });
}
function createRecipe({
  body,
  title,
  ingredients = [],
  userId
}) {
  return prisma.recipe.create({
    data: {
      id: new import_bson3.ObjectId().toString(),
      title,
      body,
      ingredients,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}
function editRecipe({
  id,
  body,
  title,
  ingredients = []
}) {
  return prisma.recipe.update({
    where: {
      id
    },
    data: {
      title,
      body,
      ingredients
    }
  });
}
function deleteRecipe({
  id,
  userId
}) {
  return prisma.recipe.deleteMany({
    where: { id, userId }
  });
}

// app/components/RecipeContainer/RecipeContainer.tsx
var import_jsx_dev_runtime7 = require("react/jsx-dev-runtime");
async function actionRequest({ request }) {
  let userId = await requireUserId(request), formData = await request.formData(), id = formData.get("id"), title = formData.get("title"), ingredientsList = formData.get("ingredients"), submit = formData.get("submit"), ingredients = JSON.parse(ingredientsList), body = formData.get("body");
  if (submit === "delete")
    return typeof id == "string" && await deleteRecipe({ userId, id }), (0, import_node4.redirect)("/");
  if (typeof title != "string" || title.length === 0)
    return (0, import_node4.json)(
      {
        errors: {
          title: "Title is required",
          ingredients: "Ingredients are required"
        }
      },
      { status: 400 }
    );
  if (typeof body != "string")
    return (0, import_node4.json)(
      { errors: { title: null, ingredients: "Body must be a string value" } },
      { status: 400 }
    );
  var properArray = [];
  if (ingredients.length === 0)
    return (0, import_node4.json)(
      { errors: { title: null, ingredients: "Ingredients are required" } },
      { status: 400 }
    );
  var properIndex = 1;
  ingredients.forEach((i) => {
    i.description.trim() !== "" && properArray.push({ id: properIndex++, description: i.description });
  });
  let recipe = id && id !== "" ? await editRecipe({ id, title, body, ingredients: properArray }) : await createRecipe({ title, body, ingredients: properArray, userId });
  return (0, import_node4.redirect)("/");
}
function RecipeContainer({ recipe }) {
  var _a, _b, _c, _d;
  let actionData = (0, import_react8.useActionData)(), titleRef = import_react9.default.useRef(null), [title, setTitle] = (0, import_react9.useState)(recipe != null && recipe.title ? recipe == null ? void 0 : recipe.title : ""), [body, setBody] = (0, import_react9.useState)(recipe != null && recipe.body ? recipe == null ? void 0 : recipe.body : ""), [items, setItems] = (0, import_react9.useState)(
    recipe != null && recipe.ingredients ? recipe == null ? void 0 : recipe.ingredients : [
      { id: 1, description: "" },
      { id: 2, description: "" },
      { id: 3, description: "" }
    ]
  ), addMoreIngredients = () => {
    setItems([...items, { id: items.length + 1, description: "" }]);
  }, updateIngredients = (newId, newDescription) => setItems(
    items.map((ingredient) => ingredient.id === newId ? { ...ingredient, description: newDescription } : ingredient)
  );
  import_react9.default.useEffect(() => {
    var _a2, _b2, _c2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.title ? (_b2 = titleRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.ingredients;
  }, [actionData]);
  var SortKey = 1;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
    import_react8.Form,
    {
      method: "post",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
          "input",
          {
            type: "hidden",
            name: "id",
            value: recipe != null && recipe.id ? recipe == null ? void 0 : recipe.id : ""
          },
          void 0,
          !1,
          {
            fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
            lineNumber: 133,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("label", { className: LABEL_STYLE, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("span", { children: "Title: " }, void 0, !1, {
              fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
              lineNumber: 141,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
              "input",
              {
                name: "title",
                value: title,
                onChange: (event) => setTitle(event == null ? void 0 : event.target.value),
                className: INPUT_STYLE,
                "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.title ? !0 : void 0,
                "aria-errormessage": (_b = actionData == null ? void 0 : actionData.errors) != null && _b.title ? "title-error" : void 0
              },
              void 0,
              !1,
              {
                fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
                lineNumber: 142,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
            lineNumber: 140,
            columnNumber: 9
          }, this),
          ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.title) && /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "pt-1 text-red-700", id: "title-error", children: actionData.errors.title }, void 0, !1, {
            fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
            lineNumber: 154,
            columnNumber: 11
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
          lineNumber: 139,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("label", { className: LABEL_STYLE, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("span", { children: "Ingredients: " }, void 0, !1, {
              fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
              lineNumber: 161,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
              SortableList,
              {
                items,
                onChange: setItems,
                renderItem: (ingredient) => {
                  var _a2, _b2;
                  return /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(SortableList.Item, { id: ingredient.id, children: [
                    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
                      "input",
                      {
                        value: ingredient.description,
                        onChange: (event) => {
                          updateIngredients(ingredient.id, event.target.value);
                        },
                        name: "ingredient",
                        className: `${SORTABLE_ITEM_STYLE} ${TRANSPARENT}`,
                        "aria-invalid": (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.ingredients ? !0 : void 0,
                        "aria-errormessage": (_b2 = actionData == null ? void 0 : actionData.errors) != null && _b2.ingredients ? "ingredients-error" : void 0
                      },
                      void 0,
                      !1,
                      {
                        fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
                        lineNumber: 167,
                        columnNumber: 17
                      },
                      this
                    ),
                    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(SortableList.DragHandle, {}, void 0, !1, {
                      fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
                      lineNumber: 183,
                      columnNumber: 17
                    }, this)
                  ] }, void 0, !0, {
                    fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
                    lineNumber: 166,
                    columnNumber: 15
                  }, this);
                }
              },
              void 0,
              !1,
              {
                fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
                lineNumber: 162,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
            lineNumber: 160,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "mb-4 cursor-pointer pt-1 text-blue-700", children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("a", { onClick: addMoreIngredients, children: "Add more..." }, void 0, !1, {
            fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
            lineNumber: 190,
            columnNumber: 11
          }, this) }, void 0, !1, {
            fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
            lineNumber: 189,
            columnNumber: 9
          }, this),
          ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.ingredients) && /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "pt-1 text-red-700", id: "body-error", children: actionData.errors.ingredients }, void 0, !1, {
            fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
            lineNumber: 194,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
            "input",
            {
              type: "hidden",
              name: "ingredients",
              value: JSON.stringify(items)
            },
            void 0,
            !1,
            {
              fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
              lineNumber: 199,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("label", { className: LABEL_STYLE, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("span", { children: "Preparation (Optional): " }, void 0, !1, {
              fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
              lineNumber: 206,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
              "textarea",
              {
                name: "body",
                value: body,
                onChange: (event) => setBody(event == null ? void 0 : event.target.value),
                rows: 2,
                className: TEXTAREA_STYLE
              },
              void 0,
              !1,
              {
                fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
                lineNumber: 207,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
            lineNumber: 205,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
          lineNumber: 159,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "text-right", children: [
          recipe && /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
            "button",
            {
              name: "submit",
              type: "submit",
              value: "delete",
              className: BUTTON_STYLE,
              children: "Delete"
            },
            void 0,
            !1,
            {
              fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
              lineNumber: 219,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
            "button",
            {
              name: "submit",
              type: "submit",
              value: "add",
              className: BUTTON_STYLE,
              children: "Save"
            },
            void 0,
            !1,
            {
              fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
              lineNumber: 229,
              columnNumber: 9
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
          lineNumber: 217,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/components/RecipeContainer/RecipeContainer.tsx",
      lineNumber: 124,
      columnNumber: 5
    },
    this
  );
}

// app/components/ShoppingContainer/ShoppingContainer.tsx
var import_react11 = __toESM(require("react"));
var import_jsx_dev_runtime8 = require("react/jsx-dev-runtime");
async function actionRequest2({ request }) {
  let userId = await requireUserId(request), formData = await request.formData(), id = formData.get("id"), title = formData.get("title"), itemList = formData.get("items"), submit = formData.get("submit"), items = JSON.parse(itemList), body = formData.get("body");
  if (submit === "delete")
    return typeof id == "string" && await deleteShopping({ userId, id }), (0, import_node5.redirect)("/");
  if (typeof id != "string")
    return (0, import_node5.json)(
      { errors: { title: null, items: "Id must be a string" } },
      { status: 400 }
    );
  if (typeof title != "string")
    return (0, import_node5.json)(
      {
        errors: {
          title: "Title is required",
          items: "items are required"
        }
      },
      { status: 400 }
    );
  if (typeof body != "string")
    return (0, import_node5.json)(
      { errors: { title: null, items: "Body must be a string value" } },
      { status: 400 }
    );
  if (typeof items != "object")
    return (0, import_node5.json)(
      {
        errors: {
          title: null,
          items: "Items for the shopping list are required"
        }
      },
      { status: 400 }
    );
  let shoppingList = id && id !== "" && await editShopping({ id, title, body, items });
  return (0, import_node5.redirect)("/");
}
function ShoppingContainer({ shopping }) {
  var _a, _b, _c, _d;
  let actionData = (0, import_react10.useActionData)(), titleRef = import_react11.default.useRef(null), [title, setTitle] = (0, import_react11.useState)(shopping != null && shopping.title ? shopping == null ? void 0 : shopping.title : ""), [body, setBody] = (0, import_react11.useState)(shopping != null && shopping.body ? shopping == null ? void 0 : shopping.body : ""), [items, setItems] = (0, import_react11.useState)(
    shopping != null && shopping.items ? shopping == null ? void 0 : shopping.items : [
      { id: 1, description: "", bought: !1, recipe: "" },
      { id: 2, description: "", bought: !1, recipe: "" },
      { id: 3, description: "", bought: !1, recipe: "" }
    ]
  ), addMoreItems = () => {
    setItems([
      ...items,
      { id: items.length + 1, description: "", bought: !1, recipe: "" }
    ]);
  }, updateItems = (newId, newDescription) => setItems(
    items.map((item) => item.id === newId ? { ...item, description: newDescription } : item)
  );
  return import_react11.default.useEffect(() => {
    var _a2, _b2, _c2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.title ? (_b2 = titleRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.items;
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "card rounded-lg border border-gray-400 bg-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "card-body", children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(import_react10.Form, { method: "post", action: `/shopping/edit/${shopping == null ? void 0 : shopping.id}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
      "input",
      {
        type: "hidden",
        name: "id",
        value: shopping != null && shopping.id ? shopping == null ? void 0 : shopping.id : ""
      },
      void 0,
      !1,
      {
        fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
        lineNumber: 130,
        columnNumber: 11
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
        "input",
        {
          name: "title",
          value: title || "Your Shopping List",
          onChange: (event) => setTitle(event == null ? void 0 : event.target.value),
          className: `${INPUT_STYLE} ${TRANSPARENT} card-title text-xl font-extrabold`,
          "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.title ? !0 : void 0,
          "aria-errormessage": (_b = actionData == null ? void 0 : actionData.errors) != null && _b.title ? "title-error" : void 0
        },
        void 0,
        !1,
        {
          fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
          lineNumber: 137,
          columnNumber: 13
        },
        this
      ),
      ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.title) && /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "pt-1 text-red-700", id: "title-error", children: actionData.errors.title }, void 0, !1, {
        fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
        lineNumber: 148,
        columnNumber: 15
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
      lineNumber: 136,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
        SortableList,
        {
          items,
          onChange: setItems,
          renderItem: (item) => {
            var _a2, _b2;
            return /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(SortableList.Item, { id: item.id, recipe: item.recipe, children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(import_jsx_dev_runtime8.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
                  "input",
                  {
                    type: "checkbox",
                    name: "bougthItem",
                    value: item.id,
                    className: "checkbox-info checkbox",
                    checked: item.bought,
                    onChange: () => console.log(item.bought)
                  },
                  void 0,
                  !1,
                  {
                    fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
                    lineNumber: 161,
                    columnNumber: 23
                  },
                  this
                ),
                /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
                  "input",
                  {
                    id: item.id.toString(),
                    value: item.description,
                    onChange: (event) => {
                      updateItems(item.id, event.target.value);
                    },
                    name: "item",
                    className: item.bought ? `${SORTABLE_ITEM_STYLE} ${TRANSPARENT} mx-20 py-0 line-through` : `${SORTABLE_ITEM_STYLE} ${TRANSPARENT} mx-2 py-0`,
                    "aria-invalid": (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.items ? !0 : void 0,
                    "aria-errormessage": (_b2 = actionData == null ? void 0 : actionData.errors) != null && _b2.items ? "items-error" : void 0
                  },
                  void 0,
                  !1,
                  {
                    fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
                    lineNumber: 169,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, !0, {
                fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
                lineNumber: 160,
                columnNumber: 21
              }, this) }, void 0, !1, {
                fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
                lineNumber: 159,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(SortableList.DragHandle, {}, void 0, !1, {
                fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
                lineNumber: 190,
                columnNumber: 19
              }, this)
            ] }, void 0, !0, {
              fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
              lineNumber: 158,
              columnNumber: 17
            }, this);
          }
        },
        void 0,
        !1,
        {
          fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
          lineNumber: 154,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "mb-4 cursor-pointer pt-1 text-blue-700", children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("a", { onClick: addMoreItems, children: "Add more..." }, void 0, !1, {
        fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
        lineNumber: 196,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
        lineNumber: 195,
        columnNumber: 13
      }, this),
      ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.items) && /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "pt-1 text-red-700", id: "body-error", children: actionData.errors.items }, void 0, !1, {
        fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
        lineNumber: 200,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
        "input",
        {
          type: "hidden",
          name: "items",
          value: JSON.stringify(items)
        },
        void 0,
        !1,
        {
          fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
          lineNumber: 205,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("label", { className: LABEL_STYLE, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("span", { children: "Notes: " }, void 0, !1, {
          fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
          lineNumber: 212,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
          "textarea",
          {
            name: "body",
            value: body,
            onChange: (event) => setBody(event == null ? void 0 : event.target.value),
            rows: 2,
            className: `${TEXTAREA_STYLE} ${TRANSPARENT}`
          },
          void 0,
          !1,
          {
            fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
            lineNumber: 213,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
        lineNumber: 211,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
      lineNumber: 153,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "text-right", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
        "button",
        {
          name: "submit",
          type: "submit",
          value: "delete",
          className: BUTTON_STYLE,
          children: "Delete"
        },
        void 0,
        !1,
        {
          fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
          lineNumber: 224,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(
        "button",
        {
          name: "submit",
          type: "submit",
          value: "add",
          className: BUTTON_STYLE,
          children: "Save"
        },
        void 0,
        !1,
        {
          fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
          lineNumber: 233,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
      lineNumber: 223,
      columnNumber: 11
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
    lineNumber: 129,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
    lineNumber: 128,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/components/ShoppingContainer/ShoppingContainer.tsx",
    lineNumber: 127,
    columnNumber: 5
  }, this);
}

// app/routes/__index/shopping/edit/$shoppingId.tsx
var import_jsx_dev_runtime9 = require("react/jsx-dev-runtime");
async function action({ request }) {
  return actionRequest2({ request });
}
async function loader2({ request, params }) {
  let userId = await requireUserId(request);
  (0, import_tiny_invariant2.default)(params.shoppingId, "shoppingId not found");
  let shopping = await getShopping({ userId, id: params.shoppingId });
  if (!shopping)
    throw new Response("Not Found", { status: 404 });
  return (0, import_node6.json)({ shopping });
}
function ShoppingEditPage() {
  let data = (0, import_react12.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(ShoppingContainer, { shopping: data.shopping }, void 0, !1, {
    fileName: "app/routes/__index/shopping/edit/$shoppingId.tsx",
    lineNumber: 34,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__index/shopping/edit/$shoppingId.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}
function ErrorBoundary({ error }) {
  return console.error(error), /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { children: [
    "An unexpected error occurred: ",
    error.message
  ] }, void 0, !0, {
    fileName: "app/routes/__index/shopping/edit/$shoppingId.tsx",
    lineNumber: 42,
    columnNumber: 10
  }, this);
}
function CatchBoundary() {
  let caught = (0, import_react12.useCatch)();
  if (caught.status === 404)
    return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { children: "Shopping not found" }, void 0, !1, {
      fileName: "app/routes/__index/shopping/edit/$shoppingId.tsx",
      lineNumber: 49,
      columnNumber: 12
    }, this);
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// app/routes/__index/shopping/new.tsx
var new_exports = {};
__export(new_exports, {
  action: () => action2,
  default: () => AddShoppingListPage
});
var import_node7 = require("@remix-run/node"), import_react13 = require("@remix-run/react");
var import_jsx_dev_runtime10 = require("react/jsx-dev-runtime");
async function action2({ request }) {
  let userId = await requireUserId(request), recipes = (await request.formData()).get("selectedRecipesList"), recipeList = await getRecipeListByIds({
    userId,
    recipeList: recipes.split(",")
  });
  if (!recipeList)
    throw new Response("Not Found", { status: 404 });
  let itemId = 1, allItems = [];
  if (recipeList.map((recipe) => {
    recipe.ingredients.map((ingredient) => {
      ingredient.id = itemId++, ingredient.recipe = recipe.title, ingredient.bought = !1, allItems.push(ingredient);
    });
  }), allItems.length) {
    let shoppingList = await createShopping({
      title: "",
      body: "",
      items: allItems,
      userId
    });
  } else
    throw new Response("Not Found", { status: 404 });
  return (0, import_node7.redirect)("/");
}
function AddShoppingListPage() {
  let actionData = (0, import_react13.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { children: "Creating shopping list" }, void 0, !1, {
    fileName: "app/routes/__index/shopping/new.tsx",
    lineNumber: 52,
    columnNumber: 10
  }, this);
}

// app/routes/__index/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader3
});
async function loader3({ request }) {
  let host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    let url = new URL("/", `http://${host}`);
    return await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]), new Response("OK");
  } catch (error) {
    return console.log("healthcheck \u274C", { error }), new Response("ERROR", { status: 500 });
  }
}

// app/routes/__index/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action3,
  loader: () => loader4
});
var import_node8 = require("@remix-run/node");
async function action3({ request }) {
  return logout(request);
}
async function loader4() {
  return (0, import_node8.redirect)("/");
}

// app/routes/__index/recipe.tsx
var recipe_exports = {};
__export(recipe_exports, {
  default: () => Index2,
  loader: () => loader5
});
var import_react14 = require("@remix-run/react"), import_node9 = require("@remix-run/node");
var import_jsx_dev_runtime11 = require("react/jsx-dev-runtime");
async function loader5({ request }) {
  let userId = await getUserId(request), recipeListItems = await getRecipeListItems({ userId });
  return (0, import_node9.json)({ recipeListItems });
}
function Index2() {
  let data = useOptionalUser() ? (0, import_react14.useLoaderData)() : { recipeListItems: [] };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "flex-1 p-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(import_react14.Outlet, {}, void 0, !1, {
    fileName: "app/routes/__index/recipe.tsx",
    lineNumber: 21,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/__index/recipe.tsx",
    lineNumber: 20,
    columnNumber: 5
  }, this);
}

// app/routes/__index/recipe/edit/$recipeId.tsx
var recipeId_exports = {};
__export(recipeId_exports, {
  CatchBoundary: () => CatchBoundary2,
  ErrorBoundary: () => ErrorBoundary2,
  action: () => action4,
  default: () => RecipeEditPage,
  loader: () => loader6
});
var import_node10 = require("@remix-run/node"), import_react15 = require("@remix-run/react"), import_tiny_invariant3 = __toESM(require("tiny-invariant"));
var import_jsx_dev_runtime12 = require("react/jsx-dev-runtime");
async function action4({ request }) {
  return actionRequest({ request });
}
async function loader6({ request, params }) {
  let userId = await requireUserId(request);
  (0, import_tiny_invariant3.default)(params.recipeId, "recipeId not found");
  let recipe = await getRecipe({ userId, id: params.recipeId });
  if (!recipe)
    throw new Response("Not Found", { status: 404 });
  return (0, import_node10.json)({ recipe });
}
function RecipeEditPage() {
  let data = (0, import_react15.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(RecipeContainer, { recipe: data.recipe }, void 0, !1, {
    fileName: "app/routes/__index/recipe/edit/$recipeId.tsx",
    lineNumber: 31,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__index/recipe/edit/$recipeId.tsx",
    lineNumber: 30,
    columnNumber: 5
  }, this);
}
function ErrorBoundary2({ error }) {
  return console.error(error), /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { children: [
    "An unexpected error occurred: ",
    error.message
  ] }, void 0, !0, {
    fileName: "app/routes/__index/recipe/edit/$recipeId.tsx",
    lineNumber: 39,
    columnNumber: 10
  }, this);
}
function CatchBoundary2() {
  let caught = (0, import_react15.useCatch)();
  if (caught.status === 404)
    return /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { children: "Recipe not found" }, void 0, !1, {
      fileName: "app/routes/__index/recipe/edit/$recipeId.tsx",
      lineNumber: 46,
      columnNumber: 12
    }, this);
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// app/routes/__index/recipe/$recipeId.tsx
var recipeId_exports2 = {};
__export(recipeId_exports2, {
  CatchBoundary: () => CatchBoundary3,
  ErrorBoundary: () => ErrorBoundary3,
  action: () => action5,
  default: () => RecipeDetailsPage,
  loader: () => loader7
});
var import_node11 = require("@remix-run/node"), import_react16 = require("@remix-run/react"), import_tiny_invariant4 = __toESM(require("tiny-invariant"));
var import_jsx_dev_runtime13 = require("react/jsx-dev-runtime");
async function loader7({ request, params }) {
  let userId = await requireUserId(request);
  (0, import_tiny_invariant4.default)(params.recipeId, "recipeId not found");
  let recipe = await getRecipe({ userId, id: params.recipeId });
  if (!recipe)
    throw new Response("Not Found", { status: 404 });
  return (0, import_node11.json)({ recipe });
}
async function action5({ request, params }) {
  let userId = await requireUserId(request);
  return (0, import_tiny_invariant4.default)(params.recipeId, "recipeId not found"), await deleteRecipe({ userId, id: params.recipeId }), (0, import_node11.redirect)("/recipe");
}
function RecipeDetailsPage() {
  let data = (0, import_react16.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("h3", { className: "text-2xl font-bold", children: data.recipe.title }, void 0, !1, {
      fileName: "app/routes/__index/recipe/$recipeId.tsx",
      lineNumber: 34,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("p", { className: "py-6", children: data.recipe.body }, void 0, !1, {
      fileName: "app/routes/__index/recipe/$recipeId.tsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("hr", { className: "my-4" }, void 0, !1, {
      fileName: "app/routes/__index/recipe/$recipeId.tsx",
      lineNumber: 36,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(import_react16.Form, { method: "post", children: /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
      "button",
      {
        type: "submit",
        className: "rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
        children: "Delete"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/__index/recipe/$recipeId.tsx",
        lineNumber: 38,
        columnNumber: 9
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/__index/recipe/$recipeId.tsx",
      lineNumber: 37,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__index/recipe/$recipeId.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}
function ErrorBoundary3({ error }) {
  return console.error(error), /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { children: [
    "An unexpected error occurred: ",
    error.message
  ] }, void 0, !0, {
    fileName: "app/routes/__index/recipe/$recipeId.tsx",
    lineNumber: 52,
    columnNumber: 10
  }, this);
}
function CatchBoundary3() {
  let caught = (0, import_react16.useCatch)();
  if (caught.status === 404)
    return /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { children: "Recipe not found" }, void 0, !1, {
      fileName: "app/routes/__index/recipe/$recipeId.tsx",
      lineNumber: 59,
      columnNumber: 12
    }, this);
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// app/routes/__index/recipe/index.tsx
var recipe_exports2 = {};
__export(recipe_exports2, {
  default: () => RecipeIndexPage
});
var import_react17 = require("@remix-run/react"), import_jsx_dev_runtime14 = require("react/jsx-dev-runtime");
function RecipeIndexPage() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("p", { children: [
    "No recipe selected. Select a recipe on the left, or",
    " ",
    /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(import_react17.Link, { to: "new", className: "text-blue-500 underline", children: "create a new recipe." }, void 0, !1, {
      fileName: "app/routes/__index/recipe/index.tsx",
      lineNumber: 7,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__index/recipe/index.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// app/routes/__index/recipe/new.tsx
var new_exports2 = {};
__export(new_exports2, {
  action: () => action6,
  default: () => NewRecipePage,
  loader: () => loader8
});
var import_node12 = require("@remix-run/node");
var import_jsx_dev_runtime15 = require("react/jsx-dev-runtime"), loader8 = async ({ request }) => await getUserId(request) ? null : (0, import_node12.redirect)("/login");
async function action6({ request }) {
  return actionRequest({ request });
}
function NewRecipePage() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(RecipeContainer, {}, void 0, !1, {
    fileName: "app/routes/__index/recipe/new.tsx",
    lineNumber: 17,
    columnNumber: 10
  }, this);
}

// app/routes/__index/index.tsx
var index_exports2 = {};
__export(index_exports2, {
  default: () => Index3,
  loader: () => loader9
});
var import_react18 = require("@remix-run/react"), import_node13 = require("@remix-run/node");
var import_react19 = require("react");
var import_jsx_dev_runtime16 = require("react/jsx-dev-runtime");
async function loader9({ request }) {
  let userId = await getUserId(request), recipeListItems = await getRecipeListItems({ userId }), latestShopping = await getLatestShopping({ userId });
  return (0, import_node13.json)({ recipeListItems, latestShopping });
}
function Index3() {
  var _a, _b, _c;
  let user = useOptionalUser(), data = user ? (0, import_react18.useLoaderData)() : { recipeListItems: [], latestShopping: null }, [userinfo, setUserInfo] = (0, import_react19.useState)({ selectedRecipes: [] }), [collapsed, setCollapsed] = (0, import_react19.useState)(!0), handleChange = (e) => {
    let { value, checked } = e.target, { selectedRecipes } = userinfo;
    setUserInfo(checked ? {
      selectedRecipes: [...selectedRecipes, value]
    } : {
      selectedRecipes: selectedRecipes.filter((e2) => e2 !== value)
    });
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_jsx_dev_runtime16.Fragment, { children: [
    !user && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "grid grid-cols-1 items-center justify-center md:grid-cols-2 ", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("h1", { className: "font-title mb-6 font-serif text-4xl font-extrabold sm:text-5xl lg:text-6xl", children: "Turn your family recipes into grocery lists" }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 46,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("h2", { className: "font-title mb-16 font-serif text-xl", children: "Add your recipes and create yout lists with no effort" }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 49,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 45,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("img", { src: "/images/shopping_illustration.png" }, void 0, !1, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 53,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 44,
      columnNumber: 9
    }, this),
    ((_a = data == null ? void 0 : data.recipeListItems) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_jsx_dev_runtime16.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "container mx-auto flex justify-end", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "w-64", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: "label cursor-pointer", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "card-title", children: collapsed ? /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_jsx_dev_runtime16.Fragment, { children: "Show Ingredients" }, void 0, !1, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 65,
        columnNumber: 21
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_jsx_dev_runtime16.Fragment, { children: "Collapse Ingredients" }, void 0, !1, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 63,
        columnNumber: 21
      }, this) }, void 0, !1, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 61,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
        "input",
        {
          type: "checkbox",
          name: "collapseIngredients",
          value: collapsed,
          className: "checkbox-info checkbox",
          onChange: () => setCollapsed(!collapsed)
        },
        void 0,
        !1,
        {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 68,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 60,
      columnNumber: 15
    }, this) }, void 0, !1, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 59,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 58,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 57,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_react18.Form, { method: "post", action: "shopping/new", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "container mx-auto mt-4", children: [
        ((_b = data == null ? void 0 : data.recipeListItems) == null ? void 0 : _b.length) === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: "card-title p-4", children: "No recipes yet" }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 83,
          columnNumber: 13
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", children: (_c = data == null ? void 0 : data.recipeListItems) == null ? void 0 : _c.map((recipe) => {
          var _a2;
          return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "card m-2 transform cursor-pointer rounded-lg border border-gray-400 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-opacity-0 hover:shadow-md", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "card-body p-5", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "form-control", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: "label cursor-pointer", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
                "input",
                {
                  type: "checkbox",
                  name: "selectedRecipesCheckbox",
                  value: recipe.id,
                  className: "checkbox-info checkbox",
                  onChange: handleChange
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/__index/index.tsx",
                  lineNumber: 91,
                  columnNumber: 25
                },
                this
              ),
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "mr-5 ml-5 font-bold", children: recipe.title }, void 0, !1, {
                fileName: "app/routes/__index/index.tsx",
                lineNumber: 98,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_react18.NavLink, { to: "/recipe/edit/" + recipe.id, children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "btn-ghost btn-xs btn-circle btn float-right mx-1 inline-block text-info", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
                "svg",
                {
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "1.5",
                  viewBox: "0 0 24 24",
                  xmlns: "http://www.w3.org/2000/svg",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
                    "path",
                    {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    },
                    void 0,
                    !1,
                    {
                      fileName: "app/routes/__index/index.tsx",
                      lineNumber: 111,
                      columnNumber: 31
                    },
                    this
                  )
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/__index/index.tsx",
                  lineNumber: 103,
                  columnNumber: 29
                },
                this
              ) }, void 0, !1, {
                fileName: "app/routes/__index/index.tsx",
                lineNumber: 102,
                columnNumber: 27
              }, this) }, void 0, !1, {
                fileName: "app/routes/__index/index.tsx",
                lineNumber: 101,
                columnNumber: 25
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/__index/index.tsx",
              lineNumber: 90,
              columnNumber: 23
            }, this) }, void 0, !1, {
              fileName: "app/routes/__index/index.tsx",
              lineNumber: 89,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
              "input",
              {
                type: "hidden",
                name: "selectedRecipesList",
                value: userinfo.selectedRecipes
              },
              void 0,
              !1,
              {
                fileName: "app/routes/__index/index.tsx",
                lineNumber: 122,
                columnNumber: 21
              },
              this
            ),
            !collapsed && ((_a2 = recipe.ingredients) == null ? void 0 : _a2.map(
              (ingredient) => (ingredient == null ? void 0 : ingredient.description) !== "" && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: "font-serif text-sm font-light text-gray-700", children: ingredient == null ? void 0 : ingredient.description }, void 0, !1, {
                fileName: "app/routes/__index/index.tsx",
                lineNumber: 132,
                columnNumber: 31
              }, this)
            ))
          ] }, void 0, !0, {
            fileName: "app/routes/__index/index.tsx",
            lineNumber: 88,
            columnNumber: 19
          }, this) }, void 0, !1, {
            fileName: "app/routes/__index/index.tsx",
            lineNumber: 87,
            columnNumber: 17
          }, this);
        }) }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 85,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_react18.Link, { to: "/recipe/new", className: "p-4 text-xl text-blue-500", children: "+ Add your own recipes" }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 144,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this),
      userinfo.selectedRecipes && userinfo.selectedRecipes.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "container mx-auto my-12 grid grid-cols-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
        "button",
        {
          name: "submit",
          type: "submit",
          value: "shopping",
          className: "rounded bg-neutral-400 py-2 px-4 text-white hover:bg-neutral-600 focus:bg-neutral-400",
          children: "Create grocery list"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 150,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 149,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 80,
      columnNumber: 7
    }, this),
    data.latestShopping !== null && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "container mx-auto mt-16", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(ShoppingContainer, { shopping: data.latestShopping }, void 0, !1, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 164,
      columnNumber: 11
    }, this) }, data.latestShopping.id, !1, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 163,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "container mx-auto mt-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_react18.Outlet, {}, void 0, !1, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 169,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 168,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__index/index.tsx",
    lineNumber: 42,
    columnNumber: 5
  }, this);
}

// app/routes/__index/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action7,
  default: () => LoginPage,
  loader: () => loader10,
  meta: () => meta2
});
var import_node14 = require("@remix-run/node"), import_react20 = require("@remix-run/react"), React5 = __toESM(require("react"));
var import_jsx_dev_runtime17 = require("react/jsx-dev-runtime");
async function loader10({ request }) {
  return await getUserId(request) ? (0, import_node14.redirect)("/") : (0, import_node14.json)({});
}
async function action7({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/"), remember = formData.get("remember");
  if (!validateEmail(email))
    return (0, import_node14.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node14.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node14.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  let user = await verifyLogin(email, password);
  return user ? createUserSession({
    request,
    userId: user.id,
    remember: remember === "on",
    redirectTo
  }) : (0, import_node14.json)(
    { errors: { email: "Invalid email or password", password: null } },
    { status: 400 }
  );
}
var meta2 = () => ({
  title: "Login"
});
function LoginPage() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react20.useSearchParams)(), redirectTo = searchParams.get("redirectTo") || "/", actionData = (0, import_react20.useActionData)(), emailRef = React5.useRef(null), passwordRef = React5.useRef(null);
  return React5.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email ? (_b2 = emailRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "mx-auto w-full max-w-md px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(import_react20.Form, { method: "post", className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
        "label",
        {
          htmlFor: "email",
          className: "block text-sm font-medium text-gray-700",
          children: "Email address"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/__index/login.tsx",
          lineNumber: 87,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
          "input",
          {
            ref: emailRef,
            id: "email",
            required: !0,
            autoFocus: !0,
            name: "email",
            type: "email",
            autoComplete: "email",
            "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.email ? !0 : void 0,
            "aria-describedby": "email-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index/login.tsx",
            lineNumber: 94,
            columnNumber: 15
          },
          this
        ),
        ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "pt-1 text-red-700", id: "email-error", children: actionData.errors.email }, void 0, !1, {
          fileName: "app/routes/__index/login.tsx",
          lineNumber: 107,
          columnNumber: 17
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index/login.tsx",
        lineNumber: 93,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index/login.tsx",
      lineNumber: 86,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
        "label",
        {
          htmlFor: "password",
          className: "block text-sm font-medium text-gray-700",
          children: "Password"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/__index/login.tsx",
          lineNumber: 115,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
          "input",
          {
            id: "password",
            ref: passwordRef,
            name: "password",
            type: "password",
            autoComplete: "current-password",
            "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.password ? !0 : void 0,
            "aria-describedby": "password-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index/login.tsx",
            lineNumber: 122,
            columnNumber: 15
          },
          this
        ),
        ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "pt-1 text-red-700", id: "password-error", children: actionData.errors.password }, void 0, !1, {
          fileName: "app/routes/__index/login.tsx",
          lineNumber: 133,
          columnNumber: 17
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index/login.tsx",
        lineNumber: 121,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index/login.tsx",
      lineNumber: 114,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("input", { type: "hidden", name: "redirectTo", value: redirectTo }, void 0, !1, {
      fileName: "app/routes/__index/login.tsx",
      lineNumber: 140,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
      "button",
      {
        type: "submit",
        className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
        children: "Log in"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/__index/login.tsx",
        lineNumber: 141,
        columnNumber: 11
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
          "input",
          {
            id: "remember",
            name: "remember",
            type: "checkbox",
            className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index/login.tsx",
            lineNumber: 149,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
          "label",
          {
            htmlFor: "remember",
            className: "ml-2 block text-sm text-gray-900",
            children: "Remember me"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index/login.tsx",
            lineNumber: 155,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/__index/login.tsx",
        lineNumber: 148,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "text-center text-sm text-gray-500", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
          import_react20.Link,
          {
            className: "text-blue-500 underline",
            to: {
              pathname: "/join",
              search: searchParams.toString()
            },
            children: "Sign up"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index/login.tsx",
            lineNumber: 164,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/__index/login.tsx",
        lineNumber: 162,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index/login.tsx",
      lineNumber: 147,
      columnNumber: 11
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__index/login.tsx",
    lineNumber: 85,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/__index/login.tsx",
    lineNumber: 84,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__index/login.tsx",
    lineNumber: 83,
    columnNumber: 5
  }, this);
}

// app/routes/__index/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action8,
  default: () => Join,
  loader: () => loader11,
  meta: () => meta3
});
var import_node15 = require("@remix-run/node"), import_react21 = require("@remix-run/react"), React6 = __toESM(require("react"));
var import_jsx_dev_runtime18 = require("react/jsx-dev-runtime");
async function loader11({ request }) {
  return await getUserId(request) ? (0, import_node15.redirect)("/") : (0, import_node15.json)({});
}
async function action8({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  if (!validateEmail(email))
    return (0, import_node15.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node15.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node15.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  if (await getUserByEmail(email))
    return (0, import_node15.json)(
      {
        errors: {
          email: "A user already exists with this email",
          password: null
        }
      },
      { status: 400 }
    );
  let user = await createUser(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: !1,
    redirectTo
  });
}
var meta3 = () => ({
  title: "Sign Up"
});
function Join() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react21.useSearchParams)(), redirectTo = searchParams.get("redirectTo") ?? void 0, actionData = (0, import_react21.useActionData)(), emailRef = React6.useRef(null), passwordRef = React6.useRef(null);
  return React6.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email ? (_b2 = emailRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "mx-auto w-full max-w-md px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(import_react21.Form, { method: "post", className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
        "label",
        {
          htmlFor: "email",
          className: "block text-sm font-medium text-gray-700",
          children: "Email address"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/__index/join.tsx",
          lineNumber: 93,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
          "input",
          {
            ref: emailRef,
            id: "email",
            required: !0,
            autoFocus: !0,
            name: "email",
            type: "email",
            autoComplete: "email",
            "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.email ? !0 : void 0,
            "aria-describedby": "email-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index/join.tsx",
            lineNumber: 100,
            columnNumber: 15
          },
          this
        ),
        ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "pt-1 text-red-700", id: "email-error", children: actionData.errors.email }, void 0, !1, {
          fileName: "app/routes/__index/join.tsx",
          lineNumber: 113,
          columnNumber: 17
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index/join.tsx",
        lineNumber: 99,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index/join.tsx",
      lineNumber: 92,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
        "label",
        {
          htmlFor: "password",
          className: "block text-sm font-medium text-gray-700",
          children: "Password"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/__index/join.tsx",
          lineNumber: 121,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
          "input",
          {
            id: "password",
            ref: passwordRef,
            name: "password",
            type: "password",
            autoComplete: "new-password",
            "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.password ? !0 : void 0,
            "aria-describedby": "password-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/__index/join.tsx",
            lineNumber: 128,
            columnNumber: 15
          },
          this
        ),
        ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "pt-1 text-red-700", id: "password-error", children: actionData.errors.password }, void 0, !1, {
          fileName: "app/routes/__index/join.tsx",
          lineNumber: 139,
          columnNumber: 17
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index/join.tsx",
        lineNumber: 127,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index/join.tsx",
      lineNumber: 120,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("input", { type: "hidden", name: "redirectTo", value: redirectTo }, void 0, !1, {
      fileName: "app/routes/__index/join.tsx",
      lineNumber: 146,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
      "button",
      {
        type: "submit",
        className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400",
        children: "Create Account"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/__index/join.tsx",
        lineNumber: 147,
        columnNumber: 11
      },
      this
    ),
    /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)("div", { className: "text-center text-sm text-gray-500", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime18.jsxDEV)(
        import_react21.Link,
        {
          className: "text-blue-500 underline",
          to: {
            pathname: "/login",
            search: searchParams.toString()
          },
          children: "Log in"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/__index/join.tsx",
          lineNumber: 156,
          columnNumber: 15
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/__index/join.tsx",
      lineNumber: 154,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/routes/__index/join.tsx",
      lineNumber: 153,
      columnNumber: 11
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__index/join.tsx",
    lineNumber: 91,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/__index/join.tsx",
    lineNumber: 90,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/__index/join.tsx",
    lineNumber: 89,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "e3b4ec2c", entry: { module: "/build/entry.client-AQ73UVCK.js", imports: ["/build/_shared/chunk-54WZONGG.js", "/build/_shared/chunk-OIMLTT7D.js", "/build/_shared/chunk-5KL4PAQL.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-BX5ZXFFR.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index": { id: "routes/__index", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/__index-P4VVYNQ4.js", imports: ["/build/_shared/chunk-NB7YIAZO.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/healthcheck": { id: "routes/__index/healthcheck", parentId: "routes/__index", path: "healthcheck", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/healthcheck-U42KF6HR.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/index": { id: "routes/__index/index", parentId: "routes/__index", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/__index/index-LZJGS7XY.js", imports: ["/build/_shared/chunk-AT4GDGJM.js", "/build/_shared/chunk-IU4RZZ3H.js", "/build/_shared/chunk-LXKICL6J.js", "/build/_shared/chunk-4UCQ5NZ4.js", "/build/_shared/chunk-GLWAIFE6.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/join": { id: "routes/__index/join", parentId: "routes/__index", path: "join", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/join-5AVXWIRL.js", imports: ["/build/_shared/chunk-M2ND3YFM.js", "/build/_shared/chunk-GLWAIFE6.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/login": { id: "routes/__index/login", parentId: "routes/__index", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/login-AFHT65AC.js", imports: ["/build/_shared/chunk-M2ND3YFM.js", "/build/_shared/chunk-GLWAIFE6.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/logout": { id: "routes/__index/logout", parentId: "routes/__index", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/logout-HDIFVD5Z.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/recipe": { id: "routes/__index/recipe", parentId: "routes/__index", path: "recipe", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/recipe-J3BKXTKR.js", imports: ["/build/_shared/chunk-4UCQ5NZ4.js", "/build/_shared/chunk-GLWAIFE6.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/recipe/$recipeId": { id: "routes/__index/recipe/$recipeId", parentId: "routes/__index/recipe", path: ":recipeId", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/recipe/$recipeId-ZZENNQGQ.js", imports: ["/build/_shared/chunk-AUYLHJJM.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !0, hasErrorBoundary: !0 }, "routes/__index/recipe/edit/$recipeId": { id: "routes/__index/recipe/edit/$recipeId", parentId: "routes/__index/recipe", path: "edit/:recipeId", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/recipe/edit/$recipeId-X6BIB7IW.js", imports: ["/build/_shared/chunk-AUYLHJJM.js", "/build/_shared/chunk-IU4RZZ3H.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !0, hasErrorBoundary: !0 }, "routes/__index/recipe/index": { id: "routes/__index/recipe/index", parentId: "routes/__index/recipe", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/__index/recipe/index-OET6HVLU.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/recipe/new": { id: "routes/__index/recipe/new", parentId: "routes/__index/recipe", path: "new", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/recipe/new-TL4LAQMQ.js", imports: ["/build/_shared/chunk-IU4RZZ3H.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/shopping/edit/$shoppingId": { id: "routes/__index/shopping/edit/$shoppingId", parentId: "routes/__index", path: "shopping/edit/:shoppingId", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/shopping/edit/$shoppingId-B6ONRSJX.js", imports: ["/build/_shared/chunk-AUYLHJJM.js", "/build/_shared/chunk-AT4GDGJM.js", "/build/_shared/chunk-IU4RZZ3H.js", "/build/_shared/chunk-LXKICL6J.js", "/build/_shared/chunk-4UCQ5NZ4.js", "/build/_shared/chunk-GLWAIFE6.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !0, hasErrorBoundary: !0 }, "routes/__index/shopping/new": { id: "routes/__index/shopping/new", parentId: "routes/__index", path: "shopping/new", index: void 0, caseSensitive: void 0, module: "/build/routes/__index/shopping/new-3KEGQPSA.js", imports: ["/build/_shared/chunk-LXKICL6J.js", "/build/_shared/chunk-4UCQ5NZ4.js", "/build/_shared/chunk-GLWAIFE6.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, cssBundleHref: void 0, url: "/build/manifest-E3B4EC2C.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public\\build", future = { unstable_cssModules: !1, unstable_cssSideEffectImports: !1, unstable_dev: !1, unstable_vanillaExtract: !1, v2_errorBoundary: !1, v2_meta: !1, v2_routeConvention: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/__index": {
    id: "routes/__index",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/__index/shopping/edit/$shoppingId": {
    id: "routes/__index/shopping/edit/$shoppingId",
    parentId: "routes/__index",
    path: "shopping/edit/:shoppingId",
    index: void 0,
    caseSensitive: void 0,
    module: shoppingId_exports
  },
  "routes/__index/shopping/new": {
    id: "routes/__index/shopping/new",
    parentId: "routes/__index",
    path: "shopping/new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  "routes/__index/healthcheck": {
    id: "routes/__index/healthcheck",
    parentId: "routes/__index",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/__index/logout": {
    id: "routes/__index/logout",
    parentId: "routes/__index",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/__index/recipe": {
    id: "routes/__index/recipe",
    parentId: "routes/__index",
    path: "recipe",
    index: void 0,
    caseSensitive: void 0,
    module: recipe_exports
  },
  "routes/__index/recipe/edit/$recipeId": {
    id: "routes/__index/recipe/edit/$recipeId",
    parentId: "routes/__index/recipe",
    path: "edit/:recipeId",
    index: void 0,
    caseSensitive: void 0,
    module: recipeId_exports
  },
  "routes/__index/recipe/$recipeId": {
    id: "routes/__index/recipe/$recipeId",
    parentId: "routes/__index/recipe",
    path: ":recipeId",
    index: void 0,
    caseSensitive: void 0,
    module: recipeId_exports2
  },
  "routes/__index/recipe/index": {
    id: "routes/__index/recipe/index",
    parentId: "routes/__index/recipe",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: recipe_exports2
  },
  "routes/__index/recipe/new": {
    id: "routes/__index/recipe/new",
    parentId: "routes/__index/recipe",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports2
  },
  "routes/__index/index": {
    id: "routes/__index/index",
    parentId: "routes/__index",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports2
  },
  "routes/__index/login": {
    id: "routes/__index/login",
    parentId: "routes/__index",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/__index/join": {
    id: "routes/__index/join",
    parentId: "routes/__index",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
