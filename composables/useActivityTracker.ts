import { invoke } from "@tauri-apps/api/core";
/**
 * start tracking
 * stop tracking
 * include key stocks in tracking
 */
export default function useActivityTracker() {
  // Your mouse inactivity check
  let coords = { x: -1, y: -1 };

  const id = setInterval(async () => {
    const newCoords = await invoke<{ x: number; y: number }>(
      "check_mouse_coords",
    );

    if (coords.x === newCoords.x && coords.y === newCoords.y) {
      console.log("inactive user");
    } else {
      coords = newCoords;
    }
  }, 1000); // 5 minutes

  // Cleanup on component unmount
  onUnmounted(() => clearInterval(id));
}
