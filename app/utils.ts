import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { ObjectId } from "bson";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function generateId(): number {
  //return new ObjectId().toString();
  return Math.floor(Math.random() * Date.now());
}

export function createListTitle(createdAt: Date, language: string): string {
  const formatDate = new Date(createdAt);
  switch (language) {
    case "English":
      return "List Created at" + formatDate.toLocaleDateString("en-US");
    case "Espanol":
      return "Lista del " + formatDate.toLocaleDateString("es-ES");
    case "Dutch":
      return "Boodschappenlijst van " + formatDate.toLocaleDateString("nl-NL");
    default:
      return "List Created at" + formatDate.toLocaleDateString();
  }
}

export function removeDuplicateObjects(array, property) {
  const uniqueIds = [];
  const unique = array.filter((element) => {
    const isDuplicate = uniqueIds.includes(element[property]);
    if (!isDuplicate) {
      uniqueIds.push(element[property]);
      return true;
    }
    return false;
  });
  return unique;
}
