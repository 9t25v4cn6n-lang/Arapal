import { parse } from '@babel/parser'
import type { StaticDoctrineParseResult } from './types.ts'

export function parseStaticDoctrineSource(sourceText: string): StaticDoctrineParseResult {
  try {
    const ast = parse(sourceText, {
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
    })

    return {
      mode: 'ast',
      ast,
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
