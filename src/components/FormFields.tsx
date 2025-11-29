"use client";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        className={cn("input", error && "border-red-500", className)}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <textarea
        id={id}
        className={cn("input min-h-[100px]", error && "border-red-500", className)}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, className, id, options, ...props }: SelectProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <select
        id={id}
        className={cn("input", error && "border-red-500", className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusClasses: Record<string, string> = {
    active: "status-badge status-active",
    inactive: "status-badge status-inactive",
    pending: "status-badge status-pending",
    done: "status-badge status-done",
    open: "status-badge status-open",
    "in progress": "status-badge status-in-progress",
    "in_progress": "status-badge status-in-progress",
    closed: "status-badge status-closed",
  };

  return (
    <span className={statusClasses[status.toLowerCase()] || "status-badge status-inactive"}>
      {status}
    </span>
  );
}
