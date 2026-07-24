const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('optiCNC.html', 'utf8');
function extractFunction(name) {
  const start = source.lastIndexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Missing function ${name}`);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`Unclosed function ${name}`);
}

const context = {};
vm.createContext(context);
['dist', 'dist3', 'strokeLength', 'pathMarkerAnchor', 'panTarget', 'strokeFractionAtIndex', 'minCameraRadius', 'outerStartPoint', 'strokeSeconds', 'formatDuration', 'safeZForMaterial', 'safeRapidLine']
  .forEach(name => vm.runInContext(extractFunction(name), context));

assert.deepEqual(JSON.parse(JSON.stringify(context.pathMarkerAnchor([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 }]))), {
  x: 5, y: 0, ux: 1, uy: 0,
});
assert.deepEqual(JSON.parse(JSON.stringify(context.pathMarkerAnchor([{ x: 2, y: 3 }, { x: 2, y: 13 }]))), {
  x: 2, y: 8, ux: 0, uy: 1,
});
assert.deepEqual(JSON.parse(JSON.stringify(context.panTarget({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, 10, -5, 100))), {
  x: -2, y: -1, z: 0,
});
assert.equal(context.strokeFractionAtIndex([
  { points: [{ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0 }] },
  { points: [{ x: 10, y: 0, z: 0 }, { x: 20, y: 0, z: 0 }] },
], 1), 0.5);
assert.equal(context.minCameraRadius({ minX: 0, maxX: 200, minY: 0, maxY: 100, minZ: 0, maxZ: 20 }), 2);
assert.deepEqual(JSON.parse(JSON.stringify(context.outerStartPoint([
  { points: [{ x: 0, y: 0, z: 0 }] },
  { points: [{ x: 8, y: 9, z: -1 }] },
], 1))), { x: 8, y: 9, z: -1 });
assert.equal(context.strokeSeconds({ points: [{ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0 }], feed: 1200 }), 0.5);
assert.equal(context.formatDuration(65), '01:05');
assert.equal(context.safeZForMaterial(15, 18), 15);
assert.equal(context.safeRapidLine(15), 'G0 Z15');

console.log('optiCNC helper tests passed');
