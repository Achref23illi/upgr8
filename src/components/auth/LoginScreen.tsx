"use client";

import * as React from "react";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { SimpleLoadingScreen } from "@/components/common/SimpleLoadingScreen";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Form values interface for login submission
 */
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Props for the LoginScreen component
 */
export interface LoginScreenProps {
  /**
   * Optional callback for handling login form submission
   */
  onLoginSubmit?: (data: LoginFormValues) => void;
  /**
   * Optional callback for navigating to create account page
   */
  onNavigateToCreateAccount?: () => void;
  /**
   * Optional callback for navigating to forgot password page
   */
  onNavigateToForgotPassword?: () => void;
}

/**
 * LoginScreen Component
 * 
 * A full-page login interface with modern design and animations.
 * Uses the custom DynamicInput and DynamicButton components.
 * 
 * Features:
 * - Email and password inputs with automatic icons
 * - Password visibility toggle
 * - Remember me checkbox (optional)
 * - Forgot password link
 * - Create account call-to-action
 * - Responsive design with animated entrance
 */
export function LoginScreen({
  onLoginSubmit,
  onNavigateToCreateAccount,
  onNavigateToForgotPassword
}: LoginScreenProps) {
  // Form state management
  const [formData, setFormData] = React.useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = React.useState<Partial<LoginFormValues>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormValues]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof LoginFormValues];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormValues> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay with longer loading time to show the 3D animation
    setTimeout(() => {
      if (onLoginSubmit) {
        onLoginSubmit(formData);
      } else {
        // Default behavior - redirect to dashboard
        console.log("Login submitted:", formData);
        window.location.href = "/dashboard";
      }
      setIsSubmitting(false);
    }, 3000); // Increased to 3 seconds to show the hockey stick animation
  };

  // Animation variants for the form container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Simple Loading Screen */}
      <SimpleLoadingScreen isLoading={isSubmitting} />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section with Logo */}
          <motion.div 
            className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center"
            variants={itemVariants}
          >
            {/* Logo Placeholder */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-red-100">Enter your credentials to access your account</p>
          </motion.div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Email Input */}
              <DynamicInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                containerClassName="space-y-2"
              />

              {/* Password Input */}
              <DynamicInput
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                containerClassName="space-y-2"
              />
            </motion.div>

            {/* Remember Me & Forgot Password Row */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              {/* Remember Me Checkbox */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>

              {/* Forgot Password Link */}
              <DynamicButton
                label="Forgot Password?"
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToForgotPassword) {
                    onNavigateToForgotPassword();
                  } else {
                    alert("Navigate to Forgot Password");
                  }
                }}
                className="text-sm p-0 h-auto"
              />
            </motion.div>

            {/* Sign In Button */}
            <motion.div variants={itemVariants}>
              <DynamicButton
                label={isSubmitting ? "Signing in..." : "Sign In"}
                type="submit"
                variant="default"
                className="w-full"
                disabled={isSubmitting}
              />
            </motion.div>

            {/* Divider */}
            <motion.div 
              variants={itemVariants}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New to UpGr8?</span>
              </div>
            </motion.div>

            {/* Create Account Button */}
            <motion.div variants={itemVariants}>
              <DynamicButton
                label="Create Account"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToCreateAccount) {
                    onNavigateToCreateAccount();
                  } else {
                    window.location.href = "/signup";
                  }
                }}
                className="w-full"
              />
            </motion.div>
          </form>
        </div>

        {/* Footer Text */}
        <motion.p 
          variants={itemVariants}
          className="text-center text-sm text-gray-500 mt-6"
        >
          By signing in, you agree to our{" "}
          <a href="#" className="text-red-600 hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>
        </motion.p>
      </motion.div>
    </div>
    </>
  );
}

export default LoginScreen;