'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { checkFrappeSession, redirectToFrappeLogin } from '@/utils/sessionAuth';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'login' | 'primary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  const baseClasses = "w-full px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg";

  const variantClasses = {
    login: 'bg-emerald-500 hover:bg-emerald-600',
    primary: 'bg-blue-500 hover:bg-blue-600'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loginWithSession, isInitialized } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    // Only check session after auth context is initialized
    if (!isInitialized) return;

    const checkAndAuthenticateSession = async () => {
      try {
        // If already authenticated, skip session check
        if (isAuthenticated) {
          setIsCheckingSession(false);
          return;
        }

        console.log("Checking for Frappe session...");
        const sessionUser = await checkFrappeSession();

        if (sessionUser && sessionUser.user) {
          console.log("Found active Frappe session, logging in...");

          if (!sessionUser.api_key || !sessionUser.api_secret) {
            console.warn("User session found but API keys are missing. Using session cookies.");
          }

          loginWithSession(
            sessionUser.user,
            sessionUser.api_key,
            sessionUser.api_secret
          );
          // Redirect to POS after successful session login
          router.push('/pos');
        } else {
          console.log("No active Frappe session found");
          setSessionError("No active session found. Please login to the main system first.");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setSessionError("Error checking session. Please try again.");
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkAndAuthenticateSession();
  }, [isInitialized, isAuthenticated, loginWithSession, router]);

  const handleRedirectPR = () => {
    router.push('/PR');
  };

  const handleRedirectPOS = () => {
    router.push('/pos');
  };

  const handleRedirectToFrappeLogin = () => {
    redirectToFrappeLogin();
  };

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <span className="text-4xl">🔄</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Checking Session...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your authentication
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">🏥</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Hospital Management
          </h1>
          {isAuthenticated && (
            <p className="text-green-600 font-semibold">✓ Authenticated</p>
          )}
        </div>

        {/* Session Error Message */}
        {sessionError && !isAuthenticated && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800 text-sm font-medium mb-3">{sessionError}</p>
            <button
              onClick={handleRedirectToFrappeLogin}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
            >
              Login to Main System
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="space-y-4 mb-8">
          {!isAuthenticated && (
            <Button
              variant="login"
              onClick={handleRedirectToFrappeLogin}
            >
              🔐 Login to Main System
            </Button>
          )}

          <Button
            variant="primary"
            onClick={handleRedirectPR}
          >
            📋 Patient Requisition
          </Button>

          <Button
            variant="primary"
            onClick={handleRedirectPOS}
          >
            💰 Sale Bill
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-100">
          <p className="text-gray-500">
            Healthcare management system
          </p>
        </div>
      </div>
    </div>
  );
}