import React from 'react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 flex flex-col">
      {children}
    </div>
  );
};
