function validCPF(cpf) {
  const digits = String(cpf || "").replace(/\D/g, "");

  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const calculateDigit = (base, factor) => {
    let sum = 0;

    for (let i = 0; i < base.length; i++) {
      sum += Number(base[i]) * (factor - i);
    }

    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const firstDigit = calculateDigit(digits.slice(0, 9), 10);
  const secondDigit = calculateDigit(digits.slice(0, 10), 11);

  return digits === `${digits.slice(0, 9)}${firstDigit}${secondDigit}`;
}
