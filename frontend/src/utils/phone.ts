export function maskPhone(phone: string): string {
  if (!phone) {
    return '';
  }

  const onlyNumbers = phone.replace(/\D/g, '');

  const maskedPhone = onlyNumbers.substring(2, 4).padEnd(11, '*');

  return maskedPhone;
}
