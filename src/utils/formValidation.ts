/**
 * Valida un email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que un campo no esté vacío
 */
export function validateRequired(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}

/**
 * Valida un número
 */
export function validateNumber(value: string): boolean {
  return !isNaN(Number(value)) && value.trim().length > 0;
}





