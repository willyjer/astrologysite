import { z } from 'zod';
import { BirthFormValues } from '../types';

// Zod Schema
export const birthFormSchema = z.object({
  birthDate: z.string().min(1, 'Birth date is required'),
  birthTime: z.string().min(1, 'Birth time is required'),
  birthPlace: z.string().min(1, 'Birth place is required'),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  timezone: z.number()
});

// Validation Helpers
export const validateBirthForm = (data: BirthFormValues) => {
  try {
    const result = birthFormSchema.parse(data);
    return {
      isValid: true,
      data: result
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      };
    }
    return {
      isValid: false,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }]
    };
  }
};

export const getFieldError = (errors: { field: string; message: string }[], fieldName: keyof BirthFormValues) => {
  return errors.find(error => error.field === fieldName)?.message;
};

export const validateDate = (date: string) => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export function validateDateFormat(dateString: string): { isValid: boolean; error?: string } {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  const today = new Date();
  if (date > today) {
    return { isValid: false, error: 'Birth date cannot be in the future' };
  }

  return { isValid: true };
}

export const validateTime = (time: string) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export function validateTimeFormat(timeString: string): { isValid: boolean; error?: string } {
  if (!timeString) {
    return { isValid: false, error: 'Time is required' };
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeString)) {
    return { isValid: false, error: 'Invalid time format (use HH:MM)' };
  }

  return { isValid: true };
}

export const validateTimezone = (timezone: string) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (timezoneError) {
    return false;
  }
}; 