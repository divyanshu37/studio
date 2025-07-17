import { describe, it, expect } from 'vitest';
import { formatPhoneNumber } from '@/lib/utils';

describe('formatPhoneNumber', () => {
  it('should format a 10-digit number correctly', () => {
    const input = '1234567890';
    const expected = '(123) 456-7890';
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  it('should handle partial numbers correctly', () => {
    expect(formatPhoneNumber('123')).toBe('(123');
    expect(formatPhoneNumber('123456')).toBe('(123) 456');
  });

  it('should ignore non-digit characters', () => {
    const input = '123-456-7890';
    const expected = '(123) 456-7890';
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  it('should return an empty string for empty input', () => {
    expect(formatPhoneNumber('')).toBe('');
  });
});
