export function verifyArray<T>(array: T[] | undefined): boolean {
  return Array.isArray(array) && array.length > 0
}
