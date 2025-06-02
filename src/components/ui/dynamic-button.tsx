"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Props for the DynamicButton component
 */
export interface DynamicButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  /**
   * The text displayed on the button
   * Required unless size="icon" and an icon is provided
   */
  label: string;
  /**
   * Optional icon component from lucide-react
   */
  icon?: LucideIcon;
  /**
   * Position of the icon relative to the label
   * @default "left"
   */
  iconPosition?: "left" | "right";
  /**
   * Visual style variant of the button
   * @default "default"
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /**
   * Size of the button
   * @default "default"
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * DynamicButton Component
 * 
 * A flexible button component with support for icons, multiple variants,
 * and sizes. Compatible with shadcn/ui design principles.
 * 
 * Features:
 * - Multiple visual variants (default, destructive, outline, etc.)
 * - Size options including icon-only mode
 * - Flexible icon positioning (left or right)
 * - Full accessibility support
 * - Ref forwarding
 */
const DynamicButton = React.forwardRef<HTMLButtonElement, DynamicButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      label,
      icon: Icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    // Base button styles
    const baseStyles = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors relative overflow-hidden",
      "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50"
    );

    // Variant styles
    const variantStyles = {
      default: "bg-red-600 text-white hover:bg-red-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      ghost: "text-gray-900 hover:bg-gray-100",
      link: "text-red-600 underline-offset-4 hover:underline"
    };

    // Size styles
    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 py-1 text-xs",
      lg: "h-12 px-8 py-3",
      icon: "h-10 w-10"
    };

    // Icon size based on button size
    const iconSize = {
      default: "h-4 w-4",
      sm: "h-3 w-3",
      lg: "h-5 w-5",
      icon: "h-5 w-5"
    };

    // Spacing between icon and label
    const iconSpacing = size === "icon" ? "" : iconPosition === "left" ? "mr-2" : "ml-2";

    // Animation variants
    const buttonVariants = {
      rest: { scale: 1 },
      hover: { scale: variant === "link" ? 1 : 1.05 },
      tap: { scale: 0.95 }
    };

    const iconVariants = {
      rest: { rotate: 0, scale: 1 },
      hover: { 
        rotate: iconPosition === "left" ? -15 : 15,
        scale: 1.2,
        transition: { type: "spring", stiffness: 300 }
      }
    };

    const textVariants = {
      rest: { y: 0 },
      hover: { 
        y: variant === "link" ? 0 : -2,
        transition: { type: "spring", stiffness: 300 }
      }
    };

    // Shimmer effect for default and destructive variants
    const shimmerVariants = {
      rest: { x: "-100%" },
      hover: { 
        x: "100%",
        transition: { 
          duration: 0.5,
          ease: "easeInOut"
        }
      }
    };

    const shouldShowShimmer = variant === "default" || variant === "destructive";

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        aria-label={size === "icon" ? label : undefined}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        {...props}
      >
        {/* Shimmer effect overlay */}
        {shouldShowShimmer && (
          <motion.div
            className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            variants={shimmerVariants}
            style={{ pointerEvents: "none" }}
          />
        )}
        {/* Icon on the left */}
        {Icon && iconPosition === "left" && (
          <motion.div
            variants={iconVariants}
            className={cn("inline-flex", iconSpacing)}
          >
            <Icon className={cn(iconSize[size])} aria-hidden="true" />
          </motion.div>
        )}
        
        {/* Label */}
        {size !== "icon" && (
          <motion.span
            variants={textVariants}
            className="inline-block"
          >
            {label}
          </motion.span>
        )}
        
        {/* Icon on the right */}
        {Icon && iconPosition === "right" && (
          <motion.div
            variants={iconVariants}
            className={cn("inline-flex", iconSpacing)}
          >
            <Icon className={cn(iconSize[size])} aria-hidden="true" />
          </motion.div>
        )}
      </motion.button>
    );
  }
);

DynamicButton.displayName = "DynamicButton";

export { DynamicButton };