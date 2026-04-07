import type {
  AuditConfidence,
  AuditFileKind,
  AuditOwnerLayer,
  AuditScope,
  AuditSeverity,
  FindingClassification,
} from './findingSchema.ts'

export interface ArchitectureBoundaryPolicy {
  ruleId: string
  title: string
  message: string
  from: AuditFileKind[]
  disallow: AuditFileKind[]
  allowSelfScreenDir: boolean
  severity: AuditSeverity
  confidence: AuditConfidence
  classification: FindingClassification
  ownerLayer: AuditOwnerLayer
  suggestedFix: string
}

export interface ArchitectureLeakagePolicy {
  ruleId: string
  title: string
  message: string
  fromScopes: AuditScope[]
  disallowTargetKinds: AuditFileKind[]
  severity: AuditSeverity
  confidence: AuditConfidence
  classification: FindingClassification
  ownerLayer: AuditOwnerLayer
  suggestedFix: string
}

export interface ArchitectureCyclePolicy {
  ruleId: string
  title: string
  message: string
  severity: AuditSeverity
  confidence: AuditConfidence
  classification: FindingClassification
  ownerLayer: AuditOwnerLayer
  suggestedFix: string
}

export interface ArchitectureUnknownPolicy {
  ruleId: string
  title: string
  message: string
  severity: AuditSeverity
  confidence: AuditConfidence
  classification: FindingClassification
  ownerLayer: AuditOwnerLayer
  suggestedFix: string
}

export interface ArchitectureSharedGenericPolicy {
  ruleId: string
  title: string
  message: string
  from: AuditFileKind[]
  to: AuditFileKind[]
  severity: AuditSeverity
  confidence: AuditConfidence
  classification: FindingClassification
  ownerLayer: AuditOwnerLayer
  suggestedFix: string
}

export const architecturePolicy = {
  enforcementMode: 'phase-4-import-graph',
  graph: {
    resolutionMode: 'relative-import-only',
    internalSpecifierPrefixes: ['.', 'src/', '@/', '~/', '/'],
    supportedInternalPrefixes: ['.'],
    fallbackParseDegradesLane: true,
    unresolvedRelativeImportsDegradeLane: true,
    unsupportedInternalImportsDegradeLane: true,
  },
  layerKinds: {
    screen: ['live-screen', 'screen-contract'],
    sharedFoundation: ['shared-layout', 'shared-primitive', 'framework-adapter'],
    tokenLayer: ['token-definition'],
    tooling: ['dashboard', 'debug', 'lab', 'audit-suite'],
    generated: ['generated'],
    ignored: ['ignored'],
    unknown: ['unknown'],
  } as const satisfies Record<string, AuditFileKind[]>,
  boundaries: [
    {
      ruleId: 'screens-no-screen-imports',
      title: 'Screen-to-screen import',
      from: ['live-screen', 'screen-contract'],
      disallow: ['live-screen', 'screen-contract'],
      allowSelfScreenDir: true,
      message: 'Screens must not import other screens directly.',
      severity: 'error',
      confidence: 'high',
      classification: 'real-code-fix',
      ownerLayer: 'architecture-policy',
      suggestedFix: 'Keep screen-local imports inside the same screen directory, or move shared logic into the shared foundation.',
    },
    {
      ruleId: 'shared-foundation-no-screen-imports',
      title: 'Shared foundation importing screen-local code',
      from: ['shared-layout', 'shared-primitive'],
      disallow: ['live-screen', 'screen-contract'],
      allowSelfScreenDir: false,
      message: 'Shared foundation must not import screen-local code.',
      severity: 'error',
      confidence: 'high',
      classification: 'real-code-fix',
      ownerLayer: 'architecture-policy',
      suggestedFix: 'Move screen-specific logic out of the shared foundation or promote the shared behavior into a proper generic.',
    },
    {
      ruleId: 'tokens-no-consumer-imports',
      title: 'Token layer importing consumers',
      from: ['token-definition'],
      disallow: ['live-screen', 'screen-contract', 'shared-layout', 'shared-primitive', 'framework-adapter', 'dashboard', 'debug', 'lab'],
      allowSelfScreenDir: false,
      message: 'Token definitions must not import consumer layers.',
      severity: 'error',
      confidence: 'high',
      classification: 'real-code-fix',
      ownerLayer: 'architecture-policy',
      suggestedFix: 'Keep token files source-of-truth only; move consumer-specific logic into the consuming layer.',
    },
  ] as const satisfies ArchitectureBoundaryPolicy[],
  productToolingLeakage: {
    ruleId: 'product-tooling-leakage',
    title: 'Product path importing tooling-only code',
    message: 'Live product code and shared product foundation must not depend on dashboard, debug, lab, generated, or audit framework paths.',
    fromScopes: ['live-product', 'shared-product-foundation'],
    disallowTargetKinds: ['dashboard', 'debug', 'lab', 'generated', 'audit-suite'],
    severity: 'error',
    confidence: 'high',
    classification: 'real-code-fix',
    ownerLayer: 'architecture-policy',
    suggestedFix: 'Keep tooling-only code out of the live product import closure, or move the shared code into an approved product foundation module.',
  } as const satisfies ArchitectureLeakagePolicy,
  dependencyCycle: {
    ruleId: 'dependency-cycle',
    title: 'Dependency cycle',
    message: 'Files should not depend on each other cyclically.',
    severity: 'warn',
    confidence: 'high',
    classification: 'real-code-fix',
    ownerLayer: 'architecture-policy',
    suggestedFix: 'Break the cycle by extracting shared logic or changing one side of the dependency direction.',
  } as const satisfies ArchitectureCyclePolicy,
  sharedGenericScreenKnowledge: {
    ruleId: 'shared-generic-screen-knowledge',
    title: 'Shared generic depending on screen-local code',
    message: 'Shared primitives and shared layout must not directly depend on screen-local files.',
    from: ['shared-layout', 'shared-primitive'],
    to: ['live-screen', 'screen-contract'],
    severity: 'error',
    confidence: 'high',
    classification: 'real-code-fix',
    ownerLayer: 'architecture-policy',
    suggestedFix: 'Move the screen-specific knowledge out of the shared generic or promote the shared behavior into a real foundation primitive.',
  } as const satisfies ArchitectureSharedGenericPolicy,
  unknownFileKindRisk: {
    ruleId: 'unknown-file-kind-architecture-risk',
    title: 'Unknown file kind architecture risk',
    message: 'Architecture-relevant files must not stay unclassified.',
    severity: 'warn',
    confidence: 'high',
    classification: 'doctrine-decision-needed',
    ownerLayer: 'architecture-policy',
    suggestedFix: 'Classify the file in scope policy or move it into an existing audited layer so boundary rules can apply reliably.',
  } as const satisfies ArchitectureUnknownPolicy,
} as const

export type ArchitecturePolicy = typeof architecturePolicy
