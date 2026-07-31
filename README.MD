# Confluence Dark Mode (Chrome Extension)

Turn Confluence dark — on Atlassian Cloud *and* on self-hosted instances — without waiting for Atlassian to ship it.

## Features

- **Instant dark mode** on `*.atlassian.net` and `confluence.*` domains, applied before the page paints (no white flash).
- **Self-hosted Confluence support.** Instances on your own domain (`wiki.acme.com`, `docs.internal.dev`, …) are detected automatically, and any page can be added by hand from the popup.
- **Five themes** — Classic, Dim, Deep, AMOLED and Warm — plus darkness, contrast and warmth sliders for your own.
- **Per-site control.** Turn it on or off for one site without touching the rest.
- **Scheduling.** Always on, in step with your system theme, or between two times of day.
- **Keyboard shortcut.** <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>D</kbd> toggles it from anywhere; rebind at `chrome://extensions/shortcuts`.
- **Images, diagrams and logos keep their real colours**, and PDF/Office previews are left alone.
- No accounts, no tracking, no network requests. Settings live in `chrome.storage.local`.

## Local installation

1. Clone this repository:

   ```bash
   git clone https://github.com/guillesotelo/confluence-dark-mode.git
   ```

2. Go to [`chrome://extensions`](chrome://extensions/), enable **Developer mode** and click **Load unpacked**, then pick the cloned folder.
3. Open a Confluence page and you're done.

## How it works

The whole theme is a single CSS filter on `<html>` (`invert` + `hue-rotate`), with the exact inverse re-applied to images, videos and SVGs so media renders as authored. Filter amounts are driven by CSS custom properties, so moving a slider repaints instantly.

| File | Role |
| --- | --- |
| `content.js` | Decides whether a page is Confluence, injects and removes the theme, follows SPA navigation. |
| `shared.js` | Defaults, theme presets, host matching and schedule logic shared by every context. |
| `background.js` | Keyboard shortcut, toolbar badge, first-run defaults. |
| `popup.*` | The settings UI. |

Settings changes propagate through `chrome.storage.onChanged`, so **every open tab updates at once** — no reload needed.

## Contributing

Bug reports and pull requests are welcome. If something on your Confluence instance renders badly, an issue with a screenshot and the affected selector is the fastest way to get it fixed.

Questions or suggestions: [open an issue](https://github.com/guillesotelo/confluence-dark-mode/issues) or [email me](mailto:guille.sotelo.cloud@gmail.com).
