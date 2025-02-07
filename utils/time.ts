import type { TimeObj } from "~/types/Time";

export const sec2TimeObj = (seconds: number): TimeObj => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds / 60) - h * 60;
  const s = Math.floor(seconds - h * 3600 - m * 60);

  return { h, m, s };
};

export const pad = (num: number) => {
  if (num < 10) {
    return `0${num}`;
  } else {
    return `${num}`;
  }
};
