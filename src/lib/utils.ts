import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhoneNumber = (value: string) => {
  const rawValue = value.replace(/[^\d]/g, '');
  let formattedValue = '';
  if (rawValue.length > 0) {
    formattedValue = '(' + rawValue.substring(0, 3);
  }
  if (rawValue.length >= 4) {
    formattedValue += ') ' + rawValue.substring(3, 6);
  }
  if (rawValue.length >= 7) {
    formattedValue += '-' + rawValue.substring(6, 10);
  }
  return formattedValue;
};

export const formatSsn = (value: string) => {
  const rawValue = value.replace(/[^\d]/g, '');
  let formattedValue = rawValue.substring(0, 3);
  if (rawValue.length > 3) {
    formattedValue += '-' + rawValue.substring(3, 5);
  }
  if (rawValue.length > 5) {
    formattedValue += '-' + rawValue.substring(5, 9);
  }
  return formattedValue;
};
