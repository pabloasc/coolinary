import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useLoaderData,
} from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin, createUserSocialLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({ ENV: { GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID } });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const socialLogin = formData.get("socialLogin");

  if (socialLogin !== "true") {
    const password = formData.get("password");
    const remember = formData.get("remember");

    if (!validateEmail(email)) {
      return json(
        { errors: { email: "Email is invalid", password: null } },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length === 0) {
      return json(
        { errors: { email: null, password: "Password is required" } },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return json(
        { errors: { email: null, password: "Password is too short" } },
        { status: 400 }
      );
    }

    const user = await verifyLogin(email, password);

    if (!user) {
      return json(
        { errors: { email: "Invalid email or password", password: null } },
        { status: 400 }
      );
    }
    return createUserSession({
      request,
      userId: user.id,
      remember: remember === "on" ? true : false,
      redirectTo,
    });
  } else {
    const user = await createUserSocialLogin(email);
    if (user) {
      return createUserSession({
        request,
        userId: user.id,
        remember: true,
        redirectTo,
      });
    }
  }
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  const divRef = React.useRef(null);

  React.useEffect(() => {
    if (divRef.current) {
      window.google.accounts.id.initialize({
        id: "g_id_onload",
        client_id: data.ENV.GOOGLE_CLIENT_ID,
        context: "signup",
        ux_mode: "popup",
        auto_select: true,
        itp_support: true,
        callback: validateGoogleLogin,
      });
      window.google.accounts.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        text: "continue_with",
        shape: "rectangular",
        width: 300,
      });
    }
  }, [divRef.current]);

  function validateGoogleLogin(res: any) {
    // This is the function that will be executed once the authentication with google is finished
    function parseJwt(token: string) {
      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    }

    const token = res.credential;
    const decoded = parseJwt(token);
    if (decoded.email) {
      var formData = new FormData();
      formData.append("socialLogin", "true");
      formData.append("email", decoded.email);
      let request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        // listen for state changes
        if (request.readyState == 4 && request.status == 200) {
          // when completed we can move away
          console.log("asd completado");
          window.location.reload();
        }
      };
      request.open("POST", "/login");
      request.send(formData);
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        {/* Activate regular login when having password recovery
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password && (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
              */}
        <b>Join us using your Google account</b>
        <br />
        <br />
        <div ref={divRef}></div>
      </div>
    </div>
  );
}
