export type Ingredient {
  id: number;
  description: string;
}

export type Recipe = {
  id: string;
  title: string;
  body?: string;
  ingredients?: Ingredient[];
  userId: string;
};
