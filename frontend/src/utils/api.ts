import { Reservation, ReservationFormData } from '../types';
import { supabase } from './supabase';

// Hilfsfunktion zum Abrufen des Authentifizierungstokens
const getAuthToken = async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
};

// Hilfsfunktion für API-Anfragen
const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    const token = await getAuthToken();

    if (!token) {
        throw new Error('Nicht authentifiziert');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    return fetch(`/functions/v1/${endpoint}`, {
        ...options,
        headers,
    });
};

// Reservierungen abrufen
export const fetchReservations = async (
    startDate: string,
    endDate: string
): Promise<Reservation[]> => {
    try {
        const response = await fetchWithAuth(
            `list-reservations?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Fehler beim Abrufen der Reservierungen');
        }

        const data = await response.json();
        return data.reservations;
    } catch (error) {
        console.error('Fehler beim Abrufen der Reservierungen:', error);
        throw error;
    }
};

// Neue Reservierung erstellen
export const createReservation = async (
    reservationData: ReservationFormData
): Promise<Reservation> => {
    try {
        const response = await fetchWithAuth('create-reservation', {
            method: 'POST',
            body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Fehler beim Erstellen der Reservierung');
        }

        const data = await response.json();
        return data.reservation;
    } catch (error) {
        console.error('Fehler beim Erstellen der Reservierung:', error);
        throw error;
    }
};

// Reservierung aktualisieren
export const updateReservation = async (
    id: string,
    reservationData: Partial<ReservationFormData>
): Promise<Reservation> => {
    try {
        const response = await fetchWithAuth(`update-reservation/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Fehler beim Aktualisieren der Reservierung');
        }

        const data = await response.json();
        return data.reservation;
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Reservierung:', error);
        throw error;
    }
};

// Reservierung löschen
export const deleteReservation = async (id: string): Promise<void> => {
    try {
        const response = await fetchWithAuth(`delete-reservation/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Fehler beim Löschen der Reservierung');
        }
    } catch (error) {
        console.error('Fehler beim Löschen der Reservierung:', error);
        throw error;
    }
}; 