import type { User, Recipe, Prisma } from "@prisma/client";
import { ObjectId } from "bson";

import { prisma } from "~/db.server";

export type { Recipe } from "@prisma/client";

export function getRecipe({
  id,
  userId,
}: Pick<Recipe, "id"> & {
  userId: User["id"];
}) {
  return prisma.recipe.findFirst({
    select: { id: true, body: true, title: true, ingredients: true },
    where: { id, userId },
  });
}

export function getRecipeListItems({ userId }: { userId?: User["id"] }) {
  return prisma.recipe.findMany({
    where: { userId },
    select: { id: true, title: true, body: true, ingredients: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createRecipe({
  body,
  title,
  ingredients = {},
  userId,
}: Pick<Recipe, "body" | "title" | "ingredients"> & {
  userId: User["id"];
}) {
  return prisma.recipe.create({
    data: {
      id: new ObjectId().toString(),
      title,
      body,
      ingredients: ingredients as Prisma.JsonObject,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function editRecipe({
  id,
  body,
  title,
  ingredients = {},
}: Pick<Recipe, "id" | "body" | "title" | "ingredients">) {
  return prisma.recipe.update({
    where: {
      id: id,
    },
    data: {
      title,
      body,
      ingredients: ingredients as Prisma.JsonObject,
    },
  });
}

export function deleteRecipe({
  id,
  userId,
}: Pick<Recipe, "id"> & { userId: User["id"] }) {
  return prisma.recipe.deleteMany({
    where: { id, userId },
  });
}
