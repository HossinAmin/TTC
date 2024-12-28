import { invoke } from "@tauri-apps/api/core";
/**
 * start tracking
 * stop tracking
 * include key stocks in tracking
 */
export default function useActivityTracker() {
  const isActive = useState("isActive", () => true);

  let intervalId: NodeJS.Timeout | undefined;
  // Your mouse coordinates
  let coords = { x: -1, y: -1 };

  const { addToast } = useToast();
  const { $setTrayIconPlay, $resetTrayIcon } = useNuxtApp();

  const startTracking = async () => {
    coords = await invoke<{ x: number; y: number }>("check_mouse_coords");

    $setTrayIconPlay();
    intervalId = setInterval(
      async () => {
        const newCoords = await invoke<{ x: number; y: number }>(
          "check_mouse_coords",
        );

        if (coords.x === newCoords.x && coords.y === newCoords.y) {
          isActive.value = false;
          addToast(
            "User Inactive",
            "The user have been inactive for 5 minus while task timer is on.",
            true,
          );
        } else {
          isActive.value = true;
          coords = newCoords;
        }
      },
      1000 * 60 * 5,
    ); // 5 minutes
  };

  const stopTracking = () => {
    $resetTrayIcon();
    coords = { x: -1, y: -1 };
    isActive.value = true;
    clearInterval(intervalId);
  };

  // Cleanup on component unmount
  onUnmounted(() => stopTracking());

  return {
    isActive,
    startTracking,
    stopTracking,
  };
}
