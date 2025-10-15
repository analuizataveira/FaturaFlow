export function validateCep(cep: string): boolean {
  // Remove any non-numeric characters from the cep string
  cep = cep.replace(/\D/g, '');

  // Check if the cep has 8 digits
  if (cep.length !== 8) {
    return false;
  }

  // Check for known invalid cep patterns
  const invalidPatterns = [
    '00000000',
    '11111111',
    '22222222',
    '33333333',
    '44444444',
    '55555555',
    '66666666',
    '77777777',
    '88888888',
    '99999999',
  ];

  if (invalidPatterns.includes(cep)) {
    return false;
  }

  return true;
}
