import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Reservation, ReservationFormData } from '../types';
import { fetchReservations, createReservation, updateReservation, deleteReservation } from '../utils/api';
import ReservationList from '../components/reservations/ReservationList';
import ReservationForm from '../components/reservations/ReservationForm';
import DateRangeFilter from '../components/reservations/DateRangeFilter';
import { format, addDays } from 'date-fns';
import { toast } from 'react-hot-toast';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [startDate, setStartDate] = useState<string>(
        format(new Date(), "yyyy-MM-dd'T'00:00:00'Z'")
    );
    const [endDate, setEndDate] = useState<string>(
        format(addDays(new Date(), 7), "yyyy-MM-dd'T'23:59:59'Z'")
    );

    const loadReservations = async () => {
        try {
            setLoading(true);
            const data = await fetchReservations(startDate, endDate);
            setReservations(data);
        } catch (error) {
            toast.error('Fehler beim Laden der Reservierungen');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadReservations();
        }
    }, [user, startDate, endDate]);

    const handleFilter = (newStartDate: string, newEndDate: string) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const handleCreateReservation = async (data: ReservationFormData) => {
        try {
            await createReservation(data);
            toast.success('Reservierung erfolgreich erstellt');
            setShowForm(false);
            loadReservations();
        } catch (error: any) {
            if (error.message.includes('bereits reserviert')) {
                toast.error('Der gewählte Zeitraum ist bereits reserviert');
            } else {
                toast.error('Fehler beim Erstellen der Reservierung');
            }
            throw error;
        }
    };

    const handleUpdateReservation = async (data: ReservationFormData) => {
        if (!editingReservation) return;

        try {
            await updateReservation(editingReservation.id, data);
            toast.success('Reservierung erfolgreich aktualisiert');
            setEditingReservation(null);
            loadReservations();
        } catch (error: any) {
            if (error.message.includes('bereits reserviert')) {
                toast.error('Der gewählte Zeitraum ist bereits reserviert');
            } else {
                toast.error('Fehler beim Aktualisieren der Reservierung');
            }
            throw error;
        }
    };

    const handleDeleteReservation = async (reservation: Reservation) => {
        if (!window.confirm('Sind Sie sicher, dass Sie diese Reservierung löschen möchten?')) {
            return;
        }

        try {
            await deleteReservation(reservation.id);
            toast.success('Reservierung erfolgreich gelöscht');
            loadReservations();
        } catch (error) {
            toast.error('Fehler beim Löschen der Reservierung');
            console.error(error);
        }
    };

    const handleEditReservation = (reservation: Reservation) => {
        setEditingReservation(reservation);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingReservation(null);
    };

    if (!user) {
        return (
            <div className= "container mx-auto px-4 py-8" >
            <div className="text-center" >
                <h1 className="text-3xl font-bold mb-4" > Parkplatz - Reservierungssystem </h1>
                    < p className = "text-lg mb-6" > Bitte melden Sie sich an, um Reservierungen zu verwalten.</p>
                        </div>
                        </div>
    );
  }

return (
    <div className= "container mx-auto px-4 py-8" >
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6" >
        <h1 className="text-3xl font-bold mb-4 md:mb-0" > Parkplatz - Reservierungen </h1>

{
    !showForm && !editingReservation && (
        <button
            className="btn btn-primary"
    onClick = {() => setShowForm(true)
}
          >
    Neue Reservierung
        </button>
        )}
</div>

{
    (showForm || editingReservation) && (
        <div className="mb-8" >
            <ReservationForm
            onSubmit={ editingReservation ? handleUpdateReservation : handleCreateReservation }
    initialData = { editingReservation || undefined
}
isEditing = {!!editingReservation}
onCancel = { handleCancelForm }
    />
    </div>
      )}

<DateRangeFilter onFilter={ handleFilter } />

{
    loading ? (
        <div className= "text-center py-8" >
        <p className="text-gray-500" > Reservierungen werden geladen...</p>
            </div>
      ) : (
        <ReservationList
          reservations= { reservations }
    onEdit = { handleEditReservation }
    onDelete = { handleDeleteReservation }
    currentUserId = { user.id }
        />
      )
}
</div>
  );
};

export default HomePage; 