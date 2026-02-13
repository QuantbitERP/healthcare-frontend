'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { checkFrappeSession, redirectToFrappeLogin } from '@/utils/sessionAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Wraps pages that require authentication
 * Automatically checks for Frappe session if not authenticated
 */
export default function ProtectedRoute({
    children,
    requireAuth = true
}: ProtectedRouteProps) {
    const { isAuthenticated, loginWithSession, isInitialized } = useAuth();
    // const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [hasCheckedSession, setHasCheckedSession] = useState(false);

    useEffect(() => {
        if (!isInitialized) return;

        const checkAuth = async () => {
            // If already authenticated, no need to check session
            if (isAuthenticated) {
                setIsChecking(false);
                return;
            }

            // If we've already checked session once, don't check again
            if (hasCheckedSession) {
                setIsChecking(false);
                if (requireAuth) {
                    // Redirect to Frappe login if authentication is required
                    redirectToFrappeLogin();
                }
                return;
            }

            // Check for Frappe session
            try {
                console.log('ProtectedRoute: Checking for Frappe session...');
                const sessionUser = await checkFrappeSession();

                if (sessionUser && sessionUser.user) {
                    console.log('ProtectedRoute: Found session, logging in...');
                    loginWithSession(
                        sessionUser.user,
                        sessionUser.api_key,
                        sessionUser.api_secret
                    );
                } else {
                    console.log('ProtectedRoute: No session found');
                    if (requireAuth) {
                        // Redirect to Frappe login
                        redirectToFrappeLogin();
                    }
                }
            } catch (error) {
                console.error('ProtectedRoute: Error checking session:', error);
                if (requireAuth) {
                    redirectToFrappeLogin();
                }
            } finally {
                setHasCheckedSession(true);
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [isInitialized, isAuthenticated, requireAuth, hasCheckedSession, loginWithSession]);

    // Show loading state while checking
    if (isChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                        <span className="text-4xl">🔄</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        Verifying Authentication...
                    </h2>
                    <p className="text-gray-600">
                        Please wait
                    </p>
                </div>
            </div>
        );
    }

    // If authentication is required but user is not authenticated, don't render children
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
