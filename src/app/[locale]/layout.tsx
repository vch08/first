import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/infrastructure/Providers";
import { PageLayout } from "@/components/layout/PageLayout";
import { routing } from "@/i18n/routing";

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale}>
      <Providers>
        <PageLayout>{children}</PageLayout>
      </Providers>
    </NextIntlClientProvider>
  );
}
