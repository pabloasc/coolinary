import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import * as React from "react";

import { requireUserId } from "~/session.server";

import { editUser } from "~/models/user.server";
import { getLanguages } from "~/models/languages";
import { getTranslation } from "~/models/languages";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const language = formData.get("language");
  const userId = await requireUserId(request);

  if (typeof language !== "string" || language.length === 0) {
    return json(
      { errors: { email: null, password: "Language is required" } },
      { status: 400 }
    );
  }

  await editUser({ id: userId, language });
  return redirect("/");
}

export const meta: MetaFunction = () => {
  return {
    title: "Edit Settings",
  };
};

export default function editSettings() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const languageRef = React.useRef<HTMLSelectElement>(null);
  const user = useOptionalUser();

  React.useEffect(() => {
    if (actionData?.errors?.language) {
      languageRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center  my-4">
      <h1 className="card-title my-4">
        {getTranslation("SETTINGS", user?.language)}
      </h1>

      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              Language
            </label>
            <div className="mt-1">
              <select
                ref={languageRef}
                id="language"
                required
                autoFocus={true}
                name="language"
                autoComplete="email"
                aria-invalid={actionData?.errors?.language ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              >
                {getLanguages().map((lang) => (
                  <option id={lang}>{lang}</option>
                ))}
              </select>

              {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save Settings
          </button>
        </Form>
      </div>
    </div>
  );
}
