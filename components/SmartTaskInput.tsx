
import React, { useState } from 'react';
import { parseNaturalLanguageTask } from '../services/geminiService';
import { CalendarTask } from '../types';

interface SmartTaskInputProps {
  onTaskAdded: (task: CalendarTask) => void;
  currentDate: Date;
}

const SmartTaskInput: React.FC<SmartTaskInputProps> = ({ onTaskAdded, currentDate }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const refDateStr = currentDate.toISOString().split('T')[0];
      const parsed = await parseNaturalLanguageTask(input, refDateStr);
      
      if (parsed) {
        onTaskAdded({
          ...parsed,
          id: Math.random().toString(36).substr(2, 9),
          completed: false
        });
        setInput('');
      }
    } catch (err) {
      console.error("Error adding task", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Try 'Gym tomorrow at 6pm' or 'Meeting 3pm high priority'..."
        className="w-full p-4 pl-12 pr-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
        disabled={isLoading}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
      </div>
      {isLoading ? (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <button 
          type="submit" 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white p-1.5 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      )}
    </form>
  );
};

export default SmartTaskInput;
