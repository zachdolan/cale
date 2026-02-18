
import React, { useState, useEffect, useMemo } from 'react';
import SmartTaskInput from './components/SmartTaskInput';
import DayCell from './components/DayCell';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import { CalendarTask } from './types';

const STORAGE_KEY = 'lumina_calendar_tasks';

type ViewMode = 'month' | 'week';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<CalendarTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

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
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const selectedDateTasks = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return tasks.filter(task => isDateInRange(dateStr, task.date, task.endDate));
  }, [selectedDate, tasks]);

  const today = new Date();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Lumina
            <span className="bg-indigo-600 text-white text-sm px-3 py-1 rounded-full font-bold">CALENDAR</span>
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Smart AI scheduling with visual density tracking.</p>
        </div>
        <div className="w-full md:w-1/2">
          <SmartTaskInput onTaskAdded={addTask} currentDate={selectedDate} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-2">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 min-w-[150px]">
                  {viewMode === 'month' 
                    ? currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
                    : `Week of ${daysInWeek[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                  }
                </h2>
                <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                  <button 
                    onClick={() => setViewMode('month')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Month
                  </button>
                  <button 
                    onClick={() => setViewMode('week')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'week' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Week
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={() => {
                    const now = new Date();
                    setCurrentDate(now);
                    setSelectedDate(now);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors text-sm font-bold text-gray-600"
                >
                  Today
                </button>
                <button 
                  onClick={() => navigate(1)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            <div className={`grid grid-cols-7 gap-2 flex-1 ${viewMode === 'week' ? 'items-stretch' : ''}`}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center py-2 text-xs font-black text-gray-400 uppercase tracking-widest">{day}</div>
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
                      onClick={() => dateObj && setSelectedDate(dateObj)}
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
                      onClick={() => setSelectedDate(dateObj)}
                      isExpanded={true}
                    />
                  );
                })
              )}
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4 h-full">
          <div className="sticky top-8 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 min-h-[600px] flex flex-col">
            <div className="mb-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-dashed border-gray-200 text-gray-500 rounded-2xl hover:border-indigo-400 hover:text-indigo-600 transition-all font-bold text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Create New Event
              </button>
            </div>
            <TaskList 
              tasks={selectedDateTasks} 
              selectedDate={selectedDate}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          </div>
        </aside>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTask}
        initialDate={selectedDate.toISOString().split('T')[0]}
      />
    </div>
  );
};

export default App;
