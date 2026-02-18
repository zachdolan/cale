
import React, { useState, useEffect } from 'react';
import { CalendarTask, Priority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: CalendarTask) => void;
  initialDate?: string;
}

const TimePicker: React.FC<{
  label: string;
  value: string;
  onChange: (time: string) => void;
}> = ({ label, value, onChange }) => {
  const [hStr, mStr] = value.split(':');
  const h24 = parseInt(hStr);
  const m = parseInt(mStr);

  const updateTime = (newH: number, newM: number) => {
    // Perpetual wrapping logic
    const wrappedH = (newH + 24) % 24;
    const wrappedM = (newM + 60) % 60;
    const formattedTime = `${wrappedH.toString().padStart(2, '0')}:${wrappedM.toString().padStart(2, '0')}`;
    onChange(formattedTime);
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl p-2 gap-3 justify-center">
        {/* Hour Column */}
        <div className="flex flex-col items-center">
          <button type="button" onClick={() => updateTime(h24 + 1, m)} className="p-1 text-gray-400 hover:text-brand-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <div className="flex flex-col items-center">
            <span className="font-black text-gray-900 dark:text-white text-xl tabular-nums">{h24.toString().padStart(2, '0')}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Hrs</span>
          </div>
          <button type="button" onClick={() => updateTime(h24 - 1, m)} className="p-1 text-gray-400 hover:text-brand-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        <span className="font-black text-gray-300 dark:text-gray-700 text-xl mt-[-8px]">:</span>

        {/* Minute Column */}
        <div className="flex flex-col items-center">
          <button type="button" onClick={() => updateTime(h24, (m + 5) % 60)} className="p-1 text-gray-400 hover:text-brand-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <div className="flex flex-col items-center">
            <span className="font-black text-gray-900 dark:text-white text-xl tabular-nums">{m.toString().padStart(2, '0')}</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Min</span>
          </div>
          <button type="button" onClick={() => updateTime(h24, (m - 5 + 60) % 60)} className="p-1 text-gray-400 hover:text-brand-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialDate }) => {
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    endDate: string;
    startTime: string;
    endTime: string;
    priority: Priority | 'none';
    category: string;
    description: string;
  }>({
    title: '',
    date: initialDate || new Date().toISOString().split('T')[0],
    endDate: initialDate || new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    priority: 'none',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (initialDate && isOpen) {
      setFormData(prev => ({ 
        ...prev, 
        date: initialDate, 
        endDate: initialDate 
      }));
      setIsMultiDay(false);
    }
  }, [initialDate, isOpen]);

  const handleStartTimeChange = (newStartTime: string) => {
    // Automatically set end time to 1 hour after start time
    const [h, m] = newStartTime.split(':').map(Number);
    const endH = (h + 1) % 24;
    const newEndTime = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    
    setFormData(prev => ({
      ...prev,
      startTime: newStartTime,
      endTime: newEndTime
    }));
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave({
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      date: formData.date,
      endDate: isMultiDay ? formData.endDate : formData.date,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
      priority: formData.priority === 'none' ? undefined : (formData.priority as Priority),
      category: formData.category || undefined,
      description: formData.description || undefined,
      completed: false,
    });

    setFormData({
      title: '',
      date: initialDate || new Date().toISOString().split('T')[0],
      endDate: initialDate || new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      priority: 'none',
      category: '',
      description: '',
    });
    setIsMultiDay(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">New Event</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Event Name</label>
            <input
              autoFocus
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="What are we doing?"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-bold text-lg text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date</label>
              <button 
                type="button"
                onClick={() => setIsMultiDay(!isMultiDay)}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all border ${
                  isMultiDay 
                  ? 'bg-brand-100 border-brand-200 text-brand-600 dark:bg-brand-900/30 dark:border-brand-800 dark:text-brand-400' 
                  : 'bg-gray-50 border-gray-100 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                {isMultiDay ? '− Multi-day' : '+ Multi-day'}
              </button>
            </div>
            
            <div className={`grid gap-4 transition-all duration-300 ${isMultiDay ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div className="space-y-1">
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => {
                    const newDate = e.target.value;
                    setFormData({ 
                      ...formData, 
                      date: newDate, 
                      endDate: isMultiDay && formData.endDate < newDate ? newDate : formData.endDate 
                    });
                  }}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white font-medium"
                />
              </div>

              {isMultiDay && (
                <div className="space-y-1 animate-in slide-in-from-right-4 duration-200">
                  <input
                    type="date"
                    min={formData.date}
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white font-medium"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TimePicker 
              label="Starts (24h)" 
              value={formData.startTime} 
              onChange={handleStartTimeChange} 
            />
            <TimePicker 
              label="Ends (24h)" 
              value={formData.endTime} 
              onChange={time => setFormData(f => ({ ...f, endTime: time }))} 
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Priority</label>
            <div className="flex gap-2">
              {(['none', 'low', 'medium', 'high'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border
                    ${formData.priority === p 
                      ? p === 'high' ? 'bg-rose-500 border-rose-500 text-white shadow-lg' :
                        p === 'medium' ? 'bg-amber-500 border-amber-500 text-white shadow-lg' :
                        p === 'low' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' :
                        'bg-gray-700 border-gray-700 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-gray-300'}
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-5 rounded-2xl font-black text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] px-6 py-5 bg-brand-600 text-white rounded-2xl font-black hover:bg-brand-700 shadow-xl shadow-brand-200 dark:shadow-none transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;