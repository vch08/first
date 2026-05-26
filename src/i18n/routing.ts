import { defineRouting } from "next-intl/routing";
import { LOCALE_CODES } from "@/types/locale";

export type Locale = (typeof routing.locales)[number];

export const routing = defineRouting({
  locales: LOCALE_CODES,
  defaultLocale: "cs",
});
