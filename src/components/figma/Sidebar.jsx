import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  List,
  Plus,
  Star,
  SplitSquareVertical,
} from 'lucide-react';

const sidebarStyles = `
  .fg-sidebar,
  .fg-sidebar * {
    box-sizing: border-box;
  }

  .fg-sidebar {
    width: 100%;
    height: 100%;
    min-height: 0;
    position: relative;
    border-right: 1px solid #dbe4f0;
    background: rgba(249, 250, 251, 0.56);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .fg-sidebar__brandShell {
    width: 100%;
    height: 88px;
    padding: 20px 10px 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-shrink: 0;
  }

  .fg-sidebar__brandShell.is-expanded {
    justify-content: space-between;
    padding-left: 18px;
    padding-right: 14px;
  }

  .fg-sidebar__brand {
    font-size: 22px;
    line-height: 30px;
    font-weight: 700;
    font-family: Georgia, "Times New Roman", serif;
    color: #155dfc;
  }

  .fg-sidebar__toggle {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #94a3b8;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-sidebar__toggle:hover {
    background: #eff6ff;
    color: #155dfc;
  }

  .fg-sidebar__nav {
    width: 100%;
    flex: 1;
    padding: 0 10px 22px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #a1aec1;
  }

  .fg-sidebar__navBottom {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .fg-sidebar__button {
    width: 100%;
    height: 40px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 0 10px;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-sidebar__button.is-expanded {
    justify-content: flex-start;
  }

  .fg-sidebar__button:hover {
    background: #eff6ff;
    color: #155dfc;
  }

  .fg-sidebar__button.is-active {
    background: rgba(239, 246, 255, 0.92);
    color: #155dfc;
  }

  .fg-sidebar__buttonLabel {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .fg-sidebar__activeIndicator {
    position: absolute;
    top: 214px;
    right: -1px;
    width: 4px;
    height: 44px;
    border-radius: 999px 0 0 999px;
    background: #155dfc;
    box-shadow: 0 0 0 1px rgba(21, 93, 252, 0.04);
  }

  .fg-sidebar__avatar {
    width: 100%;
    height: 40px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: #155dfc;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 0 10px;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-sidebar__avatar.is-expanded {
    justify-content: flex-start;
  }

  .fg-sidebar__avatar:hover {
    background: #eff6ff;
  }

  .fg-sidebar__avatarBadge {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #155dfc;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

const primaryItems = [
  { id: 'home', label: 'Project Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: List },
  { id: 'study', label: 'Study Workspace', icon: BookOpen },
  { id: 'segmentation', label: 'Source + Segmentation', icon: SplitSquareVertical },
  { id: 'exams', label: 'Exams', icon: ClipboardList },
];

const secondaryItems = [
  { id: 'alerts', label: 'Review Queue', icon: AlertCircle },
  { id: 'completed', label: 'Completed', icon: Check },
];

function NavButton({ id, label, icon: Icon, isExpanded, isActive = false, onSelect }) {
  return (
    <button
      className={`fg-sidebar__button${isExpanded ? ' is-expanded' : ''}${isActive ? ' is-active' : ''}`}
      type="button"
      aria-label={label}
      onClick={() => onSelect?.(id)}
    >
      <Icon size={21} strokeWidth={1.8} />
      {isExpanded && <span className="fg-sidebar__buttonLabel">{label}</span>}
    </button>
  );
}

export default function Sidebar({
  isExpanded = false,
  onToggleExpand,
  onHoverStart,
  onHoverEnd,
  items = primaryItems,
  secondaryNavItems = secondaryItems,
  activeId = 'study',
  onSelect,
} = {}) {
  const allItems = [...items, ...secondaryNavItems];
  const activeIndex = Math.max(0, allItems.findIndex((item) => item.id === activeId));
  const activeTop = 214 + activeIndex * 50;

  return (
    <>
      <style>{sidebarStyles}</style>
      <div className="fg-sidebar" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
        <div className={`fg-sidebar__brandShell${isExpanded ? ' is-expanded' : ''}`}>
          <div className="fg-sidebar__brand">A</div>
          <button
            className="fg-sidebar__toggle"
            type="button"
            aria-label={isExpanded ? 'Collapse navigation rail' : 'Expand navigation rail'}
            onClick={onToggleExpand}
          >
            {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <div className="fg-sidebar__activeIndicator" style={{ top: activeTop }} />

        <div className="fg-sidebar__nav">
          {items.map((item) => (
            <NavButton
              key={item.id}
              {...item}
              isExpanded={isExpanded}
              isActive={item.id === activeId}
              onSelect={onSelect}
            />
          ))}

          <div className="fg-sidebar__navBottom">
            {secondaryNavItems.map((item) => (
              <NavButton
                key={item.id}
                {...item}
                isExpanded={isExpanded}
                isActive={item.id === activeId}
                onSelect={onSelect}
              />
            ))}

            <button
              className={`fg-sidebar__avatar${isExpanded ? ' is-expanded' : ''}`}
              type="button"
              aria-label="Profile"
            >
              <span className="fg-sidebar__avatarBadge">N</span>
              {isExpanded && <span className="fg-sidebar__buttonLabel">Profile</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
