
import React from 'react';
import { CalendarTask } from '../types';

interface VisualBusynessProps {
  tasks: CalendarTask[];
}

const VisualBusyness: React.FC<VisualBusynessProps> = ({ tasks }) => {
  if (tasks.length === 0) return null;

  // We'll visualize busyness as a horizontal stack of color blocks 
  // where height or density represents priority/load.
  const score = tasks.reduce((acc, task) => {
    const priorityWeight = task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1;
    return acc + priorityWeight;
  }, 0);

  // Intensity levels
  const getIntensity = () => {
    if (score > 8) return 'bg-indigo-600 h-2.5';
    if (score > 5) return 'bg-indigo-400 h-2';
    if (score > 2) return 'bg-indigo-200 h-1.5';
    return 'bg-indigo-100 h-1';
  };

  return (
    <div className="w-full flex gap-0.5 items-end mt-auto pt-1">
      {tasks.slice(0, 12).map((task, idx) => (
        <div 
          key={task.id} 
          className={`flex-1 rounded-sm transition-all duration-300 ${
            task.priority === 'high' ? 'bg-rose-400 h-3' : 
            task.priority === 'medium' ? 'bg-amber-400 h-2' : 
            'bg-emerald-400 h-1'
          }`}
          title={`${task.title} (${task.priority})`}
        />
      ))}
      {tasks.length > 12 && <div className="text-[8px] text-gray-400 ml-1">+{tasks.length - 12}</div>}
    </div>
  );
};

export default VisualBusyness;
