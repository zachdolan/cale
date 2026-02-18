
import React from 'react';
import { CalendarTask } from '../types';
import VisualBusyness from './VisualBusyness';

interface DayCellProps {
  day: number | null;
  tasks: CalendarTask[];
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
  isExpanded?: boolean;
}

const DayCell: React.FC<DayCellProps> = ({ day, tasks, isToday, isSelected, onClick, isExpanded }) => {
  if (day === null) {
    return <div className="h-24 md:h-32 bg-gray-50/30 dark:bg-gray-900/30 rounded-lg"></div>;
  }

  return (
    <div 
      onClick={onClick}
      className={`p-2 border rounded-xl transition-all cursor-pointer flex flex-col relative
        ${isExpanded ? 'h-full min-h-[400px]' : 'h-24 md:h-32'}
        ${isSelected 
          ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/30 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' 
          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'}
        ${isToday ? 'border-indigo-300 dark:border-indigo-500' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
          {day}
        </span>
        {tasks.length > 0 && (
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md">
            {tasks.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-hidden mt-2">
        <div className="space-y-1.5">
          {tasks.slice(0, isExpanded ? 10 : 2).map(task => {
            const isMultiDay = task.endDate && task.endDate !== task.date;
            return (
              <div 
                key={task.id} 
                className={`text-[10px] truncate px-1.5 py-1 rounded shadow-sm transition-colors
                  ${task.completed 
                    ? 'opacity-50 bg-gray-50 dark:bg-gray-950 text-gray-400 dark:text-gray-600' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}
                  ${isMultiDay ? 'border-l-2 border-l-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border border-gray-100 dark:border-gray-700'}
                  ${!task.completed && task.priority === 'high' ? 'border-r-2 border-r-rose-400' : ''}
                  ${!task.completed && task.priority === 'medium' ? 'border-r-2 border-r-amber-400' : ''}
                  ${!task.completed && task.priority === 'low' ? 'border-r-2 border-r-emerald-400' : ''}
                `}
              >
                <div className="flex items-center gap-1">
                  {task.startTime && !isMultiDay && <span className="text-indigo-500 dark:text-indigo-400 font-bold shrink-0">{task.startTime}</span>}
                  {isMultiDay && (
                    <svg className="shrink-0 text-indigo-400" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3"/><path d="m15 18 6-6-6-6"/></svg>
                  )}
                  <span className="truncate">{task.title}</span>
                </div>
              </div>
            );
          })}
          {!isExpanded && tasks.length > 2 && (
            <div className="text-[9px] text-gray-400 dark:text-gray-600 text-center font-bold">
              +{tasks.length - 2} more
            </div>
          )}
        </div>
      </div>

      <VisualBusyness tasks={tasks} />
    </div>
  );
};

export default DayCell;
