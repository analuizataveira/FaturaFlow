export function centsToDouble(cents?: number) {
  if (!cents) {
    return 0;
  }
  return cents / 100;
}

export function doubleToCents(double?: number) {
  if (!double) {
    return 0;
  }
  return double * 100;
}

export const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
