// بيانات الترجمة
const i18n = {
    ar: { plan:"خطط رحلتك", from:"من:", to:"إلى:", show:"عرض المسار", tools:"أدوات الرحلة", track:"بدء التتبع", alarm:"منبه الوصول:", now:"الموقع:", sched:"جدول الرحلة", dir:"rtl" },
    fr: { plan:"Planifier", from:"De:", to:"À:", show:"Afficher", tools:"Outils", track:"Suivi Live", alarm:"Alarme Arrivée:", now:"Position:", sched:"Horaires", dir:"ltr" },
    en: { plan:"Trip Planner", from:"From:", to:"To:", show:"Show Route", tools:"Trip Tools", track:"Live Track", alarm:"Arrival Alarm:", now:"Current:", sched:"Schedule", dir:"ltr" }
};

// قاعدة بيانات المحطات
const stationsDB = {
    "Agha": [36.7658, 3.0515], "El Harrach": [36.7200, 3.1300], "Birtouta": [36.6400, 3.0000],
    "Boufarik": [36.5700, 2.9100], "Blida": [36.4702, 2.8277], "El Affroun": [36.4674, 2.6277],
    "Chlef": [36.1643, 1.3328], "Relizane": [35.7411, 0.5558], "Oran": [35.6969, -0.6331],
    "Bouira": [36.3749, 3.9030], "Setif": [36.1898, 5.4108], "Constantine": [36.3650, 6.6147], "Annaba": [36.9000, 7.7667]
};

const railwayLines = [
    { name: "West", stops: ["Agha", "El Harrach", "Birtouta", "Boufarik", "Blida", "El Affroun", "Chlef", "Relizane", "Oran"], color: "#3498db" },
    { name: "East", stops: ["Agha", "El Harrach", "Bouira", "Setif", "Constantine", "Annaba"], color: "#e74c3c" }
];

let map = L.map('map').setView([36.5, 3.0], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let trainMarker, polyline, trackInterval, currentPath = [];
let currentLang = 'ar';

function updateLanguage(lang) {
    currentLang = lang;
    const t = i18n[lang];
    document.getElementById('main-html').dir = t.dir;
    for (let key in t) {
        const el = document.getElementById('txt-'+key) || document.getElementById('lbl-'+key) || document.getElementById('btn-'+key);
        if(el) el.innerText = t[key];
    }
}

function populateDropdowns() {
    const lists = ['start-station', 'end-station', 'alarm-station'];
    const stations = Object.keys(stationsDB);
    lists.forEach(id => {
        const el = document.getElementById(id);
        stations.forEach(s => el.innerHTML += `<option value="${s}">${s}</option>`);
    });
}

function planTrip() {
    const start = document.getElementById('start-station').value;
    const end = document.getElementById('end-station').value;
    let line = railwayLines.find(l => l.stops.includes(start) && l.stops.includes(end));
    
    if (line) {
        let sIdx = line.stops.indexOf(start), eIdx = line.stops.indexOf(end);
        currentPath = sIdx < eIdx ? line.stops.slice(sIdx, eIdx+1) : line.stops.slice(eIdx, sIdx+1).reverse();
        renderRoute(currentPath, line.color);
    } else {
        alert(currentLang === 'ar' ? "لا يوجد خط مباشر بين هاتين المحطتين" : "No direct line found");
    }
}

function renderRoute(stops, color) {
    if (polyline) map.removeLayer(polyline);
    const coords = stops.map(s => stationsDB[s]);
    polyline = L.polyline(coords, {color: color, weight: 6, opacity: 0.8}).addTo(map);
    map.fitBounds(polyline.getBounds());
    
    document.getElementById('timetable-body').innerHTML = stops.map(s => `<tr><td>${s}</td><td>--:--</td></tr>`).join('');
}

function startTracking() {
    if (!currentPath.length) return alert(currentLang === 'ar' ? "اختر مساراً أولاً" : "Select a route first");
    if (trackInterval) clearInterval(trackInterval);
    
    let step = 0;
    document.getElementById('status-area').style.display = 'block';
    if (trainMarker) map.removeLayer(trainMarker);
    
    trainMarker = L.marker(stationsDB[currentPath[0]], {
        icon: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/785/785360.png', iconSize: [35, 35] })
    }).addTo(map);

    trackInterval = setInterval(() => {
        if (step >= currentPath.length) {
            clearInterval(trackInterval);
            return;
        }
        let sName = currentPath[step];
        trainMarker.setLatLng(stationsDB[sName]);
        map.panTo(stationsDB[sName]);
        document.getElementById('current-loc').innerText = sName;
        
        if (sName === document.getElementById('alarm-station').value) {
            new Audio('https://actions.google.com/google-conversions/8-bit-adventurer/reward-music-1.mp3').play();
            alert("🔔 " + (currentLang === 'ar' ? "وصلت إلى وجهتك: " : "Arrived at: ") + sName);
        }
        step++;
    }, 3000);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('dark-btn').innerText = isDark ? '☀️' : '🌙';
}

window.onload = () => {
    if(localStorage.getItem('theme')==='dark') toggleDarkMode();
    populateDropdowns();
    updateLanguage('ar');
};
