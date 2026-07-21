import ru from './dictionaries/ru';
import kk from './dictionaries/kk';
import { Locale, defaultLocale } from './config';

export type Dictionary = typeof ru;

const dictionaries: Record<Locale, Dictionary> = { ru, kk };

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale as Locale] ?? dictionaries[defaultLocale];
}
