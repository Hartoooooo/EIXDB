/**
 * Kategorie-Lookup-Service
 *
 * Liefert zu einer ISIN die zugehörige Kategorie aus der Kategorie-Datenbank.
 *
 * TODO: DB-Anbindung ausstehend.
 *   Derzeit gibt getCategoryForIsin() immer null zurück (kein Match).
 *   Sobald die Datenbank angebunden ist, muss ausschließlich die Logik
 *   innerhalb dieser Funktion ersetzt werden. Alle Aufrufe im restlichen
 *   Code bleiben unverändert.
 *
 * Interface: getCategoryForIsin(isin: string) → string | null
 *   - string  → Kategorie-Name (z. B. "Aktien Deutschland", "ETFs", "Anleihen")
 *   - null    → ISIN in der Datenbank nicht gefunden → "Unkategorisiert"
 */
export function getCategoryForIsin(isin: string): string | null {
  // TODO: Datenbank-Lookup implementieren
  void isin
  return null
}
