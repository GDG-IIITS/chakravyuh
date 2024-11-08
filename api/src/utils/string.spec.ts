import { splitRoomSessionId, toUname } from './string';

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

describe('splitRoomSessionId', () => {
  it('should return the room id and session id when the input has a hyphen', async () => {
    const roomSessionId = 'room-session';
    const [roomId, sessionId] = await splitRoomSessionId(roomSessionId);
    expect(roomId).toBe('room');
    expect(sessionId).toBe('session');
  });
  it('should return the room id and null when the input does not have a hyphen', async () => {
    const roomSessionId = 'room';
    const [roomId, sessionId] = splitRoomSessionId(roomSessionId);
    expect(roomId).toBe('room');
    expect(sessionId).toBeNull();
  });
});
