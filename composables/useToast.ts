import bellSrc from "~/assets/audio/bell.mp3";
import { v7 } from "uuid";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  sound?: boolean;
  timeout?: number;
  hide?: boolean;
};

export default function useToast() {
  const toasts = useState<Toast[]>("toasts", () => []);

  const add = (
    title?: string,
    description?: string,
    sound?: boolean,
    timeout?: number,
  ) => {
    if (sound) {
      const audio = new Audio(bellSrc);
      audio.play();
    }

    const id = v7();
    toasts.value.push({
      id,
      title,
      description,
      sound,
      timeout,
    });

    if (timeout) {
      setTimeout(() => {
        toasts.value = toasts.value.filter((toast) => {
          return toast.id !== id;
        });
      }, timeout);
    }
  };
  return { toasts, add };
}
