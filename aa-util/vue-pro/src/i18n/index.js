
import { createI18n } from 'vue-i18n'
import LangEn from './en';
import LangZh from './zh'

const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: 'zh', // Set default language
    fallbackLocale: 'zh', // Set fallback language
    messages: {
        'zh': LangZh,
        'en': LangEn,
        
    }
})

// Global access to translation function
window.$t = i18n.global.t;

export default i18n
