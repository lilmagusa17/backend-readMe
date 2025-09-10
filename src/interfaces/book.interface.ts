export interface BookInput {
    title: string,
    authors: string[],
    publisher: string,
    publishedDate: Date,
    categories: string[]
}

export interface BookInputUpdate{
    authors: string[],
    publisher: string,
    publishedDate: Date,
    categories: string[]
}