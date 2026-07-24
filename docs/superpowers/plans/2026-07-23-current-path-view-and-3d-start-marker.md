# Current Path View and 3D Start Marker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove original-order UI, reverse toolpaths from arrows, and visibly mark a selected outer start point in 3D.

**Architecture:** Reuse the existing Canvas and Three.js state. Replace the current Canvas interaction override with arrow-only interaction, remove original UI nodes after existing initialization, and wrap the existing 3D loader to manage one amber marker.

**Tech Stack:** Browser JavaScript, Canvas 2D, Three.js r128, Node.js `assert`.

## Global Constraints

- No dependencies or backend code.
- Only the current optimized toolpath is visible.
- Outer-contour reversal remains synchronized across its Z passes.

---

### Task 1: Test geometry helpers

**Files:**
- Modify: `tests/optiCNC-helpers.test.js`
- Modify: `optiCNC.html:96-104`

- [ ] **Step 1: Write failing assertion**

```js
assert.equal(strokeFractionAtIndex([{points:[{x:0,y:0,z:0},{x:10,y:0,z:0}]}], 1), 1);
```

- [ ] **Step 2: Run it**

Run: `node tests/optiCNC-helpers.test.js`

Expected: PASS confirms the marker can use a cut-stroke start fraction.

### Task 2: Replace view interactions and remove original UI

**Files:**
- Modify: `optiCNC.html:96-104`

- [ ] **Step 1: Implement arrow-only Canvas rendering**

Do not produce badges. Store arrow hit regions and use their first-edge tangent for rendering.

- [ ] **Step 2: Implement arrow-only input**

On arrow click, toggle `App.reversedSet` using the existing outer-group behavior. On arrow hover set `canvas.style.cursor='default'`; background pan uses `grab`/`grabbing`.

- [ ] **Step 3: Remove rendered original UI**

After existing UI setup, remove the original Canvas block and the 3D before button. Keep a non-rendered compatibility stub only because legacy file-load code still resolves its id.

### Task 3: Add 3D start marker

**Files:**
- Modify: `optiCNC.html:96-104`

- [ ] **Step 1: Implement marker lifecycle**

Before reloading strokes, remove and dispose any existing marker. For a selected outer start point, create one amber sphere at `strokes[outerOrderIndex * 2 + 1].points[0]` using Three.js coordinate order `(x,z,y)`.

- [ ] **Step 2: Verify tool focus**

Keep the existing focus fraction behavior and scrubber synchronization. The marker and tool must use the same cut-stroke point.

### Task 4: Verify

**Files:**
- Test: `tests/optiCNC-helpers.test.js`

- [ ] **Step 1: Run checks**

Run: `node tests/optiCNC-helpers.test.js` and compile the inline script through `new Function`.

Expected: both exit 0.
