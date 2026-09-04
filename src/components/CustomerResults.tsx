import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, RotateCcw, Scale } from 'lucide-react';

interface CustomerResultsProps {
  results: {
    status: 'pass' | 'warning' | 'fail';
    verdict: string;
    issues: string[];
  };
  onReset: () => void;
}

export const CustomerResults: React.FC<CustomerResultsProps> = ({ results, onReset }) => {
  const isGreen = results.status === 'pass';
  const isYellow = results.status === 'warning';
  const isRed = results.status === 'fail';

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-100 font-sans flex flex-col">
      <header className="h-16 border-b border-zinc-800 flex items-center px-6 bg-[#141414] shrink-0">
        <div className="flex items-center gap-2.5 text-amber-400">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-playfair text-xl font-bold text-white">MāpDrishti</span>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-full rounded-3xl border border-zinc-800 bg-[#181818] p-8 shadow-xl text-center">

          <div className="flex justify-center mb-6">
            {isGreen && (
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center border-4 border-green-500/30">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
            )}
            {isYellow && (
              <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center border-4 border-yellow-500/30">
                <AlertTriangle size={48} className="text-yellow-500" />
              </div>
            )}
            {isRed && (
              <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border-4 border-red-500/30">
                <XCircle size={48} className="text-red-500" />
              </div>
            )}
          </div>

          <h2 className={`text-3xl font-playfair font-bold mb-6 ${
            isGreen ? 'text-green-400' : isYellow ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {results.verdict}
          </h2>

          {results.issues && results.issues.length > 0 && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-left mb-8">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Things to note:</h3>
              <ul className="space-y-3">
                {results.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className={`mt-0.5 block w-1.5 h-1.5 rounded-full shrink-0 ${
                      isYellow ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="leading-relaxed">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(!results.issues || results.issues.length === 0) && (
             <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center mb-8">
                <p className="text-sm text-green-400/90 leading-relaxed">
                  We found all the required legal information on this package. It looks safe to purchase.
                </p>
             </div>
          )}

          <button
            onClick={onReset}
            className="w-full px-6 py-4 bg-zinc-800 text-white rounded-xl text-sm font-bold hover:bg-zinc-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            <span>Scan Another Product</span>
          </button>
        </div>
      </main>
    </div>
  );
};
