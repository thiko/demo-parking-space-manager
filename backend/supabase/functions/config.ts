// @ts-ignore: Deno-spezifische Importe
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Deno-Typdeklaration
declare const Deno: {
    env: {
        get(key: string): string | undefined;
    };
};

// Supabase URL und Anon Key
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? 'http://127.0.0.1:54321';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Erstelle einen Supabase-Client mit dem Service-Rollen-Key für Datenbankoperationen
export const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

// Erstelle einen Supabase-Client mit dem Anon-Key für Authentifizierung
export const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey);

// CORS-Header für alle Anfragen
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Hilfsfunktion zum Überprüfen der Authentifizierung
export async function getUserFromRequest(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseAuthClient.auth.getUser(token);

    if (error || !user) {
        console.error('Authentifizierungsfehler:', error);
        return null;
    }

    return user;
}

// Hilfsfunktion für Fehlerantworten
export function errorResponse(message: string, status = 400) {
    return new Response(
        JSON.stringify({ error: message }),
        {
            status,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
    );
}

// Hilfsfunktion für erfolgreiche Antworten
export function successResponse(data: any, status = 200) {
    return new Response(
        JSON.stringify(data),
        {
            status,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
    );
} 