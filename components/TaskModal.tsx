
import React, { useState, useEffect } from 'react';
import { CalendarTask, Priority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: CalendarTask) => void;
  initialDate?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialDate }) => {
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    endDate: string;
    startTime: string;
    endTime: string;
    priority: Priority;
    category: string;
    description: string;
  }>({
    title: '',
    date: initialDate || new Date().toISOString().split('T')[0],
    endDate: initialDate || new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    priority: 'medium',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (initialDate) {
      setFormData(prev => ({ ...prev, date: initialDate, endDate: initialDate }));
    }
  }, [initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave({
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      date: formData.date,
      endDate: formData.endDate,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
      priority: formData.priority,
      category: formData.category || undefined,
      description: formData.description || undefined,
      completed: false,
    });

    // Reset
    setFormData({
      title: '',
      date: initialDate || new Date().toISOString().split('T')[0],
      endDate: initialDate || new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      priority: 'medium',
      category: '',
      description: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">NEW EVENT</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Event Title</label>
            <input
              autoFocus
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's happening?"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Start Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value, endDate: e.target.value < formData.endDate ? formData.endDate : e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">End Date (Optional)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Priority</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border
                    ${formData.priority === p 
                      ? p === 'high' ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200' :
                        p === 'medium' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200' :
                        'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
