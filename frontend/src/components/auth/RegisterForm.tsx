import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';

interface RegisterFormProps {
    onSuccess?: () => void;
}

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const { signUp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
    const password = watch('password');

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setLoading(true);
            setError(null);

            await signUp(data.email, data.password);

            setSuccess(true);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'Registrierung fehlgeschlagen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className= "card max-w-md mx-auto" >
        <h2 className="text-2xl font-bold mb-6" > Registrieren </h2>

    {
        error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" >
                { error }
                </div>
      )}

{
    success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" >
            Registrierung erfolgreich! Bitte überprüfen Sie Ihre E - Mail, um Ihr Konto zu bestätigen.
        </div>
      )
}

<form onSubmit={ handleSubmit(onSubmit) }>
    <div className="mb-4" >
        <label htmlFor="email" className = "label" > E - Mail </label>
            < input
id = "email"
type = "email"
className = "input"
disabled = { loading || success}
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

    < div className = "mb-4" >
        <label htmlFor="password" className = "label" > Passwort </label>
            < input
id = "password"
type = "password"
className = "input"
disabled = { loading || success}
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

    < div className = "mb-6" >
        <label htmlFor="confirmPassword" className = "label" > Passwort bestätigen </label>
            < input
id = "confirmPassword"
type = "password"
className = "input"
disabled = { loading || success}
{...register('confirmPassword', {
    required: 'Passwort bestätigen ist erforderlich',
    validate: value => value === password || 'Passwörter stimmen nicht überein'
})
}
          />
{
    errors.confirmPassword && (
        <p className="text-red-500 text-sm mt-1" > { errors.confirmPassword.message } </p>
          )
}
</div>

    < button
type = "submit"
className = "btn btn-primary w-full"
disabled = { loading || success}
        >
    { loading? 'Wird registriert...': 'Registrieren' }
    </button>
    </form>
    </div>
  );
};

export default RegisterForm; 