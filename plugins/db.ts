import Database from "@tauri-apps/plugin-sql";
import { resolve } from "@tauri-apps/api/path";

export default defineNuxtPlugin(async () => {
  const dbPath = await resolve("../../DBs/TTC", "my_db.db");
  const db = await Database.load(`sqlite:${dbPath}`);
  return { provide: { db } };
});
