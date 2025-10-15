// @ts-nocheck
export function validateCPF(cpf: string): boolean {
  // Remove any non-numeric characters from the CPF string
  cpf = cpf.replace(/\D/g, '');

  // Check if the CPF has 11 digits
  if (cpf.length !== 11) {
    return false;
  }

  // Check for known invalid CPF patterns
  const invalidPatterns = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ];
  if (invalidPatterns.includes(cpf)) {
    return false;
  }

  // Calculate the first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  const verificationDigit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  // Calculate the second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  const verificationDigit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  // Check if the calculated verification digits match the original ones
  return parseInt(cpf[9]) === verificationDigit1 && parseInt(cpf[10]) === verificationDigit2;
}

export function maskCPF(cpf: string): string {
  if (!cpf) {
    return '';
  }

  const numericCPF = cpf.replace(/\D/g, '');

  if (numericCPF.length !== 11) {
    throw new Error('Invalid CPF length');
  }

  return `${numericCPF.substring(0, 3)}.***.***-${numericCPF.substring(9)}`;
}
