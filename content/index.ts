import type { Dictionary, Lang } from "./types";
import sr from "./sr";
import de from "./de";
import en from "./en";

export const dict: Record<Lang, Dictionary> = { sr, de, en };
export const langs: Lang[] = ["sr", "de", "en"];
export const defaultLang: Lang = "sr";
export type { Dictionary, Lang };
