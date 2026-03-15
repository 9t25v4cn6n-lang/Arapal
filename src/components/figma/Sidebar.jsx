import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  Plus,
  Star,
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
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'create', label: 'Create', icon: Plus },
  { id: 'list', label: 'List', icon: List },
];

const secondaryItems = [
  { id: 'alerts', label: 'Alerts', icon: AlertCircle },
  { id: 'completed', label: 'Completed', icon: Check },
];

function NavButton({ label, icon: Icon, isExpanded }) {
  return (
    <button
      className={`fg-sidebar__button${isExpanded ? ' is-expanded' : ''}`}
      type="button"
      aria-label={label}
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
} = {}) {
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

        <div className="fg-sidebar__activeIndicator" />

        <div className="fg-sidebar__nav">
          {primaryItems.map((item) => (
            <NavButton key={item.id} {...item} isExpanded={isExpanded} />
          ))}

          <div className="fg-sidebar__navBottom">
            {secondaryItems.map((item) => (
              <NavButton key={item.id} {...item} isExpanded={isExpanded} />
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
