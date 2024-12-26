import type { TimeObj } from "~/types/Time";

export default function useTimer(initValue?: number) {
  const seconds = ref(initValue ?? 0);
  const play = ref(false);

  let timerId: NodeJS.Timeout;

  const time = computed((): TimeObj => {
    const h = Math.floor(seconds.value / 3600);
    const m = Math.floor(seconds.value / 60) - h * 60;
    const s = Math.floor(seconds.value - h * 3600 - m * 60);

    return { h, m, s };
  });

  const pad = (num: number) => {
    if (num < 10) {
      return `0${num}`;
    } else {
      return `${num}`;
    }
  };

  watch(play, () => {
    if (play.value) {
      timerId = setInterval(() => {
        seconds.value += 1;
      }, 1000);
    } else if (!play.value && timerId) {
      clearInterval(timerId);
    }
  });

  onUnmounted(() => {
    clearInterval(timerId);
  });

  return {
    seconds,
    play,
    time,
    pad,
  };
}
