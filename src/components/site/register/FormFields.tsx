"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { AlertCircle, Check } from "lucide-react";

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function Label({ htmlFor, children, required }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[10px] sm:text-[11px] uppercase tracking-[0.08em] font-semibold text-blanc/60 mb-2"
    >
      {children}
      {required && <span className="text-[#C9A227] ml-1">*</span>}
    </label>
  );
}

interface FieldWrapperProps {
  error?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ error, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {children}
      {error && (
        <p
          role="alert"
          className="text-red-400 text-[11px] flex items-center gap-1.5"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`
          w-full px-4 py-3.5 rounded-xl
          bg-noir text-blanc
          text-base sm:text-sm
          placeholder:text-blanc/30
          border transition-all duration-200
          focus:outline-none
          ${
            error
              ? "border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-400/20"
              : "border-blanc/[0.08] focus:border-[#C9A227]/60 focus:ring-1 focus:ring-[#C9A227]/20"
          }
          ${className}
        `}
      />
    );
  }
);
Input.displayName = "Input";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`
          w-full px-4 py-3.5 rounded-xl
          bg-noir text-blanc
          text-base sm:text-sm
          placeholder:text-blanc/30
          border transition-all duration-200
          min-h-[120px]
          focus:outline-none
          ${
            error
              ? "border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-400/20"
              : "border-blanc/[0.08] focus:border-[#C9A227]/60 focus:ring-1 focus:ring-[#C9A227]/20"
          }
          ${className}
        `}
      />
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  id?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  error,
  id,
}: SelectProps) {
  return (
    <FieldWrapper error={error}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-3.5 rounded-xl
          bg-noir border text-blanc
          text-base sm:text-sm
          transition-all duration-200
          focus:outline-none
          ${
            error
              ? "border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-400/20"
              : "border-blanc/[0.08] focus:border-[#C9A227]/60 focus:ring-1 focus:ring-[#C9A227]/20"
          }
        `}
      >
        {placeholder && (
          <option value="" className="bg-[#1A1A1A] text-blanc/50">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-[#1A1A1A] text-blanc"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
}: RadioGroupProps) {
  return (
    <FieldWrapper error={error}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5
              rounded-xl border cursor-pointer
              text-xs sm:text-sm font-medium
              transition-all duration-200 select-none
              min-h-[44px]
              ${
                value === opt.value
                  ? "border-[#C9A227]/60 bg-[#C9A227]/[0.1] text-[#C9A227]"
                  : "border-blanc/[0.08] text-blanc/60 hover:border-blanc/20 hover:text-blanc bg-noir"
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
              aria-label={opt.label}
            />
            <span
              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                ${value === opt.value ? "border-[#C9A227]" : "border-blanc/30"}`}
              aria-hidden="true"
            >
              {value === opt.value && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] block" />
              )}
            </span>
            <span className="leading-snug">{opt.label}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
}

interface CheckboxProps {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function Checkbox({ id, label, checked, onChange, error }: CheckboxProps) {
  return (
    <FieldWrapper error={error}>
      <label
        htmlFor={id}
        className="flex items-start gap-3 cursor-pointer group min-h-[44px] py-1"
      >
        <div
          className={`
            mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
            transition-all duration-200
            ${
              checked
                ? "bg-[#C9A227] border-[#C9A227]"
                : "border-blanc/20 group-hover:border-[#C9A227]/50"
            }
          `}
          aria-hidden="true"
        >
          {checked && <Check className="w-3 h-3 text-noir" strokeWidth={3} />}
        </div>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className="text-xs sm:text-sm text-blanc/80 leading-relaxed pt-0.5">
          {label}
        </span>
      </label>
    </FieldWrapper>
  );
}
