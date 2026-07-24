# 3D Navigation and Path Marker Design

## Goal

Make start-point changes visibly update the 3D simulation, add Shift + left-drag pan, permit closer zoom, and anchor toolpath direction markers to their paths.

## Scope

Only `optiCNC.html` changes. The application stays dependency-free except for its existing Three.js CDN load.

## Design

### Reload after a start-point change

`recompute()` already regenerates `Sim3D.strokesAfter` from `workingSegments`. Because the outer contour is intentionally last, resetting to global progress zero hides its changed start point. When an outer start point is changed, the 3D reload path will seek to the first outer-contour cut stroke so the visible tool immediately sits at the new start point. Other reloads still reset to global progress zero. Camera orientation remains unchanged; the target continues to fit the regenerated toolpath bounds.

### Navigation

The existing left-drag orbit remains unchanged. Holding Shift during a left-drag pans the scene by moving the camera target along camera-right and camera-up vectors. The movement scale is proportional to the active camera radius, so it stays natural at every zoom level. Pointer-capture cleanup remains shared with the existing interaction lifecycle.

### Zoom

Camera minimum radius is calculated from the loaded toolpath bounds instead of using a fixed conservative floor. This permits a closer inspection while retaining a positive lower bound and existing wheel controls.

### 2D path markers

Each direction arrow is positioned on the first usable toolpath edge and oriented from that edge's tangent. Its badge is positioned from the same anchor with a small normal offset, so its associated number remains visually attached to the path while avoiding the arrow.

## Acceptance Criteria

- Rotating the outer contour start point moves the visible 3D tool to that contour's new start position when viewing “sau tối ưu”.
- Shift + left-drag pans the 3D view; unmodified left-drag still orbits.
- The wheel can zoom closer than before without crossing the camera target.
- Direction arrows lie on and point along their represented paths; badges remain associated with the same path.

## Verification

Use a small G-code fixture with a closed outer contour. Verify generated strokes change after rotating the contour start. Verify pan, orbit, zoom range, and marker anchor geometry in a browser-level smoke check.
