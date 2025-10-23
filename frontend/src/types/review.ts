export interface Review {
  documentId: string;
  rating: number;
  comment?: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
}
