import type { AuditFinding } from '../../policy/findingSchema.ts'
import { createStaticDoctrineFinding, getScreenIdForRecord, isApplicableConsumerFileKind } from './ruleHelpers.ts'
import type { StaticDoctrineRuleContext } from './types.ts'

const TYPOGRAPHY_PATTERN = /\b(fontSize|font-size|lineHeight|line-height|fontWeight|font-weight)\b/
const SPACING_PATTERN = /\b(padding|margin|gap|rowGap|columnGap|padding-|margin-|row-gap|column-gap)\b/
const SPACING_LITERAL_PATTERN = /\b\d+(\.\d+)?(px|rem|em|vh|vw|%)\b|\b(clamp|calc|minmax)\(/
const COLOR_PATTERN = /\b(color|background|backgroundColor|background-color|border(Color)?|border-color|outline(Color)?|outline-color|fill|stroke|boxShadow|box-shadow|textShadow|text-shadow)\b/
const COLOR_LITERAL_PATTERN = /(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/
const RADIUS_PATTERN = /\b(borderRadius|border-radius|borderTopLeftRadius|border-top-left-radius|borderTopRightRadius|border-top-right-radius|borderBottomLeftRadius|border-bottom-left-radius|borderBottomRightRadius|border-bottom-right-radius)\b/
const MOTION_PATTERN = /\b(transition|animation)(Duration|TimingFunction|Delay)?\b|\b(transition-|animation-)\b/
const MOTION_LITERAL_PATTERN = /\b\d+(\.\d+)?m?s\b|cubic-bezier\(|\bease(-in|-out|-in-out)?\b|\blinear\b/
const SHELL_CONTAINER_PATTERN = /\bLayer(1|2)_/

function createLowConfidenceFinding(
  context: StaticDoctrineRuleContext,
  lineNumber: number,
  ruleId: string,
  message: string,
  excerpt: string,
) {
  return createStaticDoctrineFinding(context, {
    ruleId,
    message,
    rationale: `This file could not be parsed into AST form, so the fallback text scanner flagged a possible doctrine issue: ${message}`,
    file: context.record.file,
    fileKind: context.record.fileKind,
    scope: context.record.scope,
    ownerLayer: context.record.ownerLayer,
    screenId: context.record.scope === 'live-product' ? getScreenIdForRecord(context.record) : null,
    line: lineNumber,
    column: 1,
    evidence: {
      excerpt: excerpt.trim(),
    },
    classification: 'low-confidence-review',
    confidence: 'low',
  })
}

export function runFallbackScan(context: StaticDoctrineRuleContext) {
  const findings: AuditFinding[] = []

  if (context.parseResult.mode !== 'fallback') {
    return findings
  }

  if (context.record.fileKind === 'live-screen') {
    const hasContainerOverrides = /\bcontainerOverrides\b/.test(context.sourceText)
    if (hasContainerOverrides) {
      findings.push(
        createLowConfidenceFinding(
          context,
          1,
          'container-overrides-usage',
          'containerOverrides is present in an unparsable screen file; review whether it is necessary screen-specific drift.',
          'containerOverrides',
        ),
      )
    }

    if (hasContainerOverrides && SHELL_CONTAINER_PATTERN.test(context.sourceText)) {
      findings.push(
        createLowConfidenceFinding(
          context,
          1,
          'shell-override-touchpoint',
          'A screen-local shell override may exist in an unparsable screen file.',
          'Layer1_/Layer2_',
        ),
      )
    }
  }

  if (!isApplicableConsumerFileKind(context.record.fileKind)) {
    return findings
  }

  context.sourceText.split('\n').forEach((line, index) => {
    const lineNumber = index + 1
    const trimmed = line.trim()

    if (!trimmed) {
      return
    }

    if (TYPOGRAPHY_PATTERN.test(trimmed) && !trimmed.includes('typography.')) {
      findings.push(
        createLowConfidenceFinding(
          context,
          lineNumber,
          'hardcoded-typography',
          'Typography appears to be using a literal rather than a token or named variant.',
          line,
        ),
      )
    }

    if (SPACING_PATTERN.test(trimmed) && SPACING_LITERAL_PATTERN.test(trimmed) && !trimmed.includes('spacing[') && !trimmed.includes('surfacePadding.')) {
      findings.push(
        createLowConfidenceFinding(
          context,
          lineNumber,
          'hardcoded-spacing',
          'Spacing appears to be using a literal rather than a spacing token or surface padding role.',
          line,
        ),
      )
    }

    if (COLOR_PATTERN.test(trimmed) && COLOR_LITERAL_PATTERN.test(trimmed) && !trimmed.includes('colors.')) {
      findings.push(
        createLowConfidenceFinding(
          context,
          lineNumber,
          'hardcoded-color',
          'Color appears to be using a literal rather than a shared color token.',
          line,
        ),
      )
    }

    if (RADIUS_PATTERN.test(trimmed) && !trimmed.includes('radius.') && !trimmed.includes('inherit')) {
      findings.push(
        createLowConfidenceFinding(
          context,
          lineNumber,
          'hardcoded-radius',
          'Radius appears to be using a literal rather than a radius token.',
          line,
        ),
      )
    }

    if (MOTION_PATTERN.test(trimmed) && MOTION_LITERAL_PATTERN.test(trimmed) && !trimmed.includes('motion.')) {
      findings.push(
        createLowConfidenceFinding(
          context,
          lineNumber,
          'hardcoded-motion',
          'Motion appears to be using a literal rather than a motion token.',
          line,
        ),
      )
    }
  })

  return findings
}
