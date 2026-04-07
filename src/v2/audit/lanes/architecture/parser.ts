import { parse } from '@babel/parser'
import type { File } from '@babel/types'

export type ArchitectureParseResult =
  | {
      mode: 'ast'
      ast: File
      error: null
    }
  | {
      mode: 'fallback'
      ast: null
      error: string
    }

export function parseArchitectureSource(sourceText: string): ArchitectureParseResult {
  try {
    return {
      mode: 'ast',
      ast: parse(sourceText, {
        sourceType: 'module',
        plugins: [
          'jsx',
          'typescript',
          'classProperties',
          'objectRestSpread',
          'optionalChaining',
          'nullishCoalescingOperator',
          'dynamicImport',
        ],
        errorRecovery: false,
      }),
      error: null,
    }
  } catch (error) {
    return {
      mode: 'fallback',
      ast: null,
      error: error instanceof Error ? error.message : 'Unknown parse failure',
    }
  }
}
