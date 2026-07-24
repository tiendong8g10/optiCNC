# Current Path View and 3D Start Marker Design

## Goal

Keep one current-toolpath view, reverse paths by clicking direction arrows, and make an outer-contour start-point change explicit in the 3D simulation.

## Scope

Modify `optiCNC.html` and its dependency-free Node test only. No dependencies are added.

## Design

### Remove original-order UI

Delete the original-order Canvas block from the HTML. Delete the 3D “trước” button and its toggle behavior. Keep “Trước tối ưu” statistics because they are cost comparisons, not a path view. The simulator always displays the current optimized toolpath.

### Current-path interaction

Do not render order-number badges or drag targets. The Canvas keeps its background pan and wheel zoom. Each arrow retains its hit region; hovering it uses the default cursor and clicking it toggles that path's direction. For an outer contour, the existing all-Z-pass reversal rule applies.

### 3D start marker

When an outer start point is selected, add a distinct amber sphere at the first point of the first outer-contour cut stroke. Move the simulated tool to the same point and synchronize the scrubber. Regenerate and replace the marker whenever the toolpath is regenerated. The marker is disposed with other simulation geometry.

## Acceptance Criteria

- No original-order Canvas or 3D “trước” control exists in the rendered UI.
- No numbered badges appear in the current toolpath view.
- Hovering an arrow shows a default cursor; clicking reverses its path.
- Changing the outer start point visibly relocates an amber 3D marker and the tool to the new point.

## Verification

Run Node helper tests and inline JavaScript syntax validation. In a browser, load a closed outer contour, choose two start positions, and confirm the amber marker and tool relocate.
