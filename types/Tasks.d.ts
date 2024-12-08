export type Task = {
  id: string;
  created_at: string;
  name: string;
  description?: string | null;
  link?: string | null;
  time: number;
  project: string;
};
