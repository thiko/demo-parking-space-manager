/**
 * Parkplatz-Reservierungssystem - Backend
 * 
 * Dieses Modul dient als Einstiegspunkt für das Backend des Parkplatz-Reservierungssystems.
 * Es verwendet Supabase Edge Functions für die Verwaltung von Parkplatzreservierungen.
 * 
 * Die folgenden Edge Functions sind implementiert:
 * - list-reservations: Listet alle Reservierungen innerhalb eines bestimmten Datums- und Zeitbereichs auf
 * - create-reservation: Erstellt eine neue Reservierung
 * - update-reservation: Aktualisiert eine bestehende Reservierung
 * - delete-reservation: Löscht eine bestehende Reservierung
 * 
 * Weitere Informationen finden Sie in der README.md-Datei.
 */

// Dieser Einstiegspunkt ist hauptsächlich für die Dokumentation gedacht.
// Die eigentliche Funktionalität wird in den einzelnen Edge Functions implementiert.

export const version = '1.0.0';

export const endpoints = {
    listReservations: '/list-reservations',
    createReservation: '/create-reservation',
    updateReservation: '/update-reservation/:id',
    deleteReservation: '/delete-reservation/:id',
};

export const schema = {
    reservations: {
        id: 'UUID (Primärschlüssel)',
        user_id: 'UUID (Fremdschlüssel zur Supabase Auth-Tabelle)',
        start_time: 'Timestamp mit Zeitzone',
        end_time: 'Timestamp mit Zeitzone',
        description: 'Text (optional)',
        created_at: 'Timestamp mit Zeitzone (automatisch)',
    },
}; 