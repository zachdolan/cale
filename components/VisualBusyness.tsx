
import React from 'react';
import { CalendarTask } from '../types';

interface VisualBusynessProps {
  tasks: CalendarTask[];
}

const VisualBusyness: React.FC<VisualBusynessProps> = ({ tasks }) => {
  if (tasks.length === 0) return null;

  // We'll visualize busyness as a horizontal stack of color blocks 
  const getTaskColor = (task: CalendarTask) => {
    if (task.completed) return 'bg-gray-200 dark:bg-gray-800';
    switch (task.priority) {
      case 'high': return 'bg-rose-400';
      case 'medium': return 'bg-amber-400';
      case 'low': return 'bg-emerald-400';
      default: return 'bg-indigo-300 dark:bg-indigo-600';
    }
  };

  const getTaskHeight = (task: CalendarTask) => {
    if (task.completed) return 'h-1';
    switch (task.priority) {
      case 'high': return 'h-3';
      case 'medium': return 'h-2';
      case 'low': return 'h-1.5';
      default: return 'h-1';
    }
  };

  return (
    <div className="w-full flex gap-0.5 items-end mt-auto pt-1">
      {tasks.slice(0, 12).map((task) => (
        <div 
          key={task.id} 
          className={`flex-1 rounded-sm transition-all duration-300 ${getTaskColor(task)} ${getTaskHeight(task)}`}
          title={`${task.title} (${task.priority || 'No priority'})`}
        />
      ))}
      {tasks.length > 12 && <div className="text-[8px] text-gray-400 ml-1">+{tasks.length - 12}</div>}
    </div>
  );
};

export default VisualBusyness;
