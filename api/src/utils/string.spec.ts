import { getUg, getYear, toUname } from './string';

describe('toUname', () => {
  test('should convert uppercase letters to lowercase', () => {
    expect(toUname('USERNAME')).toBe('username');
  });

  test('should remove special characters', () => {
    expect(toUname('user@name!')).toBe('username');
  });

  test('should remove spaces', () => {
    expect(toUname('user name')).toBe('username');
  });

  test('should remove underscores', () => {
    expect(toUname('user_name')).toBe('username');
  });

  test('should handle mixed cases and special characters', () => {
    expect(toUname('User@Name!')).toBe('username');
  });

  test('should handle empty string', () => {
    expect(toUname('')).toBe('');
  });

  test('should handle string with only special characters', () => {
    expect(toUname('@!#$%^&*()')).toBe('');
  });

  test('should handle string with numbers', () => {
    expect(toUname('user123')).toBe('user123');
  });

  test('should handle string with mixed numbers and letters', () => {
    expect(toUname('User123Name')).toBe('user123name');
  });

  test('should handle string with mixed numbers, letters, and special characters', () => {
    expect(toUname('User@123!Name')).toBe('user123name');
  });

  test('should handle string with spaces and special characters', () => {
    expect(toUname('user @ name!')).toBe('username');
  });

  test('should handle string with underscores and special characters', () => {
    expect(toUname('user_name!')).toBe('username');
  });

  test('should handle string with spaces, underscores, and special characters', () => {
    expect(toUname('user _ name!')).toBe('username');
  });

  test('should handle string with leading and trailing spaces', () => {
    expect(toUname('  username  ')).toBe('username');
  });

  test('should handle string with leading and trailing underscores', () => {
    expect(toUname('__username__')).toBe('username');
  });

  test('should handle string with leading and trailing special characters', () => {
    expect(toUname('!@username!@')).toBe('username');
  });

  test('should handle string with multiple spaces', () => {
    expect(toUname('user   name')).toBe('username');
  });

  test('should handle string with multiple underscores', () => {
    expect(toUname('user___name')).toBe('username');
  });

  test('should handle string with multiple special characters', () => {
    expect(toUname('user@!name')).toBe('username');
  });

  test('should handle string with mixed spaces, underscores, and special characters', () => {
    expect(toUname('user _ @ name!')).toBe('username');
  });
});

describe('getYear', () => {
  test('should return the last two characters before the "@" symbol', () => {
    expect(getYear('user@example.com')).toBe('er');
  });

  test('should return the last two characters of a short username', () => {
    expect(getYear('ab@example.com')).toBe('ab');
  });

  test('should return the last two characters of a short username', () => {
    expect(getYear('aahnik.d22@iiits.in')).toBe('22');
  });

  test('should return the last two characters of a short username', () => {
    expect(getYear('bishwajeet.s22@iiits.in')).toBe('22');
  });

  test('should return the last two characters of a short username', () => {
    expect(getYear('random.rn24@iiits.in')).toBe('24');
  });
});

describe('getUg', () => {
  test('should return the year difference from 2021', () => {
    expect(getUg('21')).toBe(4);
  });

  test('should return the year difference from 2021', () => {
    expect(getUg('22')).toBe(3);
  });

  test('should return the year difference from 2021', () => {
    expect(getUg('23')).toBe(2);
  });

  test('should return the year difference from 2021', () => {
    expect(getUg('24')).toBe(1);
  });
});
