// i18n.ts
// Configuración de internacionalización (i18n) para ProgressiveBar
// ---------------------------------------------------------------
// - Usa i18next y react-i18next para traducción dinámica de la UI
// - Define recursos de idioma (en/es) con textos claros y contextualizados
// - Permite cambio de idioma en tiempo real desde la UI
// - Todos los textos clave de la app están centralizados aquí para fácil mantenimiento

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Diccionario de recursos de traducción
const resources = {
  en: {
    translation: {
      title: 'Goal Progress Tracker', // Título principal
      goal: 'Goal', // Etiqueta de meta
      changeType: 'Type', // Etiqueta de tipo
      type_currency: 'Currency', // Opción de tipo: dinero
      type_elements: 'Elements', // Opción de tipo: elementos
      language: 'Language', // Etiqueta de idioma
      addProcess: 'Add Progress', // Botón para agregar progreso
      setCurrent: 'Add', // Placeholder/input para agregar
      resetProgress: 'Reset Progress', // Botón de reset
      confirmReset: 'Are you sure you want to reset progress?', // Diálogo de confirmación
      yes: 'Yes', // Botón sí
      no: 'No', // Botón no
      openMenu: 'Open menu', // Accesibilidad menú
      closeMenu: 'Close menu', // Accesibilidad menú
    }
  },
  es: {
    translation: {
      title: 'Seguimiento de Meta',
      goal: 'Meta',
      changeType: 'Tipo',
      type_currency: 'Dinero',
      type_elements: 'Elementos',
      language: 'Idioma',
      addProcess: 'Agregar Progreso',
      setCurrent: 'Agregar',
      resetProgress: 'Reiniciar Progreso',
      confirmReset: '¿Seguro que deseas reiniciar el progreso?',
      yes: 'Sí',
      no: 'No',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
    }
  }
};

// Inicialización de i18next con recursos y configuración base
// - lng: idioma inicial (español)
// - fallbackLng: idioma de respaldo (inglés)
// - escapeValue: false para React

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
