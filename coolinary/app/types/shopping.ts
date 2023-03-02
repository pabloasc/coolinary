export type Shopping = {
  id: string;
  title: string;
  body?: string;
  ingredients?: {
    id: number;
    description: string;
    recipeId: string;
  }[];
  userId: string;
};
