import { BookOpen, Home, Star, Plus, List, AlertCircle, Check } from 'lucide-react';

const sidebarStyles = `
  .fg-sidebar,
  .fg-sidebar * {
    box-sizing: border-box;
  }

  .fg-sidebar {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    flex: 0 0 auto;
    position: relative;
    border-right: 1px solid #dbe4f0;
    background: rgba(249, 250, 251, 0.56);
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
  }

  .fg-sidebar__brandShell {
    width: 100%;
    height: 88px;
    padding-top: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-shrink: 0;
  }

  .fg-sidebar__brand {
    font-size: 22px;
    line-height: 30px;
    font-weight: 700;
    font-family: Georgia, "Times New Roman", serif;
    color: #155dfc;
  }

  .fg-sidebar__nav {
    width: 100%;
    flex: 1;
    padding: 0 0 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
    color: #a1aec1;
  }

  .fg-sidebar__navBottom {
    width: 100%;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
  }

  .fg-sidebar__button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-sidebar__button:hover {
    background: #eff6ff;
    color: #155dfc;
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
    width: 36px;
    height: 36px;
    margin-top: 10px;
    border: none;
    border-radius: 6px;
    background: #155dfc;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

export default function Sidebar() {
  return (
    <>
      <style>{sidebarStyles}</style>
      <div className="fg-sidebar">
        <div className="fg-sidebar__brandShell">
          <div className="fg-sidebar__brand">A</div>
        </div>

        <div className="fg-sidebar__activeIndicator" />

        <div className="fg-sidebar__nav">
          <button className="fg-sidebar__button" type="button" aria-label="Library">
            <BookOpen size={21} strokeWidth={1.8} />
          </button>
          <button className="fg-sidebar__button" type="button" aria-label="Home">
            <Home size={21} strokeWidth={1.8} />
          </button>
          <button className="fg-sidebar__button" type="button" aria-label="Favorites">
            <Star size={21} strokeWidth={1.8} />
          </button>
          <button className="fg-sidebar__button" type="button" aria-label="Create">
            <Plus size={21} strokeWidth={1.8} />
          </button>
          <button className="fg-sidebar__button" type="button" aria-label="List">
            <List size={21} strokeWidth={1.8} />
          </button>

          <div className="fg-sidebar__navBottom">
            <button className="fg-sidebar__button" type="button" aria-label="Alerts">
              <AlertCircle size={21} strokeWidth={1.8} />
            </button>
            <button className="fg-sidebar__button" type="button" aria-label="Completed">
              <Check size={21} strokeWidth={1.8} />
            </button>
            <button className="fg-sidebar__avatar" type="button" aria-label="Profile">
              N
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
