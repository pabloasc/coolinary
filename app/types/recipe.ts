export type Ingredient = {
  id: string | number;
  description: string;
};

export type Recipe = {
  id: string;
  title: string;
  body?: string;
  ingredients?: Ingredient[];
  userId: string;
};
