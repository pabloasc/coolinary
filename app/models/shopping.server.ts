import type { User, Shopping, Prisma } from "@prisma/client";
import { ObjectId } from "bson";

import { prisma } from "~/db.server";

export type { Shopping } from "@prisma/client";

export function getShopping({
  id,
  userId,
}: Pick<Shopping, "id"> & {
  userId: User["id"];
}) {
  return prisma.shopping.findFirst({
    select: {
      id: true,
      body: true,
      title: true,
      items: true,
      userId: true,
    },
    where: { id, userId },
  });
}

export function getLatestShopping({ userId }: { userId?: User["id"] }) {
  return prisma.shopping.findFirst({
    select: {
      id: true,
      body: true,
      title: true,
      items: true,
      userId: true,
      createdAt: true,
    },
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function getAllShopping({ userId }: { userId?: User["id"] }) {
  return prisma.shopping.findMany({
    select: {
      id: true,
      body: true,
      title: true,
      items: true,
      userId: true,
      createdAt: true,
    },
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function getShoppingListItems({ userId }: { userId?: User["id"] }) {
  return prisma.shopping.findMany({
    where: { userId },
    select: { id: true, title: true, body: true, items: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function getShoppingListByIds({
  userId,
  shoppingList,
}: {
  userId?: User["id"];
  shoppingList: string[];
}) {
  return prisma.shopping.findMany({
    where: { userId, id: { in: shoppingList } },
    select: { title: true, items: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createShopping({
  body,
  title,
  items = {},
  userId,
}: Pick<Shopping, "body" | "title" | "items"> & {
  userId: User["id"];
}) {
  return prisma.shopping.create({
    data: {
      id: new ObjectId().toString(),
      title,
      body,
      items: items,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function editShopping({
  id,
  body,
  title,
  items = [],
}: Pick<Shopping, "id" | "body" | "title" | "items">) {
  return prisma.shopping.update({
    where: {
      id: id,
    },
    data: {
      title,
      body,
      items: items.filter((itm) => itm.description !== ""),
    },
  });
}

export function deleteShopping({
  id,
  userId,
}: Pick<Shopping, "id"> & { userId: User["id"] }) {
  return prisma.shopping.deleteMany({
    where: { id, userId },
  });
}
