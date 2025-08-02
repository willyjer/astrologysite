import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { birthFormSchema, validateBirthForm } from '../utils/validation';
import { BirthFormValues } from '../types';
import { useState, useEffect } from 'react';
import { useBirthFormStorage } from './useBirthFormStorage';

export interface UseBirthFormReturn {
  form: ReturnType<typeof useForm<BirthFormValues>>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  selectedReadings: string[];
}

export const useBirthForm = (): UseBirthFormReturn => {
  const router = useRouter();
  const { formData, readings, updateFormData, navigateToStep } = useBirthFormStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Create form instance with zod validation
  const form = useForm<BirthFormValues>({
    resolver: zodResolver(birthFormSchema),
    defaultValues: {
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      lat: 0,
      lon: 0,
      timezone: 0
    },
    mode: 'onChange',
  });

  // Sync form with storage data when it changes
  useEffect(() => {
    if (formData) {
      // Set form values from storage
      form.reset({
        birthDate: formData.birthDate || '',
        birthTime: formData.birthTime || '',
        birthPlace: formData.birthPlace || '',
        lat: formData.lat || 0,
        lon: formData.lon || 0,
        timezone: formData.timezone || 0,
      });
    }
  }, [formData, form]);

  const handleSubmit: SubmitHandler<BirthFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      // Validate with Zod schema
      const validation = validateBirthForm(data);
      if (!validation.isValid) {
        setSubmissionError('Validation failed. Please check your input.');
        return;
      }

      // Use the centralized storage hook to update all form data
      updateFormData({
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        birthPlace: data.birthPlace,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
      });
      
      // Navigate to confirmation page with readings in URL
      navigateToStep('/birth-form/confirmation');
        } catch (submissionError) {
      const errorMessage = submissionError instanceof Error ? submissionError.message : 'An error occurred';
      setSubmissionError(errorMessage);
      // Submission error
    } finally {
      setIsSubmitting(false);
    }
  };

  const formError = form.formState.errors ? Object.values(form.formState.errors)[0]?.message || null : null;
  const error = submissionError || formError;

  return {
    form,
    onSubmit: form.handleSubmit(handleSubmit),
    isLoading: form.formState.isSubmitting || isSubmitting,
    error,
    selectedReadings: readings,
  };
}; 