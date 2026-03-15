/**
 * Scenario Service - Generates complete TSW5 scenarios
 */

const MISSION_TYPES = {
    en: ["Passenger Service", "Freight Service"],
    de: ["Personenverkehr", "Güterverkehr"]
};

const MISSION_SYMBOLS = {
    "Passenger Service": "🧑‍🤝‍🧑",
    "Freight Service": "📦",
    "Personenverkehr": "🧑‍🤝‍🧑",
    "Güterverkehr": "📦"
};

const TIME_PERIODS = {
    en: [
        { name: "Early Morning (05:00 - 09:00)", weight: 20 },
        { name: "Morning (09:00 - 12:00)", weight: 15 },
        { name: "Midday (12:00 - 14:00)", weight: 10 },
        { name: "Afternoon (14:00 - 17:00)", weight: 20 },
        { name: "Evening (17:00 - 20:00)", weight: 20 },
        { name: "Night (20:00 - 05:00)", weight: 15 }
    ],
    de: [
        { name: "Früh (05:00 - 09:00)", weight: 20 },
        { name: "Vormittag (09:00 - 12:00)", weight: 15 },
        { name: "Mittag (12:00 - 14:00)", weight: 10 },
        { name: "Nachmittag (14:00 - 17:00)", weight: 20 },
        { name: "Abend (17:00 - 20:00)", weight: 20 },
        { name: "Nacht (20:00 - 05:00)", weight: 15 }
    ]
};

class ScenarioService {
    constructor(weatherService, routesService) {
        this.weatherService = weatherService;
        this.routesService = routesService;
        this.lang = langService ? langService.getCurrentLang() : 'en';
    }

    /**
     * Generate a complete scenario
     * @param {Date} date - Optional date (defaults to today)
     * @param {string} region - Region filter ('all', 'germany', 'uk', 'usa')
     * @returns {Object} - Complete scenario object
     */
    generateScenario(date = new Date(), region = 'all') {
        const weather = this.weatherService.generateWeather(date);
        const route = this.getRandomRoute(region);
        const missionType = this.getRandomMissionType();
        const timeOfDay = this.getRandomTimeOfDay();

        return {
            date: date,
            formattedDate: this.formatDate(date),
            weather: weather,
            route: route,
            missionType: missionType,
            missionEmoji: MISSION_SYMBOLS[missionType],
            timeOfDay: timeOfDay
        };
    }

    getRandomRoute(region) {
        const routes = this.routesService.getRoutesByCategory(region);
        if (routes.length === 0) return "N/A";
        return routes[Math.floor(Math.random() * routes.length)];
    }

    getRandomMissionType() {
        const types = MISSION_TYPES[this.lang] || MISSION_TYPES['en'];
        return types[Math.floor(Math.random() * types.length)];
    }

    getRandomTimeOfDay() {
        const periods = TIME_PERIODS[this.lang] || TIME_PERIODS['en'];
        const totalWeight = periods.reduce((sum, t) => sum + t.weight, 0);
        let random = Math.random() * totalWeight;

        for (const period of periods) {
            random -= period.weight;
            if (random <= 0) {
                return period.name;
            }
        }

        return periods[periods.length - 1].name;
    }

    formatDate(date) {
        const locale = this.lang === 'de' ? 'de-DE' : 'en-US';
        return date.toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * Format scenario for clipboard
     * @param {Object} scenario 
     * @returns {String}
     */
    formatForClipboard(scenario) {
        const title = this.lang === 'de' ? '🎲 TSW5 Szenario' : '🎲 TSW5 Scenario';
        return `${title}
-----------------------
📅 ${scenario.formattedDate}
🌦️ ${scenario.weather.name} ${scenario.weather.emoji}
🛤️ ${scenario.route}
🚆 ${scenario.missionType} ${scenario.missionEmoji}
🕐 ${scenario.timeOfDay}
-----------------------`;
    }

    /**
     * Format scenario for display
     * @param {Object} scenario 
     * @returns {String}
     */
    formatForDisplay(scenario) {
        return `${scenario.weather.emoji} ${scenario.missionEmoji}`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScenarioService, MISSION_TYPES, MISSION_SYMBOLS, TIME_PERIODS };
}
