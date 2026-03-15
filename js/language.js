/**
 * Language Service - Multi-language support
 */

const translations = {
    en: {
        title: "🚂 TSW5 Random Weather Scenario",
        subtitle: "Generate random scenarios for Train Sim World 5",
        newScenario: "🎲 New Scenario",
        copy: "📋 Copy",
        date: "📅 Date:",
        weather: "Weather:",
        route: "Route:",
        mission: "Mission:",
        time: "Time:",
        manageRoutes: "🛤️ Manage Routes",
        routesAvailable: "route(s) available",
        copied: "✅ Copied!",
        copyError: "❌ Error copying",
        routeManagement: "🛤️ Route Management",
        addRoute: "Add",
        addRoutePlaceholder: "Add new route...",
        resetRoutes: "🔄 Reset to Default",
        clearRoutes: "🗑️ Clear All",
        noRoutes: "No routes available",
        routeAdded: "✅ Route added",
        routeExists: "❌ Route already exists",
        routeRemoved: "✅ Route removed",
        routesReset: "✅ Routes reset",
        routesCleared: "✅ All routes cleared",
        confirmReset: "Reset all routes to default?",
        confirmClear: "Really delete ALL routes?",
        enterName: "❌ Please enter a name",
        filterAll: "All Regions",
        filterGermany: "🇩🇪 Germany",
        filterUK: "🇬🇧 United Kingdom",
        filterUSA: "🇺🇸 USA",
        footerGithub: "GitHub: AloyVipa/tsw5-random-web",
        version: "Version 1.0.0 • Made with ❤️ for TSW5 fans"
    },
    de: {
        title: "🚂 TSW5 Random Weather Scenario",
        subtitle: "Generiere zufällige Szenarien für Train Sim World 5",
        newScenario: "🎲 Neues Szenario",
        copy: "📋 Kopieren",
        date: "📅 Datum:",
        weather: "Wetter:",
        route: "Strecke:",
        mission: "Aufgabe:",
        time: "Zeit:",
        manageRoutes: "🛤️ Routen verwalten",
        routesAvailable: "Route(n) verfügbar",
        copied: "✅ Kopiert!",
        copyError: "❌ Fehler beim Kopieren",
        routeManagement: "🛤️ Routen verwalten",
        addRoute: "Hinzufügen",
        addRoutePlaceholder: "Neue Route hinzufügen...",
        resetRoutes: "🔄 Standard",
        clearRoutes: "🗑️ Alle löschen",
        noRoutes: "Keine Routen vorhanden",
        routeAdded: "✅ Route hinzugefügt",
        routeExists: "❌ Route existiert bereits",
        routeRemoved: "✅ Route entfernt",
        routesReset: "✅ Routen zurückgesetzt",
        routesCleared: "✅ Alle Routen gelöscht",
        confirmReset: "Alle Routen auf Standard zurücksetzen?",
        confirmClear: "Wirklich ALLE Routen löschen?",
        enterName: "❌ Bitte Name eingeben",
        filterAll: "Alle Regionen",
        filterGermany: "🇩🇪 Deutschland",
        filterUK: "🇬🇧 Großbritannien",
        filterUSA: "🇺🇸 USA",
        footerGithub: "GitHub: AloyVipa/tsw5-random-web",
        version: "Version 1.0.0 • Made with ❤️ for TSW5 fans"
    }
};

class LanguageService {
    constructor() {
        this.currentLang = this.detectLanguage();
    }

    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        return translations[langCode] ? langCode : 'en';
    }

    get(key) {
        return translations[this.currentLang][key] || translations['en'][key] || key;
    }

    getCurrentLang() {
        return this.currentLang;
    }
}

// Create global instance
const langService = new LanguageService();
