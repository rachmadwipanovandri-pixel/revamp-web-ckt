"use client";

import type { ReactNode } from "react";

const controlClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-[#fafbfc] px-3 py-2 font-numeric text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="mb-0.5 block font-numeric text-xs font-medium text-slate-700">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={controlClass}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  rows = 3,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} resize-y`}
      />
    </Field>
  );
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={controlClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
