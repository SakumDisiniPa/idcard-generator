import { CONSTRAINTS } from './constants';

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return (
    cleaned.length >= CONSTRAINTS.PHONE.MIN_LENGTH &&
    cleaned.length <= CONSTRAINTS.PHONE.MAX_LENGTH
  );
}

export function validateCustomId(id: string): boolean {
  return (
    id.length >= CONSTRAINTS.CUSTOM_ID.MIN_LENGTH &&
    id.length <= CONSTRAINTS.CUSTOM_ID.MAX_LENGTH
  );
}

export function validateName(name: string): boolean {
  return (
    name.trim().length >= CONSTRAINTS.NAME.MIN_LENGTH &&
    name.trim().length <= CONSTRAINTS.NAME.MAX_LENGTH
  );
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSizeBytes = CONSTRAINTS.FILE.MAX_SIZE_MB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File terlalu besar. Max: ${CONSTRAINTS.FILE.MAX_SIZE_MB}MB`,
    };
  }

  if (!CONSTRAINTS.FILE.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP',
    };
  }

  return { valid: true };
}

export function formatPhoneNumber(phone: string): string {
  if (!phone.startsWith('+62')) {
    return '+62' + phone.replace(/^(\+62|62|0)/, '');
  }
  return phone;
}
