import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format, setHours, setMinutes } from 'date-fns';
import { de } from 'date-fns/locale';
import { Reservation, ReservationFormData } from '../../types';
import 'react-datepicker/dist/react-datepicker.css';

interface ReservationFormProps {
    onSubmit: (data: ReservationFormData) => Promise<void>;
    initialData?: Reservation;
    isEditing?: boolean;
    onCancel: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
    onSubmit,
    initialData,
    isEditing = false,
    onCancel,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const defaultStartTime = initialData
        ? new Date(initialData.start_time)
        : setHours(setMinutes(new Date(), 0), 8); // 8:00 Uhr

    const defaultEndTime = initialData
        ? new Date(initialData.end_time)
        : setHours(setMinutes(new Date(), 0), 17); // 17:00 Uhr

    const { control, handleSubmit, formState: { errors } } = useForm<ReservationFormData>({
        defaultValues: {
            start_time: initialData ? initialData.start_time : format(defaultStartTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
            end_time: initialData ? initialData.end_time : format(defaultEndTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
            description: initialData?.description || '',
        },
    });

    const handleFormSubmit = async (data: ReservationFormData) => {
        try {
            setLoading(true);
            setError(null);

            await onSubmit(data);
        } catch (err: any) {
            setError(err.message || 'Ein Fehler ist aufgetreten');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className= "card" >
        <h2 className="text-xl font-bold mb-4" >
            { isEditing? 'Reservierung bearbeiten': 'Neue Reservierung' }
            </h2>

    {
        error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" >
                { error }
                </div>
      )}

<form onSubmit={ handleSubmit(handleFormSubmit) }>
    <div className="mb-4" >
        <label className="label" > Startzeit </label>
            < Controller
control = { control }
name = "start_time"
rules = {{ required: 'Startzeit ist erforderlich' }}
render = {({ field }) => (
    <DatePicker
                selected= { field.value ? new Date(field.value) : null }
onChange = {(date) => field.onChange(date ? format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : '')}
showTimeSelect
timeFormat = "HH:mm"
timeIntervals = { 30}
dateFormat = "dd.MM.yyyy HH:mm"
className = "input"
locale = { de }
disabled = { loading }
    />
            )}
          />
{
    errors.start_time && (
        <p className="text-red-500 text-sm mt-1" > { errors.start_time.message } </p>
          )
}
</div>

    < div className = "mb-4" >
        <label className="label" > Endzeit </label>
            < Controller
control = { control }
name = "end_time"
rules = {{ required: 'Endzeit ist erforderlich' }}
render = {({ field }) => (
    <DatePicker
                selected= { field.value ? new Date(field.value) : null }
onChange = {(date) => field.onChange(date ? format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : '')}
showTimeSelect
timeFormat = "HH:mm"
timeIntervals = { 30}
dateFormat = "dd.MM.yyyy HH:mm"
className = "input"
locale = { de }
disabled = { loading }
    />
            )}
          />
{
    errors.end_time && (
        <p className="text-red-500 text-sm mt-1" > { errors.end_time.message } </p>
          )
}
</div>

    < div className = "mb-6" >
        <label className="label" > Beschreibung(optional) </label>
            < Controller
control = { control }
name = "description"
render = {({ field }) => (
    <textarea
                className= "input"
rows = { 3}
disabled = { loading }
{...field }
              />
            )}
          />
    </div>

    < div className = "flex justify-end space-x-2" >
        <button
            type="button"
className = "btn btn-secondary"
onClick = { onCancel }
disabled = { loading }
    >
    Abbrechen
    </button>
    < button
type = "submit"
className = "btn btn-primary"
disabled = { loading }
    >
{
    loading
    ? isEditing? 'Wird aktualisiert...': 'Wird erstellt...'
              : isEditing? 'Aktualisieren': 'Erstellen'
}
    </button>
    </div>
    </form>
    </div>
  );
};

export default ReservationForm; 