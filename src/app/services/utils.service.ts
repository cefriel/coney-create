import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

    languages = [{ lang: "Afrikaans", tag: "af" }, { lang: "Albanian ", tag: "sp" }, { lang: "Arabic", tag: "ar" }, { lang: "Basque", tag: "eu" },
        { lang: "Byelorussian ", tag: "be" }, { lang: "български език", tag: "bg" }, { lang: "Català", tag: "va" }, { lang: "Hrvatski", tag: "hr" }, { lang: "Čeština", tag: "cs" },
        { lang: "Dansk", tag: "da" }, { lang: "Nederlands", tag: "nl" }, { lang: "English", tag: "en" }, { lang: "Esperanto", tag: "eo" }, { lang: "Eesti", tag: "et" },
        { lang: "Suomi", tag: "fi" }, { lang: "Faronese", tag: "fo" }, { lang: "Français", tag: "fr" },
        { lang: "Galego", tag: "gl" }, { lang: "Deutsch", tag: "de" }, { lang: "Ελληνικά", tag: "el" }, { lang: "עברית", tag: "he" }, { lang: "Magyar", tag: "hu" },
        { lang: "Icelandic", tag: "is" }, { lang: "Italiano", tag: "it" }, { lang: "Irish", tag: "ga" }, { lang: "Japanese", tag: "ja" }, { lang: "Korean", tag: "ko" },
        { lang: "Latviešu", tag: "lv" }, { lang: "Mакедонски", tag: "mk" }, { lang: "Malti", tag: "mt" }, { lang: "Norsk", tag: "nb" },
        { lang: "Polski", tag: "pl" }, { lang: "Português", tag: "pt" }, { lang: "Română", tag: "ro" },
        { lang: "Русский", tag: "ru" }, { lang: "Scottish", tag: "gd" }, { lang: "Slovenčina", tag: "sk" }, { lang: "Slovenščina", tag: "sl" },
        { lang: "Српски", tag: "sr" }, { lang: "Español", tag: "es" }, { lang: "Svenska", tag: "sv" }, { lang: "Türkçe", tag: "tr" }, { lang: "Українська", tag: "uk" }];

    getLanguageFromTag(tag: string) {
        
    
        var index = this.languages.findIndex(x => x.tag == tag);
        return this.languages[index];
      }

      getLanguageArray(){
          return this.languages;
      }
}