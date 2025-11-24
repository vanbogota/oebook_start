
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import enMessages from '../../messages/en.json';
import fiMessages from '../../messages/fi.json';

const messages = {
  en: enMessages,
  fi: fiMessages,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale] || messages.en
  };
});
