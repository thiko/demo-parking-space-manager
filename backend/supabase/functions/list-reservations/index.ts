// @ts-ignore: Deno-spezifische Importe
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, errorResponse, successResponse, supabaseClient } from '../config.ts';

interface ListReservationsParams {
    startDate: string;
    endDate: string;
}

serve(async (req: Request) => {
    // CORS-Präflug-Anfragen behandeln
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Nur GET-Anfragen erlauben
        if (req.method !== 'GET') {
            return errorResponse('Nur GET-Anfragen sind erlaubt', 405);
        }

        // URL-Parameter extrahieren
        const url = new URL(req.url);
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        // Parameter validieren
        if (!startDate || !endDate) {
            return errorResponse('startDate und endDate sind erforderliche Parameter', 400);
        }

        // Reservierungen aus der Datenbank abrufen
        const { data, error } = await supabaseClient
            .from('reservations')
            .select('*')
            .gte('start_time', startDate)
            .lte('end_time', endDate)
            .order('start_time', { ascending: true });

        if (error) {
            console.error('Fehler beim Abrufen der Reservierungen:', error);
            return errorResponse('Fehler beim Abrufen der Reservierungen', 500);
        }

        // Erfolgreiche Antwort zurückgeben
        return successResponse({ reservations: data });
    } catch (error) {
        console.error('Unerwarteter Fehler:', error);
        return errorResponse('Ein unerwarteter Fehler ist aufgetreten', 500);
    }
}); 