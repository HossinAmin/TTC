import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";
import { Image } from "@tauri-apps/api/image";
import { invoke } from "@tauri-apps/api/core";
import { getAllWindows } from "@tauri-apps/api/window";

import { resolveResource } from "@tauri-apps/api/path";

const getImgResource = async (path: string) => {
  try {
    const resource = await resolveResource(path);
    return await Image.fromPath(resource);
  } catch (err) {
    throw new Error(`Failed to get resource with path: '${path}'`);
  }
};

const getWindow = async (label: string) => {
  const allWindows = await getAllWindows();
  const window = allWindows.find((window) => window.label === label);
  if (!window) throw new Error(`Couldn't find window with label:"${label}"`);
  return window;
};

export default defineNuxtPlugin(async () => {
  const appLogo = await getImgResource("assets/images/app_logo.png");
  const mainWindow = await getWindow("main");
  const allWindows = await getAllWindows();

  const tray_id = await invoke<string>("get_tray_id");
  const tray = await TrayIcon.getById(tray_id);
  const menu = await Menu.new({
    items: [
      {
        id: "open",
        text: "Open",
        action: () => {
          mainWindow?.show();
          mainWindow?.setFocus();
        },
      },
      {
        id: "quit",
        text: "Quit",
        action: () => {
          allWindows.map((window) => window.destroy());
        },
      },
    ],
  });

  tray?.setMenu(menu);
  tray?.setIcon(appLogo);

  /** Changes system tray icon to show that there is notification */
  const setTrayIconNotify = async () => {
    const img = await getImgResource("assets/images/notify_logo.png");
    tray?.setIcon(img);
  };

  /** Changes system tray icon to show that there is notification */
  const setTrayIconPlay = async () => {
    const img = await getImgResource("assets/images/play_logo.png");
    tray?.setIcon(img);
  };

  /** Changes system tray icon back to default */
  const resetTrayIcon = async () => {
    tray?.setIcon(appLogo);
  };

  return {
    provide: {
      setTrayIconPlay,
      setTrayIconNotify,
      resetTrayIcon,
    },
  };
});
