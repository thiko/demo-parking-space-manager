import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';

interface LoginFormProps {
    onSuccess?: () => void;
}

interface LoginFormData {
    email: string;
    password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const { signIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoading(true);
            setError(null);

            await signIn(data.email, data.password);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'Anmeldung fehlgeschlagen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className= "card max-w-md mx-auto" >
        <h2 className="text-2xl font-bold mb-6" > Anmelden </h2>

    {
        error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" >
                { error }
                </div>
      )}

<form onSubmit={ handleSubmit(onSubmit) }>
    <div className="mb-4" >
        <label htmlFor="email" className = "label" > E - Mail </label>
            < input
id = "email"
type = "email"
className = "input"
disabled = { loading }
{...register('email', {
    required: 'E-Mail ist erforderlich',
    pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Ungültige E-Mail-Adresse'
    }
})
}
          />
{
    errors.email && (
        <p className="text-red-500 text-sm mt-1" > { errors.email.message } </p>
          )
}
</div>

    < div className = "mb-6" >
        <label htmlFor="password" className = "label" > Passwort </label>
            < input
id = "password"
type = "password"
className = "input"
disabled = { loading }
{...register('password', {
    required: 'Passwort ist erforderlich',
    minLength: {
        value: 6,
        message: 'Passwort muss mindestens 6 Zeichen lang sein'
    }
})
}
          />
{
    errors.password && (
        <p className="text-red-500 text-sm mt-1" > { errors.password.message } </p>
          )
}
</div>

    < button
type = "submit"
className = "btn btn-primary w-full"
disabled = { loading }
    >
    { loading? 'Wird angemeldet...': 'Anmelden' }
    </button>
    </form>
    </div>
  );
};

export default LoginForm; 