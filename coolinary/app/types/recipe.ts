export type Recipe = {
  id: string;
  title: string;
  body: string;
  ingredients?: {
    id: number;
    description: string;
  }[];
  userId: string;
};
