import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";
import { readFile } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/api/path";
import { Image } from "@tauri-apps/api/image";
import { invoke } from "@tauri-apps/api/core";

export default defineNuxtPlugin(async () => {
  const tray_id = await invoke<string>("get_tray_id");
  const tray = await TrayIcon.getById(tray_id);
  const menu = await Menu.new({
    items: [
      {
        id: "quit",
        text: "Quit",
      },
    ],
  });

  const originalImage = await Image.fromPath("../assets/images/app_logo.png");
  tray?.setMenu(menu);
  tray?.setIcon(originalImage);

  /** Changes system tray icon to show that there is notification */
  const setTrayIconNoti = async () => {
    const image = await Image.fromPath("../assets/images/noti_icon.png");
    tray?.setIcon(image);
  };

  /** Changes system tray icon back to default */
  const resetTrayIcon = async () => {
    tray?.setIcon(originalImage);
  };
  return {
    provide: {
      setTrayIconNoti,
      resetTrayIcon,
    },
  };
});
