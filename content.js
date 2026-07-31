/*
 * Confluence Dark Mode — content script.
 *
 * Runs at document_start on every page, but bails out within a few
 * microseconds unless the page looks like Confluence (known host, a host the
 * user opted into, or an auto-detected self-hosted instance).
 */
(function () {
    'use strict';

    const CDM = self.CDM;

    const STYLE_ID = 'cdm-dark-style';
    const IFRAME_STYLE_ID = 'dark-mode-iframe-style';
    const TRANSITION_ATTR = 'data-cdm-transition';

    let settings = CDM.mergeSettings(null);
    let masterOn = true;              // legacy `switchedOn` (default on)
    let detected = false;             // auto-detected Confluence markers
    let settingsLoaded = false;       // first storage read has landed
    let applied = false;
    let styleEl = null;

    let editorIframeObserver = null;
    let iframeFallbackInterval = null;
    let headObserver = null;
    let scheduleTimer = null;
    let transitionTimer = null;

    let lastUrl = location.href;
    const host = location.hostname.toLowerCase();
    const darkMedia = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

    let originalThemeAttr = null;
    let originalColorSchemeAttr = null;

    /* ------------------------------------------------------------------ */
    /* Stylesheet                                                          */
    /* ------------------------------------------------------------------ */

    /*
     * The page gets one big inverting filter; anything that is already an
     * image (or is meant to keep its own colours) gets the exact inverse so it
     * renders untouched. Values come from CSS custom properties so dragging a
     * slider repaints instantly without re-parsing the stylesheet.
     */
    const CSS = `
    /* --- MAIN COLOR BACKGROUND --- */
    html {
        filter: invert(var(--cdm-invert, .9)) hue-rotate(180deg) contrast(var(--cdm-contrast, 1)) brightness(var(--cdm-brightness, 1)) sepia(var(--cdm-sepia, 0)) !important;
        /* Inverted to near-black: stops the white flash on overscroll. */
        background-color: #fff;
    }

    html * {
        box-shadow: none !important;
    }

    html[${TRANSITION_ATTR}] * {
        transition: background-color .15s ease, color .15s ease, border-color .15s ease, fill .15s ease, filter .15s ease !important;
    }

    html, body {
        color: #000;
    }

    a {
        color: #172b4d !important;
    }

    h1, h2, h3, h4, h5, h6, h7, h8 {
        color: #000 !important;
    }

    h1 *, h2 *, h3 *, h4 *, h5 *, h6 *, h7 *, h8 * {
        color: #000 !important;
    }

    #header,
    .aui-header {
        background-color: #daebff !important;
    }

    #header-precursor, #header-precursor * {
        background-color: #f6faff !important;
    }

    /* --- Skip the following elements (undo the root filter) --- */
    img,
    svg,
    video,
    div[role=img],
    [data-cdm-keep-colors],
    *[style*="background-image"] {
        filter: var(--cdm-undo, invert(1.1) hue-rotate(180deg)) !important;
    }

    *[class^="highlight"],
    .fc-state-highlight {
        filter: var(--cdm-undo, invert(1.1) hue-rotate(180deg)) brightness(120%) !important;
        border-color: transparent !important;
    }

    .badge {
        filter: invert(var(--cdm-invert-back, 1.1)) hue-rotate(-20deg) saturate(202%) brightness(120%) !important;
    }

    .aui-header .aui-quicksearch input[type='text'], .aui-header .aui-quicksearch input[type='text'][type='text']:focus {
        background: #8e9cb3 !important;
    }

    #quick-search-query::placeholder {
        color: #181818ff;
    }

    #quick-search-query-button {
        filter: brightness(.5);
    }

    /* --- SCROLLBARS --- */
    ::-webkit-scrollbar {
        width: 6px !important;
        height: 8px !important;
    }

    ::-webkit-scrollbar-thumb {
        background-color: gray !important;
        border-radius: 4px !important;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: darkgray !important;
    }

    ::-webkit-scrollbar-track {
        background: lightgray !important;
    }
`;

    const NO_IMAGE_INVERT_CSS = `
    img, svg, video, div[role=img], *[style*="background-image"] {
        filter: none !important;
    }
`;

    function writeVars(s) {
        const root = document.documentElement;
        if (!root) return;
        const back = (2 - s.invert).toFixed(3);
        root.style.setProperty('--cdm-invert', String(s.invert));
        root.style.setProperty('--cdm-invert-back', back);
        root.style.setProperty('--cdm-contrast', String(s.contrast));
        root.style.setProperty('--cdm-brightness', String(s.brightness));
        root.style.setProperty('--cdm-sepia', String(s.sepia));
        /* Exact inverse of the root filter, so media renders as authored. */
        root.style.setProperty(
            '--cdm-undo',
            `invert(${back}) hue-rotate(180deg) contrast(${(1 / s.contrast).toFixed(3)}) brightness(${(1 / s.brightness).toFixed(3)})`
        );
    }

    function clearVars() {
        const root = document.documentElement;
        if (!root) return;
        ['--cdm-invert', '--cdm-invert-back', '--cdm-contrast', '--cdm-brightness', '--cdm-sepia', '--cdm-undo']
            .forEach(function (p) { root.style.removeProperty(p); });
    }

    function ensureStyleEl() {
        if (styleEl && styleEl.isConnected) return styleEl;
        styleEl = document.getElementById(STYLE_ID);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = STYLE_ID;
            /* Keep the legacy id around so older debugging notes still apply. */
            styleEl.setAttribute('data-legacy-id', 'dark-mode-main');
        }
        (document.head || document.documentElement).appendChild(styleEl);
        return styleEl;
    }

    function flashTransition() {
        if (!settings.smoothTransition) return;
        const root = document.documentElement;
        root.setAttribute(TRANSITION_ATTR, '');
        clearTimeout(transitionTimer);
        transitionTimer = setTimeout(function () {
            root.removeAttribute(TRANSITION_ATTR);
        }, 400);
    }

    /* ------------------------------------------------------------------ */
    /* Editor iframe (legacy TinyMCE editor)                               */
    /* ------------------------------------------------------------------ */

    function tryInjectIntoEditorIframe() {
        const iframe = document.querySelector('iframe[id^="wysiwygTextarea_ifr"]');
        if (!iframe) return;

        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            if (!doc || !doc.body || doc.getElementById(IFRAME_STYLE_ID)) return;

            const style = doc.createElement('style');
            style.id = IFRAME_STYLE_ID;
            style.textContent = `
            body { background: #000; }
            *[class^="highlight"] {
                filter: invert(${(2 - settings.invert).toFixed(3)}) brightness(120%) hue-rotate(180deg) !important;
            }
            img, svg, video, canvas, div[role=img], *[style*="background-image"] {
                filter: invert(${(2 - settings.invert).toFixed(3)}) hue-rotate(180deg) !important;
            }
        `;
            doc.head.appendChild(style);
        } catch (e) {
            /* Cross-origin editor iframe — nothing we can do. */
        }
    }

    function observeEditorIframe() {
        if (editorIframeObserver || !document.body) return;
        editorIframeObserver = new MutationObserver(function (mutations) {
            for (const m of mutations) {
                m.addedNodes.forEach(function (node) {
                    if (node.tagName === 'IFRAME' && node.id && node.id.indexOf('wysiwyg') === 0) {
                        node.addEventListener('load', tryInjectIntoEditorIframe);
                    }
                });
            }
        });
        editorIframeObserver.observe(document.body, { childList: true, subtree: true });

        /* Fallback for editors that swap their iframe in late. */
        clearInterval(iframeFallbackInterval);
        iframeFallbackInterval = setInterval(tryInjectIntoEditorIframe, 250);
        setTimeout(function () {
            clearInterval(iframeFallbackInterval);
            iframeFallbackInterval = null;
        }, 8000);
    }

    function revertIframeStyles() {
        if (editorIframeObserver) {
            editorIframeObserver.disconnect();
            editorIframeObserver = null;
        }
        if (iframeFallbackInterval) {
            clearInterval(iframeFallbackInterval);
            iframeFallbackInterval = null;
        }

        document.querySelectorAll('iframe').forEach(function (iframe) {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const s = doc && doc.getElementById(IFRAME_STYLE_ID);
                if (s) s.remove();
            } catch (e) { /* cross-origin */ }
        });
    }

    /* ------------------------------------------------------------------ */
    /* Apply / revert                                                      */
    /* ------------------------------------------------------------------ */

    function applyDarkMode(withTransition) {
        writeVars(settings);

        const el = ensureStyleEl();
        const css = CSS + (settings.invertImages ? '' : NO_IMAGE_INVERT_CSS);
        if (el.textContent !== css) el.textContent = css;

        if (document.documentElement) {
            if (originalThemeAttr === null) {
                originalThemeAttr = document.documentElement.getAttribute('data-theme');
            }
            if (originalColorSchemeAttr === null) {
                originalColorSchemeAttr = document.documentElement.getAttribute('data-color-scheme');
            }
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        document.querySelectorAll('[data-color-scheme]').forEach(function (n) {
            n.setAttribute('data-color-scheme', 'dark');
        });

        observeEditorIframe();
        keepStyleAlive();
        /* Only fade on a real on/off change — not on every re-apply. */
        if (withTransition && !applied) flashTransition();
        applied = true;
    }

    function revertDarkMode(withTransition) {
        if (withTransition) flashTransition();
        if (styleEl) {
            styleEl.remove();
            styleEl = null;
        }
        clearVars();

        if (originalThemeAttr !== null && document.documentElement) {
            document.documentElement.setAttribute('data-theme', originalThemeAttr);
        } else if (document.documentElement) {
            document.documentElement.removeAttribute('data-theme');
        }
        if (originalColorSchemeAttr !== null) {
            document.querySelectorAll('[data-color-scheme]').forEach(function (n) {
                n.setAttribute('data-color-scheme', originalColorSchemeAttr);
            });
        }

        revertIframeStyles();
        applied = false;
    }

    /* Confluence occasionally rewrites <head>; make sure our style survives. */
    function keepStyleAlive() {
        if (headObserver || !document.head) return;
        headObserver = new MutationObserver(function () {
            if (applied && styleEl && !styleEl.isConnected) {
                (document.head || document.documentElement).appendChild(styleEl);
            }
        });
        headObserver.observe(document.head, { childList: true });
    }

    /* ------------------------------------------------------------------ */
    /* Page eligibility                                                    */
    /* ------------------------------------------------------------------ */

    function shouldSkipDarkMode(url) {
        url = String(url).toLowerCase();

        return (
            /* PDF export */
            url.includes('/pdfpageexport.action') ||
            url.includes('/exportword') ||

            /* Attachment/file viewers */
            url.includes('/viewer') ||
            (url.includes('/attachment') && (url.endsWith('.pdf') || url.endsWith('.docx') || url.endsWith('.pptx') || url.endsWith('.xlsx'))) ||

            /* Office Connector preview */
            url.includes('officeconnector') ||

            /* Source or macro preview */
            url.includes('/viewsource') ||
            url.includes('/macro-preview') ||

            /* Directly opened attachments (not page content) */
            !!url.match(/\.(pdf|docx?|xlsx?|pptx?)($|\?)/)
        );
    }

    /* Signals that are unique to a Confluence instance, self-hosted or not. */
    const DETECT_SELECTOR = [
        'meta[name="confluence-base-url"]',
        'meta[id="confluence-base-url"]',
        'meta[name="ajs-conf-revision"]',
        'meta[name="ajs-space-key"]',
        'meta[name="ajs-page-id"]',
        'meta[id="confluence-request-time"]',
        'meta[name="application-name"][content="Confluence"]'
    ].join(',');

    function detectConfluence() {
        try {
            if (document.querySelector(DETECT_SELECTOR)) return true;
            const b = document.body;
            if (b && (b.id === 'com-atlassian-confluence' || b.classList.contains('aui-page-focused-confluence'))) return true;
        } catch (e) { /* ignore */ }
        return false;
    }

    function shouldBeDark() {
        if (!masterOn) return false;
        if (!CDM.isSiteEnabled(settings, host, detected)) return false;
        if (!CDM.isScheduleActive(settings, new Date(), darkMedia && darkMedia.matches)) return false;
        if (shouldSkipDarkMode(location.href)) return false;
        return true;
    }

    /*
     * A page counts as "ours" once it is a known host, the user named it, or
     * detection fired. Only then do we install the SPA/editor observers — on
     * every other website this script stays inert.
     */
    function isOurPage() {
        return (
            CDM.isKnownConfluenceHost(host) ||
            Object.prototype.hasOwnProperty.call(settings.sites, host) ||
            detected
        );
    }

    function reconcile(withTransition) {
        /*
         * Detection can win the race against the (async) storage read. Acting
         * on default settings before then would flash a page dark that the
         * user had switched off, so hold off until we know what they chose.
         */
        if (!settingsLoaded) return;

        const want = shouldBeDark();
        if (want) {
            applyDarkMode(withTransition);
        } else if (applied) {
            revertDarkMode(withTransition);
        }
        if (isOurPage()) {
            observeUrlChanges();
            scheduleNextCheck();
        }
    }

    /* Re-evaluate on the minute while a custom time range is configured. */
    function scheduleNextCheck() {
        clearTimeout(scheduleTimer);
        if (settings.scheduleMode !== 'custom') return;
        scheduleTimer = setTimeout(function () { reconcile(true); }, 30000);
    }

    /* ------------------------------------------------------------------ */
    /* Storage                                                             */
    /* ------------------------------------------------------------------ */

    function loadAndApply(withTransition) {
        chrome.storage.local.get([CDM.LEGACY_KEY, CDM.SETTINGS_KEY], function (data) {
            if (!chrome.runtime.lastError) {
                masterOn = data[CDM.LEGACY_KEY] === 1 || data[CDM.LEGACY_KEY] === undefined;
                settings = CDM.mergeSettings(data[CDM.SETTINGS_KEY]);
            }
            settingsLoaded = true;
            reconcile(withTransition);
        });
    }

    chrome.storage.onChanged.addListener(function (changes, area) {
        if (area !== 'local') return;
        let touched = false;
        if (changes[CDM.LEGACY_KEY]) {
            const v = changes[CDM.LEGACY_KEY].newValue;
            masterOn = v === 1 || v === undefined;
            touched = true;
        }
        if (changes[CDM.SETTINGS_KEY]) {
            settings = CDM.mergeSettings(changes[CDM.SETTINGS_KEY].newValue);
            touched = true;
        }
        if (touched) reconcile(true);
    });

    /* Legacy messages ("run"/"revert") plus the popup's state query. */
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (!message) return;
        if (message.action === 'run') { masterOn = true; reconcile(true); }
        if (message.action === 'revert') { masterOn = false; reconcile(true); }
        if (message.action === 'cdm:getState') {
            sendResponse({
                host: host,
                detected: detected,
                known: CDM.isKnownConfluenceHost(host),
                active: applied,
                skipped: shouldSkipDarkMode(location.href)
            });
        }
    });

    /* ------------------------------------------------------------------ */
    /* URL changes (Confluence Cloud is a SPA)                             */
    /* ------------------------------------------------------------------ */

    let urlObserverInstalled = false;

    function observeUrlChanges() {
        if (urlObserverInstalled) return;
        urlObserverInstalled = true;
        let queued = false;
        const handleChange = function () {
            if (location.href === lastUrl) return;
            lastUrl = location.href;
            reconcile(false);
        };
        /* Body mutations fire constantly in the editor — coalesce per frame. */
        const queueCheck = function () {
            if (queued) return;
            queued = true;
            requestAnimationFrame(function () {
                queued = false;
                handleChange();
            });
        };

        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function () {
            const result = pushState.apply(this, arguments);
            handleChange();
            return result;
        };
        history.replaceState = function () {
            const result = replaceState.apply(this, arguments);
            handleChange();
            return result;
        };

        window.addEventListener('popstate', handleChange);
        window.addEventListener('hashchange', handleChange);

        function waitForBodyThenObserve() {
            if (document.body) {
                new MutationObserver(queueCheck).observe(document.body, { childList: true, subtree: true });
            } else {
                requestAnimationFrame(waitForBodyThenObserve);
            }
        }
        waitForBodyThenObserve();
    }

    /* ------------------------------------------------------------------ */
    /* Boot                                                                */
    /* ------------------------------------------------------------------ */

    const knownHost = CDM.isKnownConfluenceHost(host);

    /*
     * Kill the white flash: on hosts we already know are Confluence, paint the
     * dark filter synchronously at document_start and let the (async) storage
     * read undo it a few milliseconds later if the user has it switched off.
     */
    if (knownHost && !shouldSkipDarkMode(location.href)) {
        applyDarkMode(false);
    }

    /*
     * On unknown hosts, look for Confluence markers while <head> is parsed.
     * Scoped to head's direct children so this stays cheap on any website.
     */
    function watchForDetection() {
        if (knownHost || detected) return;

        const check = function () {
            if (detected) return true;
            if (!detectConfluence()) return false;
            detected = true;
            reconcile(true);
            return true;
        };
        if (check()) return;

        let obs = null;
        const stop = function () {
            if (obs) { obs.disconnect(); obs = null; }
        };

        const attach = function () {
            if (!document.head) return requestAnimationFrame(attach);
            obs = new MutationObserver(function () {
                if (check()) stop();
            });
            obs.observe(document.head, { childList: true });
        };
        attach();

        document.addEventListener('DOMContentLoaded', function () {
            if (check()) return stop();
            /* Some instances render their markers with the app; give it a beat. */
            setTimeout(function () { check(); stop(); }, 1500);
        });
    }

    loadAndApply(false);
    watchForDetection();

    /* document_start runs before <head>/<body> exist — finish wiring up later. */
    document.addEventListener('DOMContentLoaded', function () {
        if (applied) {
            keepStyleAlive();
            observeEditorIframe();
            ensureStyleEl();
        }
    });

    if (darkMedia && darkMedia.addEventListener) {
        darkMedia.addEventListener('change', function () {
            if (settings.scheduleMode === 'system') reconcile(true);
        });
    }
})();
