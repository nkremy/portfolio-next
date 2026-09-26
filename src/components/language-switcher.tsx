"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";

const labels: Record<string, string> = {
  fr: "FR",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const switchTo = (nextLocale: string) => {
    router.replace(
      // @ts-expect-error -- params shape depends on the current route
      { pathname, params },
      { locale: nextLocale }
    );
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-gray-300 dark:border-gray-600 p-0.5 text-xs font-medium">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          aria-label={`Switch to ${labels[loc]}`}
          className={`px-2 py-1 rounded-full transition-colors duration-200 ${
            locale === loc
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-900/10 dark:hover:bg-white/10"
          }`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
