/*
 * Shared constants + helpers used by the content script, the popup and the
 * service worker. Loaded as a plain script (no modules) so it works in every
 * context without a build step.
 */
(function (root) {
    'use strict';

    /* Master switch key kept as-is for backwards compatibility (1 | 0). */
    const LEGACY_KEY = 'switchedOn';
    const SETTINGS_KEY = 'cdmSettings';

    const DEFAULTS = {
        version: 2,
        theme: 'classic',
        /* Filter values. `classic` reproduces the pre-2.0 look exactly. */
        invert: 0.9,
        contrast: 1,
        brightness: 1,
        sepia: 0,
        invertImages: true,
        smoothTransition: true,
        /* Auto-enable on self-hosted Confluence instances (any domain). */
        autoDetect: true,
        /* 'always' | 'system' | 'custom' */
        scheduleMode: 'always',
        scheduleFrom: '19:00',
        scheduleTo: '07:00',
        /* Per-site overrides: { 'wiki.acme.com': true | false } */
        sites: {}
    };

    const THEMES = {
        classic: { label: 'Classic', invert: 0.9, contrast: 1, brightness: 1, sepia: 0 },
        dim: { label: 'Dim', invert: 0.84, contrast: 0.95, brightness: 1.04, sepia: 0.03 },
        deep: { label: 'Deep', invert: 0.95, contrast: 1.06, brightness: 0.98, sepia: 0 },
        amoled: { label: 'AMOLED', invert: 1, contrast: 1.12, brightness: 0.94, sepia: 0 },
        warm: { label: 'Warm', invert: 0.9, contrast: 1, brightness: 1, sepia: 0.16 }
    };

    function clamp(n, min, max, fallback) {
        n = Number(n);
        if (!isFinite(n)) return fallback === undefined ? min : fallback;
        return Math.min(max, Math.max(min, n));
    }

    /* Never trust stored data: merge over defaults and clamp every number. */
    function mergeSettings(stored) {
        const s = Object.assign({}, DEFAULTS, stored && typeof stored === 'object' ? stored : {});
        s.invert = clamp(s.invert, 0.7, 1, DEFAULTS.invert);
        s.contrast = clamp(s.contrast, 0.8, 1.4, DEFAULTS.contrast);
        s.brightness = clamp(s.brightness, 0.8, 1.2, DEFAULTS.brightness);
        s.sepia = clamp(s.sepia, 0, 0.5, DEFAULTS.sepia);
        s.sites = s.sites && typeof s.sites === 'object' ? s.sites : {};
        if (!THEMES[s.theme] && s.theme !== 'custom') s.theme = 'classic';
        if (['always', 'system', 'custom'].indexOf(s.scheduleMode) === -1) s.scheduleMode = 'always';
        return s;
    }

    /* Hosts covered out of the box — mirrors the original manifest globs. */
    function isKnownConfluenceHost(host) {
        if (!host) return false;
        host = String(host).toLowerCase();
        return (
            host === 'atlassian.net' ||
            host.endsWith('.atlassian.net') ||
            host.startsWith('confluence.')
        );
    }

    /* Resolves whether dark mode should run on a given host. */
    function isSiteEnabled(settings, host, detected) {
        if (!host) return false;
        host = String(host).toLowerCase();
        if (Object.prototype.hasOwnProperty.call(settings.sites, host)) {
            return settings.sites[host] !== false;
        }
        if (isKnownConfluenceHost(host)) return true;
        return !!(settings.autoDetect && detected);
    }

    function minutesFromTime(value, fallback) {
        const m = /^(\d{1,2}):(\d{2})$/.exec(String(value || ''));
        if (!m) return fallback;
        return (Number(m[1]) % 24) * 60 + (Number(m[2]) % 60);
    }

    /* Is the configured schedule currently asking for dark mode? */
    function isScheduleActive(settings, now, prefersDark) {
        if (settings.scheduleMode === 'system') return !!prefersDark;
        if (settings.scheduleMode !== 'custom') return true;

        const d = now || new Date();
        const current = d.getHours() * 60 + d.getMinutes();
        const from = minutesFromTime(settings.scheduleFrom, 19 * 60);
        const to = minutesFromTime(settings.scheduleTo, 7 * 60);
        if (from === to) return true;
        /* Ranges that wrap past midnight (the common case). */
        return from < to ? current >= from && current < to : current >= from || current < to;
    }

    const API = {
        LEGACY_KEY: LEGACY_KEY,
        SETTINGS_KEY: SETTINGS_KEY,
        DEFAULTS: DEFAULTS,
        THEMES: THEMES,
        clamp: clamp,
        mergeSettings: mergeSettings,
        isKnownConfluenceHost: isKnownConfluenceHost,
        isSiteEnabled: isSiteEnabled,
        isScheduleActive: isScheduleActive,
        minutesFromTime: minutesFromTime
    };

    root.CDM = API;
})(typeof self !== 'undefined' ? self : this);
