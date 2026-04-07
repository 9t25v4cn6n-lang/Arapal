import { radius, spacing, typography } from '../tokens'

const diagram = {
  stage: '#175f7d',
  layer1: '#29a5d4',
  bodyField: '#d3d3d3',
  layer2: '#1f7729',
  layer34: '#f3772f',
  line: '#0d4760',
  badge: '#f03ad8',
  text: '#ffffff',
}

const shellRatio = {
  width: 14,
  height: 9,
  header: 1,
  rail: 1,
  bodyWidth: 13,
  bodyHeight: 8,
}

const layer2Split = [2.5, 8, 2.5]
const layer34CenteredRows = [0.5, 1, 0.5, 4, 2]
const layer34FullRows = [2, 4, 2]
const layer34TopBandRows = [0.5, 1, 0.5]
const centeredEntryColumns = [2.5, 8, 2.5]
const centeredEntryRows = [1.5, 5, 1.5]
const homeCommandDeckRows = [2, 4, 2]
const heroTwoUpFooterRows = [2, 4, 2]
const heroTwoUpFooterColumns = [6.5, 6.5]
const studyLeftRows = [1.5, 5, 1.5]
const studyCenterRows = [1.5, 4.5, 2]
const studyRightRows = [1, 3, 1, 3]
const layer5Columns = [2, 9, 2]
const layer5Rows = [1.5, 5, 1.5]
const projectsColumns = [4, 9]
const projectsRows = [1.5, 4.5, 2]
const patchingRows = [1.5, 4.5, 2]
const examColumns = [2, 9, 2]
const examRows = [1, 5, 2]
const successColumns = [2, 9, 2]
const successRows = [1.5, 4.5, 2]

function formatRatioValue(value) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, '')
}

function ratioLabel(width, height) {
  return `${formatRatioValue(width)}x${formatRatioValue(height)}`
}

function frTemplate(values) {
  return values.map((value) => `${value}fr`).join(' ')
}

function DiagramCanvas({ index, children }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '14 / 9',
        borderRadius: radius[16],
        background: diagram.stage,
        border: `2px solid ${diagram.line}`,
        padding: spacing[16],
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 42,
          height: 42,
          display: 'grid',
          placeItems: 'center',
          background: diagram.badge,
          color: '#fff',
          borderRight: `2px solid ${diagram.line}`,
          borderBottom: `2px solid ${diagram.line}`,
          fontFamily: typography.bodyText.fontFamily,
          fontSize: 16,
          fontWeight: 700,
          zIndex: 2,
        }}
      >
        {index}
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(14, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(9, minmax(0, 1fr))',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Layer1Base({ bodyChildren, bodyBackground = diagram.bodyField }) {
  return (
    <>
      <div
        style={{
          gridColumn: '1 / span 14',
          gridRow: '1 / span 1',
          background: diagram.layer1,
          border: `2px solid ${diagram.line}`,
          display: 'grid',
          placeItems: 'center',
          color: diagram.text,
          fontFamily: typography.bodyText.fontFamily,
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        {ratioLabel(shellRatio.width, shellRatio.header)}
      </div>

      <div
        style={{
          gridColumn: '1 / span 1',
          gridRow: '2 / span 8',
          background: diagram.layer1,
          borderLeft: `2px solid ${diagram.line}`,
          borderRight: `2px solid ${diagram.line}`,
          borderBottom: `2px solid ${diagram.line}`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <span
          style={{
            color: diagram.text,
            fontFamily: typography.bodyText.fontFamily,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1.1,
            textAlign: 'center',
            whiteSpace: 'pre-line',
          }}
        >
          {`${formatRatioValue(shellRatio.rail)}\nx\n${formatRatioValue(shellRatio.bodyHeight)}`}
        </span>
      </div>

      <div
        style={{
          gridColumn: '2 / span 13',
          gridRow: '2 / span 8',
          background: bodyBackground,
          borderRight: `2px solid ${diagram.line}`,
          borderBottom: `2px solid ${diagram.line}`,
          position: 'relative',
        }}
      >
        {bodyChildren}
      </div>
    </>
  )
}

function centeredLabel(text, size = 16) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          color: diagram.text,
          fontFamily: typography.bodyText.fontFamily,
          fontSize: size,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        {text}
      </span>
    </div>
  )
}

function fillGrid({ columns, rows = '1fr', children }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
      }}
    >
      {children}
    </div>
  )
}

function diagramBlock({ background, label, labelSize = 16, borderLeft = false, borderRight = true, borderTop = false, borderBottom = false, children }) {
  return (
    <div
      style={{
        position: 'relative',
        background,
        borderLeft: borderLeft ? `2px solid ${diagram.line}` : 'none',
        borderRight: borderRight ? `2px solid ${diagram.line}` : 'none',
        borderTop: borderTop ? `2px solid ${diagram.line}` : 'none',
        borderBottom: borderBottom ? `2px solid ${diagram.line}` : 'none',
        overflow: 'hidden',
      }}
    >
      {label ? centeredLabel(label, labelSize) : null}
      {children}
    </div>
  )
}

export function Layer1UniversalShellPreview() {
  return (
    <DiagramCanvas index="1">
      <Layer1Base bodyChildren={centeredLabel(ratioLabel(shellRatio.bodyWidth, shellRatio.bodyHeight), 20)} />
    </DiagramCanvas>
  )
}

export function Layer2DefaultSplitPreview() {
  return (
    <DiagramCanvas index="2">
      <Layer1Base
        bodyBackground="transparent"
        bodyChildren={
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateColumns: frTemplate(layer2Split),
            }}
          >
            <div style={{ position: 'relative', background: diagram.layer2, borderLeft: `2px solid ${diagram.line}`, borderRight: `2px solid ${diagram.line}` }}>
              {centeredLabel(ratioLabel(layer2Split[0], shellRatio.bodyHeight))}
            </div>
            <div style={{ position: 'relative', background: diagram.layer2, borderRight: `2px solid ${diagram.line}` }}>
              {centeredLabel(ratioLabel(layer2Split[1], shellRatio.bodyHeight))}
            </div>
            <div style={{ position: 'relative', background: diagram.layer2, borderRight: `2px solid ${diagram.line}` }}>
              {centeredLabel(ratioLabel(layer2Split[2], shellRatio.bodyHeight))}
            </div>
          </div>
        }
      />
    </DiagramCanvas>
  )
}

export function Layer34CenteredBandsPreview() {
  return (
    <DiagramCanvas index="3">
      <Layer1Base
        bodyBackground="transparent"
        bodyChildren={
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateColumns: frTemplate(layer2Split),
            }}
          >
            <div style={{ position: 'relative', background: diagram.layer2, borderLeft: `2px solid ${diagram.line}`, borderRight: `2px solid ${diagram.line}` }}>
              {centeredLabel(ratioLabel(layer2Split[0], shellRatio.bodyHeight))}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateRows: frTemplate(layer34CenteredRows),
                borderRight: `2px solid ${diagram.line}`,
              }}
            >
              {layer34CenteredRows.map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  style={{
                    position: 'relative',
                    background: diagram.layer34,
                    borderBottom: index === layer34CenteredRows.length - 1 ? 'none' : `2px solid ${diagram.line}`,
                  }}
                >
                  {centeredLabel(ratioLabel(layer2Split[1], height))}
                </div>
              ))}
            </div>
            <div style={{ position: 'relative', background: diagram.layer2, borderRight: `2px solid ${diagram.line}` }}>
              {centeredLabel(ratioLabel(layer2Split[2], shellRatio.bodyHeight))}
            </div>
          </div>
        }
      />
    </DiagramCanvas>
  )
}

export function Layer34FullWidthWorkPreview() {
  return (
    <DiagramCanvas index="4">
      <Layer1Base
        bodyBackground="transparent"
        bodyChildren={
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateRows: frTemplate(layer34FullRows),
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: frTemplate(layer2Split), borderBottom: `2px solid ${diagram.line}` }}>
              <div style={{ position: 'relative', background: diagram.layer2, borderLeft: `2px solid ${diagram.line}`, borderRight: `2px solid ${diagram.line}` }}>
                {centeredLabel(ratioLabel(layer2Split[0], layer34FullRows[0]))}
              </div>
              <div style={{ display: 'grid', gridTemplateRows: frTemplate(layer34TopBandRows), borderRight: `2px solid ${diagram.line}` }}>
                {layer34TopBandRows.map((height, index) => (
                  <div
                    key={`${height}-${index}`}
                    style={{
                      position: 'relative',
                      background: diagram.layer34,
                      borderBottom: index === layer34TopBandRows.length - 1 ? 'none' : `2px solid ${diagram.line}`,
                    }}
                  >
                    {centeredLabel(ratioLabel(layer2Split[1], height))}
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative', background: diagram.layer2, borderRight: `2px solid ${diagram.line}` }}>
                {centeredLabel(ratioLabel(layer2Split[2], layer34FullRows[0]))}
              </div>
            </div>
            <div style={{ position: 'relative', background: diagram.layer34, borderLeft: `2px solid ${diagram.line}`, borderRight: `2px solid ${diagram.line}`, borderBottom: `2px solid ${diagram.line}` }}>
              {centeredLabel(ratioLabel(shellRatio.bodyWidth, layer34FullRows[1]), 20)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: frTemplate(layer2Split) }}>
              <div style={{ position: 'relative', background: diagram.layer2, borderLeft: `2px solid ${diagram.line}`, borderRight: `2px solid ${diagram.line}` }}>
                {centeredLabel(ratioLabel(layer2Split[0], layer34FullRows[2]))}
              </div>
              <div style={{ position: 'relative', background: diagram.layer34, borderRight: `2px solid ${diagram.line}` }}>
                {centeredLabel(ratioLabel(layer2Split[1], layer34FullRows[2]))}
              </div>
              <div style={{ position: 'relative', background: diagram.layer2, borderRight: `2px solid ${diagram.line}` }}>
                {centeredLabel(ratioLabel(layer2Split[2], layer34FullRows[2]))}
              </div>
            </div>
          </div>
        }
      />
    </DiagramCanvas>
  )
}

export function Layer5ContentOwnerPreview() {
  return (
    <DiagramCanvas index="5">
      <Layer1Base
        bodyChildren={
          fillGrid({
            columns: frTemplate(layer5Columns),
            rows: frTemplate(layer5Rows),
            children: (
              <>
                <div />
                <div />
                <div />
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(layer5Columns[1], layer5Rows[1]),
                  labelSize: 20,
                  border: false,
                  borderRight: false,
                  borderBottom: false,
                })}
                <div />
                <div />
                <div />
                <div />
              </>
            ),
          })
        }
      />
    </DiagramCanvas>
  )
}

export function Layer2CenteredEntryPreview() {
  return (
    <DiagramCanvas index="6">
      <Layer1Base
        bodyChildren={
          fillGrid({
            columns: frTemplate(centeredEntryColumns),
            rows: frTemplate(centeredEntryRows),
            children: (
              <>
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(centeredEntryColumns[1], centeredEntryRows[0]),
                  borderRight: false,
                  borderBottom: true,
                })}
                <div />
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(centeredEntryColumns[1], centeredEntryRows[1]),
                  labelSize: 20,
                  borderRight: false,
                  borderBottom: true,
                })}
                <div />
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(centeredEntryColumns[1], centeredEntryRows[2]),
                  borderRight: false,
                })}
                <div />
              </>
            ),
          })
        }
      />
    </DiagramCanvas>
  )
}

export function HomeCommandDeckPreview() {
  return (
    <DiagramCanvas index="7">
      <Layer1Base
        bodyChildren={
          fillGrid({
            columns: '1fr',
            rows: frTemplate(heroTwoUpFooterRows),
            children: (
              <>
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(shellRatio.bodyWidth, heroTwoUpFooterRows[0]),
                  borderBottom: true,
                })}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: frTemplate(heroTwoUpFooterColumns),
                    borderBottom: `2px solid ${diagram.line}`,
                  }}
                >
                  {heroTwoUpFooterColumns.map((width, index) => (
                    <div
                      key={`${width}-${index}`}
                      style={{
                        position: 'relative',
                        background: diagram.layer34,
                        borderRight: index === heroTwoUpFooterColumns.length - 1 ? 'none' : `2px solid ${diagram.line}`,
                      }}
                    >
                      {centeredLabel(ratioLabel(width, heroTwoUpFooterRows[1]))}
                    </div>
                  ))}
                </div>
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(shellRatio.bodyWidth, heroTwoUpFooterRows[2]),
                })}
              </>
            ),
          })
        }
      />
    </DiagramCanvas>
  )
}

export function SegmentationOperationalWorkspacePreview() {
  return (
    <DiagramCanvas index="8">
      <Layer1Base
        bodyBackground="transparent"
        bodyChildren={
          fillGrid({
            columns: frTemplate(layer2Split),
            children: (
              <>
                {diagramBlock({
                  background: diagram.layer2,
                  label: ratioLabel(layer2Split[0], shellRatio.bodyHeight),
                  borderLeft: true,
                  borderRight: true,
                })}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: frTemplate(layer34CenteredRows),
                    borderRight: `2px solid ${diagram.line}`,
                  }}
                >
                  {layer34CenteredRows.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      style={{
                        position: 'relative',
                        background: diagram.layer34,
                        borderBottom: index === layer34CenteredRows.length - 1 ? 'none' : `2px solid ${diagram.line}`,
                      }}
                    >
                      {centeredLabel(ratioLabel(layer2Split[1], height), index === 3 ? 20 : 16)}
                    </div>
                  ))}
                </div>
                {diagramBlock({
                  background: diagram.layer2,
                  label: ratioLabel(layer2Split[2], shellRatio.bodyHeight),
                  borderRight: true,
                })}
              </>
            ),
          })
        }
      />
    </DiagramCanvas>
  )
}

export function StudyAnchoredWorkspacePreview() {
  return (
    <DiagramCanvas index="9">
      <Layer1Base
        bodyBackground="transparent"
        bodyChildren={
          fillGrid({
            columns: frTemplate(layer2Split),
            children: (
              <>
                {diagramBlock({
                  background: diagram.layer2,
                  label: ratioLabel(layer2Split[0], shellRatio.bodyHeight),
                  borderLeft: true,
                  borderRight: true,
                })}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: frTemplate(studyCenterRows),
                    borderRight: `2px solid ${diagram.line}`,
                  }}
                >
                  {studyCenterRows.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      style={{
                        position: 'relative',
                        background: diagram.layer34,
                        borderBottom: index === studyCenterRows.length - 1 ? 'none' : `2px solid ${diagram.line}`,
                      }}
                    >
                      {centeredLabel(ratioLabel(layer2Split[1], height), index === 1 ? 20 : 16)}
                    </div>
                  ))}
                </div>
                {diagramBlock({
                  background: diagram.layer2,
                  label: ratioLabel(layer2Split[2], shellRatio.bodyHeight),
                  borderRight: true,
                })}
              </>
            ),
          })
        }
      />
    </DiagramCanvas>
  )
}

export function ProjectsBrowseShellPreview() {
  return (
    <DiagramCanvas index="10">
      <Layer1Base
        bodyChildren={
          fillGrid({
            columns: frTemplate(projectsColumns),
            rows: '1fr',
            children: (
              <>
                {diagramBlock({
                  background: diagram.layer2,
                  label: ratioLabel(projectsColumns[0], shellRatio.bodyHeight),
                  labelSize: 20,
                  borderLeft: false,
                  borderRight: true,
                })}
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(projectsColumns[1], shellRatio.bodyHeight),
                  labelSize: 20,
                  borderRight: true,
                })}
              </>
            ),
          })
        }
      />
    </DiagramCanvas>
  )
}

export function PatchingCorrectionShellPreview() {
  return (
    <DiagramCanvas index="11">
      <Layer1Base
        bodyChildren={
          fillGrid({
            columns: '1fr',
            rows: frTemplate(patchingRows),
            children: (
              <>
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(shellRatio.bodyWidth, patchingRows[0]),
                  borderBottom: true,
                })}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    borderBottom: `2px solid ${diagram.line}`,
                  }}
                >
                  {[shellRatio.bodyWidth / 2, shellRatio.bodyWidth / 2].map((width, index) => (
                    <div
                      key={`${width}-${index}`}
                      style={{
                        position: 'relative',
                        background: diagram.layer34,
                        borderRight: index === 1 ? 'none' : `2px solid ${diagram.line}`,
                      }}
                    >
                      {centeredLabel(ratioLabel(width, patchingRows[1]))}
                    </div>
                  ))}
                </div>
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(shellRatio.bodyWidth, patchingRows[2]),
                })}
              </>
            ),
          })
        }
      />
    </DiagramCanvas>
  )
}

export function ExamsFocusShellPreview() {
  return (
    <DiagramCanvas index="12">
      <Layer1Base
        bodyChildren={
          fillGrid({
            columns: frTemplate(examColumns),
            rows: frTemplate(examRows),
            children: (
              <>
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(examColumns[1], examRows[0]),
                  borderRight: false,
                  borderBottom: true,
                })}
                <div />
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(examColumns[1], examRows[1]),
                  labelSize: 20,
                  borderRight: false,
                  borderBottom: true,
                })}
                <div />
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(examColumns[1], examRows[2]),
                  borderRight: false,
                })}
                <div />
              </>
            ),
          })
        }
      />
    </DiagramCanvas>
  )
}

export function CenteredSuccessReviewStagePreview() {
  return (
    <DiagramCanvas index="13">
      <Layer1Base
        bodyChildren={
          fillGrid({
            columns: frTemplate(successColumns),
            rows: frTemplate(successRows),
            children: (
              <>
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(successColumns[1], successRows[0]),
                  borderRight: false,
                  borderBottom: true,
                })}
                <div />
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(successColumns[1], successRows[1]),
                  labelSize: 20,
                  borderRight: false,
                  borderBottom: true,
                })}
                <div />
                <div />
                {diagramBlock({
                  background: diagram.layer34,
                  label: ratioLabel(successColumns[1], successRows[2]),
                  borderRight: false,
                })}
                <div />
              </>
            ),
          })
        }
      />
    </DiagramCanvas>
  )
}
