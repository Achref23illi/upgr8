"use client";

import * as React from "react";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { SimpleLoadingScreen } from "@/components/common/SimpleLoadingScreen";
import { motion } from "framer-motion";
import Image from "next/image";

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
      newErrors.email = "Le courriel est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse courriel valide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mock accounts
  const mockAccounts = [
    {
      email: "coach@upgr8.com",
      password: "coach123",
      type: "coach",
      name: "Coach Martin",
      redirectPath: "/dashboard/coach"
    },
    {
      email: "player@upgr8.com", 
      password: "player123",
      type: "player",
      name: "Alexandre Dubois",
      redirectPath: "/player"
    }
  ];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay with longer loading time to show the 3D animation
    setTimeout(() => {
      // Check mock accounts
      const account = mockAccounts.find(
        acc => acc.email === formData.email && acc.password === formData.password
      );

      if (account) {
        // Store user data in localStorage
        localStorage.setItem('userType', account.type);
        localStorage.setItem('userData', JSON.stringify({
          name: account.name,
          email: account.email,
          type: account.type
        }));

        if (onLoginSubmit) {
          onLoginSubmit(formData);
        } else {
          // Redirect based on account type
          console.log("Login successful:", account);
          window.location.href = account.redirectPath;
        }
      } else {
        // Invalid credentials
        setErrors({
          email: "Courriel ou mot de passe invalide",
          password: "Courriel ou mot de passe invalide"
        });
      }
      
      setIsSubmitting(false);
    }, 3000); // Increased to 3 seconds to show the hockey stick animation
  };

  // Animation variants for the form container
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      {/* Simple Loading Screen */}
      <SimpleLoadingScreen isLoading={isSubmitting} />
      
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Logo Section */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <div className="inline-flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="UpGr8 Logo" 
                width={320} 
                height={112}
                priority
                className="w-auto h-24"
              />
            </div>
          </motion.div>

          {/* Main Card Container */}
          <motion.div 
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-4"
            variants={itemVariants}
          >
            {/* Header Text */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-1">Connectez-vous à votre compte</h1>
              <p className="text-gray-600 text-sm">Bon retour ! Veuillez entrer vos informations.</p>
              
              {/* Demo Accounts */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-left">
                <p className="text-xs font-medium text-blue-900 mb-2">Comptes de démonstration :</p>
                <div className="text-xs text-blue-800 space-y-1">
                  <div><strong>Entraîneur :</strong> coach@upgr8.com / coach123</div>
                  <div><strong>Joueur :</strong> player@upgr8.com / player123</div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <DynamicInput
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Entrez votre courriel"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    className="h-10 text-sm"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <DynamicInput
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Entrez votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between">
                {/* Remember Me Checkbox */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-offset-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Se souvenir pendant 30 jours</span>
                </label>

                {/* Forgot Password Link */}
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigateToForgotPassword) {
                      onNavigateToForgotPassword();
                    }
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Sign In Button */}
              <div className="pt-1">
                <DynamicButton
                  label={isSubmitting ? "Connexion..." : "Se connecter"}
                  type="submit"
                  variant="default"
                  className="w-full h-10 text-sm font-medium bg-red-600 text-white border-0 hover:bg-red-700 focus:ring-red-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* Create Account Link */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Vous n&apos;avez pas de compte ?{" "}
                  <a 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigateToCreateAccount) {
                        onNavigateToCreateAccount();
                      } else {
                        window.location.href = "/signup";
                      }
                    }}
                    className="font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    S&apos;inscrire
                  </a>
                </span>
              </div>
            </form>
          </motion.div>

          {/* Footer Links */}
          <motion.div 
            variants={itemVariants}
            className="mt-4 flex items-center justify-center space-x-4 text-sm"
          >
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              © 2025 UpGr8
            </a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Politique de confidentialité
            </a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Conditions d&apos;utilisation
            </a>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default LoginScreen;