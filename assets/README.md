# Chrome Web Store assets

Ready to upload in the developer dashboard. All PNG, at the exact sizes the store requires.

| File | Size | Where it goes |
| --- | --- | --- |
| `screenshot-1-hero.png` | 1280×800 | Screenshots (up to 5, first one is the thumbnail) |
| `screenshot-2-themes.png` | 1280×800 | Screenshots |
| `screenshot-3-self-hosted.png` | 1280×800 | Screenshots |
| `screenshot-4-control.png` | 1280×800 | Screenshots |
| `promo-tile-small-440x280.png` | 440×280 | Small promo tile — required to be listed in the store |
| `promo-tile-marquee-1400x560.png` | 1400×560 | Marquee promo tile — only used if you're featured |

## Regenerating

The frames are real HTML rendered by headless Chrome, and the popup shown in them
is the shipping [`popup.css`](../popup.css) — so re-running the build after a UI
change keeps the store listing honest.

```bash
./assets/src/build.sh
```

Needs Google Chrome and Python 3. Override the browser path with `CHROME=…` if
yours lives somewhere else.

Sources live in [`src/`](src/): `frames.html` (layout of all six frames),
`frames.css` (frame styling and the mock Confluence page), `frames.js` (the
repeated mock markup). Open `src/frames.html?f=hero` in a browser to preview a
single frame — the ids are `hero`, `themes`, `selfhosted`, `control`,
`tile-small` and `tile-marquee`.
