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

export const formatLastFour = (value: string) => {
  return value.replace(/[^\d]/g, "").substring(0, 4);
};
