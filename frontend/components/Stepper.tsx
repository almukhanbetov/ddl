'use client';

export default function Stepper({
  value,
  max,
  min = 1,
  onChange,
  small = false,
}: {
  value: number;
  max: number;
  min?: number;
  onChange: (next: number) => void;
  small?: boolean;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  return (
    <div className="stepper">
      <button type="button" disabled={value <= min} onClick={() => onChange(clamp(value - 1))}>
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        readOnly
        value={value}
        style={small ? { width: 34, fontSize: 13.5 } : undefined}
      />
      <button type="button" disabled={value >= max} onClick={() => onChange(clamp(value + 1))}>
        +
      </button>
    </div>
  );
}
