"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Option interface for DynamicSelect
 */
export interface DynamicSelectOption {
  /**
   * The actual value of the option
   */
  value: string;
  /**
   * The display text for the option
   */
  label: string;
  /**
   * Optional key that corresponds to an image path in AppAssets
   */
  imageKey?: string;
  /**
   * Optional key that corresponds to an overlay image in AppAssets
   */
  overlayKey?: string;
}

/**
 * Props for the DynamicSelect component
 */
export interface DynamicSelectProps {
  /**
   * Optional label for the select group
   */
  label?: string;
  /**
   * Placeholder text for the select trigger
   */
  placeholder?: string;
  /**
   * Array of options to display in the select
   */
  options: DynamicSelectOption[];
  /**
   * Controlled component value
   */
  value?: string;
  /**
   * Callback when the value changes
   * Provides both the new value and the full selected option object
   */
  onValueChange?: (value: string, selectedOption: DynamicSelectOption) => void;
  /**
   * Optional classes for the main wrapper
   */
  containerClassName?: string;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Name attribute for the select
   */
  name?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
}

/**
 * DynamicSelect Component
 * 
 * A wrapper around shadcn/ui Select component that provides
 * enhanced functionality for image-based selections.
 * 
 * Features:
 * - Options with associated image and overlay keys
 * - Enhanced onChange callback with full option data
 * - Consistent styling with project design system
 * - Full shadcn/ui Select functionality
 */
export function DynamicSelect({
  label,
  placeholder = "Select an option",
  options,
  value,
  onValueChange,
  containerClassName,
  disabled,
  name,
  required,
}: DynamicSelectProps) {
  // Handle value change and provide full option data
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      const selectedOption = options.find(opt => opt.value === newValue);
      if (selectedOption && onValueChange) {
        onValueChange(newValue, selectedOption);
      }
    },
    [options, onValueChange]
  );

  return (
    <div className={cn("w-full space-y-2", containerClassName)}>
      {/* Optional label above the select */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        name={name}
        required={required}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length > 0 ? (
            <SelectGroup>
              {label && <SelectLabel>{label}</SelectLabel>}
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : (
            <div className="py-2 px-3 text-sm text-gray-500">
              No options available
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// Re-export the base Select components for convenience
export {
  Select as DynamicSelectRoot,
  SelectTrigger as DynamicSelectTrigger,
  SelectValue as DynamicSelectValue,
  SelectContent as DynamicSelectContent,
  SelectItem as DynamicSelectItem,
  SelectLabel as DynamicSelectLabel,
  SelectGroup as DynamicSelectGroup,
} from "@/components/ui/select";