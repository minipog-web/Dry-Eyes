# Agent Memory Log

## Milestone: Website Polish & Accessibility Implementation (June 2026)

### What Worked
- **WAI-ARIA Roles & Linkages**: Adding explicit `role="tabpanel"` and `aria-labelledby` attributes to tab content boxes solved potential screen reader navigation issues.
- **Keyboard Triggers for Interactive Cards**: Adding `keydown` listeners (`Space`/`Enter`) on elements with `tabindex="0"` and `role="button"` enabled keyboard accessibility for 3D flip cards.
- **CSS Transitions over Display Toggles**: Transitioning height/opacity instead of toggling `display: none`/`display: flex` created a smoother slide-down mobile menu transition.
- **Asset/Layout Syncing**: Automating or manually copying the optimized files to the `dist/` folder kept local previews and Netlify hosting synchronized.

### What to Avoid
- **Avoid Layout Snapping**: Avoid raw display state swaps for interactive components where custom cubic-bezier transitions can provide a luxury feel.
- **Avoid Missing Focus States**: Ensure interactive custom elements have distinct `:focus-within` and `:focus-visible` styling so keyboard navigation remains visual.

## Milestone: Google Analytics 4 (GA4) Event Tracking Optimization (June 2026)

### What Worked
- **Centralized Safe Telemetry Wrapper**: Defining a `trackEvent` check for `typeof gtag === 'function'` prevents Javascript reference errors if visitors use privacy extensions, adblockers, or when testing locally.
- **Micro-Funnel Event Mapping**: Breaking down the 7-step self-assessment quiz and the 3-step contact form with navigation events enables visual drop-off analysis directly inside Google Analytics.
- **Distribution Directory Syncing**: Ensuring that updates to source files are copied immediately to the `dist/` directory guarantees changes deploy correctly to host providers like Netlify.

