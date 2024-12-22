import { TrayIcon, type TrayIconOptions } from "@tauri-apps/api/tray";
import { defaultWindowIcon } from "@tauri-apps/api/app";
import { Menu } from "@tauri-apps/api/menu";

export default defineNuxtPlugin(async () => {
  // const menu = await Menu.new([]);
  // const icon = await defaultWindowIcon();
  // const options = {
  //   menu,
  //   icon,
  //   menuOnLeftClick: true,
  // };
  // const tray = await TrayIcon.new(options);
});
