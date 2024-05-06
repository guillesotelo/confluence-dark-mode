chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "run") applyDarkMode()
    if (message.action === "revert") revertDarkMode()
})

const styles = `
/* 
The content of the css file will be copied 
to the styles used by the script. 
Its purpose is just to have a separate 
file to pretify and debug stylesheet.
*/

/* --- MAIN COLOR BACKGROUND --- */
html {
    filter: invert(84%) grayscale(0%) saturate(110%) contrast(115%) brightness(110%) hue-rotate(180deg) !important;
}

html * {
    box-shadow: none !important;
}

header,
#header,
.aui-header {
    background-color: #daebff !important;
}

#header-precursor,#header-precursor * {
    background-color: #f6faff !important;
}

img,
svg,
video,
div[role=img],
*[style*="background-image"] {
    filter: invert(84%) grayscale(0%) saturate(110%) contrast(115%) brightness(110%) hue-rotate(180deg) !important;
}

.aui-header .aui-quicksearch input[type='text'], .aui-header .aui-quicksearch input[type='text'][type='text']:focus {
    background: #8e9cb3 !important;
}

/* --- SCROLLBARS --- */
::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
}

::-webkit-scrollbar-thumb {
    background-color: gray !important;
    border-radius: 6px !important;
}

::-webkit-scrollbar-thumb:hover {
    background-color: darkgray !important;
}

::-webkit-scrollbar-track {
    background: lightgray !important;
}


`

function applyDarkMode() {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelectorAll('[data-color-scheme]').forEach(element => {
        element.setAttribute('data-color-scheme', 'dark');
    });

    console.log('Confluence Dark Mode [ACTIVE]')
}

function revertDarkMode() {
    location.reload()
    console.log('Let there be light!')
}

function run() {
    chrome.storage.local.get('switchedOn', function (data) {
        const isOn = data.switchedOn === 1; // Check if lights are on
        const on = document.getElementById("on");
        const off = document.getElementById("off");

        // Switched on or first time using extension
        if (isOn || data.switchedOn === undefined) {
            applyDarkMode()
            if (on && off) {
                off.classList.remove('active')
                on.classList.add('active')
            }
        }
    })
}

run();
