export type ShoppingItem = {
  id: string;
  description: string;
  bought: boolean;
  recipe: string | null;
};

export type Shopping = {
  id: string;
  title: string;
  body?: string;
  items?: ShoppingItem[];
  userId: string;
  createdAt?: Date;
};
