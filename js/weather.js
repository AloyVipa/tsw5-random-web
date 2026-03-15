/**
 * Weather Service - Handles weather generation based on seasonal probabilities
 */

const WEATHER_SYMBOLS = {
    "Klar": "☀️",
    "Neblig": "🌫️",
    "Leicht Bewölkt": "⛅",
    "Stark Bewölkt": "☁️",
    "Gewittersturm": "⛈️",
    "Leichter Schneefall": "🌨️",
    "Schneesturm": "❄️"
};

const MONTH_NAMES = {
    1: "Januar",
    2: "Februar",
    3: "März",
    4: "April",
    5: "Mai",
    6: "Juni",
    7: "Juli",
    8: "August",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Dezember"
};

class WeatherService {
    constructor() {
        this.weatherConfig = null;
        this.loaded = false;
    }

    async loadConfig() {
        try {
            const response = await fetch('js/weather-config.json');
            this.weatherConfig = await response.json();
            this.loaded = true;
            return true;
        } catch (error) {
            console.error('Failed to load weather config:', error);
            // Fallback config
            this.weatherConfig = this.getFallbackConfig();
            this.loaded = true;
            return true;
        }
    }

    getFallbackConfig() {
        return {
            "1": [["Klar", 25], ["Neblig", 15], ["Leicht Bewölkt", 20], ["Stark Bewölkt", 25], ["Gewittersturm", 5], ["Leichter Schneefall", 8], ["Schneesturm", 2]],
            "2": [["Klar", 28], ["Neblig", 12], ["Leicht Bewölkt", 22], ["Stark Bewölkt", 25], ["Gewittersturm", 3], ["Leichter Schneefall", 8], ["Schneesturm", 2]],
            "3": [["Klar", 30], ["Neblig", 10], ["Leicht Bewölkt", 25], ["Stark Bewölkt", 25], ["Gewittersturm", 5], ["Leichter Schneefall", 4], ["Schneesturm", 1]],
            "4": [["Klar", 35], ["Neblig", 8], ["Leicht Bewölkt", 28], ["Stark Bewölkt", 22], ["Gewittersturm", 5], ["Leichter Schneefall", 2], ["Schneesturm", 0]],
            "5": [["Klar", 40], ["Neblig", 5], ["Leicht Bewölkt", 30], ["Stark Bewölkt", 20], ["Gewittersturm", 5], ["Leichter Schneefall", 0], ["Schneesturm", 0]],
            "6": [["Klar", 45], ["Neblig", 3], ["Leicht Bewölkt", 30], ["Stark Bewölkt", 15], ["Gewittersturm", 7], ["Leichter Schneefall", 0], ["Schneesturm", 0]],
            "7": [["Klar", 50], ["Neblig", 2], ["Leicht Bewölkt", 28], ["Stark Bewölkt", 12], ["Gewittersturm", 8], ["Leichter Schneefall", 0], ["Schneesturm", 0]],
            "8": [["Klar", 48], ["Neblig", 3], ["Leicht Bewölkt", 28], ["Stark Bewölkt", 13], ["Gewittersturm", 8], ["Leichter Schneefall", 0], ["Schneesturm", 0]],
            "9": [["Klar", 40], ["Neblig", 5], ["Leicht Bewölkt", 28], ["Stark Bewölkt", 20], ["Gewittersturm", 5], ["Leichter Schneefall", 2], ["Schneesturm", 0]],
            "10": [["Klar", 32], ["Neblig", 10], ["Leicht Bewölkt", 25], ["Stark Bewölkt", 25], ["Gewittersturm", 3], ["Leichter Schneefall", 4], ["Schneesturm", 1]],
            "11": [["Klar", 25], ["Neblig", 15], ["Leicht Bewölkt", 20], ["Stark Bewölkt", 25], ["Gewittersturm", 2], ["Leichter Schneefall", 10], ["Schneesturm", 3]],
            "12": [["Klar", 20], ["Neblig", 15], ["Leicht Bewölkt", 18], ["Stark Bewölkt", 25], ["Gewittersturm", 2], ["Leichter Schneefall", 15], ["Schneesturm", 5]]
        };
    }

    /**
     * Generate weather for a specific date
     * @param {Date} date - JavaScript Date object
     * @returns {Object} - { name, emoji, monthName }
     */
    generateWeather(date) {
        if (!this.loaded || !this.weatherConfig) {
            return { name: "N/A", emoji: "❓", monthName: "Unbekannt" };
        }

        const month = date.getMonth() + 1; // JavaScript months are 0-based
        const monthStr = month.toString();
        const conditions = this.weatherConfig[monthStr];

        if (!conditions || conditions.length === 0) {
            return { name: "N/A", emoji: "❓", monthName: MONTH_NAMES[month] || "Unbekannt" };
        }

        // Filter out conditions with weight 0
        const validConditions = conditions.filter(c => c[1] > 0);
        if (validConditions.length === 0) {
            return { name: "N/A", emoji: "❓", monthName: MONTH_NAMES[month] || "Unbekannt" };
        }

        // Weighted random selection
        const totalWeight = validConditions.reduce((sum, c) => sum + c[1], 0);
        let random = Math.random() * totalWeight;

        for (const condition of validConditions) {
            random -= condition[1];
            if (random <= 0) {
                return {
                    name: condition[0],
                    emoji: WEATHER_SYMBOLS[condition[0]] || "❓",
                    monthName: MONTH_NAMES[month] || "Unbekannt"
                };
            }
        }

        // Fallback to last condition
        const lastCondition = validConditions[validConditions.length - 1];
        return {
            name: lastCondition[0],
            emoji: WEATHER_SYMBOLS[lastCondition[0]] || "❓",
            monthName: MONTH_NAMES[month] || "Unbekannt"
        };
    }

    /**
     * Get weather probabilities for a specific month
     * @param {number} month - Month number (1-12)
     * @returns {Array} - Array of [weatherName, probability] pairs
     */
    getWeatherProbabilities(month) {
        if (!this.weatherConfig) return [];
        return this.weatherConfig[month.toString()] || [];
    }

    /**
     * Get all available weather types
     * @returns {Array} - Array of weather names
     */
    getWeatherTypes() {
        return Object.keys(WEATHER_SYMBOLS);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherService;
}