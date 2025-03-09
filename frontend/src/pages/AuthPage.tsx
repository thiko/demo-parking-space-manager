import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    // Wenn der Benutzer bereits angemeldet ist, zur Hauptseite weiterleiten
    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className= "container mx-auto px-4 py-12" >
        <div className="max-w-md mx-auto" >
            <h1 className="text-3xl font-bold text-center mb-8" > Parkplatz - Reservierungssystem </h1>

                < div className = "bg-white rounded-lg shadow-md overflow-hidden" >
                    <div className="flex border-b" >
                        <button
              className={
        `flex-1 py-3 font-medium ${activeTab === 'login'
            ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
            : 'text-gray-500 hover:text-gray-700'
        }`
    }
    onClick = {() => setActiveTab('login')}
            >
    Anmelden
    </button>
    < button
className = {`flex-1 py-3 font-medium ${activeTab === 'register'
        ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
        : 'text-gray-500 hover:text-gray-700'
    }`}
onClick = {() => setActiveTab('register')}
            >
    Registrieren
    </button>
    </div>

    < div className = "p-6" >
        { activeTab === 'login' ? (
        <LoginForm />
    ) : (
        <RegisterForm onSuccess= {() => setActiveTab('login')} />
            )}
</div>
    </div>
    </div>
    </div>
  );
};

export default AuthPage; 