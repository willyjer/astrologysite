export interface DateTimeFormProps {
  date: string;
  time: string;
  error: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}
