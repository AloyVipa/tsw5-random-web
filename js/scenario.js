/**
 * Scenario Service - Generates complete TSW5 scenarios
 */

const MISSION_TYPES = ["Personenverkehr", "Güterverkehr"];

const MISSION_SYMBOLS = {
    "Personenverkehr": "🧑‍🤝‍🧑",
    "Güterverkehr": "📦"
};

const TIME_PERIODS = [
    { name: "Früh (05:00 - 09:00)", weight: 20 },
    { name: "Vormittag (09:00 - 12:00)", weight: 15 },
    { name: "Mittag (12:00 - 14:00)", weight: 10 },
    { name: "Nachmittag (14:00 - 17:00)", weight: 20 },
    { name: "Abend (17:00 - 20:00)", weight: 20 },
    { name: "Nacht (20:00 - 05:00)", weight: 15 }
];

class ScenarioService {
    constructor(weatherService, routesService) {
        this.weatherService = weatherService;
        this.routesService = routesService;
    }

    /**
     * Generate a complete scenario
     * @param {Date} date - Optional date (defaults to today)
     * @returns {Object} - Complete scenario object
     */
    generateScenario(date = new Date()) {
        const weather = this.weatherService.generateWeather(date);
        const route = this.routesService.getRandomRoute();
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

    getRandomMissionType() {
        return MISSION_TYPES[Math.floor(Math.random() * MISSION_TYPES.length)];
    }

    getRandomTimeOfDay() {
        const totalWeight = TIME_PERIODS.reduce((sum, t) => sum + t.weight, 0);
        let random = Math.random() * totalWeight;

        for (const period of TIME_PERIODS) {
            random -= period.weight;
            if (random <= 0) {
                return period.name;
            }
        }

        return TIME_PERIODS[TIME_PERIODS.length - 1].name;
    }

    formatDate(date) {
        return date.toLocaleDateString('de-DE', {
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
        return `🎲 TSW5 Szenario
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