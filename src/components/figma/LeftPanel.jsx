import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Circle,
} from 'lucide-react';

const leftPanelStyles = `
  .fg-left,
  .fg-left * {
    box-sizing: border-box;
  }

  .fg-left {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #dde6f1;
    background: #fdfdfd;
    overflow: hidden;
  }

  .fg-left__header {
    height: 52px;
    padding: 0 14px 0 16px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #62748e;
    flex-shrink: 0;
  }

  .fg-left__toggle {
    border: none;
    background: transparent;
    color: #94a3b8;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s ease;
  }

  .fg-left__toggle:hover {
    color: #1e293b;
  }

  .fg-left__body {
    flex: 1;
    overflow-y: auto;
    padding: 14px 0 0;
  }

  .fg-left__list {
    display: flex;
    flex-direction: column;
  }

  .fg-left__node {
    position: relative;
    min-height: 38px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .fg-left__node:hover {
    background: #f8fafc;
  }

  .fg-left__node.is-active {
    background: rgba(232, 241, 255, 0.92);
  }

  .fg-left__node.is-folder {
    margin-top: 6px;
  }

  .fg-left__activeBar {
    position: absolute;
    left: 0;
    top: 5px;
    bottom: 5px;
    width: 4px;
    border-radius: 0 999px 999px 0;
    background: #155dfc;
  }

  .fg-left__nodeInner {
    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fg-left__iconWrap {
    width: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8fa0b7;
  }

  .fg-left__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export default function LeftPanel({
  nodes = [],
  currentSegmentId,
  segmentRecords = {},
  onSelectSegment,
  isCollapsed = false,
  isPreviewExpanded = false,
  onToggleCollapse,
  onHoverStart,
  onHoverEnd,
} = {}) {
  const [folderState, setFolderState] = useState(() =>
    Object.fromEntries(
      nodes
        .filter((node) => node.type === 'folder')
        .map((node) => [node.id, node.isOpenByDefault ?? true]),
    ),
  );
  const isExpanded = !isCollapsed || isPreviewExpanded;

  const toggleFolder = (id) => {
    setFolderState((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <>
      <style>{leftPanelStyles}</style>
      <div className="fg-left" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
        <div
          className="fg-left__header"
          style={{ justifyContent: isExpanded ? 'space-between' : 'center' }}
        >
          {isExpanded && <span>Segments</span>}
          <button
            className="fg-left__toggle"
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand segments' : 'Collapse segments'}
          >
            {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>

        <div className="fg-left__body">
          <div className="fg-left__list">
            {nodes.map((node) => {
              if (node.depth > 0) {
                const parentId = node.id.split('.')[0];
                if (folderState[parentId] === false) {
                  return null;
                }
              }

              const isFolder = node.type === 'folder';
              const segmentState = segmentRecords[node.id]?.submissionState ?? 'draft';
              const isActive = currentSegmentId === node.id;
              const paddingLeft = isExpanded ? node.depth * 16 + 16 : node.depth * 18 + 12;
              const collapsedLabel = isFolder ? node.id : node.label.split(' ')[0];

              return (
                <div
                  key={node.id}
                  className={`fg-left__node${isActive ? ' is-active' : ''}${isFolder ? ' is-folder' : ''}`}
                  onClick={() => {
                    if (isFolder) {
                      toggleFolder(node.id);
                    } else {
                      onSelectSegment?.(node.id);
                    }
                  }}
                  style={{
                    paddingLeft,
                    paddingRight: isExpanded ? 18 : 10,
                  }}
                >
                  {isActive && <div className="fg-left__activeBar" />}

                  <div className="fg-left__nodeInner">
                    {isFolder ? (
                      <span className="fg-left__iconWrap">
                        {folderState[node.id] ? (
                          <ChevronDown size={isExpanded ? 15 : 13} strokeWidth={1.9} />
                        ) : (
                          <ChevronRight size={isExpanded ? 15 : 13} strokeWidth={1.9} />
                        )}
                      </span>
                    ) : (
                      <span className="fg-left__iconWrap">
                        {segmentState === 'submitted' ? (
                          <CheckCircle2 size={14} strokeWidth={1.9} color="#16c58a" />
                        ) : isActive ? (
                          <Circle size={12} strokeWidth={1.8} color="#2563eb" fill="#2563eb" />
                        ) : segmentState === 'failed' ? (
                          <AlertCircle size={14} strokeWidth={1.9} color="#f97316" />
                        ) : (
                          <Circle size={12} strokeWidth={1.8} color="#d6deea" />
                        )}
                      </span>
                    )}

                    <span
                      className="fg-left__label"
                      style={{
                        fontWeight: isFolder ? 600 : isActive ? 500 : 400,
                        color: isFolder
                          ? '#1d293d'
                          : isActive
                            ? '#1447e6'
                            : segmentState === 'failed'
                              ? '#c2410c'
                              : '#45556c',
                        fontSize: isExpanded ? (isFolder ? 14.5 : 15) : 12,
                      }}
                    >
                      {isExpanded ? node.label : collapsedLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
