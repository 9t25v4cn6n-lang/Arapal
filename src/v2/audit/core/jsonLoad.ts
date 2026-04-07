import fs from 'node:fs/promises'

export type JsonLoadStatus = 'ready' | 'missing' | 'malformed' | 'invalid' | 'failed'

export interface JsonLoadResult<T> {
  status: JsonLoadStatus
  data: T | null
  message: string | null
}

export async function loadJsonFile<T>(
  filePath: string,
  options: {
    label: string
    validate?: (value: unknown) => string | null
  },
): Promise<JsonLoadResult<T>> {
  let sourceText: string

  try {
    sourceText = await fs.readFile(filePath, 'utf8')
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return {
        status: 'missing',
        data: null,
        message: `${options.label} is missing at ${filePath}.`,
      }
    }

    return {
      status: 'failed',
      data: null,
      message: `${options.label} could not be read: ${error instanceof Error ? error.message : 'unknown read failure'}.`,
    }
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(sourceText)
  } catch (error: any) {
    return {
      status: 'malformed',
      data: null,
      message: `${options.label} contains malformed JSON: ${error instanceof Error ? error.message : 'unknown parse failure'}.`,
    }
  }

  const validationError = options.validate?.(parsed) ?? null
  if (validationError) {
    return {
      status: 'invalid',
      data: null,
      message: `${options.label} has an invalid schema: ${validationError}`,
    }
  }

  return {
    status: 'ready',
    data: parsed as T,
    message: null,
  }
}
