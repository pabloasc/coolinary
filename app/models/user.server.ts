import type { Password, User } from "@prisma/client";

import { ObjectId } from "bson";

import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      id: new ObjectId().toString(),
      email,
      password: {
        create: {
          id: new ObjectId().toString(),
          hash: hashedPassword,
        },
      },
      language: "English",
    },
  });
}

export async function createUserSocialLogin(email: string, picture: string) {
  //First, Check if user with email exists
  const user = await prisma.user.findUnique({ where: { email: email } });

  //Then, if it does not exists, create the user
  if (!user) {
    return prisma.user.create({
      data: {
        id: new ObjectId().toString(),
        email,
        image: picture,
        language: "English",
      },
    });
  }
  return user;
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export function editUser({ id, language }: Pick<User, "id" | "language">) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      language,
    },
  });
}
