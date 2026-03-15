/**
 * Main Application Logic
 */

// Initialize services
const weatherService = new WeatherService();
const routesService = new RoutesService();
let scenarioService = null;

// Current state
let currentScenario = null;
let selectedDate = new Date();
let selectedRegion = 'all';
let currentTab = 'germany';

// DOM Elements
let scenarioDisplay = null;
let dateInput = null;
let routesInfo = null;
let copyStatus = null;
let routeModal = null;
let myRoutesList = null;
let availableRoutesList = null;
let regionFilter = null;
let languageSelect = null;
let routeSearch = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});

async function initApp() {
    // Load weather config
    await weatherService.loadConfig();

    // Initialize scenario service
    scenarioService = new ScenarioService(weatherService, routesService);

    // Cache DOM elements
    cacheElements();

    // Set up event listeners
    setupEventListeners();

    // Apply translations
    applyTranslations();

    // Set language selector to current
    languageSelect.value = langService.getCurrentLang();

    // Set today's date
    dateInput.valueAsDate = selectedDate;

    // Update routes info
    updateRoutesInfo();

    // Generate initial scenario
    generateScenario();
}

function cacheElements() {
    scenarioDisplay = {
        symbol: document.getElementById('scenario-symbol'),
        date: document.getElementById('scenario-date'),
        weather: document.getElementById('scenario-weather'),
        route: document.getElementById('scenario-route'),
        mission: document.getElementById('scenario-mission'),
        time: document.getElementById('scenario-time')
    };
    dateInput = document.getElementById('date-input');
    routesInfo = document.getElementById('routes-info');
    copyStatus = document.getElementById('copy-status');
    routeModal = document.getElementById('route-modal');
    myRoutesList = document.getElementById('my-routes-list');
    availableRoutesList = document.getElementById('available-routes-list');
    regionFilter = document.getElementById('region-filter');
    languageSelect = document.getElementById('language-select');
    routeSearch = document.getElementById('route-search');
}

function setupEventListeners() {
    // Generate button
    document.getElementById('generate-btn').addEventListener('click', generateScenario);

    // Copy button
    document.getElementById('copy-btn').addEventListener('click', copyScenario);

    // Date change
    dateInput.addEventListener('change', (e) => {
        if (e.target.value) {
            selectedDate = new Date(e.target.value);
            generateScenario();
        }
    });

    // Language change
    languageSelect.addEventListener('change', (e) => {
        langService.setLanguage(e.target.value);
        location.reload(); // Reload to apply new language
    });

    // Region filter change
    regionFilter.addEventListener('change', (e) => {
        selectedRegion = e.target.value;
        updateRoutesInfo();
        generateScenario();
    });

    // Route search
    routeSearch.addEventListener('input', (e) => {
        renderAvailableRoutes(currentTab, e.target.value);
    });

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.category;
            renderAvailableRoutes(currentTab, routeSearch.value);
        });
    });

    // Route management
    document.getElementById('manage-routes-btn').addEventListener('click', openRouteModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeRouteModal);
    document.getElementById('add-route-btn').addEventListener('click', addNewRoute);
    document.getElementById('reset-routes-btn').addEventListener('click', resetRoutes);
    document.getElementById('clear-routes-btn').addEventListener('click', clearAllRoutes);

    // Close modal on backdrop click
    routeModal.addEventListener('click', (e) => {
        if (e.target === routeModal) {
            closeRouteModal();
        }
    });

    // Enter key on new route input
    document.getElementById('new-route-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewRoute();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
            e.preventDefault();
            generateScenario();
        }
        if (e.key === 'c' && (e.ctrlKey || e.metaKey) && currentScenario) {
            e.preventDefault();
            copyScenario();
        }
    });
}

function applyTranslations() {
    // Update static text elements
    document.getElementById('page-subtitle').textContent = langService.get('subtitle');
    document.getElementById('generate-btn').textContent = langService.get('newScenario');
    document.getElementById('copy-btn').textContent = langService.get('copy');
    document.getElementById('manage-routes-btn').textContent = langService.get('manageRoutes');
    
    // Update scenario labels
    const labels = document.querySelectorAll('.scenario-detail .label');
    labels.forEach(label => {
        const text = label.textContent.toLowerCase().replace(':', '');
        if (text.includes('date') || text.includes('datum')) {
            label.textContent = langService.get('dateLabel');
        } else if (text.includes('weather') || text.includes('wetter')) {
            label.textContent = langService.get('weatherLabel');
        } else if (text.includes('route') || text.includes('strecke')) {
            label.textContent = langService.get('routeLabel');
        } else if (text.includes('mission') || text.includes('aufgabe')) {
            label.textContent = langService.get('missionLabel');
        } else if (text.includes('time') || text.includes('zeit')) {
            label.textContent = langService.get('timeLabel');
        }
    });
    
    // Update modal
    document.querySelector('.modal-header h2').textContent = langService.get('routeManagement');
    document.getElementById('new-route-input').placeholder = langService.get('addRoutePlaceholder');
    document.getElementById('route-search').placeholder = langService.get('searchRoutes');
    document.getElementById('add-route-btn').textContent = langService.get('addRoute');
    document.getElementById('reset-routes-btn').textContent = langService.get('resetRoutes');
    document.getElementById('clear-routes-btn').textContent = langService.get('clearRoutes');
    
    // Update section titles
    const sectionTitles = document.querySelectorAll('.route-section h3');
    if (sectionTitles[0]) sectionTitles[0].textContent = langService.get('myRoutes');
    if (sectionTitles[1]) sectionTitles[1].textContent = langService.get('availableRoutes');
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const cat = btn.dataset.category;
        btn.textContent = langService.get(cat);
    });
    
    // Update footer
    document.querySelector('footer p:last-child').textContent = langService.get('version');
    
    // Update filter options
    const filterOptions = regionFilter.querySelectorAll('option');
    filterOptions[0].textContent = langService.get('filterAll');
    filterOptions[1].textContent = langService.get('filterGermany');
    filterOptions[2].textContent = langService.get('filterUK');
    filterOptions[3].textContent = langService.get('filterUSA');
}

function generateScenario() {
    currentScenario = scenarioService.generateScenario(selectedDate, selectedRegion);
    displayScenario(currentScenario);
}

function displayScenario(scenario) {
    // Animate the display
    const display = document.getElementById('scenario-display');
    display.classList.add('updating');

    setTimeout(() => {
        const translatedWeather = langService.translateWeather(scenario.weather.name);
        scenarioDisplay.symbol.textContent = `${scenario.weather.emoji} ${scenario.missionEmoji}`;
        scenarioDisplay.date.textContent = `📅 ${scenario.formattedDate}`;
        scenarioDisplay.weather.textContent = `🌦️ ${translatedWeather}`;
        scenarioDisplay.route.textContent = `🛤️ ${scenario.route}`;
        scenarioDisplay.mission.textContent = `🚆 ${scenario.missionType}`;
        scenarioDisplay.time.textContent = `🕐 ${scenario.timeOfDay}`;

        display.classList.remove('updating');
    }, 150);
}

async function copyScenario() {
    if (!currentScenario) return;

    const text = scenarioService.formatForClipboard(currentScenario);

    try {
        await navigator.clipboard.writeText(text);
        showCopyStatus(langService.get('copied'), 'success');
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            showCopyStatus(langService.get('copied'), 'success');
        } catch (e) {
            showCopyStatus(langService.get('copyError'), 'error');
        }

        document.body.removeChild(textarea);
    }
}

function showCopyStatus(message, type) {
    copyStatus.textContent = message;
    copyStatus.className = `copy-status ${type}`;
    copyStatus.style.opacity = '1';

    setTimeout(() => {
        copyStatus.style.opacity = '0';
    }, 2000);
}

function updateRoutesInfo() {
    const count = routesService.getRoutesByCategory(selectedRegion).length;
    routesInfo.textContent = `${count} ${langService.get('routesAvailable')}`;
}

// Route Management Modal
function openRouteModal() {
    renderMyRoutes();
    renderAvailableRoutes(currentTab);
    routeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRouteModal() {
    routeModal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderMyRoutes() {
    const routes = routesService.getAllRoutes();
    myRoutesList.innerHTML = '';

    if (routes.length === 0) {
        myRoutesList.innerHTML = `<div class="empty-list">${langService.get('noRoutes')}</div>`;
        return;
    }

    routes.sort().forEach(route => {
        const item = document.createElement('div');
        item.className = 'route-item';
        item.innerHTML = `
            <span class="route-name">${escapeHtml(route)}</span>
            <button class="btn-icon delete-route-btn" data-route="${escapeHtml(route)}" title="Remove">
                🗑️
            </button>
        `;
        myRoutesList.appendChild(item);
    });

    // Add delete handlers
    myRoutesList.querySelectorAll('.delete-route-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const route = btn.getAttribute('data-route');
            deleteRoute(route);
        });
    });
}

function renderAvailableRoutes(category, searchTerm = '') {
    const availableRoutes = routesService.getDefaultRoutesByCategory(category);
    const myRoutes = routesService.getAllRoutes();
    
    // Filter out routes already in my list and by search term
    const filteredRoutes = availableRoutes.filter(route => {
        const notAdded = !myRoutes.includes(route);
        const matchesSearch = !searchTerm || route.toLowerCase().includes(searchTerm.toLowerCase());
        return notAdded && matchesSearch;
    });

    availableRoutesList.innerHTML = '';

    if (filteredRoutes.length === 0) {
        const msg = searchTerm ? langService.get('noMatches') : langService.get('allRoutesAdded');
        availableRoutesList.innerHTML = `<div class="empty-list">${msg}</div>`;
        return;
    }

    filteredRoutes.sort().forEach(route => {
        const item = document.createElement('div');
        item.className = 'route-item available';
        item.innerHTML = `
            <span class="route-name">${escapeHtml(route)}</span>
            <button class="btn-icon add-route-btn" data-route="${escapeHtml(route)}" title="Add">
                ➕
            </button>
        `;
        availableRoutesList.appendChild(item);
    });

    // Add handlers
    availableRoutesList.querySelectorAll('.add-route-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const route = btn.getAttribute('data-route');
            addAvailableRoute(route);
        });
    });
}

function addAvailableRoute(route) {
    if (routesService.addRoute(route)) {
        renderMyRoutes();
        renderAvailableRoutes(currentTab, routeSearch.value);
        updateRoutesInfo();
        showCopyStatus(langService.get('routeAdded'), 'success');
    }
}

function addNewRoute() {
    const input = document.getElementById('new-route-input');
    const name = input.value.trim();

    if (!name) {
        showCopyStatus(langService.get('enterName'), 'error');
        return;
    }

    if (routesService.addRoute(name)) {
        input.value = '';
        renderMyRoutes();
        renderAvailableRoutes(currentTab, routeSearch.value);
        updateRoutesInfo();
        showCopyStatus(langService.get('routeAdded'), 'success');
    } else {
        showCopyStatus(langService.get('routeExists'), 'error');
    }
}

function deleteRoute(route) {
    if (routesService.removeRoute(route)) {
        renderMyRoutes();
        renderAvailableRoutes(currentTab, routeSearch.value);
        updateRoutesInfo();
        showCopyStatus(langService.get('routeRemoved'), 'success');
    }
}

function resetRoutes() {
    if (confirm(langService.get('confirmReset'))) {
        routesService.resetToDefault();
        renderMyRoutes();
        renderAvailableRoutes(currentTab, routeSearch.value);
        updateRoutesInfo();
        showCopyStatus(langService.get('routesReset'), 'success');
    }
}

function clearAllRoutes() {
    if (confirm(langService.get('confirmClear'))) {
        routesService.clearAll();
        renderMyRoutes();
        renderAvailableRoutes(currentTab, routeSearch.value);
        updateRoutesInfo();
        showCopyStatus(langService.get('routesCleared'), 'success');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
