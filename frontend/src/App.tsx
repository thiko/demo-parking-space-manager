import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';

// Geschützte Route-Komponente
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen" > Wird geladen...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return <>{ children } </>;
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
        <Route path= "/auth" element = {< AuthPage />} />
            < Route
path = "/"
element = {
          < ProtectedRoute >
    <HomePage />
    </ProtectedRoute>
        }
      />
    < Route path = "*" element = {< Navigate to = "/" replace />} />
        </Routes>
  );
};

const App: React.FC = () => {
    return (
        <Router>
        <AuthProvider>
        <Layout>
        <AppRoutes />
        </Layout>
        </AuthProvider>
        </Router>
    );
};

export default App; 