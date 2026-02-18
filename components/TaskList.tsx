
import React from 'react';
import { CalendarTask } from '../types';

interface TaskListProps {
  tasks: CalendarTask[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  selectedDate: Date;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask, selectedDate }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    if (a.startTime) return -1;
    if (b.startTime) return 1;
    return 0;
  });

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-xl font-bold text-gray-900">
          {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </h2>
        <span className="text-sm text-gray-500">{tasks.length} tasks</span>
      </div>

      {tasks.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400">No tasks for this day yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <div 
              key={task.id} 
              className={`group flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all ${task.completed ? 'opacity-60' : ''}`}
            >
              <button 
                onClick={() => onToggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                  task.completed 
                    ? 'bg-indigo-500 border-indigo-500 text-white' 
                    : 'border-gray-200 hover:border-indigo-400'
                }`}
              >
                {task.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold text-gray-800 ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  {task.priority === 'high' && (
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">High</span>
                  )}
                  {task.endDate && task.endDate !== task.date && (
                    <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                      Multi-day
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                  {task.startTime && (
                    <span className="flex items-center gap-1 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {task.startTime} {task.endTime ? `- ${task.endTime}` : ''}
                    </span>
                  )}
                  {task.endDate && task.endDate !== task.date && (
                    <span className="flex items-center gap-1 shrink-0 text-indigo-500 font-medium">
                      {formatDateShort(task.date)} — {formatDateShort(task.endDate)}
                    </span>
                  )}
                  {task.category && (
                    <span className="flex items-center gap-1 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                      {task.category}
                    </span>
                  )}
                </div>
              </div>

              <button 
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-rose-500 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
