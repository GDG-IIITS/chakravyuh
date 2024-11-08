import { normalizeToHttps } from './urls';

describe('normalizeToHttps', () => {
  test('should add https to a URL without protocol', () => {
    expect(normalizeToHttps('example.com')).toBe('https://example.com');
  });

  test('should not replace http with https', () => {
    expect(normalizeToHttps('http://example.com')).toBe('http://example.com');
  });

  test('should not change https URL', () => {
    expect(normalizeToHttps('https://example.com')).toBe('https://example.com');
  });

  test('should handle URLs with subdomains', () => {
    expect(normalizeToHttps('sub.example.com')).toBe('https://sub.example.com');
  });

  test('should handle http URLs with subdomains', () => {
    expect(normalizeToHttps('http://sub.example.com')).toBe(
      'http://sub.example.com',
    );
  });

  test('should handle https URLs with subdomains', () => {
    expect(normalizeToHttps('https://sub.example.com')).toBe(
      'https://sub.example.com',
    );
  });

  test('should handle URLs with ports', () => {
    expect(normalizeToHttps('example.com:8080')).toBe(
      'https://example.com:8080',
    );
  });

  test('should handle http URLs with ports', () => {
    expect(normalizeToHttps('http://example.com:8080')).toBe(
      'http://example.com:8080',
    );
  });

  test('should handle https URLs with ports', () => {
    expect(normalizeToHttps('https://example.com:8080')).toBe(
      'https://example.com:8080',
    );
  });

  test('should handle URLs with paths', () => {
    expect(normalizeToHttps('example.com/path')).toBe(
      'https://example.com/path',
    );
  });

  test('should handle http URLs with paths', () => {
    expect(normalizeToHttps('http://example.com/path')).toBe(
      'http://example.com/path',
    );
  });

  test('should handle https URLs with paths', () => {
    expect(normalizeToHttps('https://example.com/path')).toBe(
      'https://example.com/path',
    );
  });

  test('should handle URLs with query parameters', () => {
    expect(normalizeToHttps('example.com?query=param')).toBe(
      'https://example.com?query=param',
    );
  });

  test('should handle http URLs with query parameters', () => {
    expect(normalizeToHttps('http://example.com?query=param')).toBe(
      'http://example.com?query=param',
    );
  });

  test('should handle https URLs with query parameters', () => {
    expect(normalizeToHttps('https://example.com?query=param')).toBe(
      'https://example.com?query=param',
    );
  });

  test('should handle URLs with fragments', () => {
    expect(normalizeToHttps('example.com#fragment')).toBe(
      'https://example.com#fragment',
    );
  });

  test('should handle http URLs with fragments', () => {
    expect(normalizeToHttps('http://example.com#fragment')).toBe(
      'http://example.com#fragment',
    );
  });

  test('should handle https URLs with fragments', () => {
    expect(normalizeToHttps('https://example.com#fragment')).toBe(
      'https://example.com#fragment',
    );
  });

  test('should handle empty string', () => {
    expect(normalizeToHttps('')).toBe('https://');
  });
});
