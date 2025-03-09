# Parkplatz-Reservierungssystem - Backend

Dieses Backend verwendet Supabase Edge Functions, um die Verwaltung von Parkplatzreservierungen zu ermöglichen.

## Datenbank-Schema

Die Anwendung verwendet eine PostgreSQL-Datenbank mit der folgenden Tabelle:

### Tabelle: `reservations`

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | uuid | Primärschlüssel |
| user_id | uuid | Fremdschlüssel zur Supabase Auth-Tabelle |
| start_time | timestamp | Startzeit der Reservierung |
| end_time | timestamp | Endzeit der Reservierung |
| description | text | Optionale Beschreibung der Reservierung |
| created_at | timestamp | Zeitpunkt der Erstellung (automatisch) |

## Edge Functions

### 1. `list-reservations`

Listet alle Reservierungen innerhalb eines bestimmten Datums- und Zeitbereichs auf.

**Methode:** GET  
**Endpunkt:** `/list-reservations`  
**Parameter:**
- `startDate`: ISO-Datumsstring (z.B. "2023-01-01T00:00:00Z")
- `endDate`: ISO-Datumsstring (z.B. "2023-01-31T23:59:59Z")

**Antwort:**
```json
{
  "reservations": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "start_time": "2023-01-15T09:00:00Z",
      "end_time": "2023-01-15T17:00:00Z",
      "description": "Beispielreservierung",
      "created_at": "2023-01-10T12:00:00Z"
    },
    ...
  ]
}
```

### 2. `create-reservation`

Erstellt eine neue Reservierung.

**Methode:** POST  
**Endpunkt:** `/create-reservation`  
**Authentifizierung erforderlich:** Ja  
**Anfragekörper:**
```json
{
  "start_time": "2023-01-15T09:00:00Z",
  "end_time": "2023-01-15T17:00:00Z",
  "description": "Beispielreservierung" // Optional
}
```

**Antwort:**
```json
{
  "reservation": {
    "id": "uuid",
    "user_id": "uuid",
    "start_time": "2023-01-15T09:00:00Z",
    "end_time": "2023-01-15T17:00:00Z",
    "description": "Beispielreservierung",
    "created_at": "2023-01-10T12:00:00Z"
  }
}
```

### 3. `update-reservation`

Aktualisiert eine bestehende Reservierung.

**Methode:** PUT  
**Endpunkt:** `/update-reservation/{reservationId}`  
**Authentifizierung erforderlich:** Ja  
**Anfragekörper:**
```json
{
  "start_time": "2023-01-15T10:00:00Z", // Optional
  "end_time": "2023-01-15T18:00:00Z",   // Optional
  "description": "Aktualisierte Beschreibung" // Optional
}
```

**Antwort:**
```json
{
  "reservation": {
    "id": "uuid",
    "user_id": "uuid",
    "start_time": "2023-01-15T10:00:00Z",
    "end_time": "2023-01-15T18:00:00Z",
    "description": "Aktualisierte Beschreibung",
    "created_at": "2023-01-10T12:00:00Z"
  }
}
```

### 4. `delete-reservation`

Löscht eine bestehende Reservierung.

**Methode:** DELETE  
**Endpunkt:** `/delete-reservation/{reservationId}`  
**Authentifizierung erforderlich:** Ja  

**Antwort:**
```json
{
  "message": "Reservierung erfolgreich gelöscht"
}
```

## Fehlerbehandlung

Alle Edge Functions geben bei Fehlern eine standardisierte Antwort zurück:

```json
{
  "error": "Fehlermeldung"
}
```

Mit entsprechenden HTTP-Statuscodes:
- 400: Ungültige Anfrage (fehlende Parameter, ungültiges Format)
- 401: Nicht authentifiziert
- 403: Nicht autorisiert
- 404: Ressource nicht gefunden
- 409: Konflikt (z.B. Zeitraum bereits reserviert)
- 500: Serverfehler

## Lokale Entwicklung

Um die Edge Functions lokal zu entwickeln, installiere die Supabase CLI und führe folgende Befehle aus:

```bash
# Supabase-Projekt initialisieren
supabase init

# Lokalen Entwicklungsserver starten
supabase start

# Edge Functions lokal ausführen
supabase functions serve
```

## Deployment

Um die Edge Functions zu deployen, verwende die Supabase CLI:

```bash
# In Supabase einloggen
supabase login

# Edge Functions deployen
supabase functions deploy
``` 