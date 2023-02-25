export type Recipe = {
    id: string,
    title: string,
    body:string,
    ingredients: {
        id: string,
        description: string
    }[],
    userId: string 
}