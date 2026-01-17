"use client";

import * as React from "react";

type BaseProps = {
  label: string;
  name: string;
  helperText?: string;
  error?: string;
  required?: boolean;
};

type InputProps = BaseProps & {
  as?: "input";
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

type TextareaProps = BaseProps & {
  as: "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
};

type SelectProps = BaseProps & {
  as: "select";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
};

type FormFieldProps = InputProps | TextareaProps | SelectProps;

export function FormField(props: FormFieldProps) {
  const { label, name, helperText, error, required } = props;

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>

      {props.as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          rows={props.rows ?? 4}
          className={[
            "w-full rounded-md border px-3 py-2 text-sm outline-none",
            "focus:ring-2 focus:ring-black/10",
            error ? "border-red-400" : "border-gray-300",
          ].join(" ")}
        />
      ) : props.as === "select" ? (
        <select
          id={name}
          name={name}
          value={props.value}
          onChange={props.onChange}
          className={[
            "w-full rounded-md border px-3 py-2 text-sm outline-none bg-white",
            "focus:ring-2 focus:ring-black/10",
            error ? "border-red-400" : "border-gray-300",
          ].join(" ")}
        >
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={props.type ?? "text"}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          className={[
            "w-full rounded-md border px-3 py-2 text-sm outline-none",
            "focus:ring-2 focus:ring-black/10",
            error ? "border-red-400" : "border-gray-300",
          ].join(" ")}
        />
      )}

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
