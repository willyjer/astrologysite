# DateTimeForm Component

A form component for collecting user's birth date and time information in the birth form flow.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `date` | `string` | Current value of the birth date field (yyyy-mm-dd) |
| `time` | `string` | Current value of the birth time field (hh:mm) |
| `dontKnowTime` | `boolean` | Whether the "I don't know my birth time" checkbox is checked |
| `error` | `string` | Error message to display (if any) |
| `onDateChange` | `(value: string) => void` | Handler for date changes |
| `onTimeChange` | `(value: string) => void` | Handler for time changes |
| `onDontKnowTimeChange` | `(checked: boolean) => void` | Handler for the checkbox state change |
| `onNext` | `() => void` | Handler for the Next button click |
| `onBack` | `() => void` | Handler for the Back button click |

## Usage

```tsx
<DateTimeForm 
  date={date}
  time={time}
  dontKnowTime={dontKnowTime}
  error={error}
  onDateChange={(value) => {
    setDate(value);
    setError('');
  }}
  onTimeChange={(value) => {
    setTime(value);
    setError('');
  }}
  onDontKnowTimeChange={handleDontKnowTimeChange}
  onNext={handleNext}
  onBack={handleBack}
/>
```

## Features

- Date and time input fields with validation
- Option to mark birth time as unknown
- Error display for invalid inputs
- Navigation buttons for form flow

## Styling

The component uses CSS modules for styling with the following classes:
- `.form`: Container for the entire form
- `.fieldGroup`: Container for the input fields and checkbox group
- `.inputRow`: Row layout for the date and time inputs
- `.checkboxGroup`: Container for the "don't know time" checkbox and label
- `.checkbox`: Custom-styled checkbox input
- `.checkboxLabel`: Styled label for the checkbox
- `.buttons`: Container for the navigation buttons

All styles follow the AstroAware Tablet Intake Style Guide. 