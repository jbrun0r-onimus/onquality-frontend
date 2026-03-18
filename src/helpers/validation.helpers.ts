function cpfSum(cpf: string, upToIndex: number): number {
  let sum = 0;
  for (let i = 1; i <= upToIndex; i++) {
    sum += (i + 1) * parseInt(cpf[upToIndex - i]);
  }
  return sum;
}

export function calculateCpfFVerificationDigit(
  cpf: string,
  digit: 0 | 1
): number {
  const remainder = cpfSum(cpf, 9 + digit) % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function checkCpf(cpf: string): boolean {
  if (cpf.length !== 11) return false;

  const expectedFirstDigit = calculateCpfFVerificationDigit(cpf, 0);
  if (expectedFirstDigit !== parseInt(cpf[9])) return false;

  const expectedSecondDigit = calculateCpfFVerificationDigit(cpf, 1);
  return expectedSecondDigit === parseInt(cpf[10]);
}
