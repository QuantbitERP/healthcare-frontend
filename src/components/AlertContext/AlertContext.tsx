"use client";
import React, { createContext, useContext, useState } from 'react';
import Alerts from '@/components/alerts/Alerts'; // Adjust path as needed

type AlertState = {
    show: boolean;
    variant: 'success' | 'warning' | 'danger' | 'primary' | 'secondary';
    heading: string;
    content: string;
};

type AlertContextType = {
    showAlert: (variant: AlertState['variant'], heading: string, content: string) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<AlertState>({ show: false, variant: 'success', heading: '', content: '' });

    const showAlert = (variant: AlertState['variant'], heading: string, content: string) => {
        setAlert({ show: true, variant, heading, content });
        setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert.show && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] max-w-md">
                    <Alerts
                        heading={alert.heading}
                        content={alert.content}
                        variant={alert.variant}
                        showCloseIcon
                        open={alert.show}
                        disappear
                        onClick={() => setAlert(prev => ({ ...prev, show: false }))}
                    />
                </div>
            )}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error('useAlert must be used within an AlertProvider');
    return context;
};