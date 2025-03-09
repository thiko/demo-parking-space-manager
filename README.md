# Parkplatz-Reservierungssystem

Ein vollständiges System zur Verwaltung von Parkplatzreservierungen mit Supabase-Backend und React-Frontend.

## Schnellstart

Führen Sie die folgenden Befehle aus, um die Anwendung zu starten:

### 1. Backend starten

```bash
# Navigieren Sie zum Backend-Verzeichnis
cd backend

# Starten Sie Supabase
supabase start

# Starten Sie die Edge Functions (in einem neuen Terminal)
cd backend
supabase functions serve
```

### 2. Frontend starten

```bash
# Navigieren Sie zum Frontend-Verzeichnis (in einem neuen Terminal)
cd frontend

# Starten Sie den Entwicklungsserver
npm run dev
```

### 3. Anwendung öffnen

Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser.

## Erstanmeldung

Bei der ersten Nutzung müssen Sie einen Benutzer registrieren:

1. Klicken Sie auf den Tab "Registrieren"
2. Geben Sie eine E-Mail-Adresse und ein Passwort ein (mindestens 6 Zeichen)
3. Klicken Sie auf "Registrieren"
4. Melden Sie sich mit den erstellten Anmeldedaten an

## Projektstruktur

- `backend/`: Supabase-Backend mit Edge Functions
  - `supabase/functions/`: Edge Functions für die API
  - `supabase/migrations/`: Datenbankmigrationen

- `frontend/`: React-Frontend
  - `src/components/`: UI-Komponenten
  - `src/pages/`: Hauptseiten der Anwendung
  - `src/utils/`: Hilfsfunktionen und API-Clients

## Weitere Informationen

Detaillierte Informationen finden Sie in den README-Dateien der jeweiligen Verzeichnisse:

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md) 