import React from 'react';
import { Gift } from 'lucide-react';

interface ReferralButtonProps {
  onClick: () => void;
}

export default function ReferralButton({ onClick }: ReferralButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
    >
      <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      Refer & Earn
      <div className="absolute -top-1 -right-1 bg-yellow-400 text-orange-900 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
        NEW
      </div>
    </button>
  );
}
