import React from 'react';

function GlobalStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
      .font-poppins { font-family: 'Poppins', sans-serif; }
      .font-inter { font-family: 'Inter', sans-serif; }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
      .premium-hover { transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1); }
      .premium-hover:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
      .card-hover { transition: transform 200ms ease, box-shadow 200ms ease; }
      .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.04); }
      .btn-hover { transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease; }
      .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
      @keyframes soft-pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
      .notif-pulse { animation: soft-pulse 2s infinite; }
      .compliance-table th { background-color: #13294B; color: white; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
      .compliance-table tr:nth-child(even) { background-color: #F9FAFB; }
      .compliance-table tr:hover { background-color: #EAF2FF; }
      .text-open { color: #EF4444; font-weight: 700; }
      .text-cnf { color: #16A34A; font-weight: 700; }
    `,
      }}
    />
  );
}

export default GlobalStyles;
