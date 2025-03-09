import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/auth');
        } catch (error) {
            console.error('Fehler beim Abmelden:', error);
        }
    };

    return (
        <div className= "min-h-screen flex flex-col bg-gray-50" >
        <header className="bg-white shadow-sm" >
            <div className="container mx-auto px-4 py-4" >
                <div className="flex justify-between items-center" >
                    <Link to="/" className = "text-xl font-bold text-primary-600" >
                        Parkplatz - Reservierungssystem
                        </Link>

    {
        user ? (
            <div className= "flex items-center space-x-4" >
            <span className="text-sm text-gray-600" >
                { user.email }
                </span>
                < button
        onClick = { handleSignOut }
        className = "text-sm text-gray-600 hover:text-gray-900"
            >
            Abmelden
            </button>
            </div>
            ) : (
    <Link to= "/auth" className = "text-sm text-primary-600 hover:text-primary-800" >
        Anmelden
        </Link>
            )}
</div>
    </div>
    </header>

    < main className = "flex-grow" >
        { children }
        </main>

        < footer className = "bg-white border-t border-gray-200 mt-auto" >
            <div className="container mx-auto px-4 py-6" >
                <div className="text-center text-gray-500 text-sm" >
            & copy; { new Date().getFullYear() } Parkplatz - Reservierungssystem
    </div>
    </div>
    </footer>

    < Toaster
position = "top-right"
toastOptions = {{
    duration: 3000,
        style: {
        background: '#fff',
            color: '#333',
          },
    success: {
        style: {
            background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                    color: '#1E40AF',
            },
    },
    error: {
        style: {
            background: '#FEF2F2',
                border: '1px solid #FECACA',
                    color: '#B91C1C',
            },
    },
}}
      />
    </div>
  );
};

export default Layout; 