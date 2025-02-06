export type TimeObj = {
  h: number;
  m: number;
  s: number;
};

export type FloatingTimerPayload = {
  taskId: string;
  isPlaying: boolean;
};
