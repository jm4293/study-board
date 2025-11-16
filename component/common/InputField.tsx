import React from "react";

type InputFieldProps = {
    id: string;
    name?: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    required?: boolean;
    rightSlot?: React.ReactNode;
};

export default function InputField({
    id,
    name,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    className,
    required,
    rightSlot,
}: InputFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {label}
            </label>
            <div className={rightSlot ? "relative mt-2" : ""}>
                <input
                    type={type}
                    id={id}
                    name={name ?? id}
                    className={
                        className ??
                        `w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 ${rightSlot ? "pr-10" : ""
                        } text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-blue-400`
                    }
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
                {rightSlot}
            </div>
        </div>
    );
}

