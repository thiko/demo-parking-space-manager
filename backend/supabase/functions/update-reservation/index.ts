// @ts-ignore: Deno-spezifische Importe
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, errorResponse, getUserFromRequest, successResponse, supabaseClient } from '../config.ts';

interface UpdateReservationBody {
    start_time?: string;
    end_time?: string;
    description?: string;
}

serve(async (req: Request) => {
    // CORS-Präflug-Anfragen behandeln
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Nur PUT-Anfragen erlauben
        if (req.method !== 'PUT') {
            return errorResponse('Nur PUT-Anfragen sind erlaubt', 405);
        }

        // Benutzer authentifizieren
        const user = await getUserFromRequest(req);
        if (!user) {
            return errorResponse('Nicht authentifiziert', 401);
        }

        // Reservierungs-ID aus der URL extrahieren
        const url = new URL(req.url);
        const pathParts = url.pathname.split('/');
        const reservationId = pathParts[pathParts.length - 1];

        if (!reservationId) {
            return errorResponse('Reservierungs-ID ist erforderlich', 400);
        }

        // Überprüfen, ob die Reservierung existiert und dem Benutzer gehört
        const { data: existingReservation, error: fetchError } = await supabaseClient
            .from('reservations')
            .select('*')
            .eq('id', reservationId)
            .single();

        if (fetchError) {
            console.error('Fehler beim Abrufen der Reservierung:', fetchError);
            return errorResponse('Reservierung nicht gefunden', 404);
        }

        if (existingReservation.user_id !== user.id) {
            return errorResponse('Sie sind nicht berechtigt, diese Reservierung zu bearbeiten', 403);
        }

        // Anfragekörper parsen
        const updates = await req.json() as UpdateReservationBody;

        // Mindestens ein zu aktualisierendes Feld ist erforderlich
        if (!updates.start_time && !updates.end_time && updates.description === undefined) {
            return errorResponse('Mindestens ein zu aktualisierendes Feld ist erforderlich', 400);
        }

        // Datum und Zeit validieren, falls vorhanden
        let startTime = existingReservation.start_time;
        let endTime = existingReservation.end_time;

        if (updates.start_time) {
            const newStartTime = new Date(updates.start_time);
            if (isNaN(newStartTime.getTime())) {
                return errorResponse('Ungültiges Startzeit-Format', 400);
            }
            startTime = updates.start_time;
        }

        if (updates.end_time) {
            const newEndTime = new Date(updates.end_time);
            if (isNaN(newEndTime.getTime())) {
                return errorResponse('Ungültiges Endzeit-Format', 400);
            }
            endTime = updates.end_time;
        }

        // Überprüfen, ob die Startzeit vor der Endzeit liegt
        if (new Date(startTime) >= new Date(endTime)) {
            return errorResponse('Die Startzeit muss vor der Endzeit liegen', 400);
        }

        // Überprüfen, ob der neue Zeitraum mit anderen Reservierungen kollidiert
        const { data: conflictingReservations, error: checkError } = await supabaseClient
            .from('reservations')
            .select('*')
            .neq('id', reservationId)
            .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

        if (checkError) {
            console.error('Fehler beim Überprüfen von Konflikten:', checkError);
            return errorResponse('Fehler beim Überprüfen von Konflikten', 500);
        }

        if (conflictingReservations && conflictingReservations.length > 0) {
            return errorResponse('Der gewählte Zeitraum ist bereits reserviert', 409);
        }

        // Reservierung aktualisieren
        const updateData: UpdateReservationBody = {};
        if (updates.start_time) updateData.start_time = updates.start_time;
        if (updates.end_time) updateData.end_time = updates.end_time;
        if (updates.description !== undefined) updateData.description = updates.description;

        const { data, error } = await supabaseClient
            .from('reservations')
            .update(updateData)
            .eq('id', reservationId)
            .select()
            .single();

        if (error) {
            console.error('Fehler beim Aktualisieren der Reservierung:', error);
            return errorResponse('Fehler beim Aktualisieren der Reservierung', 500);
        }

        // Erfolgreiche Antwort zurückgeben
        return successResponse({ reservation: data });
    } catch (error) {
        console.error('Unerwarteter Fehler:', error);
        return errorResponse('Ein unerwarteter Fehler ist aufgetreten', 500);
    }
}); 