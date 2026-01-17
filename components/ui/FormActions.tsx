"use client";

import * as React from "react";
import Link from "next/link";

type FormActionsProps = {
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelHref?: string;
};

export function FormActions({
  isSubmitting,
  submitLabel = "Save",
  cancelHref,
}: FormActionsProps) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>

      {cancelHref ? (
        <Link
          href={cancelHref}
          className="text-sm text-muted-foreground hover:underline"
        >
          Cancel
        </Link>
      ) : null}
    </div>
  );
}
