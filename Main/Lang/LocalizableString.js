import LocalizedStringsAdapter from '../../plugin_common/Adapter/LocalizedStringsAdapter';

import IntlMessageFormat from 'intl-messageformat';
import 'intl';
import 'intl/locale-data/jsonp/en.js';
import 'intl/locale-data/jsonp/zh-Hans.js';
import 'intl/locale-data/jsonp/zh-Hant.js';
import 'intl/locale-data/jsonp/ko-KR.js';

import zh from './zh';
import en from './en';

export const strings = {
    "en": en,
    "zh": zh,
};
export const localizedStrings = new LocalizedStringsAdapter(strings);

export function getString(key, obj = null) {
    if (obj) {
        return new IntlMessageFormat(localizedStrings[key], localizedStrings.language).format(obj);
    } else {
        return localizedStrings[key];
    }
}
