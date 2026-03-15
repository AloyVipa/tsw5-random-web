/**
 * Language Service - Multi-language support
 */

// Weather translations
const WEATHER_TRANSLATIONS = {
    en: {
        "Klar": "Clear",
        "Neblig": "Foggy",
        "Leicht Bewölkt": "Partly Cloudy",
        "Stark Bewölkt": "Overcast",
        "Gewittersturm": "Thunderstorm",
        "Leichter Schneefall": "Light Snow",
        "Schneesturm": "Blizzard"
    },
    de: {
        "Klar": "Klar",
        "Neblig": "Neblig",
        "Leicht Bewölkt": "Leicht Bewölkt",
        "Stark Bewölkt": "Stark Bewölkt",
        "Gewittersturm": "Gewittersturm",
        "Leichter Schneefall": "Leichter Schneefall",
        "Schneesturm": "Schneesturm"
    }
};

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
        filterUK: "🇬🇧 UK",
        filterUSA: "🇺🇸 USA",
        footerGithub: "GitHub: AloyVipa/tsw5-random-web",
        version: "Version 1.0.0 • Made with ❤️ for TSW5 fans",
        myRoutes: "My Routes",
        availableRoutes: "Available Routes",
        searchRoutes: "🔍 Search routes...",
        dateLabel: "Date:",
        weatherLabel: "Weather:",
        routeLabel: "Route:",
        missionLabel: "Mission:",
        timeLabel: "Time:",
        noMatches: "No matches",
        allRoutesAdded: "All routes added",
        germany: "Germany",
        uk: "UK",
        usa: "USA",
        other: "Other"
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
        filterUK: "🇬🇧 UK",
        filterUSA: "🇺🇸 USA",
        footerGithub: "GitHub: AloyVipa/tsw5-random-web",
        version: "Version 1.0.0 • Made with ❤️ for TSW5 fans",
        myRoutes: "Meine Routen",
        availableRoutes: "Verfügbare Routen",
        searchRoutes: "🔍 Routen suchen...",
        dateLabel: "Datum:",
        weatherLabel: "Wetter:",
        routeLabel: "Strecke:",
        missionLabel: "Aufgabe:",
        timeLabel: "Zeit:",
        noMatches: "Keine Treffer",
        allRoutesAdded: "Alle Routen hinzugefügt",
        germany: "Deutschland",
        uk: "UK",
        usa: "USA",
        other: "Sonstige"
    }
};

class LanguageService {
    constructor() {
        this.currentLang = this.detectLanguage();
    }

    detectLanguage() {
        // Check saved preference first
        const savedLang = localStorage.getItem('tsw5_language');
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }
        
        // Detect from browser
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.toLowerCase();
        
        // Map variants (de-AT, de-CH -> de)
        if (langCode.startsWith('de')) return 'de';
        if (langCode.startsWith('en')) return 'en';
        
        return translations[langCode] ? langCode : 'en';
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('tsw5_language', lang);
            return true;
        }
        return false;
    }

    get(key) {
        return translations[this.currentLang][key] || translations['en'][key] || key;
    }

    translateWeather(weatherName) {
        return WEATHER_TRANSLATIONS[this.currentLang][weatherName] || weatherName;
    }

    getCurrentLang() {
        return this.currentLang;
    }
}

// Create global instance
const langService = new LanguageService();
