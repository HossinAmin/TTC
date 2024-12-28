import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";
import { Image } from "@tauri-apps/api/image";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default defineNuxtPlugin(async () => {
  const tray_id = await invoke<string>("get_tray_id");
  const tray = await TrayIcon.getById(tray_id);
  const menu = await Menu.new({
    items: [
      {
        id: "open",
        text: "Open",
        action: () => {
          getCurrentWindow().show();
          getCurrentWindow().setFocus();
        },
      },
      {
        id: "quit",
        text: "Quit",
        action: () => {
          getCurrentWindow().destroy();
        },
      },
    ],
  });

  const originalImage = await Image.fromPath("../assets/images/app_logo.png");
  tray?.setMenu(menu);
  tray?.setMenuOnLeftClick(false);
  tray?.setIcon(originalImage);

  /** Changes system tray icon to show that there is notification */
  const setTrayIconNotify = async () => {
    const image = await Image.fromPath("../assets/images/notify_logo.png");
    tray?.setIcon(image);
  };

  /** Changes system tray icon to show that there is notification */
  const setTrayIconPlay = async () => {
    const image = await Image.fromPath("../assets/images/play_logo.png");
    tray?.setIcon(image);
  };

  /** Changes system tray icon back to default */
  const resetTrayIcon = async () => {
    tray?.setIcon(originalImage);
  };

  return {
    provide: {
      setTrayIconPlay,
      setTrayIconNotify,
      resetTrayIcon,
    },
  };
});
