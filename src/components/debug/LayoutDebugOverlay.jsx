import { useEffect, useMemo, useRef, useState } from 'react';
import './layout-debug.css';
import {
  buildDebugLayerCatalog,
  clampLayoutDebugShellOffset,
  collectDebugDetailsForTarget,
  formatDebugName,
  layoutDebugLayerOptions,
} from './layoutDebug';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

export default function LayoutDebugOverlay({ rootRef, rootNode, enabled, screenLabel }) {
  const [activeLayer, setActiveLayer] = useState('all');
  const [panelOpen, setPanelOpen] = useState(false);
  const [hoverPreviewTarget, setHoverPreviewTarget] = useState(null);
  const [selectedTrail, setSelectedTrail] = useState([]);
  const [trailDetails, setTrailDetails] = useState([]);
  const [shellOffset, setShellOffset] = useState({ x: 0, y: 0 });
  const shellRef = useRef(null);
  const dragRef = useRef(null);
  const [registryVersion, setRegistryVersion] = useState(0);

  const root = rootNode || rootRef?.current || null;
  const layerCatalog = useMemo(() => buildDebugLayerCatalog(root), [root, registryVersion]);
  const visibleContainers =
    activeLayer === 'all'
      ? [...layerCatalog.layer1, ...layerCatalog.layer2, ...layerCatalog.layer3, ...layerCatalog.misc]
      : layerCatalog[activeLayer] || [];

  const selectedTarget = selectedTrail[selectedTrail.length - 1] || null;
  const activeTarget = hoverPreviewTarget || selectedTarget;
  const activeContainerName =
    activeTarget?.kind === 'container'
      ? activeTarget.name
      : activeTarget?.parentContainer || null;

  useEffect(() => {
    if (!enabled || !root) {
      return undefined;
    }

    root.classList.add('is-layoutDebug');
    root.dataset.debugActiveLayer = activeLayer;

    return () => {
      root.classList.remove('is-layoutDebug');
      delete root.dataset.debugActiveLayer;
      root.querySelectorAll('[data-debug-hovered="true"]').forEach((node) => node.removeAttribute('data-debug-hovered'));
    };
  }, [enabled, root, activeLayer]);

  useEffect(() => {
    if (!enabled || !root) {
      return undefined;
    }

    const observer = new MutationObserver(() => setRegistryVersion((current) => current + 1));
    observer.observe(root, { subtree: true, childList: true, attributes: true });
    return () => observer.disconnect();
  }, [enabled, root, screenLabel]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const rootTarget = selectedTrail[0];
    if (!rootTarget) {
      return;
    }

    const rootContainerName = rootTarget.kind === 'container' ? rootTarget.name : rootTarget.parentContainer;
    if (rootContainerName && !visibleContainers.includes(rootContainerName)) {
      setSelectedTrail([]);
      setTrailDetails([]);
    }
  }, [enabled, visibleContainers, selectedTrail]);

  useEffect(() => {
    if (!enabled || !root) {
      return undefined;
    }

    root.querySelectorAll('[data-debug-hovered="true"]').forEach((node) => node.removeAttribute('data-debug-hovered'));

    let activeElement = null;
    if (activeTarget?.kind === 'item' && activeTarget?.name) {
      if (activeTarget.parentContainer) {
        const parent = root.querySelector(`[data-debug-name="${activeTarget.parentContainer}"]`);
        activeElement = parent?.querySelector(`[data-debug-item="${activeTarget.name}"]`) || null;
      }
      activeElement ||= root.querySelector(`[data-debug-item="${activeTarget.name}"]`);
    } else if (activeContainerName) {
      activeElement = root.querySelector(`[data-debug-name="${activeContainerName}"]`);
    }

    if (activeElement) {
      activeElement.setAttribute('data-debug-hovered', 'true');
    }

    if (selectedTrail.length) {
      setTrailDetails(selectedTrail.map((target) => collectDebugDetailsForTarget(root, target)).filter(Boolean));
    } else {
      setTrailDetails([]);
    }

    return () => {
      root.querySelectorAll('[data-debug-hovered="true"]').forEach((node) => node.removeAttribute('data-debug-hovered'));
    };
  }, [enabled, root, activeTarget, activeContainerName, selectedTrail]);

  useEffect(() => {
    if (!enabled || !panelOpen || !shellRef.current) {
      return undefined;
    }

    const shell = shellRef.current;
    const handleWheel = (event) => {
      if (!event.shiftKey) {
        return;
      }

      const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      shell.scrollLeft += horizontalDelta;
      event.preventDefault();
    };

    shell.addEventListener('wheel', handleWheel, { passive: false });
    return () => shell.removeEventListener('wheel', handleWheel);
  }, [enabled, panelOpen]);

  useEffect(() => {
    if (!enabled || !panelOpen) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      if (!dragRef.current) {
        return;
      }

      const { startX, startY, baseX, baseY } = dragRef.current;
      setShellOffset(
        clampLayoutDebugShellOffset({
          x: baseX + (event.clientX - startX),
          y: baseY - (event.clientY - startY),
        }),
      );
    };

    const handlePointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [enabled, panelOpen]);

  if (!enabled || !root) {
    return null;
  }

  return (
    <>
      <button type="button" className="layout-debug__launcher" onClick={() => setPanelOpen((current) => !current)}>
        {panelOpen ? 'Hide debug' : 'Show debug'}
      </button>

      {panelOpen ? (
        <div
          ref={shellRef}
          className="layout-debug__shell"
          style={{ transform: `translate(${shellOffset.x}px, ${-shellOffset.y}px)` }}
        >
          <div className="layout-debug__rail">
            <aside className="layout-debug__toolbar">
              <p className="layout-debug__toolbarLabel">Inspector</p>
              <button
                type="button"
                className="layout-debug__moveHandle"
                onPointerDown={(event) => {
                  dragRef.current = {
                    startX: event.clientX,
                    startY: event.clientY,
                    baseX: shellOffset.x,
                    baseY: shellOffset.y,
                  };
                }}
              >
                Move
              </button>
              <div className="layout-debug__scrollButtons">
                <button
                  type="button"
                  className="layout-debug__scrollButton"
                  onClick={() => shellRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="layout-debug__scrollButton"
                  onClick={() => shellRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                >
                  ›
                </button>
              </div>
            </aside>

            <aside className="layout-debug__panel">
              <p className="layout-debug__panelTitle">Layout Layers</p>
              <p className="layout-debug__panelMeta">{screenLabel}</p>
              <div className="layout-debug__panelTabs">
                {layoutDebugLayerOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={cn('layout-debug__tab', activeLayer === option.id && 'is-active')}
                    onClick={() => setActiveLayer(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <ul className="layout-debug__list">
                {visibleContainers.map((containerName) => (
                  <li key={containerName}>
                    <button
                      type="button"
                      className={cn(
                        'layout-debug__listItem',
                        selectedTrail[0]?.kind === 'container' && selectedTrail[0]?.name === containerName && 'is-active',
                      )}
                      onMouseEnter={() => setHoverPreviewTarget({ kind: 'container', name: containerName })}
                      onMouseLeave={() => setHoverPreviewTarget(null)}
                      onClick={() => setSelectedTrail([{ kind: 'container', name: containerName }])}
                    >
                      {containerName}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {trailDetails.length ? (
              trailDetails.map((detail, index) => (
                <aside key={`${detail.kind}-${detail.name}-${index}`} className="layout-debug__panel is-inspector">
                  <p className="layout-debug__panelTitle">Selected Details</p>
                  <p className="layout-debug__panelLevel">Level {index + 1}</p>
                  <div className="layout-debug__details">
                    <div className="layout-debug__detailsScroll">
                      <p className="layout-debug__detailsTitle">{formatDebugName(detail.name)}</p>
                      <p className="layout-debug__detailsMeta">
                        {detail.kind.toUpperCase()} · {detail.layer.toUpperCase()}
                        {detail.parentContainer && detail.kind === 'item'
                          ? ` · parent: ${formatDebugName(detail.parentContainer)}`
                          : ''}
                      </p>
                      <ul className="layout-debug__settingsList">
                        {detail.settings.map((setting) => (
                          <li key={setting} className="layout-debug__settingsItem">
                            {setting}
                          </li>
                        ))}
                      </ul>

                      {detail.childContainers.length ? (
                        <>
                          <p className="layout-debug__subsectionTitle">Child containers</p>
                          <ul className="layout-debug__childList">
                            {detail.childContainers.map((childName) => (
                              <li key={childName}>
                                <button
                                  type="button"
                                  className={cn(
                                    'layout-debug__childItem',
                                    selectedTrail[index + 1]?.kind === 'container' &&
                                      selectedTrail[index + 1]?.name === childName &&
                                      'is-active',
                                  )}
                                  onMouseEnter={() => setHoverPreviewTarget({ kind: 'container', name: childName })}
                                  onMouseLeave={() => setHoverPreviewTarget(null)}
                                  onClick={() =>
                                    setSelectedTrail((current) => [...current.slice(0, index + 1), { kind: 'container', name: childName }])
                                  }
                                >
                                  {childName}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}

                      {detail.childItems.length ? (
                        <>
                          <p className="layout-debug__subsectionTitle">Items inside</p>
                          <ul className="layout-debug__childList">
                            {detail.childItems.map((itemName) => (
                              <li key={itemName}>
                                <button
                                  type="button"
                                  className={cn(
                                    'layout-debug__childItem',
                                    selectedTrail[index + 1]?.kind === 'item' &&
                                      selectedTrail[index + 1]?.name === itemName &&
                                      'is-active',
                                  )}
                                  onMouseEnter={() =>
                                    setHoverPreviewTarget({ kind: 'item', name: itemName, parentContainer: detail.name })
                                  }
                                  onMouseLeave={() => setHoverPreviewTarget(null)}
                                  onClick={() =>
                                    setSelectedTrail((current) => [
                                      ...current.slice(0, index + 1),
                                      { kind: 'item', name: itemName, parentContainer: detail.name },
                                    ])
                                  }
                                >
                                  {itemName}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>
                  </div>
                </aside>
              ))
            ) : (
              <aside className="layout-debug__panel is-inspector">
                <p className="layout-debug__panelTitle">Selected Details</p>
                <div className="layout-debug__details">
                  <p className="layout-debug__emptyState">
                    Click any container in the layer list to start a hierarchy trail. Each clicked child opens in a new
                    panel.
                  </p>
                </div>
              </aside>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
