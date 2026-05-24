export interface Snippet {
  id: number;
  category: string;
  title: string;
  body: string;
  usageCount?: number;
}

export interface Category {
  name: string;
  emoji: string;
}
