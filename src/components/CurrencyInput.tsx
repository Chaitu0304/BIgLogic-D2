
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface CurrencyInputProps {
    value: number;
    onChange: (val: number) => void;
    className?: string;
    disabled?: boolean;
}

export const CurrencyInput = ({ value, onChange, className, disabled }: CurrencyInputProps) => {
    const [localValue, setLocalValue] = useState<string>(
        value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );

    // Sync with external value changes when not focused/editing (handled via simple effect with dependency)
    // To avoid fighting with user input, we only update if the external value is significantly different 
    // from our parsed local value, OR rely on a key prop in parent to force reset?
    // Better: Only reset if the external value changed and it wasn't triggered by our onChange.
    // But simplistic approach: unique key in parent map OR useEffect that checks if prop changed.

    useEffect(() => {
        // We can't differentiate easily between parent update from us vs others without more props.
        // However, since we update parent on every keystroke (for totals), this effect would fire.
        // To prevent cursor jump, we must NOT update localValue if it parses to the same number.
        const clean = localValue.replace(/,/g, '');
        const currentNum = parseFloat(clean);

        // Check if the incoming value matches our current parsed value.
        // If it does, don't touch localValue (preserves user's "1,000." while typing)
        if (Math.abs(currentNum - value) < 0.001) {
            return;
        }

        // If different, update (e.g. initial load or external reset)
        setLocalValue(value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value;

        // Allow digits, dots, commas, and negative sign
        // Remove invalid characters immediately
        if (!/^[-0-9.,]*$/.test(input)) return;

        // Limit to 2 decimal places
        if (input.includes('.')) {
            const parts = input.split('.');
            if (parts[1].length > 2) return;
        }

        setLocalValue(input);

        // Parse for parent
        const clean = input.replace(/,/g, '');
        const num = parseFloat(clean);
        if (!isNaN(num)) {
            onChange(num);
        }
    };

    const handleBlur = () => {
        const clean = localValue.replace(/,/g, '');
        const num = parseFloat(clean);
        if (!isNaN(num)) {
            const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            setLocalValue(formatted);
            onChange(num); // Ensure parent has clean number
        } else {
            // Revert to 0 if invalid? or keep valid previous?
            // Revert to prop value
            setLocalValue(value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
    };

    return (
        <Input
            type="text"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${className} focus-visible:ring-0 focus-visible:border-none focus:outline-none`}
            // The crucial part for "border should not appear as white to all items" 
            // is ensuring default focus ring is removed and border is transparent or none.
            // Tailwind's ring util handles the focus ring.
            disabled={disabled}
        />
    );
};
