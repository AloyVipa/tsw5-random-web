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

// DOM Elements
let scenarioDisplay = null;
let dateInput = null;
let routesInfo = null;
let copyStatus = null;
let routeModal = null;
let routeList = null;
let regionFilter = null;

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
    routeList = document.getElementById('route-list');
    regionFilter = document.getElementById('region-filter');
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

    // Region filter change
    regionFilter.addEventListener('change', (e) => {
        selectedRegion = e.target.value;
        updateRoutesInfo();
        generateScenario();
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
    
    // Update modal
    document.querySelector('.modal-header h2').textContent = langService.get('routeManagement');
    document.getElementById('new-route-input').placeholder = langService.get('addRoutePlaceholder');
    document.getElementById('add-route-btn').textContent = langService.get('addRoute');
    document.getElementById('reset-routes-btn').textContent = langService.get('resetRoutes');
    document.getElementById('clear-routes-btn').textContent = langService.get('clearRoutes');
    
    // Update labels
    document.querySelector('label[for="date-input"]').textContent = langService.get('date');
    document.querySelector('label[for="region-filter"]').textContent = '🌍 Region:';
    
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
        scenarioDisplay.symbol.textContent = `${scenario.weather.emoji} ${scenario.missionEmoji}`;
        scenarioDisplay.date.textContent = `📅 ${scenario.formattedDate}`;
        scenarioDisplay.weather.textContent = `🌦️ ${scenario.weather.name}`;
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
    renderRouteList();
    routeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRouteModal() {
    routeModal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderRouteList() {
    const routes = routesService.getAllRoutes();
    routeList.innerHTML = '';

    if (routes.length === 0) {
        routeList.innerHTML = `<div class="empty-list">${langService.get('noRoutes')}</div>`;
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
        routeList.appendChild(item);
    });

    // Add delete handlers
    document.querySelectorAll('.delete-route-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const route = btn.getAttribute('data-route');
            deleteRoute(route);
        });
    });
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
        renderRouteList();
        updateRoutesInfo();
        showCopyStatus(langService.get('routeAdded'), 'success');
    } else {
        showCopyStatus(langService.get('routeExists'), 'error');
    }
}

function deleteRoute(route) {
    if (routesService.removeRoute(route)) {
        renderRouteList();
        updateRoutesInfo();
        showCopyStatus(langService.get('routeRemoved'), 'success');
    }
}

function resetRoutes() {
    if (confirm(langService.get('confirmReset'))) {
        routesService.resetToDefault();
        renderRouteList();
        updateRoutesInfo();
        showCopyStatus(langService.get('routesReset'), 'success');
    }
}

function clearAllRoutes() {
    if (confirm(langService.get('confirmClear'))) {
        routesService.clearAll();
        renderRouteList();
        updateRoutesInfo();
        showCopyStatus(langService.get('routesCleared'), 'success');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
