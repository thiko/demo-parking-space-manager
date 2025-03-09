// @ts-ignore: Deno-spezifische Importe
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, errorResponse, getUserFromRequest, successResponse, supabaseClient } from '../config.ts';

interface CreateReservationBody {
    start_time: string;
    end_time: string;
    description?: string;
}

serve(async (req: Request) => {
    // CORS-Präflug-Anfragen behandeln
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Nur POST-Anfragen erlauben
        if (req.method !== 'POST') {
            return errorResponse('Nur POST-Anfragen sind erlaubt', 405);
        }

        // Benutzer authentifizieren
        const user = await getUserFromRequest(req);
        if (!user) {
            return errorResponse('Nicht authentifiziert', 401);
        }

        // Anfragekörper parsen
        const { start_time, end_time, description } = await req.json() as CreateReservationBody;

        // Parameter validieren
        if (!start_time || !end_time) {
            return errorResponse('start_time und end_time sind erforderliche Parameter', 400);
        }

        const startTime = new Date(start_time);
        const endTime = new Date(end_time);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            return errorResponse('Ungültiges Datums- oder Zeitformat', 400);
        }

        if (startTime >= endTime) {
            return errorResponse('Die Startzeit muss vor der Endzeit liegen', 400);
        }

        // Überprüfen, ob der Zeitraum bereits reserviert ist
        const { data: existingReservations, error: checkError } = await supabaseClient
            .from('reservations')
            .select('*')
            .or(`start_time.lte.${end_time},end_time.gte.${start_time}`);

        if (checkError) {
            console.error('Fehler beim Überprüfen vorhandener Reservierungen:', checkError);
            return errorResponse('Fehler beim Überprüfen vorhandener Reservierungen', 500);
        }

        if (existingReservations && existingReservations.length > 0) {
            return errorResponse('Der gewählte Zeitraum ist bereits reserviert', 409);
        }

        // Neue Reservierung erstellen mit Service-Rolle
        try {
            const { data, error } = await supabaseClient
                .from('reservations')
                .insert([
                    {
                        user_id: user.id,
                        start_time,
                        end_time,
                        description: description || null,
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Fehler beim Erstellen der Reservierung:', error);
                return errorResponse('Fehler beim Erstellen der Reservierung', 500);
            }

            // Erfolgreiche Antwort zurückgeben
            return successResponse({ reservation: data }, 201);
        } catch (insertError) {
            console.error('Fehler beim Erstellen der Reservierung:', insertError);
            return errorResponse('Fehler beim Erstellen der Reservierung', 500);
        }
    } catch (error) {
        console.error('Unerwarteter Fehler:', error);
        return errorResponse('Ein unerwarteter Fehler ist aufgetreten', 500);
    }
}); 