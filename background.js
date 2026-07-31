/*
 * Service worker: keyboard shortcut, toolbar badge and first-run defaults.
 * Everything else flows through chrome.storage, which the content scripts
 * watch directly, so no tab messaging (and no extra permissions) is needed.
 */
importScripts('shared.js');

const CDM = self.CDM;

function paintBadge(isOn) {
    /* Only badge the "off" state — a permanent badge is visual noise. */
    chrome.action.setBadgeText({ text: isOn ? '' : 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
    chrome.action.setTitle({
        title: isOn ? 'Confluence Dark Mode — on' : 'Confluence Dark Mode — off'
    });
}

function refreshBadge() {
    chrome.storage.local.get(CDM.LEGACY_KEY, function (data) {
        paintBadge(data[CDM.LEGACY_KEY] === 1 || data[CDM.LEGACY_KEY] === undefined);
    });
}

chrome.runtime.onInstalled.addListener(function (details) {
    chrome.storage.local.get([CDM.LEGACY_KEY, CDM.SETTINGS_KEY], function (data) {
        const patch = {};
        /* Preserve the existing on/off choice; only seed it on a fresh install. */
        if (data[CDM.LEGACY_KEY] === undefined) patch[CDM.LEGACY_KEY] = 1;
        if (!data[CDM.SETTINGS_KEY]) patch[CDM.SETTINGS_KEY] = CDM.mergeSettings(null);
        if (Object.keys(patch).length) chrome.storage.local.set(patch);
        refreshBadge();
    });

    if (details && details.reason === 'install') {
        chrome.tabs.create({ url: 'welcome.html' });
    }
});

chrome.runtime.onStartup.addListener(refreshBadge);

chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === 'local' && changes[CDM.LEGACY_KEY]) {
        const v = changes[CDM.LEGACY_KEY].newValue;
        paintBadge(v === 1 || v === undefined);
    }
});

chrome.commands.onCommand.addListener(function (command) {
    if (command !== 'toggle-dark-mode') return;
    chrome.storage.local.get(CDM.LEGACY_KEY, function (data) {
        const isOn = data[CDM.LEGACY_KEY] === 1 || data[CDM.LEGACY_KEY] === undefined;
        chrome.storage.local.set({ [CDM.LEGACY_KEY]: isOn ? 0 : 1 });
    });
});

refreshBadge();
