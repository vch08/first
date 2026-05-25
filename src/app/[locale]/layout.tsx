import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { Providers } from "@/components/infrastructure/Providers";
import { PageLayout } from "@/components/layout/PageLayout";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({ children, params }: Props) {
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
