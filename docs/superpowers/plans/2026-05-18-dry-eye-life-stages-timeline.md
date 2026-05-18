# Dry Eye Life Stages Segmented Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dot-based life stages timeline with a modern, highly interactive capsule segmented control featuring a fluid sliding glass background.

**Architecture:** Switch timeline HTML markup to semantic `<button>` tabs with full ARIA specifications. Add custom CSS styles for the segmented container, sliding pill, and buttons, plus detailed hardware-accelerated JS logic to calculate active tab offsets on load, click, and resize.

**Tech Stack:** HTML5 (semantic/accessible), CSS3 (Flexbox, transform transitions), Vanilla JavaScript (measurements, event listeners).

---

### Task 1: Update HTML in `index.html`

**Files:**
- Modify: [index.html](file:///x:/adamp/Documents/Dry%20Eye%20App/index.html#L65-L85)

- [ ] **Step 1: Replace timeline markup with tablist segmented container**
  Locate the timeline block on lines 65-85:
  ```html
  <div class="timeline reveal reveal-delay-1">
      <div class="timeline-node active" data-stage="teens">
          <div class="timeline-dot"></div>
          <div class="timeline-label">Children & Teens</div>
      </div>
      ...
  </div>
  ```
  Replace it with the accessibility-compliant `<button>` segmented switcher:
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

- [ ] **Step 2: Save and verify HTML changes**
  Save the file and verify the markup compiles correctly.

- [ ] **Step 3: Commit HTML changes**
  Run:
  ```bash
  git add index.html
  git commit -m "markup: update life stages timeline to semantic button tablist"
  ```

---

### Task 2: Update CSS in `styles.css`

**Files:**
- Modify: [styles.css](file:///x:/adamp/Documents/Dry%20Eye%20App/styles.css#L327-L393)

- [ ] **Step 1: Replace timeline styles with capsule switcher and sliding pill styles**
  Locate lines 327-393 in `styles.css` starting with `/* ===================== LIFE STAGES ===================== */` and ending before `/* ===================== TEAR FILM ===================== */`. Replace with:
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
      display: none;
    }
    
    .stage-tab.active {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      box-shadow: 0 4px 12px rgba(123, 150, 200, 0.2);
    }
  }
  ```

- [ ] **Step 2: Save and verify compilation of styles**
  Save `styles.css`.

- [ ] **Step 3: Commit CSS changes**
  Run:
  ```bash
  git add styles.css
  git commit -m "style: apply segmented control and sliding pill styles for dry eye life stages"
  ```

---

### Task 3: Update JavaScript in `script.js`

**Files:**
- Modify: [script.js](file:///x:/adamp/Documents/Dry%20Eye%20App/script.js#L41-L60)

- [ ] **Step 1: Replace life stages event listener logic**
  Locate lines 41-60 in `script.js` containing the `// Life Stages Timeline` block:
  ```javascript
  // Life Stages Timeline
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const stageContents = document.querySelectorAll('.stage-content');
  ...
  ```
  Replace it with the dynamic sliding pill and button active-toggle logic:
  ```javascript
  // Life Stages Timeline - Sleek Segmented Slider Control
  const stagesWrapper = document.querySelector('.stages-control-wrapper');
  const slidingPill = document.querySelector('.sliding-pill-bg');
  const stageTabs = document.querySelectorAll('.stage-tab');
  const stageContents = document.querySelectorAll('.stage-content');

  const updateSlidingPill = (activeTab) => {
    if (!slidingPill || !activeTab || !stagesWrapper) return;
    
    const leftOffset = activeTab.offsetLeft;
    const tabWidth = activeTab.offsetWidth;
    
    slidingPill.style.width = `${tabWidth}px`;
    slidingPill.style.transform = `translateX(${leftOffset}px)`;
  };

  stageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetStage = tab.dataset.stage;
      
      stageTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      updateSlidingPill(tab);

      stageContents.forEach(content => {
        if (content.id === `stage-${targetStage}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  const initialActiveTab = document.querySelector('.stage-tab.active');
  if (initialActiveTab) {
    setTimeout(() => updateSlidingPill(initialActiveTab), 100);
  }

  window.addEventListener('resize', () => {
    const currentActiveTab = document.querySelector('.stage-tab.active');
    if (currentActiveTab) {
      updateSlidingPill(currentActiveTab);
    }
  });
  ```

- [ ] **Step 2: Save and verify script execution**
  Save the file `script.js`.

- [ ] **Step 3: Commit JavaScript changes**
  Run:
  ```bash
  git add script.js
  git commit -m "feat: implement sliding pill positioning logic and active stage transitions"
  ```

---

### Task 4: Visual & Interactive Verification

**Files:**
- Test: [index.html](file:///x:/adamp/Documents/Dry%20Eye%20App/index.html)

- [ ] **Step 1: Perform visual verification in the browser**
  Load `index.html` using the browser subagent. Verify the capsule border aligns perfectly, and colors match light mode.

- [ ] **Step 2: Verify active sliding pill animation**
  Click on all four tabs sequentially and confirm:
  1. The sliding pill background follows smoothly to each tab with cubic-bezier easing.
  2. The text changes active color beautifully.
  3. The target stage content card displays corresponding statistics for the correct age group.

- [ ] **Step 3: Verify mobile layout scaling**
  Resize page width down to `480px` or a mobile aspect ratio and confirm the tabs stack into a grid or single column cleanly without layout overlap, matching the mobile stylesheet media query.
