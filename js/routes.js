/**
 * Routes Service - Manages TSW5 route data
 */

const DEFAULT_ROUTES = {
    germany: [
        "Schnellfahrstrecke Kassel - Würzburg",
        "Bahnstrecke Bremen - Oldenburg",
        "Pfälzische Ludwigsbahn",
        "Kinzigtalbahn",
        "Niddertalbahn",
        "Bahnstrecke Salzburg - Rosenheim",
        "Ruhr-Sieg Nord",
        "Rhein-Ruhr Osten",
        "Hauptstrecke Hamburg - Lübeck",
        "Hauptstrecke München - Augsburg",
        "Schnellfahrstrecke Köln-Aachen",
        "Hauptstrecke Riesa - Dresden",
        "Hauptstrecke Rhein-Ruhr",
        "Nahverkehr Dresden",
        "S-Bahn Zentralschweiz",
        "Semmeringbahn",
        "Bahnstrecke S-Bahn Vorarlberg",
        "Linke Rheinstrecke",
        "Pfälzische Maximiliansbahn",
        "Maintalbahn",
        "Thüringerwaldbahn",
        "Schnellfahrstrecke Karlsruhe - Basel",
        "Bahnstrecke Kiel - Lübeck",
        "Bahnstrecke Würzburg - Stuttgart"
    ],
    uk: [
        "West Coast Main Line South",
        "Midland Main Line",
        "East Coast Main Line",
        "Great Western Express",
        "Southeastern High Speed",
        "West Cornwall Local",
        "Glossop Line",
        "Birmingham Cross-City Line",
        "Island Line",
        "Cathcart Circle Line",
        "West Coast Main Line North",
        "Blackpool Branches",
        "East Midlands Railway",
        "London Overground Suffragette Line",
        "West Coast Main Line Over Shap",
        "Spirit of Steam",
        "Glasgow Cathcart Circle",
        "Bakerloo Line",
        "London Commuter",
        "Scotland Express",
        "Peninsula Corridor",
        "Clinchfield Railroad",
        "Cajon Pass",
        "NEC: New York - Trenton"
    ],
    usa: [
        "NEC: Boston - Providence",
        "Long Island Rail Road",
        "Cane Creek",
        "Sherman Hill",
        "Clinchfield Railroad",
        "Cajon Pass",
        "San Bernardino Line",
        "Peninsula Corridor"
    ],
    other: [
        "Linha do Norte",
        "S-Bahn Vorarlberg",
        "S-Bahn Zentralschweiz",
        "Semmeringbahn"
    ]
};

// Combined list of all routes
const ALL_ROUTES = [
    ...DEFAULT_ROUTES.germany,
    ...DEFAULT_ROUTES.uk,
    ...DEFAULT_ROUTES.usa,
    ...DEFAULT_ROUTES.other
];

class RoutesService {
    constructor() {
        this.routes = this.loadRoutes();
    }

    loadRoutes() {
        const saved = localStorage.getItem('tsw5_routes');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved routes:', e);
            }
        }
        return [...ALL_ROUTES];
    }

    saveRoutes() {
        localStorage.setItem('tsw5_routes', JSON.stringify(this.routes));
    }

    getAllRoutes() {
        return [...this.routes];
    }

    getRoutesByCategory(category) {
        if (category === 'all') return this.getAllRoutes();
        if (DEFAULT_ROUTES[category]) {
            return DEFAULT_ROUTES[category].filter(route => this.routes.includes(route));
        }
        return [];
    }

    addRoute(routeName) {
        if (!this.routes.includes(routeName)) {
            this.routes.push(routeName);
            this.saveRoutes();
            return true;
        }
        return false;
    }

    removeRoute(routeName) {
        const index = this.routes.indexOf(routeName);
        if (index > -1) {
            this.routes.splice(index, 1);
            this.saveRoutes();
            return true;
        }
        return false;
    }

    resetToDefault() {
        this.routes = [...ALL_ROUTES];
        this.saveRoutes();
    }

    clearAll() {
        this.routes = [];
        this.saveRoutes();
    }

    getRandomRoute() {
        if (this.routes.length === 0) return "N/A";
        return this.routes[Math.floor(Math.random() * this.routes.length)];
    }

    getCategories() {
        return {
            germany: "Deutschland",
            uk: "Großbritannien",
            usa: "USA",
            other: "Sonstige"
        };
    }

    getRouteCount() {
        return this.routes.length;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RoutesService, DEFAULT_ROUTES, ALL_ROUTES };
}