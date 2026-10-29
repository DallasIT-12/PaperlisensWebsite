import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !['en', 'id', 'zh'].includes(locale)) {
    locale = 'id';
  }
 
  let messages = {};
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}`, error);
  }

  return {
    locale,
    messages
  };
});