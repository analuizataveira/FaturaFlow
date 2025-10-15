// @ts-nocheck

export function validateCNPJ(cnpj: string): boolean {
  // Remove any non-numeric characters from the CNPJ string
  cnpj = cnpj.replace(/\D/g, '');

  // Check if the CNPJ has 14 digits
  if (cnpj.length !== 14) {
    return false;
  }

  // Calculate the first verification digit
  let sum = 0;
  let factor = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * factor;
    factor = factor === 2 ? 9 : factor - 1;
  }
  const verificationDigit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  // Calculate the second verification digit
  sum = 0;
  factor = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj[i]) * factor;
    factor = factor === 2 ? 9 : factor - 1;
  }
  const verificationDigit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  // Check if the calculated verification digits match the original ones
  return parseInt(cnpj[12]) === verificationDigit1 && parseInt(cnpj[13]) === verificationDigit2;
}
