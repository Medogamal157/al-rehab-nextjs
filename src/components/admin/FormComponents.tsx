'use client';

import { useEffect, useState } from 'react';
import { ValidationRule, validateField } from '@/lib/form-validation';
import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'url' | 'number' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rules?: ValidationRule;
  serverError?: string;
  hint?: string;
  className?: string;
}

export function FormInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  rules,
  serverError,
  hint,
  className = '',
}: FormInputProps) {
  const [touched, setTouched] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // Validate on change after first touch
  useEffect(() => {
    if (touched && rules) {
      const error = validateField(value, { ...rules, required });
      setClientError(error);
    }
  }, [value, touched, rules, required]);

  const displayError = serverError || (touched ? clientError : null);
  const hasError = !!displayError;

  // Build validation attributes for native validation
  const validationAttrs: Record<string, unknown> = {};
  if (required) validationAttrs.required = true;
  if (rules?.minLength) validationAttrs.minLength = rules.minLength;
  if (rules?.maxLength) validationAttrs.maxLength = rules.maxLength;
  if (rules?.pattern) validationAttrs.pattern = rules.pattern.source;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent transition-colors ${
          hasError 
            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        {...validationAttrs}
      />
      {/* Hint text */}
      {hint && !hasError && (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
      {/* Validation constraints */}
      {rules && !hasError && !hint && (
        <p className="mt-1 text-xs text-gray-400">
          {rules.maxLength && `Max ${rules.maxLength} chars`}
          {rules.pattern && rules.patternMessage && ` • ${rules.patternMessage}`}
        </p>
      )}
      {/* Error message */}
      {hasError && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {displayError}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rules?: ValidationRule;
  serverError?: string;
  hint?: string;
  className?: string;
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  rows = 3,
  placeholder,
  required = false,
  disabled = false,
  rules,
  serverError,
  hint,
  className = '',
}: FormTextareaProps) {
  const [touched, setTouched] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    if (touched && rules) {
      const error = validateField(value, { ...rules, required });
      setClientError(error);
    }
  }, [value, touched, rules, required]);

  const displayError = serverError || (touched ? clientError : null);
  const hasError = !!displayError;
  const charCount = value.length;
  const maxLength = rules?.maxLength;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent transition-colors resize-none ${
          hasError 
            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      <div className="mt-1 flex justify-between items-center">
        <div>
          {hint && !hasError && (
            <p className="text-xs text-gray-500">{hint}</p>
          )}
          {hasError && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {displayError}
            </p>
          )}
        </div>
        {maxLength && (
          <p className={`text-xs ${charCount > maxLength * 0.9 ? 'text-amber-600' : 'text-gray-400'}`}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  serverError?: string;
  className?: string;
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  serverError,
  className = '',
}: FormSelectProps) {
  const hasError = !!serverError;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent transition-colors ${
          hasError 
            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {serverError}
        </p>
      )}
    </div>
  );
}

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export function FormCheckbox({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  hint,
  className = '',
}: FormCheckboxProps) {
  return (
    <div className={className}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 text-[#2d7a3e] focus:ring-[#2d7a3e] rounded"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
      {hint && <p className="mt-1 text-xs text-gray-500 ml-6">{hint}</p>}
    </div>
  );
}

interface FormErrorAlertProps {
  message?: string;
  onDismiss?: () => void;
}

export function FormErrorAlert({ message, onDismiss }: FormErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      )}
    </div>
  );
}
