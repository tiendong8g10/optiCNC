# 3D Navigation and Path Marker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make 3D start-point updates visible, add Shift + left-drag pan, allow closer zoom, and correctly anchor 2D path markers.

**Architecture:** Keep the single-file application. Add small geometry helpers near the existing 3D and Canvas functions; use regenerated after-optimization strokes as the single source of truth. Add a dependency-free Node assertion script that extracts and tests the pure helpers from the HTML script.

**Tech Stack:** Browser JavaScript, Canvas 2D, Three.js r128, Node.js `assert`.

## Global Constraints

- Modify only `optiCNC.html` and one dependency-free test script.
- Preserve ordinary left-drag orbit; Shift + left-drag is the only new pan gesture.
- Do not add dependencies or backend code.

---

### Task 1: Define geometry and simulation-reset behavior

**Files:**
- Modify: `optiCNC.html:43-58, 95`
- Test: `tests/optiCNC-helpers.test.js`

**Interfaces:**
- Produces `pathMarkerAnchor(poly)` returning `{x, y, ux, uy}` for the first non-zero polyline edge.
- Produces `panTarget(target, right, up, dx, dy, radius)` returning a translated `{x, y, z}` target.
- `sim3dLoadStrokes(strokes, focusFraction)` sets `Sim3D.progress` to the supplied fraction before rendering the new strokes.
- `strokeFractionAtIndex(strokes, index)` returns the cumulative-length fraction at a stroke start.

- [ ] **Step 1: Write the failing test**

```js
assert.deepEqual(pathMarkerAnchor([{x: 0, y: 0}, {x: 0, y: 0}, {x: 10, y: 0}]), {
  x: 0, y: 0, ux: 1, uy: 0,
});
assert.deepEqual(panTarget({x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 1, z: 0}, 10, -5, 100), {
  x: -2, y: -1, z: 0,
});
assert.equal(strokeFractionAtIndex([{points:[{x:0,y:0,z:0},{x:10,y:0,z:0}]},{points:[{x:10,y:0,z:0},{x:20,y:0,z:0}]}], 1), 0.5);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/optiCNC-helpers.test.js`

Expected: FAIL because helpers do not exist.

- [ ] **Step 3: Write minimal implementation**

```js
function pathMarkerAnchor(poly) { /* return first non-zero edge origin and unit tangent */ }
function panTarget(target, right, up, dx, dy, radius) { /* translate target at radius/500 */ }
```

Add `strokeFractionAtIndex`. Make `sim3dLoadStrokes` use its optional focus fraction and synchronize the scrubber. In `recompute()`, pass the start fraction of the first outer-contour cut only after a start-point rotation; otherwise pass zero.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/optiCNC-helpers.test.js`

Expected: PASS.

### Task 2: Wire 3D controls and zoom range

**Files:**
- Modify: `optiCNC.html:44-51`
- Test: `tests/optiCNC-helpers.test.js`

**Interfaces:**
- Consumes `panTarget` from Task 1.
- Produces Shift + left-drag pan and radius-derived `minRadius` after toolpath bounds are calculated.

- [ ] **Step 1: Write the failing test**

```js
assert.equal(minCameraRadius({x: 200, y: 100, z: 20}), 2);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/optiCNC-helpers.test.js`

Expected: FAIL because `minCameraRadius` does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
function minCameraRadius(bounds) { return Math.max(0.1, Math.max(bounds.x, bounds.y, bounds.z) * 0.01); }
```

On Shift pointer movement, derive camera right/up from the camera matrix and assign `Sim3D.camState.target = panTarget(...)`. Set `minRadius` from the loaded bounds.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/optiCNC-helpers.test.js`

Expected: PASS.

### Task 3: Anchor Canvas arrows and badges to each path

**Files:**
- Modify: `optiCNC.html:58`
- Test: `tests/optiCNC-helpers.test.js`

**Interfaces:**
- Consumes `pathMarkerAnchor` from Task 1.
- Produces arrows on the first non-zero rendered segment and badges offset from that same anchor.

- [ ] **Step 1: Write the failing test**

```js
assert.deepEqual(pathMarkerAnchor([{x: 2, y: 3}, {x: 2, y: 13}]), {
  x: 2, y: 3, ux: 0, uy: 1,
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/optiCNC-helpers.test.js`

Expected: FAIL until Task 1 implementation is loaded into the test harness.

- [ ] **Step 3: Write minimal implementation**

Replace the fixed `poly[Math.min(2,...)]` marker calculation with `pathMarkerAnchor(poly)`. Render the arrow from the returned anchor and position its badge by the perpendicular unit vector.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/optiCNC-helpers.test.js`

Expected: PASS.

### Task 4: Run verification

**Files:**
- Test: `tests/optiCNC-helpers.test.js`

- [ ] **Step 1: Run automated checks**

Run: `node tests/optiCNC-helpers.test.js`

Expected: PASS with all assertions.

- [ ] **Step 2: Run static syntax check**

Run: extract the inline application script and execute `node --check` on it.

Expected: exit code 0.

- [ ] **Step 3: Manual browser smoke test**

Load `bf.cnc`, rotate the outer start point, inspect “sau tối ưu”, then verify orbit, Shift-pan, close zoom, and visible arrow/badge alignment.
