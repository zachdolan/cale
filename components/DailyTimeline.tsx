
import React from 'react';
import { CalendarTask } from '../types';

interface DailyTimelineProps {
  tasks: CalendarTask[];
  selectedDate: Date;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const DailyTimeline: React.FC<DailyTimelineProps> = ({ tasks, selectedDate, onToggleTask, onDeleteTask }) => {
  // Sort tasks: Timed tasks first (by time), then untimed tasks (by title)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    if (a.startTime) return -1;
    if (b.startTime) return 1;
    return a.title.localeCompare(b.title);
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-brand-500';
    }
  };

  const getPriorityBg = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50';
      case 'medium': return 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50';
      case 'low': return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50';
      default: return 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800';
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent toggling the task completion
    if (window.confirm('Permanently remove this event?')) {
      onDeleteTask(id);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      {/* Header Info */}
      <div className="mb-6 px-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
          {selectedDate.toLocaleDateString(undefined, { weekday: 'long' })}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
            {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            {tasks.length} {tasks.length === 1 ? 'Event' : 'Events'}
          </span>
        </div>
      </div>

      {/* Agenda List */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-hide">
        {sortedTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <h4 className="text-gray-900 dark:text-white font-bold">Clear Schedule</h4>
            <p className="text-sm text-gray-500 mt-1">No events planned for this day. Enjoy your free time!</p>
          </div>
        ) : (
          <div className="relative pl-4 space-y-6 pb-8">
            {/* The Timeline Line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800" />

            {sortedTasks.map((task) => (
              <div key={task.id} className="relative group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[13px] top-5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 z-10 transition-transform group-hover:scale-125 ${getPriorityColor(task.priority)} ${task.completed ? 'grayscale opacity-50' : ''}`} />

                <div 
                  className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md cursor-pointer relative ${getPriorityBg(task.priority)} ${task.completed ? 'opacity-50' : ''}`}
                  onClick={() => onToggleTask(task.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                          {task.startTime ? `${task.startTime}${task.endTime ? ` - ${task.endTime}` : ''}` : 'All Day'}
                        </span>
                        {task.priority && (
                          <span className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`} />
                        )}
                      </div>
                      
                      <h3 className={`font-bold text-gray-900 dark:text-white leading-snug break-words ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h3>
                      
                      {task.category && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-white dark:bg-black/20 text-[9px] font-black text-gray-500 dark:text-gray-400 rounded uppercase tracking-tighter">
                          {task.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={(e) => handleDelete(e, task.id)}
                        className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-800 shrink-0"
                        title="Delete Event"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTimeline;