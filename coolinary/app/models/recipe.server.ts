import type { User, Recipe } from "@prisma/client";
import { ObjectId } from 'bson';

import { prisma } from "~/db.server";

export type { Recipe } from "@prisma/client";

export function getRecipe({
  id,
  userId,
}: Pick<Recipe, "id"> & {
  userId: User["id"];
}) {
  return prisma.recipe.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  });
}

export function getRecipeListItems({ userId }: { userId?: User["id"] }) {
  return prisma.recipe.findMany({
    where: { userId },
    select: { id: true, title: true, body: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createRecipe({
  body,
  title,
  userId,
}: Pick<Recipe, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.recipe.create({
    data: {
      id: new ObjectId().toString(),
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
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
