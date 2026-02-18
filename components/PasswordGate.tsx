
import React, { useState } from 'react';

interface PasswordGateProps {
  onAuthenticated: () => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'zachdolan') {
      sessionStorage.setItem('lumina_auth', 'true');
      onAuthenticated();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-12 space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Lumina
          </h1>
          <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-xs">
            Restricted Access
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className={`w-full bg-white/5 border-2 ${
                error ? 'border-rose-500 animate-shake' : 'border-white/10'
              } rounded-2xl px-6 py-5 text-white text-center text-xl font-bold placeholder:text-white/20 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all shadow-2xl`}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-900/20"
          >
            UNLOCK CALENDAR
          </button>
        </form>
        
        <p className="mt-12 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          Authorized Users Only
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default PasswordGate;
