export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}
