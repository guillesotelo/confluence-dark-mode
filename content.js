let mainDarkStyle = null;

let originalThemeAttr = null;
let originalColorSchemeAttr = null;

let editorIframeObserver = null;
let iframeFallbackInterval = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "run") applyDarkMode();
    if (message.action === "revert") revertDarkMode();
});

const styles = `
    /* 
        The content of the css file will be copied 
        to the styles used by the script. 
        Its purpose is just to have a separate 
        file to pretify and debug stylesheet.
    */

    /* --- MAIN COLOR BACKGROUND --- */
    html {
        filter: invert(90%) hue-rotate(180deg) !important;
    }

    html * {
        box-shadow: none !important;
        transition: .1s !important;
    }

    #header,
    .aui-header {
        background-color: #daebff !important;
    }

    #header-precursor,#header-precursor * {
        background-color: #f6faff !important;
    }

    /* --- Skip the following elements --- */
    img,
    svg,
    video,
    div[role=img],
    *[style*="background-image"],
    .aui-icon {
        filter: invert(90%) hue-rotate(180deg) !important;
    }

    *[class^="highlight"],
    .fc-state-highlight {
        filter: invert(90%) brightness(120%) hue-rotate(180deg) !important;
        border-color: transparent !important;
    }
        
    .badge {
        filter: invert(1) hue-rotate(-20deg) saturate(202%) brightness(120%) !important;
    }

    .aui-header .aui-quicksearch input[type='text'], .aui-header .aui-quicksearch input[type='text'][type='text']:focus {
        background: #8e9cb3 !important;
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
`

function tryInjectIntoEditorIframe() {
    const iframe = document.querySelector('iframe[id^="wysiwygTextarea_ifr"]');
    if (!iframe) return;

    try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc || !doc.body || doc.getElementById('dark-mode-iframe-style')) return;

        const style = doc.createElement('style');
        style.id = 'dark-mode-iframe-style';
        style.textContent = `
            body {
                background: #000;
            }
            *[class^="highlight"] {
                filter: invert(90%) brightness(120%) hue-rotate(180deg) !important;
            }
        `;
        doc.head.appendChild(style);
        console.log('[DarkMode] Editor iframe styled');
    } catch (e) {
        console.warn('[DarkMode] Could not inject into editor iframe:', e);
    }
}

function observeEditorIframe() {
    editorIframeObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.tagName === 'IFRAME' && node.id?.startsWith('wysiwyg')) {
                    node.addEventListener('load', tryInjectIntoEditorIframe);
                }
            });
        }
    });
    editorIframeObserver.observe(document.body, { childList: true, subtree: true });

    // Also periodically attempt injection (fallback for tricky delays)
    iframeFallbackInterval = setInterval(() => {
        tryInjectIntoEditorIframe();
    }, 50);

    setTimeout(() => clearInterval(iframeFallbackInterval), 5000);
}

const revertIframeStyles = () => {
    if (editorIframeObserver) {
        editorIframeObserver.disconnect();
        editorIframeObserver = null;
    }
    if (iframeFallbackInterval) {
        clearInterval(iframeFallbackInterval);
        iframeFallbackInterval = null;
    }

    document.querySelectorAll('iframe').forEach(iframe => {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const iframeStyle = doc?.getElementById('dark-mode-iframe-style');
            if (iframeStyle) iframeStyle.remove();
        } catch (e) { }
        iframe.style.filter = '';
        iframe.style.background = '';
    });
}

function applyDarkMode() {
    if (mainDarkStyle) mainDarkStyle.remove();

    mainDarkStyle = document.createElement('style');
    mainDarkStyle.textContent = styles;
    mainDarkStyle.id = 'dark-mode-main';
    document.head.appendChild(mainDarkStyle);

    // Color schemes
    if (originalThemeAttr === null) {
        originalThemeAttr = document.documentElement.getAttribute('data-theme');
    }
    if (originalColorSchemeAttr === null) {
        originalColorSchemeAttr = document.documentElement.getAttribute('data-color-scheme');
    }

    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelectorAll('[data-color-scheme]').forEach(el => {
        el.setAttribute('data-color-scheme', 'dark');
    });

    observeEditorIframe()

    console.log('Welcome to the dark side of Confluence');
}

function revertDarkMode() {
    if (mainDarkStyle) {
        mainDarkStyle.textContent = `
            html * {
                transition: .1s !important;
            }
        `
    }

    // Color schemes
    if (originalThemeAttr !== null) {
        document.documentElement.setAttribute('data-theme', originalThemeAttr);
    }

    if (originalColorSchemeAttr !== null) {
        document.querySelectorAll('[data-color-scheme]').forEach(el => {
            el.setAttribute('data-color-scheme', originalColorSchemeAttr);
        });
    }
    revertIframeStyles();

    console.log('Let there be light!')
}

function run() {
    chrome.storage.local.get('switchedOn', function (data) {
        const isOn = data.switchedOn === 1 || data.switchedOn === undefined;
        if (isOn) {
            applyDarkMode(); // run immediately at document_start
        } else {
            revertDarkMode();
        }
    });
}

run();
