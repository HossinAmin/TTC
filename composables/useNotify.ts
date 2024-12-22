import bellSrc from "~/assets/audio/bell.mp3";

/**
 * show notification
 * stack notifications
 * play sound
 * display toast until timeout or user interaction
 */
export default function useNotify() {
  const audio = new Audio(bellSrc);
  audio.play();
  return;
}
