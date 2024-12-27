import bellSrc from "~/assets/audio/bell.mp3";
import { v7 } from "uuid";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  sound?: boolean;
  timeout?: number;
};

export default function useToast() {
  const toasts = useState<Toast[]>("toasts", () => []);

  const addToast = (
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
    toasts.value = [
      ...toasts.value,
      {
        id,
        title,
        description,
        sound,
        timeout,
      },
    ];

    if (timeout) {
      setTimeout(() => {
        removeToast(id);
      }, timeout);
    }
  };

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((toast) => {
      return toast.id !== id;
    });
  };

  return { toasts, addToast, removeToast };
}
