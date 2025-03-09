# Parkplatz-Reservierungssystem - Frontend

Dieses Frontend ist Teil des Parkplatz-Reservierungssystems und ermöglicht die Verwaltung von Parkplatzreservierungen über eine benutzerfreundliche Weboberfläche.

## Funktionen

- Benutzerauthentifizierung (Anmeldung und Registrierung)
- Anzeige von Reservierungen für einen ausgewählten Datumsbereich
- Erstellung neuer Reservierungen
- Bearbeitung eigener Reservierungen
- Löschung eigener Reservierungen
- Fehlerbehandlung bei Überschneidungen von Reservierungen

## Technologien

- React mit TypeScript
- Vite als Build-Tool
- React Router für die Navigation
- React Hook Form für Formulare
- date-fns für Datums- und Zeitoperationen
- Tailwind CSS für das Styling
- Supabase für die Authentifizierung
- React Hot Toast für Benachrichtigungen

## Installation

1. Klone das Repository
2. Navigiere zum Frontend-Verzeichnis: `cd frontend`
3. Installiere die Abhängigkeiten: `npm install`
4. Kopiere die `.env.example`-Datei zu `.env` und passe die Werte an
5. Starte die Entwicklungsumgebung: `npm run dev`

## Entwicklung

Die Anwendung wird standardmäßig auf `http://localhost:3000` gestartet und kommuniziert mit dem Supabase-Backend auf `http://127.0.0.1:54321`.

## Produktionsbereitstellung

Um die Anwendung für die Produktion zu erstellen, führe den folgenden Befehl aus:

```bash
npm run build
```

Die erstellten Dateien befinden sich im `dist`-Verzeichnis und können auf einem Webserver bereitgestellt werden.

## Projektstruktur

- `src/components`: Wiederverwendbare UI-Komponenten
- `src/contexts`: React-Kontexte für die Zustandsverwaltung
- `src/hooks`: Benutzerdefinierte React-Hooks
- `src/pages`: Hauptseiten der Anwendung
- `src/styles`: CSS-Stile und Tailwind-Konfiguration
- `src/types`: TypeScript-Typdefinitionen
- `src/utils`: Hilfsfunktionen und API-Clients 