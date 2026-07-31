/* Confluence Dark Mode — popup controller */
(function () {
    'use strict';

    const CDM = self.CDM;
    const $ = function (id) { return document.getElementById(id); };

    let masterOn = true;
    let settings = CDM.mergeSettings(null);
    let host = '';
    let detected = false;
    let known = false;
    let saveTimer = null;

    /* ---------------------------------------------------------------- */
    /* Persistence                                                       */
    /* ---------------------------------------------------------------- */

    function saveSettings(immediate) {
        clearTimeout(saveTimer);
        const write = function () {
            const payload = {};
            payload[CDM.SETTINGS_KEY] = settings;
            chrome.storage.local.set(payload);
        };
        /* Sliders fire continuously — coalesce writes while dragging. */
        if (immediate) write(); else saveTimer = setTimeout(write, 90);
    }

    function saveMaster() {
        const payload = {};
        payload[CDM.LEGACY_KEY] = masterOn ? 1 : 0;
        chrome.storage.local.set(payload);
        /* Legacy message kept so any older content script still responds. */
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs || !tabs[0]) return;
            chrome.tabs.sendMessage(tabs[0].id, { action: masterOn ? 'run' : 'revert' }, function () {
                void chrome.runtime.lastError;
            });
        });
    }

    /* ---------------------------------------------------------------- */
    /* Rendering                                                         */
    /* ---------------------------------------------------------------- */

    function setSwitch(el, on) {
        el.setAttribute('aria-checked', on ? 'true' : 'false');
    }

    function fillRange(input) {
        const min = Number(input.min), max = Number(input.max);
        const pct = ((Number(input.value) - min) / (max - min)) * 100;
        input.style.setProperty('--fill', pct + '%');
    }

    function scheduleSummary() {
        if (settings.scheduleMode === 'system') return 'Follows your system theme';
        if (settings.scheduleMode === 'custom') {
            return 'Active ' + settings.scheduleFrom + ' – ' + settings.scheduleTo;
        }
        return 'Enabled everywhere';
    }

    function siteEnabled() {
        return CDM.isSiteEnabled(settings, host, detected);
    }

    function renderStatus() {
        const line = $('statusLine');
        if (!host) {
            line.textContent = 'No page detected';
            line.classList.remove('good');
            return;
        }
        const live = masterOn && siteEnabled() &&
            CDM.isScheduleActive(settings, new Date(), window.matchMedia('(prefers-color-scheme: dark)').matches);
        line.textContent = live ? 'Active on ' + host : 'Inactive on ' + host;
        line.classList.toggle('good', live);
    }

    function renderMaster() {
        setSwitch($('masterSwitch'), masterOn);
        $('heroCard').classList.toggle('off', !masterOn);
        $('masterSub').textContent = masterOn ? scheduleSummary() : 'Turned off';
    }

    function renderSite() {
        const card = $('siteCard');
        const title = $('siteTitle');
        const sub = $('siteSub');

        if (!host) {
            card.classList.add('disabled');
            title.textContent = 'This site';
            sub.textContent = 'Open a Confluence page';
            setSwitch($('siteSwitch'), false);
            return;
        }

        card.classList.remove('disabled');
        title.textContent = host;
        setSwitch($('siteSwitch'), siteEnabled());

        if (Object.prototype.hasOwnProperty.call(settings.sites, host)) {
            sub.textContent = settings.sites[host] === false ? 'Excluded by you' : 'Added by you';
        } else if (known) {
            sub.textContent = 'Atlassian site';
        } else if (detected) {
            sub.textContent = 'Confluence detected here';
        } else {
            sub.textContent = 'Not a Confluence page — enable anyway?';
        }
    }

    function renderThemes() {
        const wrap = $('themeChips');
        wrap.innerHTML = '';
        Object.keys(CDM.THEMES).forEach(function (key) {
            const t = CDM.THEMES[key];
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'chip';
            chip.setAttribute('role', 'radio');
            chip.dataset.theme = key;
            chip.setAttribute('aria-checked', settings.theme === key ? 'true' : 'false');

            const dot = document.createElement('span');
            dot.className = 'dot';
            /* Swatch = page background → mid-tone, as this preset would render them. */
            dot.style.background = 'linear-gradient(135deg,' + shade(t, 255) + ' 50%,' + shade(t, 190) + ' 50%)';
            chip.appendChild(dot);
            chip.appendChild(document.createTextNode(t.label));
            wrap.appendChild(chip);
        });
    }

    /* Run a grey level through the same filter chain the page gets. */
    function shade(t, level) {
        let c = level * (1 - t.invert) + (255 - level) * t.invert;
        c = (c - 128) * t.contrast + 128;
        c *= t.brightness;
        const byte = function (v) { return Math.max(0, Math.min(255, Math.round(v))); };
        return 'rgb(' + byte(c * (1 + t.sepia * 0.18)) + ',' + byte(c) + ',' + byte(c * (1 - t.sepia * 0.24)) + ')';
    }

    function renderSliders() {
        const map = [
            ['invert', Math.round(settings.invert * 100), 'invertVal'],
            ['contrast', Math.round(settings.contrast * 100), 'contrastVal'],
            ['sepia', Math.round(settings.sepia * 100), 'sepiaVal']
        ];
        map.forEach(function (m) {
            const input = $(m[0]);
            input.value = m[1];
            $(m[2]).textContent = m[1] + '%';
            fillRange(input);
        });
    }

    function renderAdvanced() {
        $('scheduleMode').value = settings.scheduleMode;
        $('scheduleFrom').value = settings.scheduleFrom;
        $('scheduleTo').value = settings.scheduleTo;
        $('timeRow').hidden = settings.scheduleMode !== 'custom';
        $('invertImages').checked = !!settings.invertImages;
        $('autoDetect').checked = !!settings.autoDetect;
        $('smoothTransition').checked = !!settings.smoothTransition;
        renderSites();
    }

    function renderSites() {
        const hosts = Object.keys(settings.sites).sort();
        const wrap = $('sitesWrap');
        const list = $('sitesList');
        wrap.hidden = hosts.length === 0;
        list.innerHTML = '';

        hosts.forEach(function (h) {
            const on = settings.sites[h] !== false;
            const li = document.createElement('li');

            const name = document.createElement('span');
            name.className = 'name';
            name.textContent = h;
            name.title = h;

            const state = document.createElement('span');
            state.className = 'state' + (on ? '' : ' off');
            state.textContent = on ? 'on' : 'off';

            const del = document.createElement('button');
            del.type = 'button';
            del.textContent = '×';
            del.title = 'Remove ' + h;
            del.addEventListener('click', function () {
                delete settings.sites[h];
                saveSettings(true);
                renderAll();
            });

            li.appendChild(name);
            li.appendChild(state);
            li.appendChild(del);
            list.appendChild(li);
        });
    }

    function renderAll() {
        renderMaster();
        renderSite();
        renderThemes();
        renderSliders();
        renderAdvanced();
        renderStatus();
    }

    /* ---------------------------------------------------------------- */
    /* Events                                                            */
    /* ---------------------------------------------------------------- */

    function bind() {
        $('masterSwitch').addEventListener('click', function () {
            masterOn = !masterOn;
            saveMaster();
            renderMaster();
            renderStatus();
        });

        $('siteSwitch').addEventListener('click', function () {
            if (!host) return;
            settings.sites[host] = !siteEnabled();
            saveSettings(true);
            renderSite();
            renderStatus();
            renderSites();
        });

        $('themeChips').addEventListener('click', function (e) {
            const chip = e.target.closest('.chip');
            if (!chip) return;
            const t = CDM.THEMES[chip.dataset.theme];
            if (!t) return;
            settings.theme = chip.dataset.theme;
            settings.invert = t.invert;
            settings.contrast = t.contrast;
            settings.brightness = t.brightness;
            settings.sepia = t.sepia;
            saveSettings(true);
            renderThemes();
            renderSliders();
        });

        [['invert', 'invertVal'], ['contrast', 'contrastVal'], ['sepia', 'sepiaVal']].forEach(function (pair) {
            const input = $(pair[0]);
            input.addEventListener('input', function () {
                const v = Number(input.value);
                $(pair[1]).textContent = v + '%';
                fillRange(input);
                settings[pair[0]] = v / 100;
                settings.theme = 'custom';
                saveSettings(false);
                renderThemes();
            });
        });

        $('resetBtn').addEventListener('click', function () {
            const t = CDM.THEMES.classic;
            settings.theme = 'classic';
            settings.invert = t.invert;
            settings.contrast = t.contrast;
            settings.brightness = t.brightness;
            settings.sepia = t.sepia;
            saveSettings(true);
            renderThemes();
            renderSliders();
        });

        $('scheduleMode').addEventListener('change', function (e) {
            settings.scheduleMode = e.target.value;
            $('timeRow').hidden = settings.scheduleMode !== 'custom';
            saveSettings(true);
            renderMaster();
            renderStatus();
        });

        ['scheduleFrom', 'scheduleTo'].forEach(function (id) {
            $(id).addEventListener('change', function (e) {
                if (!e.target.value) return;
                settings[id] = e.target.value;
                saveSettings(true);
                renderMaster();
                renderStatus();
            });
        });

        [['invertImages', 'invertImages'], ['autoDetect', 'autoDetect'], ['smoothTransition', 'smoothTransition']]
            .forEach(function (pair) {
                $(pair[0]).addEventListener('change', function (e) {
                    settings[pair[1]] = e.target.checked;
                    saveSettings(true);
                    renderSite();
                    renderStatus();
                });
            });
    }

    /* ---------------------------------------------------------------- */
    /* Boot                                                              */
    /* ---------------------------------------------------------------- */

    function readTabState(done) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs && tabs[0];
            if (!tab) return done();

            if (tab.url) {
                try {
                    const u = new URL(tab.url);
                    if (u.protocol === 'http:' || u.protocol === 'https:') host = u.hostname.toLowerCase();
                } catch (e) { /* chrome:// and friends */ }
            }
            known = CDM.isKnownConfluenceHost(host);

            /* The content script knows whether it found Confluence markers. */
            chrome.tabs.sendMessage(tab.id, { action: 'cdm:getState' }, function (res) {
                if (chrome.runtime.lastError || !res) return done();
                host = res.host || host;
                detected = !!res.detected;
                known = !!res.known;
                done();
            });
        });
    }

    function boot() {
        chrome.storage.local.get([CDM.LEGACY_KEY, CDM.SETTINGS_KEY], function (data) {
            masterOn = data[CDM.LEGACY_KEY] === 1 || data[CDM.LEGACY_KEY] === undefined;
            settings = CDM.mergeSettings(data[CDM.SETTINGS_KEY]);
            renderAll();
            readTabState(renderAll);
        });

        bind();

        $('versionPill').textContent = 'v' + chrome.runtime.getManifest().version;
        $('rateLink').href = 'https://chromewebstore.google.com/detail/' + chrome.runtime.id + '/reviews';

        if (chrome.commands && chrome.commands.getAll) {
            chrome.commands.getAll(function (cmds) {
                const c = (cmds || []).find(function (x) { return x.name === 'toggle-dark-mode'; });
                if (!c || !c.shortcut) return;
                const keys = c.shortcut.split('+');
                const hint = document.querySelector('.kbd-hint');
                hint.innerHTML = '';
                hint.appendChild(document.createTextNode('Toggle with '));
                keys.forEach(function (k) {
                    const kbd = document.createElement('kbd');
                    kbd.textContent = k;
                    hint.appendChild(kbd);
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', boot);
})();
