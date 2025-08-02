'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { DateTimeForm } from './DateTimeForm/index';
import { useBirthFormStorage } from './hooks/useBirthFormStorage';
import { useFormSubmission } from './hooks/useFormSubmission';
import { BirthDataConfirmationModal, BirthFormErrorBoundary } from './components';
import { SharedHeader, SharedFooter } from '../../components/layout';
import { checkBrowserSupport } from './utils/browserSupport';
import { 
  FormHeader, 
  LocationSection, 
  BrowserWarning, 
  ErrorDisplay, 
  ActionButtons 
} from './components';

function BirthFormPageContent() {
  const router = useRouter();
  const { formData, updateFormData } = useBirthFormStorage();
  const { handleSubmit, isLoading, error: submissionError } = useFormSubmission();
  const [date, setDate] = React.useState(formData.birthDate || '');
  const [time, setTime] = React.useState(formData.birthTime || '');
  const [location, setLocation] = React.useState({
    name: formData.birthPlace || '',
    lat: formData.lat || 0,
    lon: formData.lon || 0,
    timezone: formData.timezone || 0
  });
  const [error, setError] = React.useState('');
  const [showErrors, setShowErrors] = React.useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [browserSupport, setBrowserSupport] = useState<ReturnType<typeof checkBrowserSupport> | null>(null);

  // Update local state when formData changes
  useEffect(() => {
    if (formData) {
      setDate(formData.birthDate || '');
      setTime(formData.birthTime || '');
      setLocation({
        name: formData.birthPlace || '',
        lat: formData.lat || 0,
        lon: formData.lon || 0,
        timezone: formData.timezone || 0
      });
    }
  }, [formData]);

  // Check browser support on mount
  useEffect(() => {
    const support = checkBrowserSupport();
    setBrowserSupport(support);
  }, []);

  // Get birth date from formData for timezone calculation
  const getBirthDate = () => {
    if (date) {
      const dateObj = new Date(date);
      return {
        day: dateObj.getDate(),
        month: dateObj.getMonth() + 1,
        year: dateObj.getFullYear(),
        hour: 0,
        minute: 0
      };
    }
    return undefined;
  };

  const handleNext = () => {
    setShowErrors(true); // Show errors when button is clicked
    
    // Validate date
    if (!date) {
      setError('Please select a date');
      return;
    }

    // Validate date is not in the future
    const selectedDate = new Date(date);
    const today = new Date();
    if (selectedDate > today) {
      setError('Birth date cannot be in the future');
      return;
    }

    // Validate time if not marked as unknown
    if (!time) {
      setError('Please select a birth time');
      return;
    }

    // Validate location
    if (!location.name || location.lat === 0 || location.lon === 0) {
      setError('Please select a valid location');
      return;
    }

    // Show confirmation modal
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmission = async () => {
    // Prepare form data for submission
    const formData = {
      birthDate: date,
      birthTime: time,
      birthPlace: location.name,
      lat: location.lat,
      lon: location.lon,
      timezone: location.timezone
    };

    try {
      // Submit form data and fetch chart
      await handleSubmit(formData);
      
      // Update centralized storage
      updateFormData(formData);
      
      // Set navigation loading state
      setIsNavigating(true);
      
      // Wait a moment to ensure session data is stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get session data from storage
      const sessionData = sessionStorage.getItem('astroSession');
      if (!sessionData) {
        throw new Error('Session data not found. Please try again.');
      }

      const parsedSession = JSON.parse(sessionData);
              // Session data before navigation
      
      // Navigate to qualified readings with session ID only
      await router.push(`/qualified-readings?sessionId=${parsedSession.sessionId}`);
    } catch (submissionError) {
      // Error is handled by the submission hook
      // Form submission failed
      setIsNavigating(false);
      console.error('❌ Error during form submission:', submissionError);
    }
  };

  return (
    <BirthFormErrorBoundary>
      {/* Header */}
      <SharedHeader />
      
      <div className={`${styles.container} vignette-bg`}>
        <div className={styles.content}>
          {/* Form Header */}
          <FormHeader />
          
          <div className={styles.form}>
            <div className={styles.section}>
              {/* Date and Time */}
              <DateTimeForm
                date={date}
                time={time}
                error=""
                onDateChange={(value) => {
                  setDate(value);
                  if (showErrors) setError('');
                }}
                onTimeChange={(value) => {
                  setTime(value);
                  if (showErrors) setError('');
                }}
                onNext={() => {}} // We'll handle this in the main form
              />

              {/* Location */}
              <LocationSection
                location={location}
                setLocation={setLocation}
                showErrors={showErrors}
                setError={setError}
                birthDate={getBirthDate()}
              />
            </div>
          </div>

          {/* Browser Compatibility Warning */}
          <BrowserWarning browserSupport={browserSupport} />

          {/* Centralized Error Display */}
          <ErrorDisplay 
            showErrors={showErrors} 
            error={error} 
            submissionError={submissionError} 
          />

          {/* Action Buttons */}
          <ActionButtons
            handleNext={handleNext}
            isLoading={isLoading}
            showErrors={showErrors}
            error={error}
          />
        </div>

        {/* Confirmation Modal */}
        <BirthDataConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleConfirmSubmission}
          birthData={{
            birthDate: date,
            birthTime: time,
            birthPlace: location.name,
            lat: location.lat,
            lon: location.lon,
            timezone: location.timezone,
          }}
          isLoading={isLoading || isNavigating}
        />
        
        {/* Footer */}
        <SharedFooter />
      </div>
    </BirthFormErrorBoundary>
  );
}

export default function BirthFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BirthFormPageContent />
    </Suspense>
  );
}