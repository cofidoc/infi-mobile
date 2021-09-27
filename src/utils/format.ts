import { format } from "date-fns";
import { fr } from "date-fns/locale";

const locales = { fr };

// by providing a default string of 'PP' or any of its variants for `formatStr`
// it will format dates in whichever way is appropriate to the locale
export default function formatT(date: number | Date, formatStr = "PP") {
  return format(date, formatStr, {
    locale: locales.fr, // TODO: use global react i18next language here
  });
}
