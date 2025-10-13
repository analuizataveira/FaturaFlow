export function maskName(name: string): string {
  if (!name) {
    return '';
  }

  return name
    .split(' ')
    .map((name, i) => {
      return i === 0
        ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        : name.charAt(0).toUpperCase() + '.';
    })
    .join(' ');
}
