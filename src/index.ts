import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        percentage_paid: 'Percentage Paid',
        delete_band: 'Delete Band'
      },
      // Add other languages here
    },
    lng: 'en', // Set the default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export { default as BandedPaymentSlider } from './BandedPaymentSlider';