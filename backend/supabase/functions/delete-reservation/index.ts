// @ts-ignore: Deno-spezifische Importe
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, errorResponse, getUserFromRequest, successResponse, supabaseClient } from '../config.ts';

serve(async (req: Request) => {
    // CORS-Präflug-Anfragen behandeln
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Nur DELETE-Anfragen erlauben
        if (req.method !== 'DELETE') {
            return errorResponse('Nur DELETE-Anfragen sind erlaubt', 405);
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
            return errorResponse('Sie sind nicht berechtigt, diese Reservierung zu löschen', 403);
        }

        // Reservierung löschen
        const { error } = await supabaseClient
            .from('reservations')
            .delete()
            .eq('id', reservationId);

        if (error) {
            console.error('Fehler beim Löschen der Reservierung:', error);
            return errorResponse('Fehler beim Löschen der Reservierung', 500);
        }

        // Erfolgreiche Antwort zurückgeben
        return successResponse({ message: 'Reservierung erfolgreich gelöscht' }, 200);
    } catch (error) {
        console.error('Unerwarteter Fehler:', error);
        return errorResponse('Ein unerwarteter Fehler ist aufgetreten', 500);
    }
}); 