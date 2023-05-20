function areAllNonEmptyStrings (...values: string[]): boolean {
  return values.every((value) => typeof value === 'string' && value !== '')
}

export default areAllNonEmptyStrings
