# Spec: Sleek Segmented Control for Dry Eye Life Stages

**Date:** 2026-05-18  
**Feature:** Advanced Sliding Pill Segmented Control  
**Component:** Understanding Dry Eye Through Life Stages Section  
**Status:** Approved  

---

## 1. Goal
Upgrade the "Understanding Dry Eye Through Life Stages" timeline switcher to look and behave like a high-end, premium interactive control. The current design (represented as small dots on a connecting thin line) is static-looking and lacks visual signifiers showing that each stage is a clickable button. 

To solve this, we will replace the dots with a unified **Sleek Segmented Pill Control (Approach A)**. It features a sliding backdrop pill that glides smoothly behind the active segment when clicked or resized, utilizing hardware-accelerated CSS transitions.

---

## 2. Accessibility & Semantic Upgrades
To comply with premium web design guidelines and SEO best practices, the timeline will be upgraded from passive `div` containers to a semantic, accessible `tablist` architecture:
* Container uses `role="tablist"` and is labeled with `aria-label="Dry Eye Life Stages"`.
* Individual switch nodes are changed to HTML `<button>` elements with `role="tab"`.
* Active states utilize `aria-selected="true"` or `aria-selected="false"` to communicate state to screen readers.
* Associated content panels utilize corresponding `id` matching their `aria-controls` values on the tabs.

---

## 3. UI/UX Specifications

### A. The Control Container (`.stages-control-wrapper`)
* **Shape:** Perfectly rounded capsule (`border-radius: 100px` / flex-row).
* **Background:** Sleek light glass layer (`rgba(123, 150, 200, 0.06)`).
* **Border:** Clean, subtle border (`1px solid rgba(123, 150, 200, 0.15)`).
* **Max Width:** Set to a centered horizontal layout to ensure alignment and modern density.

### B. The Sliding Backplate (`.sliding-pill-bg`)
* **Positioning:** Absolute positioning within the container, layer index placed underneath the tab text (`z-index: 1`).
* **Background:** Premium vibrant blue-to-dark-blue gradient matching the site's brand styling:
  `linear-gradient(135deg, var(--primary), var(--primary-dark))`
* **Glow / Shadow:** Soft, elegant glow mimicking modern lighting:
  `0 8px 24px rgba(123, 150, 200, 0.3)`
* **Motion Easing:** Hardware-accelerated transitions utilizing a customized cubic-bezier curve:
  `transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), width 0.45s cubic-bezier(0.25, 1, 0.5, 1)`

### C. The Button Tabs (`.stage-tab`)
* **Background / Border:** Reset button defaults (`background: none; border: none; cursor: pointer; outline: none;`).
* **Active Style:** Active tab changes text color to pure white (`#FFFFFF`) with a subtle text shadow for readability.
* **Inactive Style:** Inactive tabs use `--text-dark` or slightly muted color, shifting to white on hover.
* **Hover Interaction:** Inactive tabs have micro-scale hover transitions (`transform: scale(1.03)`).
* **Responsive Layout:** On mobile/tablet viewports, the control automatically wraps or stacks into a 2x2 grid or single column with full width, keeping the sliding pill aligned beautifully.

---

## 4. Technical Proposed Changes

### HTML Modifications (`index.html`)
Update lines 65-85 in `index.html` to:
```html
<div class="stages-control-wrapper reveal reveal-delay-1">
    <div class="sliding-pill-bg"></div>
    <div class="stages-tablist" role="tablist" aria-label="Dry Eye Life Stages">
        <button class="stage-tab btn-reset active" role="tab" aria-selected="true" aria-controls="stage-teens" data-stage="teens">
            <span class="stage-tab-label">Children & Teens</span>
            <span class="stage-tab-age">Under 20</span>
        </button>
        <button class="stage-tab btn-reset" role="tab" aria-selected="false" aria-controls="stage-young" data-stage="young">
            <span class="stage-tab-label">Young Adults</span>
            <span class="stage-tab-age">20s – 30s</span>
        </button>
        <button class="stage-tab btn-reset" role="tab" aria-selected="false" aria-controls="stage-middle" data-stage="middle">
            <span class="stage-tab-label">Middle Age</span>
            <span class="stage-tab-age">40s – 50s</span>
        </button>
        <button class="stage-tab btn-reset" role="tab" aria-selected="false" aria-controls="stage-seniors" data-stage="seniors">
            <span class="stage-tab-label">Seniors</span>
            <span class="stage-tab-age">60+</span>
        </button>
    </div>
</div>
```

### CSS Modifications (`styles.css`)
Replace the `.timeline` styles (lines 327-393 in `styles.css`) with:
```css
/* ===================== SLEEK SEGMENTED SLIDER CONTROL ===================== */
.stages-control-wrapper {
  position: relative;
  max-width: 860px;
  margin: 32px auto 0;
  padding: 6px;
  background: rgba(123, 150, 200, 0.06);
  border: 1px solid rgba(123, 150, 200, 0.15);
  border-radius: 100px;
  display: flex;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
}

.sliding-pill-bg {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 0;
  width: 0;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: 80px;
  z-index: 1;
  box-shadow: 0 8px 24px rgba(123, 150, 200, 0.3);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), 
              width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  pointer-events: none;
}

.stages-tablist {
  display: flex;
  width: 100%;
  position: relative;
  z-index: 2;
}

.btn-reset {
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.stage-tab {
  flex: 1;
  padding: 14px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-dark);
  font-family: var(--font-heading);
  text-align: center;
  border-radius: 80px;
  transition: color 0.3s ease, transform 0.2s ease;
  user-select: none;
}

.stage-tab:hover {
  color: var(--primary-dark);
  transform: translateY(-1px);
}

.stage-tab.active {
  color: #FFFFFF !important;
}

.stage-tab-label {
  font-weight: 600;
  font-size: 1rem;
}

.stage-tab-age {
  font-size: 0.78rem;
  opacity: 0.75;
  margin-top: 2px;
}

.stage-tab.active .stage-tab-age {
  opacity: 0.9;
}

/* Mobile & Tablet Responsiveness */
@media (max-width: 768px) {
  .stages-control-wrapper {
    border-radius: 20px;
    padding: 8px;
    max-width: 500px;
  }
  
  .stages-tablist {
    flex-direction: column;
    gap: 8px;
  }
  
  .stage-tab {
    padding: 12px 16px;
    border-radius: 12px;
    background: rgba(123, 150, 200, 0.04);
  }
  
  .sliding-pill-bg {
    display: none; /* In grid/vertical view we fall back to a simpler clean card highlight style */
  }
  
  .stage-tab.active {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    box-shadow: 0 4px 12px rgba(123, 150, 200, 0.2);
  }
}
```

### JavaScript Modifications (`script.js`)
Update the `// Life Stages Timeline` block in `script.js` to use the dynamic `updateSlidingPill` measurements.

---

## 5. Verification Plan
* **Visual Audit:** Open in Playwright/browser, verify that the segmented control is centered, capsule-shaped, and readable in light mode.
* **Interaction Verification:** Click on all 4 buttons sequentially:
  * Check that active content panels change correctly.
  * Observe the sliding background pill moving fluidly behind the clicked tab.
* **Responsiveness Audit:** Resize the browser window. Verify that the pill adjusts position. Shrink viewport below `768px` to verify vertical block transitions cleanly without layout breakages.
