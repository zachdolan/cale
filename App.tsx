
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DayCell from './components/DayCell';
import DailyTimeline from './components/DailyTimeline';
import TaskModal from './components/TaskModal';
import PasswordGate from './components/PasswordGate';
import { CalendarTask } from './types';

const STORAGE_KEY = 'lumina_calendar_tasks';
const THEME_KEY = 'lumina_theme';

type ViewMode = 'month' | 'week';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('lumina_auth') === 'true';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return (saved as Theme) || 'light';
  });

  const [tasks, setTasks] = useState<CalendarTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  }, [currentDate]);

  const daysInWeek = useMemo(() => {
    const curr = new Date(currentDate);
    const day = curr.getDay(); 
    const first = curr.getDate() - day; 
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(curr.setDate(first + i));
      return d;
    });
  }, [currentDate]);

  const navigate = (direction: number) => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (direction * 7));
      setCurrentDate(newDate);
    }
  };

  const isDateInRange = (targetDateStr: string, startDateStr: string, endDateStr?: string) => {
    if (!endDateStr || startDateStr === endDateStr) {
      return targetDateStr === startDateStr;
    }
    return targetDateStr >= startDateStr && targetDateStr <= endDateStr;
  };

  const getTasksForDateString = (dateStr: string) => {
    return tasks.filter(task => isDateInRange(dateStr, task.date, task.endDate));
  };

  const addTask = (task: CalendarTask) => {
    setTasks(prev => [...prev, task]);
    const taskDate = new Date(task.date);
    setCurrentDate(taskDate);
    setSelectedDate(taskDate);
    setIsModalOpen(false);
    setIsTimelineOpen(true);
  };

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const selectedDateTasks = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return tasks.filter(task => isDateInRange(dateStr, task.date, task.endDate));
  }, [selectedDate, tasks]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsTimelineOpen(true);
  };

  const today = new Date();

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col overflow-hidden">
      <div className="w-full flex-1 flex flex-col overflow-hidden">
        
        {/* Compact Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
              Lumina
              <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">CAL</span>
            </h1>
            <div className="h-6 w-px bg-gray-100 dark:bg-gray-800" />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all font-bold text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add Event
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-500 hover:text-indigo-600 transition-all"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              )}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Calendar View */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-[1200px] mx-auto flex flex-col h-full min-h-[600px]">
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {viewMode === 'month' 
                      ? currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
                      : `Week of ${daysInWeek[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                    }
                  </h2>
                  <div className="bg-white dark:bg-gray-900 p-1 rounded-2xl border border-gray-200 dark:border-gray-800 flex gap-1 shadow-sm">
                    <button 
                      onClick={() => setViewMode('month')}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'month' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                      Month
                    </button>
                    <button 
                      onClick={() => setViewMode('week')}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'week' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                      Week
                    </button>
                  </div>
                </div>

                <div className="flex items-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  <button onClick={() => navigate(-1)} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <div className="h-6 w-px bg-gray-100 dark:bg-gray-800" />
                  <button 
                    onClick={() => {
                      const now = new Date();
                      setCurrentDate(now);
                      handleDayClick(now);
                    }}
                    className="px-6 py-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Today
                  </button>
                  <div className="h-6 w-px bg-gray-100 dark:bg-gray-800" />
                  <button onClick={() => navigate(1)} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3 flex-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center pb-4 text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">{day}</div>
                ))}
                
                {viewMode === 'month' ? (
                  daysInMonth.map((day, idx) => {
                    const dateObj = day !== null ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
                    const dateStr = dateObj?.toISOString().split('T')[0] || '';
                    const isToday = dateObj?.toDateString() === today.toDateString();
                    const isSelected = dateObj?.toDateString() === selectedDate.toDateString();
                    
                    return (
                      <DayCell 
                        key={idx}
                        day={day}
                        tasks={getTasksForDateString(dateStr)}
                        isToday={isToday}
                        isSelected={isSelected}
                        onClick={() => dateObj && handleDayClick(dateObj)}
                      />
                    );
                  })
                ) : (
                  daysInWeek.map((dateObj, idx) => {
                    const dateStr = dateObj.toISOString().split('T')[0];
                    const isToday = dateObj.toDateString() === today.toDateString();
                    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
                    
                    return (
                      <DayCell 
                        key={idx}
                        day={dateObj.getDate()}
                        tasks={getTasksForDateString(dateStr)}
                        isToday={isToday}
                        isSelected={isSelected}
                        onClick={() => handleDayClick(dateObj)}
                        isExpanded={true}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </main>

          {/* Expanded Sidebar Agenda */}
          {isTimelineOpen && (
            <aside className="w-[400px] border-l border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl z-20 overflow-hidden flex flex-col animate-in slide-in-from-right duration-500 ease-out">
              <div className="flex-1 overflow-hidden p-8 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Timeline</span>
                  <button 
                    onClick={() => setIsTimelineOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                
                <div className="flex-1 min-h-0">
                  <DailyTimeline 
                    tasks={selectedDateTasks} 
                    selectedDate={selectedDate}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                  />
                </div>
              </div>
            </aside>
          )}
        </div>

        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={addTask}
          initialDate={selectedDate.toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};

export default App;
