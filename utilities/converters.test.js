const { convertDuration } = require('./converters');

describe('convertDuration', () => {
    test('handles full duration', () => {
        expect(convertDuration('PT2H7M5S')).toBe('02:07:05');
        expect(convertDuration('PT12H37M50S')).toBe('12:37:50');
    });
    test('handles missing sections duartion', () => {
        expect(convertDuration('PT20H')).toBe('20:00:00');
        expect(convertDuration('PT12M')).toBe('00:12:00');
        expect(convertDuration('PT42S')).toBe('00:00:42');
    });
    test('handles zero duration', () => {
        expect(convertDuration('PT0S')).toBe('00:00:00');
    });
});