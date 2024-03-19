const styles = `
/* 
This file is not being directly used. 
Its purpose is just to have a separate 
file to pretify and debug stylesheet 
*/

/* --- MAIN COLOR BACKGROUND --- */
html,
html * {
    background-color: #202020 !important;
    color: lightgray !important;
}

/* --- SECONDARY BACKGROUND --- */
.acs-side-bar,
.ia-fixed-sidebar,
.ia-fixed-sidebar *,
nav,
nav * {
    background-color: #2E2E30 !important;
    color: lightgray !important;
}

.ia-splitter-handle,
.ia-splitter-handle * {
    background-color: #202020 !important;
    color: lightgray !important;
}

.confluence-information-macro,
.confluence-information-macro-tip,
.output-block,
.space-tools-section {
    background-color: #000 !important;
    color: lightgray !important;
}

/* --- SIDE TOOLBAR--- */
.space-tools-section {
    background-color: #000 !important;
    color: lightgray !important;
    border-top: 1px solid #5b5b5b !important;
}

/* --- HEADERS --- */
#header-precursor,
#header,
#rte-ellipsis-menu,
.aui-header,
.aui-inline-dialog-contents,
.aui-dialog2-content,
footer {
    background-color: #2e2e30 !important;
    color: lightgray !important;
    border-bottom: 1px solid #5b5b5b !important;
}

/* --- BLUE TITLES --- */
.acs-tree-item,
.acs-side-bar a,
.acs-nav-item-label,
.acs-nav-list,
.acs-nav-sections p,
.node-title,
.acs-side-bar-flyout {
    color: #9eb7dc !important;
}

/* --- SECONDARY SECTIONS --- */
.RecentContentItem_result-item-container__iBkZU:hover,
.RecentContentItem_result-item-container__iBkZU:focus,
.aui-dropdown2 .aui-dropdown2-checkbox:not(.aui-dropdown2-disabled):hover,
.aui-dropdown2 .aui-dropdown2-radio:not(.aui-dropdown2-disabled):hover,
.aui-dropdown2 a:not(.aui-dropdown2-disabled):hover,
.aui-dropdown2 button:not(.aui-dropdown2-disabled):hover,
.aui-header .aui-dropdown2-trigger:hover,
.aui-header .aui-dropdown2-trigger.active,
#header .aui-header .aui-nav-link.active,
#header .aui-header .aui-nav-imagelink.active,
#header .aui-header .aui-nav-imagelink:focus,
#header .aui-header .aui-nav-imagelink:hover,
#header .aui-header a:focus,
#header .aui-header a:hover,
#header .aui-header a:active,
.acs-side-bar .current-item .acs-nav-item-link,
.collapsed .quick-links-section:hover,
.collapsed .advanced-links-section:hover,
.collapsed .ia-secondary-header-title.wiki .parent-item > a:hover,
.collapsed .ia-secondary-header-title.page-tree:hover,
.acs-side-bar-flyout li.acs-tree-item a:hover,
.acs-side-bar-flyout li.acs-tree-item a:focus,
li.acs-nav-item .acs-nav-item-link:hover,
li.acs-nav-item .acs-nav-item-link:focus {
    background-color: #414141 !important;
}

/* --- MAIN ELEMENTS --- */
span,
span *,
ul,
form > div {
    background-color: transparent !important;
    color: inherit !important;
}

.user-mention,
time {
    background-color: #4f4f4f !important;
    color: #cbe0ff !important;
}

th,
.panelHeader {
    background-color: #4f4f4f !important;
    border: 1px solid gray !important;
    color: #cad0da !important;
}
th * {
    background-color: #4f4f4f !important;
    color: #cad0da !important;
}

th > div > button {
    color: #cad0da !important;
}

td {
    background-color: #1e1f20 !important;
    color: lightgray !important;
    border: 1px solid #5b5b5b !important;
}

h1,
a,
a > span,
form.aui,
.checkbox > label {
    color: #648bc6 !important;
}

h2,
h3,
h4 {
    color: #cad0da !important;
}

input,
textarea {
    background-color: #5757577a !important;
}

.quick-comment-prompt {
    border: 1px solid #919191 !important;
}

/* --- BUTTONS --- */
button {
    color: #dddddd !important;
}

.button-primary,
.aui-button,
.aui-button *,
.aui-button-primary {
    background-color: #3e3e3e !important;
}

.aui-button:focus,
.aui-button:hover {
    filter: brightness(120%) !important;
}

#editor-precursor > .cell,
#editor-precursor > div,
#editor-precursor > div > div,
#editor-precursor > div > div > input
{
    background-color: white !important;
}

#breadcrumbs,
li {
    color: #dbdbdb !important;
}

.page-metadata {
    color: #dbdbdb !important;
}


/* --- SCROLLBARS --- */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-thumb {
    background-color: #3d3d3d;
    border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

::-webkit-scrollbar-track {
    background: #000;
}

:root {
    color-scheme: dark;
}
`

function applyDarkMode() {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    document.querySelectorAll('[data-color-scheme]').forEach(element => {
        element.setAttribute('data-color-scheme', 'dark');
    });

    console.log('Confluence Dark Mode [ACTIVE]')
}

applyDarkMode();