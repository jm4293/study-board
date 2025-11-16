import React from "react";

type SubmitButtonProps = {
    isSubmitting: boolean;
    children: React.ReactNode;
    loading?: React.ReactNode;
    className?: string;
    disabled?: boolean;
};

export default function SubmitButton({
    isSubmitting,
    children,
    loading = "Submitting...",
    className,
    disabled,
}: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={isSubmitting || disabled}
            className={
                className ??
                "w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
            }
        >
            {isSubmitting ? loading : children}
        </button>
    );
}

