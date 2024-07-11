import { formattedDate, formattedDateNumeric, formattedDateTime, convertSecondsToDuration, convertSecondsToDurationTime } from './dateFormatter'; // replace './filename' with the actual path to your file

describe('formattedDate', () => {
    it('should format the date correctly', () => {
        const date = new Date('2023-07-10T12:00:00Z');
        expect(formattedDate(date)).toBe('July 10, 2023');
    });
});

describe('formattedDateNumeric', () => {
    it('should format the date correctly in numeric format', () => {
        const date = new Date('2023-07-10T12:00:00Z');
        expect(formattedDateNumeric(date)).toBe('July 23');
    });
});

describe('formattedDateTime', () => {
    it('should format the time correctly', () => {
        const date = new Date('2023-07-10T12:00:00Z');
        const expectedTime = new Date(date).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
        });
        expect(formattedDateTime(date)).toBe(expectedTime);
    });
});

describe('convertSecondsToDuration', () => {
    it('should convert seconds to duration correctly', () => {
        expect(convertSecondsToDuration(3661)).toBe('01h 01m');
        expect(convertSecondsToDuration(61)).toBe('01m 01s');
        expect(convertSecondsToDuration(1)).toBe('01s');
    });
});

describe('convertSecondsToDurationTime', () => {
    it('should convert seconds to duration time correctly', () => {
        expect(convertSecondsToDurationTime(3661)).toBe('01:01');
        expect(convertSecondsToDurationTime(61)).toBe('01:01');
        expect(convertSecondsToDurationTime(1)).toBe('00:01');
    });
});
