'use client';
import { useRef, KeyboardEvent, ClipboardEvent } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  disabled?: boolean;
}

export default function OTPInput({ value, onChange, length = 6, disabled = false }: OTPInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const focus = (i: number) => inputs.current[i]?.focus();

  const handleChange = (i: number, ch: string) => {
    const d = ch.replace(/\D/g, '').slice(-1);
    const next = digits.slice();
    next[i] = d;
    onChange(next.join(''));
    if (d && i < length - 1) focus(i + 1);
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[i]) { const n = digits.slice(); n[i] = ''; onChange(n.join('')); }
      else if (i > 0) { focus(i - 1); }
    } else if (e.key === 'ArrowLeft' && i > 0) focus(i - 1);
    else if (e.key === 'ArrowRight' && i < length - 1) focus(i + 1);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(paste.padEnd(length, '').slice(0, length));
    focus(Math.min(paste.length, length - 1));
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`w-11 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
            d ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 focus:border-primary'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      ))}
    </div>
  );
}
