export const layoutDebugLayerOptions = [
  { id: 'all', label: 'All Layers' },
  { id: 'layer1', label: 'Layer 1' },
  { id: 'layer2', label: 'Layer 2' },
  { id: 'layer3', label: 'Layer 3' },
  { id: 'misc', label: 'Misc' },
];

export function getLayoutDebugAttrs(layer, name) {
  return {
    'data-debug-layer': layer,
    'data-debug-name': name,
  };
}

export function formatDebugName(name) {
  return name.replace(/_/g, ' ');
}

function normalizeLayer(layer) {
  return ['layer1', 'layer2', 'layer3', 'misc'].includes(layer) ? layer : 'misc';
}

function collectDebugNodes(root) {
  if (!root) {
    return [];
  }

  const nodes = [];
  if (root instanceof Element && root.dataset.debugName) {
    nodes.push(root);
  }

  nodes.push(...Array.from(root.querySelectorAll('[data-debug-name]')));
  return nodes;
}

export function buildDebugLayerCatalog(root) {
  const catalog = { layer1: [], layer2: [], layer3: [], misc: [] };

  for (const node of collectDebugNodes(root)) {
    const name = node.getAttribute('data-debug-name');
    if (!name) {
      continue;
    }

    const layer = normalizeLayer(node.getAttribute('data-debug-layer') || 'misc');
    if (!catalog[layer].includes(name)) {
      catalog[layer].push(name);
    }
  }

  return catalog;
}

export function collectDebugSettings(element) {
  const styles = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return [
    `display: ${styles.display}`,
    `position: ${styles.position}`,
    `width: ${Math.round(rect.width)}px`,
    `height: ${Math.round(rect.height)}px`,
    `align-items: ${styles.alignItems || 'normal'}`,
    `justify-content: ${styles.justifyContent || 'normal'}`,
    `padding: ${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}`,
    `gap: ${styles.gap || 'normal'}`,
    `flex-direction: ${styles.flexDirection || 'row'}`,
    `grid-columns: ${styles.gridTemplateColumns !== 'none' ? styles.gridTemplateColumns : 'none'}`,
    `grid-rows: ${styles.gridTemplateRows !== 'none' ? styles.gridTemplateRows : 'none'}`,
    `text-align: ${styles.textAlign}`,
    `font-size: ${styles.fontSize}`,
    `line-height: ${styles.lineHeight}`,
  ];
}

export function collectDirectDebugChildren(element) {
  const children = Array.from(element.children);

  return {
    containers: children
      .filter((child) => child.dataset.debugName)
      .map((child) => child.dataset.debugName),
    items: children
      .filter((child) => child.dataset.debugItem)
      .map((child) => child.dataset.debugItem),
  };
}

function findDebugElement(root, target) {
  if (!root || !target?.name) {
    return null;
  }

  if (target.kind === 'item') {
    if (target.parentContainer) {
      const parent = root.querySelector(`[data-debug-name="${target.parentContainer}"]`);
      if (parent) {
        return parent.querySelector(`[data-debug-item="${target.name}"]`);
      }
    }

    return root.querySelector(`[data-debug-item="${target.name}"]`);
  }

  return root.querySelector(`[data-debug-name="${target.name}"]`);
}

export function collectDebugDetailsForTarget(root, target) {
  const element = findDebugElement(root, target);
  if (!element) {
    return null;
  }

  const parentContainer =
    target.kind === 'item'
      ? target.parentContainer || element.closest('[data-debug-name]')?.getAttribute('data-debug-name') || null
      : target.name;

  const childData = target.kind === 'container' ? collectDirectDebugChildren(element) : { containers: [], items: [] };

  return {
    kind: target.kind,
    name: target.name,
    layer:
      target.kind === 'container'
        ? normalizeLayer(element.getAttribute('data-debug-layer') || 'misc')
        : normalizeLayer(
            parentContainer
              ? root.querySelector(`[data-debug-name="${parentContainer}"]`)?.getAttribute('data-debug-layer') || 'misc'
              : 'misc',
          ),
    parentContainer,
    settings: collectDebugSettings(element),
    childContainers: childData.containers,
    childItems: childData.items,
  };
}

export function clampLayoutDebugShellOffset(nextOffset) {
  return {
    x: Math.max(-900, Math.min(900, nextOffset.x)),
    y: Math.max(-520, Math.min(520, nextOffset.y)),
  };
}
