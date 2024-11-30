export type Project = {
  created_at: Date;
  id: string;
  name: string;
  description: string;
  link?: string;
  tasks_count: number;
  time: number;
};
