
export type Priority = 'low' | 'medium' | 'high';

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO format: YYYY-MM-DD (Start Date)
  endDate?: string; // ISO format: YYYY-MM-DD (End Date for ranges)
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  priority: Priority;
  completed: boolean;
  category?: string;
}

export interface DayActivity {
  date: string;
  tasks: CalendarTask[];
}
