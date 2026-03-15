import { useState } from 'react';
import { Award, Book, Info, Maximize2, ScrollText, Sparkles, X } from 'lucide-react';

const rightPanelStyles = `
  .fg-right,
  .fg-right * {
    box-sizing: border-box;
  }

  .fg-right {
    width: 100%;
    height: 100%;
    min-height: 0;
    flex: 0 0 auto;
    align-self: stretch;
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #dde6f1;
    background: #fbfcfe;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .fg-right__content {
    padding: 22px 18px 34px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .fg-right__card {
    margin-top: 0;
    position: relative;
    z-index: 1;
    border: 1px solid #dfe8f4;
    border-radius: 18px;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.05);
  }

  .fg-right__cardHeader {
    min-height: 52px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--panel-border, #e2e8f0);
    background: var(--panel-bg, #f8fafc);
  }

  .fg-right__cardTitle {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #1d293d;
  }

  .fg-right__expand {
    margin-left: auto;
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 0;
    background: transparent;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-right__expand:hover {
    background: var(--expand-bg, #eff6ff);
    color: var(--expand-color, #2563eb);
  }

  .fg-right__cardBody {
    padding: 18px 18px 20px;
  }

  .fg-right__centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fg-right__circleGrade {
    width: 96px;
    height: 96px;
    border: 4px solid #bbf7d0;
    border-radius: 999px;
    background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fg-right__circleGradeLarge {
    width: 128px;
    height: 128px;
    border: 4px solid #bbf7d0;
    border-radius: 999px;
    background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 18px 32px rgba(5, 150, 105, 0.16);
  }

  .fg-right__gradeValue {
    font-size: 30px;
    font-weight: 700;
    color: #047857;
  }

  .fg-right__gradeValueLarge {
    font-size: 48px;
    font-weight: 700;
    color: #047857;
  }

  .fg-right__stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .fg-right__feedbackBlock {
    padding: 12px;
    border: 1px solid var(--feedback-border, #e2e8f0);
    border-radius: 12px;
    background: var(--feedback-bg, #f8fafc);
  }

  .fg-right__feedbackBlockLarge {
    padding: 24px;
    border: 1px solid var(--feedback-border, #e2e8f0);
    border-radius: 16px;
    background: var(--feedback-bg, #f8fafc);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  }

  .fg-right__feedbackTitle {
    margin: 0 0 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: var(--feedback-title, #334155);
  }

  .fg-right__feedbackTitleLarge {
    margin: 0 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: var(--feedback-title, #334155);
  }

  .fg-right__dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
    display: inline-block;
  }

  .fg-right__smallDot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: currentColor;
    display: inline-block;
  }

  .fg-right__text {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: #415268;
  }

  .fg-right__textLarge {
    margin: 0;
    font-size: 16px;
    line-height: 1.75;
    color: #374151;
  }

  .fg-right__muted {
    color: #45556c;
  }

  .fg-right__arabic {
    font-family: "Amiri", "Noto Naskh Arabic", "Geeza Pro", serif;
    font-weight: 700;
    color: #111827;
    font-size: 16px;
    line-height: 1.4;
  }

  .fg-right__inlineArabic {
    font-family: "Amiri", "Noto Naskh Arabic", "Geeza Pro", serif;
    font-weight: 700;
    color: #111827;
    font-size: 1em;
    line-height: inherit;
    display: inline-block;
    direction: rtl;
    unicode-bidi: isolate;
    vertical-align: middle;
    transform: translateY(1px);
  }

  .fg-right__mono {
    font-family: "SFMono-Regular", "JetBrains Mono", "Menlo", monospace;
    font-size: 12px;
    line-height: 1.2;
    display: inline-flex;
    align-items: center;
    color: #74839a;
  }

  .fg-right__bulletList {
    margin: 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: #374151;
  }

  .fg-right__takeawayList {
    display: grid;
    gap: 24px;
  }

  .fg-right__takeawayItem {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  }

  .fg-right__takeawayNumber {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: #e0e7ff;
    color: #4f46e5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 18px;
    font-weight: 700;
    margin-top: 4px;
  }

  .fg-right__takeawayTitle {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }

  .fg-right__takeawayText {
    margin: 0;
    font-size: 16px;
    line-height: 1.75;
    color: #374151;
  }

  .fg-right__listRow {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .fg-right__listDot {
    width: 6px;
    height: 6px;
    margin-top: 8px;
    border-radius: 999px;
    background: #6366f1;
    flex-shrink: 0;
  }

  .fg-right__entry {
    padding-bottom: 16px;
    border-bottom: 1px solid #f3f4f6;
  }

  .fg-right__entry:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .fg-right__entryRow {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .fg-right__contextBox {
    margin-top: 12px;
    padding: 16px 17px;
    border: 1px solid #f3f4f6;
    border-radius: 8px;
    background: #f9fafb;
    font-size: 12px;
    line-height: 1.58;
    color: #45556c;
  }

  .fg-right__modalBackdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
  }

  .fg-right__modal {
    width: 100%;
    max-width: 1120px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 28px 56px rgba(15, 23, 42, 0.24);
  }

  .fg-right__modalHeader {
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid #e5e7eb;
    background: var(--panel-bg, #f8fafc);
  }

  .fg-right__modalTitleRow {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fg-right__modalTitle {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }

  .fg-right__close {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .fg-right__close:hover {
    background: var(--expand-bg, #eff6ff);
    color: var(--expand-color, #2563eb);
  }

  .fg-right__modalBody {
    flex: 1;
    overflow: auto;
    background: #ffffff;
  }

  .fg-right__modalSection {
    padding: 32px;
  }

  .fg-right__modalCentered {
    min-height: 400px;
    padding: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #6b7280;
  }

  .fg-right__modalHeading {
    margin: 0 0 24px;
    font-size: 24px;
    font-weight: 700;
    color: #111827;
  }

  .fg-right__modalLead {
    margin: 0 0 24px;
    font-size: 18px;
    line-height: 1.75;
    color: #374151;
  }

  .fg-right__tableWrap {
    padding: 32px;
    overflow: auto;
  }

  .fg-right__table {
    width: 100%;
    border-collapse: collapse;
  }

  .fg-right__table th {
    padding: 12px 16px;
    border-bottom: 2px solid #d1d5db;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #374151;
    vertical-align: top;
  }

  .fg-right__table td {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: top;
    font-size: 14px;
    line-height: 1.65;
    color: #374151;
  }

  .fg-right__tableRow:hover {
    background: rgba(250, 245, 255, 0.5);
  }

  .fg-right__tableFooter {
    padding: 16px 32px;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
    font-size: 12px;
    color: #6b7280;
  }

  .fg-right__thread {
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  }

  .fg-right__message {
    padding: 24px;
    display: flex;
    gap: 16px;
    border-bottom: 1px solid #f3f4f6;
  }

  .fg-right__message:last-child {
    border-bottom: none;
  }

  .fg-right__message.is-alt {
    background: #f8fafc;
  }

  .fg-right__avatar {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-weight: 700;
  }

  .fg-right__avatar.is-reviewer {
    background: #e2e8f0;
    color: #475569;
  }

  .fg-right__avatar.is-user {
    background: #bfdbfe;
    color: #1d4ed8;
  }

  .fg-right__messageMeta {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fg-right__messageAuthor {
    font-weight: 700;
    color: #111827;
  }

  .fg-right__messageTime {
    font-size: 14px;
    color: #6b7280;
  }

  .fg-right__emptyIcon {
    margin-bottom: 24px;
  }

  .fg-right__variant--guidance .fg-right__cardHeader {
    background: #f3f7ff;
  }

  .fg-right__variant--lexicography .fg-right__cardHeader {
    background: #faf5ff;
  }

  .fg-right__variant--summary .fg-right__cardHeader {
    background: #ecfdf5;
  }

  .fg-right__variant--discussion .fg-right__cardHeader {
    background: #fff7ed;
  }

  .fg-right__variant--phrasing .fg-right__cardHeader {
    background: #fff7ed;
  }
`;

const tones = {
  emerald: {
    panelBg: 'rgba(236, 253, 245, 0.82)',
    panelBorder: 'rgba(167, 243, 208, 0.85)',
    expandBg: '#d1fae5',
    expandColor: '#059669',
    iconColor: '#059669',
  },
  blue: {
    panelBg: 'rgba(239, 246, 255, 0.82)',
    panelBorder: 'rgba(191, 219, 254, 0.85)',
    expandBg: '#dbeafe',
    expandColor: '#2563eb',
    iconColor: '#2563eb',
  },
  indigo: {
    panelBg: 'rgba(238, 242, 255, 0.9)',
    panelBorder: 'rgba(199, 210, 254, 0.85)',
    expandBg: '#e0e7ff',
    expandColor: '#4f46e5',
    iconColor: '#4f46e5',
  },
  purple: {
    panelBg: 'rgba(250, 245, 255, 0.92)',
    panelBorder: 'rgba(233, 213, 255, 0.85)',
    expandBg: '#f3e8ff',
    expandColor: '#9333ea',
    iconColor: '#9333ea',
  },
  orange: {
    panelBg: 'rgba(255, 247, 237, 0.92)',
    panelBorder: 'rgba(254, 215, 170, 0.85)',
    expandBg: '#ffedd5',
    expandColor: '#ea580c',
    iconColor: '#ea580c',
  },
};

function toneVars(tone) {
  return {
    '--panel-bg': tone.panelBg,
    '--panel-border': tone.panelBorder,
    '--expand-bg': tone.expandBg,
    '--expand-color': tone.expandColor,
  };
}

function PanelCard({ tone, icon, title, expandLabel, onExpand, children }) {
  return (
    <div className={`fg-right__card fg-right__variant--${title.toLowerCase().split(' ')[0]}`}>
      <div className="fg-right__cardHeader" style={toneVars(tone)}>
        {icon}
        <h3 className="fg-right__cardTitle">{title}</h3>
        <button className="fg-right__expand" type="button" aria-label={expandLabel} onClick={onExpand} style={toneVars(tone)}>
          <Maximize2 size={15} strokeWidth={1.9} />
        </button>
      </div>
      <div className="fg-right__cardBody">{children}</div>
    </div>
  );
}

export default function RightPanel({ isSubmitted = false } = {}) {
  const [expandedCard, setExpandedCard] = useState(null);

  const renderExpandedModal = () => {
    if (!expandedCard) {
      return null;
    }

    let title = '';
    let tone = tones.blue;
    let icon = null;
    let content = null;

    switch (expandedCard) {
      case 'grade':
        title = 'Your Grade';
        tone = tones.emerald;
        icon = <Award size={20} color={tone.iconColor} />;
        content = (
          <div className="fg-right__modalSection">
            <div className="fg-right__centered" style={{ marginBottom: 32 }}>
              <div className="fg-right__circleGradeLarge">
                <span className="fg-right__gradeValueLarge">8.4</span>
              </div>
            </div>

            <div className="fg-right__stack" style={{ gap: 24, maxWidth: 960, margin: '0 auto' }}>
              <div
                className="fg-right__feedbackBlockLarge"
                style={{
                  '--feedback-bg': '#ecfdf5',
                  '--feedback-border': '#d1fae5',
                  '--feedback-title': '#047857',
                }}
              >
                <h4 className="fg-right__feedbackTitleLarge">
                  <span className="fg-right__smallDot" style={{ color: '#059669' }} />
                  Strengths
                </h4>
                <p className="fg-right__textLarge">
                  Excellent accuracy in translating technical terminology, particularly &quot;miṣr jāmiʿ&quot; and the
                  attribution to Abū Yūsuf. The structure flows very naturally in English while maintaining strict
                  fidelity to the original Arabic syntax.
                </p>
              </div>

              <div
                className="fg-right__feedbackBlockLarge"
                style={{
                  '--feedback-bg': '#fffbeb',
                  '--feedback-border': '#fde68a',
                  '--feedback-title': '#b45309',
                }}
              >
                <h4 className="fg-right__feedbackTitleLarge">
                  <span className="fg-right__smallDot" style={{ color: '#d97706' }} />
                  Areas for Improvement
                </h4>
                <p className="fg-right__textLarge">
                  Consider providing more context for &quot;al-Karkhī&quot; and &quot;al-Thaljī&quot; to help readers
                  unfamiliar with Hanafi scholarship. Adding brief biographical footnotes or dates would elevate the
                  scholarly utility of the translation.
                </p>
              </div>

              <div
                className="fg-right__feedbackBlockLarge"
                style={{
                  '--feedback-bg': '#eff6ff',
                  '--feedback-border': '#dbeafe',
                  '--feedback-title': '#1d4ed8',
                }}
              >
                <h4 className="fg-right__feedbackTitleLarge">
                  <span className="fg-right__smallDot" style={{ color: '#2563eb' }} />
                  Suggestion
                </h4>
                <p className="fg-right__textLarge">
                  The phrase &quot;meat-drying&quot; for &quot;تشريق&quot; is accurate but may benefit from a brief
                  explanatory note in brackets, as it refers specifically to the days of Tashreeq during Eid al-Adha.
                </p>
              </div>
            </div>
          </div>
        );
        break;

      case 'guidance':
        title = 'Guidance';
        tone = tones.blue;
        icon = <Info size={20} color={tone.iconColor} />;
        content = (
          <div className="fg-right__modalSection" style={{ maxWidth: 960, margin: '0 auto' }}>
            <h3 className="fg-right__modalHeading" style={{ fontSize: 32, marginBottom: 24 }}>
              Translation Approach
            </h3>
            <p className="fg-right__modalLead">
              Focus on accurately translating the conditions for Jumu&apos;ah validity. Pay close attention to the
              definition of <span className="fg-right__arabic" dir="rtl">مصر جامع</span> (comprehensive city) and its
              components. Distinguish between the different opinions and their attributions.
            </p>

            <div
              className="fg-right__feedbackBlockLarge"
              style={{
                '--feedback-bg': '#f8fafc',
                '--feedback-border': '#e2e8f0',
                '--feedback-title': '#334155',
                marginTop: 32,
              }}
            >
              <h4 className="fg-right__feedbackTitleLarge">Key Focus Areas:</h4>
              <ul className="fg-right__bulletList">
                <li>Identify the primary condition for Jumu&apos;ah (the comprehensive city).</li>
                <li>Ensure the legal definitions set by Abu Yusuf are captured clearly.</li>
                <li>Differentiate the opinions of al-Karkhi and al-Thalji without causing confusion in the English flow.</li>
              </ul>
            </div>
          </div>
        );
        break;

      case 'takeaways':
        title = 'Key Takeaways';
        tone = tones.indigo;
        icon = <Sparkles size={20} color={tone.iconColor} />;
        content = (
          <div className="fg-right__modalSection" style={{ maxWidth: 960, margin: '0 auto' }}>
            <div className="fg-right__takeawayList">
              <div className="fg-right__takeawayItem">
                <div className="fg-right__takeawayNumber">1</div>
                <div>
                  <h4 className="fg-right__takeawayTitle">Legal Precedent</h4>
                  <p className="fg-right__takeawayText">
                    The term <span className="fg-right__arabic" dir="rtl">مصر جامع</span> requires careful breakdown as
                    it sets the legal precedent for Friday prayers.
                  </p>
                </div>
              </div>

              <div className="fg-right__takeawayItem">
                <div className="fg-right__takeawayNumber">2</div>
                <div>
                  <h4 className="fg-right__takeawayTitle">Differing Opinions</h4>
                  <p className="fg-right__takeawayText">
                    Differing opinions (al-Karkhī vs al-Thaljī) should be clearly attributed to avoid conflating the
                    primary stance with secondary views.
                  </p>
                </div>
              </div>

              <div className="fg-right__takeawayItem">
                <div className="fg-right__takeawayNumber">3</div>
                <div>
                  <h4 className="fg-right__takeawayTitle">Spatial Extension</h4>
                  <p className="fg-right__takeawayText">
                    The physical expansion of the city (<span className="fg-right__arabic" dir="rtl">أفنية</span>)
                    carries the same legal weight as the center, which is a critical nuance in Hanafi fiqh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'phrasing':
        title = 'Phrasing';
        tone = tones.orange;
        icon = <ScrollText size={20} color={tone.iconColor} />;
        content = (
          <div className="fg-right__modalSection" style={{ maxWidth: 960, margin: '0 auto' }}>
            <div className="fg-right__stack" style={{ gap: 18 }}>
              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">لا تصح الجمعة إلا في مصر جامع</span>
                  <span className="fg-right__mono">la taṣiḥḥ al-jumuʿah illa fi miṣr jamiʿ</span>
                </div>
                <p className="fg-right__text">
                  Keep this phrasing firm and legal in tone: &quot;The Friday prayer is only valid in a comprehensive
                  city.&quot;
                </p>
                <div className="fg-right__contextBox">
                  <strong>Tip:</strong> Avoid softer paraphrases like &quot;usually valid&quot; or &quot;best performed&quot;.
                  The Arabic is stating a condition of validity, not a recommendation.
                </div>
              </div>

              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">الحكم غير مقصور على المصلى</span>
                  <span className="fg-right__mono">al-ḥukm ghayr maqṣur ʿala al-muṣalla</span>
                </div>
                <p className="fg-right__text">
                  Translate this as a legal extension of the ruling, not a physical description of the place.
                </p>
                <div className="fg-right__contextBox">
                  <strong>Tip:</strong> &quot;The ruling is not confined to the prayer area&quot; is stronger and cleaner than
                  &quot;the judgment is not restricted to the musalla only,&quot; which reads more literally.
                </div>
              </div>

              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">بل تجوز في جميع أفنية المصر</span>
                  <span className="fg-right__mono">bal tajuzu fi jamiʿ afniyat al-miṣr</span>
                </div>
                <p className="fg-right__text">
                  This clause widens the scope of permissibility, so the English should feel like an expansion rather than
                  a restatement.
                </p>
                <div className="fg-right__contextBox">
                  <strong>Tip:</strong> Use &quot;rather, it is permissible throughout all the outskirts of the city&quot; to preserve
                  the argumentative flow.
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'lexicography':
        title = 'Lexicography Details';
        tone = tones.purple;
        icon = <Book size={20} color={tone.iconColor} />;
        content = (
          <>
            <div className="fg-right__tableWrap">
              <table className="fg-right__table">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Type</th>
                    <th>Root/Pattern or Class</th>
                    <th>Core Meaning/Function Source</th>
                    <th>Direct English</th>
                    <th>Context</th>
                    <th>Why Included</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="fg-right__tableRow">
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="fg-right__arabic" dir="rtl">مصر جامع</span>
                        <span className="fg-right__mono">miṣr jāmiʿ</span>
                      </div>
                    </td>
                    <td>Compound Noun</td>
                    <td>
                      <div className="fg-right__arabic" dir="rtl">م-ص-ر + ج-م-ع</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>فَعْل + فَاعِل</div>
                    </td>
                    <td>Large settlement + gathering/comprehensive</td>
                    <td>Comprehensive city</td>
                    <td>Hanafi fiqh: defined by having a judge (qāḍī) and ruler (amīr)</td>
                    <td>Central legal term defining jurisdiction for Friday prayer</td>
                  </tr>

                  <tr className="fg-right__tableRow">
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="fg-right__arabic" dir="rtl">أفنية</span>
                        <span className="fg-right__mono">afniyah</span>
                      </div>
                    </td>
                    <td>Plural Noun</td>
                    <td>
                      <div className="fg-right__arabic" dir="rtl">ف-ن-ي</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>أَفْعِلَة (broken plural)</div>
                    </td>
                    <td>Open spaces, courtyards</td>
                    <td>Outskirts / Courtyards</td>
                    <td>Immediate surrounding areas attached to the city</td>
                    <td>Clarifies spatial extension of legal ruling beyond city center</td>
                  </tr>

                  <tr className="fg-right__tableRow">
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="fg-right__arabic" dir="rtl">مصلى</span>
                        <span className="fg-right__mono">muṣallā</span>
                      </div>
                    </td>
                    <td>Noun (Place)</td>
                    <td>
                      <div className="fg-right__arabic" dir="rtl">ص-ل-ي</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>مَفْعَل (place noun)</div>
                    </td>
                    <td>Place of prayer</td>
                    <td>Prayer area / Prayer ground</td>
                    <td>Open space designated for communal prayers, especially Eid</td>
                    <td>Distinguishes permissible Friday prayer location from regular mosque</td>
                  </tr>

                  <tr className="fg-right__tableRow">
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="fg-right__arabic" dir="rtl">تشريق</span>
                        <span className="fg-right__mono">tashrīq</span>
                      </div>
                    </td>
                    <td>Verbal Noun</td>
                    <td>
                      <div className="fg-right__arabic" dir="rtl">ش-ر-ق</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>تَفْعِيل</div>
                    </td>
                    <td>Drying meat in the sun (from sharq = east/sunrise)</td>
                    <td>Meat-drying / Drying sacrificial meat</td>
                    <td>Refers to the days after Eid al-Adha when meat is dried</td>
                    <td>Unusual term requiring cultural context for accurate translation</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="fg-right__tableFooter">
              Lexicographical analysis based on classical Arabic dictionaries and Hanafi legal terminology.
            </div>
          </>
        );
        break;

      default:
        return null;
    }

    return (
      <div className="fg-right__modalBackdrop">
        <div className="fg-right__modal">
          <div className="fg-right__modalHeader" style={toneVars(tone)}>
            <div className="fg-right__modalTitleRow">
              {icon}
              <h2 className="fg-right__modalTitle">{title}</h2>
            </div>

            <button
              className="fg-right__close"
              type="button"
              onClick={() => setExpandedCard(null)}
              aria-label={`Close ${title}`}
              style={toneVars(tone)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="fg-right__modalBody">{content}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{rightPanelStyles}</style>
      <div className="fg-right">
        <div className="fg-right__content">
          {isSubmitted && (
            <PanelCard
              tone={tones.emerald}
              icon={<Award size={18} color={tones.emerald.iconColor} strokeWidth={1.9} />}
              title="Your Grade"
              expandLabel="Expand Grade"
              onExpand={() => setExpandedCard('grade')}
            >
              <div className="fg-right__centered" style={{ marginBottom: 16 }}>
                <div className="fg-right__circleGrade">
                  <span className="fg-right__gradeValue">8.4</span>
                </div>
              </div>

              <div className="fg-right__stack">
                <div
                  className="fg-right__feedbackBlock"
                  style={{
                    '--feedback-bg': '#ecfdf5',
                    '--feedback-border': '#d1fae5',
                    '--feedback-title': '#047857',
                  }}
                >
                  <h4 className="fg-right__feedbackTitle">
                    <span className="fg-right__dot" style={{ color: '#059669' }} />
                    Strengths
                  </h4>
                  <p className="fg-right__text">
                    Excellent accuracy in translating technical terminology, particularly &quot;miṣr jāmiʿ&quot; and
                    the attribution to Abū Yūsuf.
                  </p>
                </div>

                <div
                  className="fg-right__feedbackBlock"
                  style={{
                    '--feedback-bg': '#fffbeb',
                    '--feedback-border': '#fde68a',
                    '--feedback-title': '#b45309',
                  }}
                >
                  <h4 className="fg-right__feedbackTitle">
                    <span className="fg-right__dot" style={{ color: '#d97706' }} />
                    Areas for Improvement
                  </h4>
                  <p className="fg-right__text">
                    Consider providing more context for &quot;al-Karkhī&quot; and &quot;al-Thaljī&quot; to help readers
                    unfamiliar with Hanafi scholarship.
                  </p>
                </div>

                <div
                  className="fg-right__feedbackBlock"
                  style={{
                    '--feedback-bg': '#eff6ff',
                    '--feedback-border': '#dbeafe',
                    '--feedback-title': '#1d4ed8',
                  }}
                >
                  <h4 className="fg-right__feedbackTitle">
                    <span className="fg-right__dot" style={{ color: '#2563eb' }} />
                    Suggestion
                  </h4>
                  <p className="fg-right__text">
                    The phrase &quot;meat-drying&quot; for &quot;تشريق&quot; is accurate but may benefit from a brief
                    explanatory note in brackets.
                  </p>
                </div>
              </div>
            </PanelCard>
          )}

          {!isSubmitted && (
            <PanelCard
              tone={tones.blue}
              icon={<Info size={18} color={tones.blue.iconColor} strokeWidth={1.9} />}
              title="Guidance"
              expandLabel="Expand Guidance"
              onExpand={() => setExpandedCard('guidance')}
            >
              <p className="fg-right__text">
                Focus on accurately translating the conditions for Jumu&apos;ah validity. Pay close attention to the
                definition of <span className="fg-right__inlineArabic" dir="rtl">مصر جامع</span> (comprehensive city) and its
                components. Distinguish between the different opinions and their attributions.
              </p>
            </PanelCard>
          )}

          {isSubmitted && (
            <PanelCard
              tone={tones.indigo}
              icon={<Sparkles size={18} color={tones.indigo.iconColor} strokeWidth={1.9} />}
              title="Key Takeaways"
              expandLabel="Expand Key Takeaways"
              onExpand={() => setExpandedCard('takeaways')}
            >
              <div className="fg-right__stack">
                <div className="fg-right__listRow">
                  <span className="fg-right__listDot" />
                  <p className="fg-right__text">
                    The term <span className="fg-right__inlineArabic" dir="rtl">مصر جامع</span> requires careful breakdown as
                    it sets the legal precedent for Friday prayers.
                  </p>
                </div>
                <div className="fg-right__listRow">
                  <span className="fg-right__listDot" />
                  <p className="fg-right__text">
                    Differing opinions (al-Karkhī vs al-Thaljī) should be clearly attributed.
                  </p>
                </div>
                <div className="fg-right__listRow">
                  <span className="fg-right__listDot" />
                  <p className="fg-right__text">
                    The physical expansion of the city (<span className="fg-right__inlineArabic" dir="rtl">أفنية</span>)
                    carries the same legal weight as the center.
                  </p>
                </div>
              </div>
            </PanelCard>
          )}

          <PanelCard
            tone={tones.purple}
            icon={<Book size={18} color={tones.purple.iconColor} strokeWidth={1.9} />}
            title="Lexicography"
            expandLabel="Expand Lexicography"
            onExpand={() => setExpandedCard('lexicography')}
          >
            <div className="fg-right__stack" style={{ gap: 16 }}>
              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">مصر جامع</span>
                  <span className="fg-right__mono">miṣr jāmiʿ</span>
                </div>
                <p className="fg-right__text">Comprehensive city; a large urban center with civic amenities.</p>
                <div className="fg-right__contextBox">
                  <strong>Context:</strong> In Hanafi fiqh, typically defined by having a judge (qadi) and a ruler
                  (amir) capable of enforcing laws.
                </div>
              </div>

              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">أفنية</span>
                  <span className="fg-right__mono">afniyah</span>
                </div>
                <p className="fg-right__text">
                  Outskirts, courtyards, or immediate surrounding areas attached to the city.
                </p>
              </div>
            </div>
          </PanelCard>

          <PanelCard
            tone={tones.orange}
            icon={<ScrollText size={18} color={tones.orange.iconColor} strokeWidth={1.9} />}
            title="Phrasing"
            expandLabel="Expand Phrasing"
            onExpand={() => setExpandedCard('phrasing')}
          >
            <div className="fg-right__stack" style={{ gap: 16 }}>
              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">لا تصح الجمعة إلا في مصر جامع</span>
                  <span className="fg-right__mono">miṣr jamiʿ</span>
                </div>
                <p className="fg-right__text">
                  Phrase this as a condition of validity, not a recommendation: &quot;The Friday prayer is only valid in a
                  comprehensive city.&quot;
                </p>
              </div>

              <div className="fg-right__entry">
                <div className="fg-right__entryRow">
                  <span className="fg-right__arabic" dir="rtl">بل تجوز في جميع أفنية المصر</span>
                  <span className="fg-right__mono">afniyat al-miṣr</span>
                </div>
                <p className="fg-right__text">
                  Preserve the argumentative turn here: &quot;rather, it is permissible throughout all the outskirts of
                  the city.&quot;
                </p>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      {renderExpandedModal()}
    </>
  );
}
