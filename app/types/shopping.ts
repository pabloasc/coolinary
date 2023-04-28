export type ShoppingItem = {
  id: number;
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
