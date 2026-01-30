// components/ToggleSwitch.tsx
'use client';

import { useState } from 'react';

interface ToggleSwitchProps {
  defaultChecked?: boolean;
  label: string;
  description: string;
}

export default function ToggleSwitch({ defaultChecked = false, label, description }: ToggleSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const toggle = () => {
    setChecked(!checked);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked}
          onChange={toggle}
        />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );
}