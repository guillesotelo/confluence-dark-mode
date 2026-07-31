/* Fills the repeated mock markup so frames.html stays readable. */
(function () {
    'use strict';

    /* A believable slice of a Confluence page, in its original light colours.
       Each frame wraps this in the extension's real filter. */
    const PAGE = `
    <div class="cp">
      <div class="cp-top">
        <span class="cp-logo"></span>
        <span class="cp-nav">Spaces</span><span class="cp-nav">People</span>
        <span class="cp-nav">Apps</span><span class="cp-create">Create</span>
        <span class="cp-search"></span>
      </div>
      <div class="cp-body">
        <aside class="cp-side">
          <span class="cp-space">ENG&nbsp;&nbsp;Engineering</span>
          <span class="cp-li on">Overview</span>
          <span class="cp-li">Onboarding</span>
          <span class="cp-li">Architecture decisions</span>
          <span class="cp-li">Runbooks</span>
          <span class="cp-li">Roadmap</span>
          <span class="cp-li">Meeting notes</span>
        </aside>
        <main class="cp-main">
          <h3>Engineering Home</h3>
          <p class="cp-meta">Last updated by Ana Ruiz · 3 min read</p>
          <p>Welcome to the <a>Engineering space</a>. This page collects onboarding notes,
             architecture decisions and the current roadmap.</p>
          <div class="cp-note"><b>Note:</b> the staging cluster is rebuilt every night at 02:00 UTC.</div>
          <h4>Deploy checklist</h4>
          <table class="cp-table">
            <tr><th>Step</th><th>Owner</th><th>Status</th></tr>
            <tr><td>Migrate schema</td><td>Platform</td><td><span class="cp-badge done">Done</span></td></tr>
            <tr><td>Flip feature flag</td><td>Web</td><td><span class="cp-badge wip">In progress</span></td></tr>
          </table>
          <h4>Rollout</h4>
          <pre class="cp-code">kubectl rollout status deploy/api --timeout=120s</pre>
          <p class="cp-swatches">
            <svg width="46" height="46"><rect width="46" height="46" rx="8" fill="#e01e5a"/></svg>
            <svg width="46" height="46"><rect width="46" height="46" rx="8" fill="#2eb67d"/></svg>
            <svg width="46" height="46"><rect width="46" height="46" rx="8" fill="#ecb22e"/></svg>
            <svg width="46" height="46"><rect width="46" height="46" rx="8" fill="#36c5f0"/></svg>
            <span class="cp-caption">Brand colours stay true</span>
          </p>
        </main>
      </div>
    </div>`;

    /* The popup, exactly as it ships, with static values in place of popup.js. */
    const POPUP = `
    <div class="aurora" aria-hidden="true">
      <span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span>
    </div>
    <main class="shell">
      <header class="head">
        <img class="logo" src="../../icons/icon48.png" alt="" width="34" height="34" />
        <div class="head-text">
          <h1>Confluence Dark Mode</h1>
          <p class="sub good">Active on acme.atlassian.net</p>
        </div>
        <span class="pill">v2.0</span>
      </header>

      <section class="glass hero">
        <div class="hero-copy">
          <span class="hero-title">Dark mode</span>
          <span class="hero-sub">Enabled everywhere</span>
        </div>
        <span class="switch" aria-checked="true"><span class="knob"></span></span>
      </section>

      <section class="glass row">
        <div class="row-copy">
          <span class="row-title">acme.atlassian.net</span>
          <span class="row-sub">Atlassian site</span>
        </div>
        <span class="switch small" aria-checked="true"><span class="knob"></span></span>
      </section>

      <section class="glass block">
        <h2 class="block-title">Theme</h2>
        <div class="chips">
          <span class="chip" aria-checked="true"><span class="dot" style="background:linear-gradient(135deg,rgb(26,26,26) 50%,rgb(78,78,78) 50%)"></span>Classic</span>
          <span class="chip"><span class="dot" style="background:linear-gradient(135deg,rgb(47,47,47) 50%,rgb(91,91,90) 50%)"></span>Dim</span>
          <span class="chip"><span class="dot" style="background:linear-gradient(135deg,rgb(6,6,6) 50%,rgb(66,66,66) 50%)"></span>Deep</span>
          <span class="chip"><span class="dot" style="background:linear-gradient(135deg,rgb(0,0,0) 50%,rgb(54,54,54) 50%)"></span>AMOLED</span>
          <span class="chip"><span class="dot" style="background:linear-gradient(135deg,rgb(26,26,25) 50%,rgb(80,78,75) 50%)"></span>Warm</span>
        </div>
      </section>

      <section class="glass block">
        <div class="block-head">
          <h2 class="block-title">Fine tuning</h2>
          <span class="ghost">Reset</span>
        </div>
        <span class="slider-label">Darkness <b>90%</b></span>
        <span class="fakerange"><i style="width:67%"></i><em style="left:67%"></em></span>
        <span class="slider-label sp">Contrast <b>100%</b></span>
        <span class="fakerange"><i style="width:33%"></i><em style="left:33%"></em></span>
        <span class="slider-label sp">Warmth <b>0%</b></span>
        <span class="fakerange"><i style="width:2%"></i><em style="left:2%"></em></span>
      </section>

      <section class="glass block adv-closed">
        <div class="block-head">
          <h2 class="block-title">Advanced</h2>
          <span class="caret">⌄</span>
        </div>
      </section>

      <footer class="foot">
        <span class="kbd-hint">Toggle with <kbd>Alt</kbd><kbd>Shift</kbd><kbd>D</kbd></span>
        <span class="links"><a>Rate ★</a><a>GitHub</a></span>
      </footer>
    </main>`;

    document.querySelectorAll('[data-page]').forEach(function (el) {
        el.innerHTML = PAGE;
    });
    document.querySelectorAll('[data-mock]').forEach(function (el) {
        el.innerHTML = POPUP;
    });

    /* ?f=<frame id suffix> shows exactly one frame, sized for the screenshot. */
    const want = new URLSearchParams(location.search).get('f');
    if (want) {
        document.querySelectorAll('.frame').forEach(function (f) {
            f.style.display = f.id === 'f-' + want ? '' : 'none';
        });
        document.body.classList.add('single');
    }
})();
