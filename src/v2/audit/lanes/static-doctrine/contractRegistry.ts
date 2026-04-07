import fs from 'node:fs/promises'
import path from 'node:path'
import traverseModule from '@babel/traverse'
import * as t from '@babel/types'
import { getScreenIdForRecord, getObjectPropertyName, getStringLiteralValue } from './ruleHelpers.ts'
import { parseStaticDoctrineSource } from './parser.ts'
import type { AuditFileInventoryRecord } from '../../policy/findingSchema.ts'
import type {
  StaticDoctrineContractContainer,
  StaticDoctrineContractRegistry,
  StaticDoctrineContractRegistryEntry,
} from './types.ts'

const traverse = (traverseModule as any).default ?? traverseModule
const UNIVERSAL_SHELL_PATH = path.join(process.cwd(), 'src', 'v2', 'foundation', 'layout', 'universalShell.ts')

function extractContractContainers(sourceText: string) {
  const parseResult = parseStaticDoctrineSource(sourceText)
  if (parseResult.mode !== 'ast') {
    return []
  }

  const containers: StaticDoctrineContractContainer[] = []

  traverse(parseResult.ast, {
    ObjectExpression(path) {
      const properties = path.node.properties.filter((property) => t.isObjectProperty(property))
      const nameProperty = properties.find((property) => getObjectPropertyName(property) === 'name')
      const name = nameProperty ? getStringLiteralValue(nameProperty.value as t.Node) : null

      if (!name) {
        return
      }

      const parentProperty = properties.find((property) => getObjectPropertyName(property) === 'parent')
      const allowEmptyProperty = properties.find((property) => getObjectPropertyName(property) === 'allowEmpty')
      const semanticRoleProperty = properties.find((property) => getObjectPropertyName(property) === 'semanticRole')

      containers.push({
        name,
        parent: parentProperty ? getStringLiteralValue(parentProperty.value as t.Node) : null,
        allowEmpty: Boolean(
          allowEmptyProperty && t.isBooleanLiteral(allowEmptyProperty.value as t.Node) && allowEmptyProperty.value.value,
        ),
        semanticRole: semanticRoleProperty ? getStringLiteralValue(semanticRoleProperty.value as t.Node) : null,
        line: path.node.loc?.start.line ?? null,
        column: path.node.loc ? path.node.loc.start.column + 1 : null,
      })
    },
  })

  return containers
}

export async function buildStaticDoctrineContractRegistry(records: AuditFileInventoryRecord[]): Promise<StaticDoctrineContractRegistry> {
  const sharedShellSource = await fs.readFile(UNIVERSAL_SHELL_PATH, 'utf8')
  const sharedShellContainerNames = new Set(extractContractContainers(sharedShellSource).map((container) => container.name))
  const contractByScreenId = new Map<string, StaticDoctrineContractRegistryEntry>()

  const contractRecords = records.filter((record) => record.fileKind === 'screen-contract' && record.absolutePath)

  for (const record of contractRecords) {
    const sourceText = await fs.readFile(record.absolutePath!, 'utf8')
    const screenId = getScreenIdForRecord(record)
    if (!screenId) {
      continue
    }

    contractByScreenId.set(screenId, {
      file: record.file,
      screenId,
      containers: extractContractContainers(sourceText),
    })
  }

  return {
    sharedShellContainerNames,
    contractByScreenId,
  }
}
