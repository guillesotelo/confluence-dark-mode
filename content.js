const applyDarkMode = () => {
        const styles = `
        html {
            background-color: #1e1e1e !important;
            color: #fff !important;
        }
        body {
            background-color: #1e1e1e !important;
            color: #fff !important;
        }
        #main {
            background-color: #1e1e1e !important;
            color: #fff !important;
        }
        #main-content {
            background-color: #1e1e1e !important;
            color: #fff !important;
        }
        td {
            background-color: #1e1e1e !important;
            color: #fff !important;
        }
        .acs-side-bar, 
        .ia-scrollable-section {
            background-color: #1e1e1e !important;
            color: #fff !important;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

document.addEventListener('DOMContentLoaded', applyDarkMode);