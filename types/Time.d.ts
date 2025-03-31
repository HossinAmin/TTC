export type TimeObj = {
  h: number;
  m: number;
  s: number;
};

export type FloatingTimerPayload = {
  taskId: string;
  seconds: number;
  isPlaying: boolean;
};
