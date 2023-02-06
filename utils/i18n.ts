import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import translation from '@dao-dao/i18n/locales/en/translation.json'

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation,
    },
  },
  lng: 'en',
})
