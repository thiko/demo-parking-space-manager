-- Erstelle die Reservierungstabelle
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Stellen Sie sicher, dass die Startzeit vor der Endzeit liegt
  CONSTRAINT start_before_end CHECK (start_time < end_time)
);

-- Erstelle einen Index für schnellere Abfragen nach Zeiträumen
CREATE INDEX IF NOT EXISTS reservations_time_range_idx ON public.reservations (start_time, end_time);

-- Erstelle einen Index für Benutzerabfragen
CREATE INDEX IF NOT EXISTS reservations_user_id_idx ON public.reservations (user_id);

-- Erstelle eine Funktion, um Überschneidungen zu überprüfen
CREATE OR REPLACE FUNCTION check_reservation_overlap()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.reservations
    WHERE 
      id != NEW.id AND  -- Ignoriere die aktuelle Reservierung bei Updates
      (
        (NEW.start_time <= end_time AND NEW.end_time >= start_time)
      )
  ) THEN
    RAISE EXCEPTION 'Reservierungszeitraum überschneidet sich mit einer bestehenden Reservierung';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Erstelle einen Trigger, der die Überschneidungsprüfung vor dem Einfügen oder Aktualisieren ausführt
DROP TRIGGER IF EXISTS check_reservation_overlap_trigger ON public.reservations;
CREATE TRIGGER check_reservation_overlap_trigger
BEFORE INSERT OR UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION check_reservation_overlap();

-- Erstelle Row-Level-Security-Richtlinien
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Richtlinie: Jeder kann Reservierungen sehen
CREATE POLICY "Reservierungen sind für alle sichtbar" ON public.reservations
  FOR SELECT USING (true);

-- Richtlinie: Benutzer können nur ihre eigenen Reservierungen erstellen
CREATE POLICY "Benutzer können nur ihre eigenen Reservierungen erstellen" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Richtlinie: Benutzer können nur ihre eigenen Reservierungen aktualisieren
CREATE POLICY "Benutzer können nur ihre eigenen Reservierungen aktualisieren" ON public.reservations
  FOR UPDATE USING (auth.uid() = user_id);

-- Richtlinie: Benutzer können nur ihre eigenen Reservierungen löschen
CREATE POLICY "Benutzer können nur ihre eigenen Reservierungen löschen" ON public.reservations
  FOR DELETE USING (auth.uid() = user_id);

-- Erlaube dem Service-Rolle-Benutzer vollen Zugriff auf die Tabelle
CREATE POLICY "Service-Rolle hat vollen Zugriff" ON public.reservations
  FOR ALL TO service_role USING (true); 