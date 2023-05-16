export function getLanguages() {
  return ["English", "Espanol", "Dutch"];
}

export const getTranslation = (key: string, language: string) => {
  const langId = getLanguages().indexOf(language);
  const translations = {
    SHOW_INGREDIENTS: {
      0: "Show Ingredients",
      1: "Mostrar Ingredientes",
      2: "Ingrediënten laten zien",
    },
    COLLAPSE_INGREDIENTS: {
      0: "Collapse Ingredients",
      1: "Ocultar Ingredientes",
      2: "Ingrediënten verbergen",
    },
    SHOPPING_LISTS: {
      0: "Your grocery lists",
      1: "Tus listas de compras",
      2: "Uw boodschappenlijstjes",
    },
    SETTINGS: {
      0: "Settings",
      1: "Configuraciones",
      2: "Instellingen",
    },
    CLOSE: {
      0: "Close",
      1: "Cerrar",
      2: "Sluiten",
    },
  };

  return translations[key][langId];
};
