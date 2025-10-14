'use client';
import { useRouter } from 'next/navigation';

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

  const handleRedirectPR = () => {
    router.push('/PR');
  };

  const handleRedirectPOS = () => {
    router.push('/pos');
  };

  const handleRedirectLogin = () => {
    router.push('/login');
  };

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
          
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4 mb-8">
          <Button
            variant="login"
            onClick={handleRedirectLogin}
          >
            🔐 Login
          </Button>
          
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