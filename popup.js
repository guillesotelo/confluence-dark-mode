document.addEventListener("DOMContentLoaded", function () {
    const switchButton = document.getElementById("switchButton")
    if (switchButton) {
        chrome.storage.local.get('switchedOn', function (data) {
            const isOn = data.switchedOn === 1
            const on = document.getElementById("on")
            const off = document.getElementById("off")

            // Switched on or first time using extension
            if (isOn || data.switchedOn === undefined) {
                off.classList.remove('active')
                on.classList.add('active')
            } else {
                on.classList.remove('active')
                off.classList.add('active')
            }

            switchButton.addEventListener("click", function () {
                const isOn = on.classList.contains('active')
                if (isOn) {
                    on.classList.remove('active')
                    off.classList.add('active')
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "revert" })
                    })
                }
                else {
                    off.classList.remove('active')
                    on.classList.add('active')
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "run" })
                    })
                }

                const newValue = isOn ? 0 : 1;
                chrome.storage.local.set({ switchedOn: newValue });
            })
        })
    }
})