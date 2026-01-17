"use client";

import * as React from "react";

type FormProps = {
  title?: string;
  description?: string;
  error?: string | null;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  className?: string;
};

export function Form({
  title,
  description,
  error,
  children,
  onSubmit,
  className,
}: FormProps) {
  return (
    <form onSubmit={onSubmit} className={className ?? "space-y-6"}>
      {(title || description) && (
        <header className="space-y-1">
          {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </header>
      )}

      {error ? (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">{children}</div>
    </form>
  );
}
