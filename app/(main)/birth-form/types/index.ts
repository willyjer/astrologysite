import { UseFormReturn } from 'react-hook-form';

/**
 * The complete set of values for the birth form
 * Derived from the Zod validation schema
 */
export interface BirthFormValues {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  lat: number;
  lon: number;
  timezone: number;
}

/**
 * The possible steps in the birth form flow
 */
export type FormStep = 'personal' | 'birthDetails' | 'location';

/**
 * Configuration for each step in the form
 */
export interface StepConfig {
  /** Unique identifier for the step */
  id: FormStep;
  /** Display title for the step */
  title: string;
  /** Description of what the step collects */
  description: string;
  /** Function to determine if the step is complete */
  isComplete: (values: Partial<BirthFormValues>) => boolean;
}

/**
 * Props for the main birth form component
 */
export interface BirthFormProps {
  /** Callback when form is submitted */
  onSubmit: (data: BirthFormValues) => Promise<void>;
  /** Whether the form is currently submitting */
  isLoading: boolean;
  /** Any error message to display */
  error: string | null;
  /** The form instance from react-hook-form */
  form: UseFormReturn<BirthFormValues>;
}

/**
 * Base props for form fields
 */
export interface FormFieldProps {
  /** Label text for the field */
  label: string;
  /** Name of the field in the form data */
  name: keyof BirthFormValues;
  /** Error message to display */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
}



/**
 * Props for displaying form errors
 */
export interface ErrorDisplayProps {
  /** The error message to display */
  error: string | null;
  /** Callback when error is dismissed */
  onDismiss: () => void;
}

/**
 * Return type for the form submission hook
 */
export interface UseFormSubmissionReturn {
  /** Function to submit the form */
  submitForm: (data: BirthFormValues) => Promise<void>;
  /** Whether the form is currently submitting */
  isLoading: boolean;
  /** Any error message */
  error: string | null;
}

/**
 * The data format sent to the API
 * (parsed and expanded from user-facing BirthFormData)
 */
export interface BirthFormApiData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  lat: number;
  lon: number;
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  tzone: number;
}

/**
 * Type for validation errors
 */
export interface ValidationError {
  field: keyof BirthFormValues;
  message: string;
}

/**
 * Type for validation result
 */
export interface ValidationResult {
  isValid: boolean;
  data?: BirthFormValues;
  errors?: ValidationError[];
}

/**
 * Type for form field error state
 */
export interface FieldError {
  field: keyof BirthFormValues;
  message: string;
}

/**
 * Type for form submission response
 */
export interface FormSubmissionResponse {
  success: boolean;
  data?: BirthFormApiData;
  error?: string;
}
