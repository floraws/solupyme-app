import React from 'react';

export interface CheckboxOption {
    value: string;
    label: string;
}

export interface CheckboxGroupProps {
    label: string;
    options: CheckboxOption[];
    value: string[];
    onChange: (values: string[]) => void;
    error?: string;
    required?: boolean;
    className?: string;
    columns?: 1 | 2 | 3 | 4;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    label,
    options,
    value = [],
    onChange,
    error,
    required = false,
    className = "",
    columns = 3
}) => {
    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
        if (checked) {
            onChange([...value, optionValue]);
        } else {
            onChange(value.filter(v => v !== optionValue));
        }
    };

    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4'
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-3">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className={`grid ${gridCols[columns]} gap-3`}>
                {options.map((option) => (
                    <label 
                        key={option.value} 
                        className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            value={option.value}
                            checked={value.includes(option.value)}
                            onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                ))}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
