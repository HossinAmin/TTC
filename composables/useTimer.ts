export default function useTimer(initValue?: number) {
  const seconds = ref(initValue ?? 0);
  const play = ref(false);

  let timerId: NodeJS.Timeout;

  const time = computed(() => sec2TimeObj(seconds.value));

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
  };
}
