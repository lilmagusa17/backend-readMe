export interface ReviewInput {
  bookId: string; // id del libro (ObjectId string)
  userId: string; // id del usuario que escribe la reseña (string por ahora)
  rating: number; // 1..5
  title?: string;
  content?: string;
}
