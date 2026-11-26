import { cache } from "react";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { isOpenLocalMode, isSupabaseConfigured } from "@/lib/supabase/config";
import { createAdminClient } from "@/lib/supabase/server";
import type { WeddingSettings } from "@/types/wedding";

const directory = path.join(process.cwd(), "data");
const settingsFile = path.join(directory, "wedding-settings.json");

export async function readLocalWeddingSettings(): Promise<WeddingSettings | null> {
  try {
    return JSON.parse(await readFile(settingsFile, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function saveLocalWeddingSettings(settings: WeddingSettings) {
  await mkdir(directory, { recursive: true });
  const temporaryFile = `${settingsFile}.${randomUUID()}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(settings, null, 2));
  await rename(temporaryFile, settingsFile);
}

export const getWeddingSettings = cache(async (): Promise<WeddingSettings | null> => {
  if (isOpenLocalMode()) return readLocalWeddingSettings();
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await createAdminClient()
    .from("wedding_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .order("id")
    .limit(1)
    .maybeSingle<WeddingSettings>();

  if (error) throw new Error(`Could not load wedding settings: ${error.message}`);
  if (!data) throw new Error("Wedding settings are missing from the database.");
  return data;
});
