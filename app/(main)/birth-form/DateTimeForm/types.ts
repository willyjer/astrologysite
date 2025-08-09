export interface DateTimeFormProps {
  readonly date: string;
  readonly time: string;
  readonly error: string;
  readonly onDateChange: (value: string) => void;
  readonly onTimeChange: (value: string) => void;
}
