const styles = `
/* 
The content of the css file will be copied 
to the styles used by the script. 
Its purpose is just to have a separate 
file to pretify and debug stylesheet.
*/

/* --- MAIN COLOR BACKGROUND --- */
html,
html * {
    background-color: #202020 !important;
    color: #9f9f9f !important;
}

/* --- SECONDARY BACKGROUND --- */
.acs-side-bar,
.ia-fixed-sidebar,
#space-tools-menu,
header,
header * {
    background-color: #2E2E30 !important;
    color: #9f9f9f !important;
}

.ia-splitter-handle,
.ia-splitter-handle * {
    background-color: #202020 !important;
    color: #9f9f9f !important;
}

.space-tools-section {
    background-color: #000 !important;
    color: #9f9f9f !important;
}

/* --- SIDE TOOLBAR--- */
.space-tools-section {
    background-color: #000 !important;
    color: #9f9f9f !important;
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
    color: #9f9f9f !important;
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
.search-drawer-list-item:hover,
.aui-page-panel-content .default-list-view .item:hover,
li.acs-nav-item .acs-nav-item-link:focus {
    background-color: #414141 !important;
}

/* --- MAIN ELEMENTS --- */
span,
span *,
ul,
.search-drawer-list-item *,
.acs-side-bar, 
.acs-side-bar-content,
.acs-nav-list
.icon,
.ia-fixed-sidebar *,
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
    color: #b0b0b0 !important;
}
th * {
    background-color: #4f4f4f !important;
    color: #b0b0b0 !important;
}

th > div > button {
    color: #b0b0b0 !important;
}

td {
    background-color: #1e1f20 !important;
    color: #9f9f9f !important;
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
    color: #b0b0b0 !important;
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
#quick-search-query-button,
.aui-button-primary {
    background-color: #3e3e3e !important;
}

.aui-button:focus,
.aui-button:hover {
    filter: brightness(120%) !important;
}



.page-metadata {
    color: #dbdbdb !important;
}

.avatar,
.avatar-item {
    border-radius: 50% !important;
}

#editor-precursor,
#editor-precursor * {
    background-color: white !important;
}
iframe,
#editor-precursor {
    filter: brightness(.4) !important;
}



.create-dialog-location-bar {
    border-bottom: 1px solid #5e5e5e !important;
}
.template {
    border: 1px solid #5e5e5e !important;
}



#rte-toolbar {
    border-bottom: 1px solid gray !important;
}
#rte-savebar {
    border-top: 1px solid gray !important;
}

/* --- SCROLLBARS --- */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
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
    --aui-shadow1: rgba(255,255,255,0.13);
    --aui-shadow2: rgba(255,255,255,0.25);
    --aui-blanket: rgba(255,255,255,0.45);
    --aui-body-text: #f4f5f7;
    --aui-lesser-body-text: #b3bac5;
    --aui-lesser-header-text: #a5adba;
    --aui-body-background: #172b4d;
    --aui-page-background: #1E1F20;
    --aui-page-border: #5b5b5b;
    --aui-border: #5b5b5b;
    --aui-border-strong: #c6c6c6;
    --aui-focus: #6c9eff;
    --aui-link-color: #9eb7dc;
    --aui-link-decoration: none;
    --aui-link-hover-color: #a3bdff;
    --aui-link-active-color: #4f81d3;
    --aui-link-hover-decoration: underline;
    --aui-link-visited-color: #b8a5ff;
    --aui-itemheading-text: #b3bac5;
    --aui-item-bg: transparent;
    --aui-item-text: #b3bac5;
    --aui-item-focus-bg: rgba(255,255,255,0.08);
    --aui-item-focus-text: #b3bac5;
    --aui-item-active-text: #9eb7dc;
    --aui-item-active-bg: #2E2E30;
    --aui-item-selected-bg: var(--aui-item-focus-bg);
    --aui-item-selected-text: var(--aui-item-focus-text);
    --aui-item-disabled-bg: transparent;
    --aui-item-disabled-text: #a5adba;
    --aui-tooltip-bg-color: rgba(255,255,255,0.9);
    --aui-tooltip-border-color: rgba(255,255,255,0.9);
    --aui-tooltip-content-text-color: #1E1F20;
    --aui-tooltip-title-text-color: #fff;
    --aui-help-color: #bdbdbd;
    --aui-badge-bg-color: rgba(255,255,255,0.13);
    --aui-badge-text-color: #f4f5f7;
    --aui-badge-primary-bg-color: #648bc6;
    --aui-badge-primary-text-color: #fff;
    --aui-badge-added-bg-color: #002800;
    --aui-badge-addded-text-color: #abe098;
    --aui-badge-removed-bg-color: #440000;
    --aui-badge-removed-text-color: #ffb6b6;
    --aui-badge-important-bg-color: #ff2400;
    --aui-badge-important-text-color: #fff;
    --aui-badge-on-blue-text-color: #fff;
    --aui-badge-on-blue-bg-color: hsla(0,0%,100%,0.25);
    --aui-lozenge-bg-color: #b3bac5;
    --aui-lozenge-text-color: #f4f5f7;
    --aui-lozenge-subtle-bg-color: #5b5b5b;
    --aui-lozenge-subtle-text-color: #b3bac5;
    --aui-lozenge-success-bg-color: #00875a;
    --aui-lozenge-success-text-color: #fff;
    --aui-lozenge-success-subtle-bg-color: #006644;
    --aui-lozenge-success-subtle-text-color: #fff;
    --aui-lozenge-current-bg-color: #648bc6;
    --aui-lozenge-current-text-color: #fff;
    --aui-lozenge-current-subtle-bg-color: #2E2E30;
    --aui-lozenge-current-subtle-text-color: #fff;
    --aui-lozenge-moved-bg-color: #ffb300;
    --aui-lozenge-moved-text-color: #1E1F20;
    --aui-lozenge-moved-subtle-bg-color: #ffd34d;
    --aui-lozenge-moved-subtle-text-color: #1E1F20;
    --aui-lozenge-error-bg-color: #ff2400;
    --aui-lozenge-error-text-color: #fff;
    --aui-lozenge-error-subtle-bg-color: #5b5b5b;
    --aui-lozenge-error-subtle-text-color: #ff8080;
    --aui-lozenge-new-bg-color: #bdbdbd;
    --aui-lozenge-new-text-color: #1E1F20;
    --aui-lozenge-new-subtle-bg-color: #b3bac5;
    --aui-lozenge-new-subtle-text-color: #1E1F20;
    --aui-message-info-bg-color: #648bc6;
    --aui-message-info-icon-color: #0052cc;
    --aui-message-info-text-color: #f4f5f7;
    --aui-message-success-bg-color: #00875a;
    --aui-message-success-icon-color: #36b37e;
    --aui-message-success-text-color: #f4f5f7;
    --aui-message-warning-bg-color: #ffb300;
    --aui-message-warning-icon-color: #ffab00;
    --aui-message-warning-text-color: #f4f5f7;
    --aui-message-error-bg-color: #ff2400;
    --aui-message-error-icon-color: #ff5630;
    --aui-message-error-text-color: #f4f5f7;
    --aui-message-change-bg-color: #bdbdbd;
    --aui-message-change-icon-color: #5243aa;
    --aui-message-change-text-color: #f4f5f7;
    --aui-banner-error-bg-color: #ff2400;
    --aui-banner-error-text-color: #fff;
    --aui-flag-bg-color: var(--aui-dropdown-bg-color);
    --aui-flag-info-color: #0052cc;
    --aui-flag-success-color: #36b37e;
    --aui-flag-warning-color: #ffab00;
    --aui-flag-error-color: #ff5630;
    --aui-button-default-bg-color: rgba(255,255,255,0.08);
    --aui-button-default-text-color: #f4f5f7;
    --aui-button-default-hover-bg-color: rgba(255,255,255,0.13);
    --aui-button-default-active-bg-color: #94a3b8;
    --aui-button-default-active-text-color: #99d6ff;
    --aui-button-default-selected-bg-color: #73819e;
    --aui-button-default-selected-text-color: #fff;
    --aui-button-default-disabled-bg-color: rgba(255, 255, 255, 0.04);
    --aui-button-default-disabled-text-color: #6e7989;
    --aui-button-primary-bg-color: #0077ff;
    --aui-button-primary-text-color: #fff;
    --aui-button-primary-hover-bg-color: #1a8cff;
    --aui-button-primary-active-bg-color: #0077ff;
    --aui-button-primary-active-text-color: #fff;
    --aui-button-primary-disabled-bg-color: var(--aui-button-default-disabled-bg-color);
    --aui-button-primary-disabled-text-color: var(--aui-button-default-disabled-text-color);
    --aui-button-light-bg-color: #2e3847;
    --aui-button-subtle-text-color: #b3bac5;
    --aui-label-text-color: inherit;
    --aui-label-link-color: inherit;
    --aui-label-bg-color: #2e3847;
    --aui-label-hover-bg-color: #2e3847;
    --aui-label-close-hover-bg-color: #ffbdad;
    --aui-label-close-hover-text-color: #94a3b8;
    --aui-form-placeholder-text-color: #94a3b8;
    --aui-form-placeholder-disabled-text-color: #6e7989;
    --aui-form-label-text-color: #73819e;
    --aui-form-error-text-color: #ff675c;
    --aui-form-description-text-color: #73819e;
    --aui-form-disabled-field-bg-color: #2e3847;
    --aui-form-disabled-field-text-color: #4d5768;
    --aui-form-disabled-field-label-color: #4d5768;
    --aui-form-field-border-color: #4d5768;
    --aui-form-field-hover-border-color: #4d5768;
    --aui-form-field-default-text-color: #dfe1e6;
    --aui-form-field-default-bg-color: #303c49;
    --aui-form-field-hover-text-color: var(--aui-form-field-default-text-color);
    --aui-form-field-hover-bg-color: #404d5b;
    --aui-form-field-focus-bg-color: #2e3847;
    --aui-form-select-bg-color: #404d5b;
    --aui-form-select-border-color: #4d5768;
    --aui-form-select-hover-bg-color: #2e3847;
    --aui-form-checkbox-radio-hover-bg-color: #1a8cff;
    --aui-form-checkbox-radio-active-bg-color: #73819e;
    --aui-form-optgroup-text-color: #94a3b8;
    --aui-form-optgroup-bg-color: #2e3847;
    --aui-form-option-bg-color: #404d5b;
    --aui-form-pre-bg-color: #2e3847;
    --aui-form-field-autofilled-bg-color: #403294;
    --aui-form-field-autofilled-border-color: #6554c0;
    --aui-form-field-autofilled-text-color: #403294;
    --aui-form-glyph-disabled-icon-color: #6e7989;
    --aui-form-glyph-disabled-fill-color: rgba(255, 255, 255, 0.04);
    --aui-form-glyph-icon-color: #0077ff;
    --aui-form-glyph-fill-color: #dfe1e6;
    --aui-form-checkbox-active-bg-color: #73819e;
    --aui-form-checkbox-active-border-color: #73819e;
    --aui-form-checkbox-active-icon-color: #0077ff;
    --aui-form-radio-unchecked-bg-color: #303c49;
    --aui-form-radio-unchecked-border-color: #4d5768;
    --aui-form-radio-unchecked-hover-bg-color: #404d5b;
    --aui-form-radio-unchecked-hover-border-color: #4d5768;
    --aui-toggle-default-bg-color: #73819e;
    --aui-toggle-default-bg-hover-color: #94a3b8;
    --aui-toggle-button-color: #fff;
    --aui-toggle-on-color: #1aff80;
    --aui-toggle-on-hover-color: #47ffae;
    --aui-toggle-disabled-overlay-color: hsla(0, 0%, 0%, 0.5);
    --aui-toggle-tick-color: #fff;
    --aui-toggle-cross-color: #fff;
    --aui-form-notification-info-color: #94a3b8;
    --aui-form-notification-error-color: var(--aui-message-error-icon-color);
    --aui-form-notification-success-color: var(--aui-message-success-icon-color);
    --aui-progressbar-color: #768595;
    --aui-progressbar-track-color: rgba(255, 255, 255, 0.13);
    --aui-spinner-color: #768595;
    --aui-nav-pagination-text-color: #dfe1e6;
    --aui-nav-pagination-active-text-color: #5e6c84;
    --aui-appheader-bg-color: #002a68;
    --aui-appheader-text-color: #fff;
    --aui-appheader-item-focus-bg-color: rgba(255, 255, 255, 0.48);
    --aui-appheader-item-focus-text-color: #fff;
    --aui-appheader-item-active-bg-color: rgba(255, 255, 255, 0.48);
    --aui-appheader-item-active-text-color: #fff;
    --aui-appheader-quicksearch-bg-color: rgba(255, 255, 255, 0.48);
    --aui-appheader-quicksearch-border-color: transparent;
    --aui-appheader-quicksearch-text-color: #fff;
    --aui-appheader-quicksearch-focus-bg-color: var(--aui-appheader-quicksearch-bg-color);
    --aui-appheader-quicksearch-focus-text-color: #fff;
    --aui-sidebar-icon-color: #dfe1e6;
    --aui-sidebar-toggle-icon-color: #dfe1e6;
    --aui-sidebar-bg-color: #303c49;
    --aui-sidebar-dropdown-arrow-color: #dfe1e6;
    --aui-sidebar-tooltip-bg-color: rgba(255, 255, 255, 0.95);
    --aui-sidebar-badge-bg-color: #444b56;
    --aui-sidebar-badge-text-color: inherit;
    --aui-tabs-tab-border-color: #303c49;
    --aui-tabs-tab-text-color: #768595;
    --aui-tabs-tab-hover-text-color: #62c2ff;
    --aui-tabs-tab-active-border-color: #0077ff;
    --aui-tabs-tab-active-text-color: #0077ff;
    --aui-progress-tracker-step-border-color: #303c49;
    --aui-progress-tracker-container-color: #303c49;
    --aui-progress-tracker-current-step-color: #94d0ff;
    --aui-progress-tracker-current-step-text-color: var(--aui-progress-tracker-visited-step-text-color);
    --aui-progress-tracker-visited-step-text-color: #dfe1e6;
    --aui-progress-tracker-visited-step-hover-text-color: #0077ff;
    --aui-progress-tracker-visited-step-active-text-color: #002a68;
    --aui-progress-tracker-future-step-color: #5e6c84;
    --aui-progress-tracker-future-step-text-color: #a5adba;
    --aui-table-row-bg-color: transparent;
    --aui-table-row-text-color: #dfe1e6;
    --aui-table-header-bg-color: transparent;
    --aui-table-heading-text-color: #b3bac5;
    --aui-table-border-color: #303c49;
    --aui-table-caption-bg-color: #303c49;
    --aui-table-caption-text-color: #94a3b8;
    --aui-table-list-row-hover-color: rgba(255, 255, 255, 0.08);
    --aui-table-list-row-subtle-color: #6e7989;
    --aui-table-sortable-hover-bg-color: rgba(255, 255, 255, 0.08);
    --aui-table-sortable-active-bg-color: #94a3b8;
    --aui-table-sortable-active-border-color: #002a68;
    --aui-table-sortable-active-text-color: #002a68;
    --aui-table-sortable-selected-bg-color: transparent;
    --aui-table-sortable-selected-border-color: #444b56;
    --aui-table-sortable-selected-text-color: #768595;
    --aui-restfultable-row-focused-border-color: #6e7989;
    --aui-restfultable-row-create-border-color: #303c49;
    --aui-restfultable-row-editable-hover-bg-color: var(--aui-form-field-hover-bg-color);
    --aui-restfultable-error-text-color: var(--aui-form-notification-error-color);
    --aui-restfultable-header-row-bg-color: #2e3847;
    --aui-restfultable-header-row-text-color: #73819e;
    --aui-restfultable-row-moving-bg-color: #303c49;
    --aui-restfultable-editable-em-text-color: #5e6c84;
    --aui-restfultable-row-active-bg-color: #303c49;
    --aui-restfultable-row-hover-bg-color: #303c49;
    --aui-dropdown-bg-color: #fff;
    --aui-dropdown-border-color: #dfe1e6;
    --aui-select2-placeholder-text-color: #94a3b8;
    --aui-select2-chosen-bg-color: #fff;
    --aui-select2-chosen-text-color: #dfe1e6;
    --aui-select2-chosen-hover-bg-color: #fff;
    --aui-select2-chosen-hover-text-color: #dfe1e6;
    --aui-select2-active-chosen-bg-color: #303c49;
    --aui-select2-active-chosen-text-color: #dfe1e6;
    --aui-select2-field-default-bg-color: var(--aui-form-select-bg-color);
    --aui-select2-field-border-color: var(--aui-form-select-border-color);
    --aui-select2-field-hover-bg-color: var(--aui-form-select-hover-bg-color);
    --aui-select2-drop-bg-color: var(--aui-dropdown-bg-color);
    --aui-dialog-bg-color: #fff;
    --aui-dialog-border-color: #5e5e5e;
    --aui-dialog-header-bg-color: var(--aui-dialog-bg-color);
    --aui-dialog-header-warning-bg-color: #ff675c;
    --aui-dialog-header-warning-text-color: #fff;
    --aui-dialog-button-hover-border-color: #444b56;
    --aui-dialog-footer-hint-text-color: #dfe1e6;
    --aui-inline-dialog-bg-color: var(--aui-dropdown-bg-color);
    --aui-inline-dialog-border-color: var(--aui-dropdown-border-color);
    --aui-datepicker-panel-bg-color: #fff;
    --aui-datepicker-panel-divider-color: #dfe1e6;
    --aui-datepicker-heading-bg-color: #2e3847;
    --aui-datepicker-heading-text-color: #dfe1e6;
    --aui-datepicker-heading-weekdays-text-color: #a5adba;
    --aui-datepicker-option-bg-color: transparent;
    --aui-datepicker-option-text-color: #94d0ff;
    --aui-datepicker-option-focus-bg-color: #2e3847;
    --aui-datepicker-option-focus-text-color: #94d0ff;
    --aui-datepicker-option-selected-bg-color: #0077ff;
    --aui-datepicker-option-selected-text-color: #fff;
    --aui-datepicker-option-unselectable-bg-color: #2e3847;
    --aui-datepicker-option-unselectable-text-color: #6e7989;
    --aui-datepicker-disabled-text-color: #6e7989;
    --aui-datepicker-hint-text-color: #b3bac5;
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