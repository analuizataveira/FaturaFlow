export function buildStringFieldQuery(value?: string) {
  return value ? { contains: value, mode: 'insensitive' as const } : undefined;
}
