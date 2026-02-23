# Multi-Asset Terminal (EIXDB)

> Dark-Mode Dashboard für Gold, Silber, Crypto und weitere Asset-Klassen — Vue 3 + Vite + TypeScript + TailwindCSS

---

## Stack

| Layer       | Technologie                        |
|-------------|------------------------------------|
| Framework   | Vue 3 (Composition API)            |
| Build       | Vite 5                             |
| Sprache     | TypeScript (strict)                |
| Styling     | TailwindCSS 3                      |
| State       | Pinia                              |
| Routing     | Vue Router 4                       |
| Charts      | SVG (inline, kein Dependency)      |
| Backend     | .NET/C# — **noch nicht verbunden** |
| Datenbank   | Azure SQL — **noch nicht verbunden** |

---

## Projektstruktur

```
src/
├── components/
│   ├── CategoryPanel.vue       # Panel-Karte pro Asset-Kategorie
│   ├── DataTableMini.vue       # Mini-Tabelle (Sector Heat / Correlates)
│   ├── HeaderBar.vue           # Sticky Header: Über-Filter (Location + Exchange)
│   ├── LoadingSkeleton.vue     # Wiederverwendbares Skeleton-Element
│   ├── MiniLineChart.vue       # SVG-Liniendiagramm (ohne externe Libs)
│   ├── PositionsSummary.vue    # Long/Short Zusammenfassung je Kategorie
│   ├── RecentTradesList.vue    # Letzte 5 Trades pro Kategorie
│   ├── SentimentGauge.vue      # SVG-Halbkreis-Gauge (Long vs. Short %)
│   └── TopTickerBar.vue        # Sticky Ticker-Leiste oben
│
├── mocks/
│   ├── mock.market.ts          # Mock Tickers, Charts, Panel-Tabellen
│   ├── mock.positions.ts       # Mock Positions-Aggregate (je Filter-Kombination)
│   └── mock.trades.ts          # Mock Trade-Liste mit basket + exchange pro Trade
│
├── pages/
│   └── Dashboard.vue           # Haupt-Seite — orchestriert alle Stores + Filter
│
├── router/
│   └── index.ts                # Vue Router Config
│
├── services/
│   ├── http.client.ts          # HTTP-Platzhalter (Axios-ready)
│   ├── market.service.ts       # IMarketDataService + Mock-Impl.
│   ├── positions.service.ts    # IPositionsService + Mock-Impl.
│   └── trades.service.ts       # ITradesService + Mock-Impl.
│
├── stores/
│   ├── market.store.ts         # Pinia Store: Tickers, Charts, Tabellen
│   ├── positions.store.ts      # Pinia Store: Positions-Aggregate
│   └── trades.store.ts         # Pinia Store: Recent Trades
│
├── types/
│   └── dto.ts                  # DTOs — identisch zu .NET/C# Contracts
│
└── utils/
    ├── color.ts                # Farb-Utilities, Category-Accent-Maps
    └── format.ts               # formatCurrencyEUR, formatPct, formatPrice, …
```

---

## Datenfluss & Kategorie-Zuordnung

> Das ist der wichtigste Abschnitt für die Backend-Integration.  
> Das Dashboard zeigt keine rohe Trade-Liste, sondern **pro Asset-Kategorie aggregierte Daten**.  
> Die zentrale Aufgabe des Backends ist daher: **offene Positionen anhand von Kürzel/ISIN einer Kategorie zuordnen**.

### Konzept: Vom offenen Trade zum Panel

```
Datenbank (Azure SQL)
        │
        ▼
1. Alle offenen Trades laden (gefiltert nach Location + Exchange/Basket)
        │
        ▼
2. Für jeden Trade: Symbol / ISIN → Kategorie auflösen
   z.B.  GC=F        → "gold"
         BTC/USD      → "crypto"
         ETH/USD      → "eth"
         SI=F         → "silver"
         PL=F         → "platinum"
         CL=F, BZ=F   → "oil"
        │
        ▼
3. Trades nach Kategorie gruppieren + aggregieren
   → longPct / shortPct / longEur / shortEur pro Kategorie
        │
        ▼
4. API gibt strukturierte Daten zurück (je Endpoint ein Typ)
        │
        ▼
5. Frontend rendert pro Kategorie ein CategoryPanel
   mit Chart, Sentiment-Gauge, Mini-Tabelle und Recent Trades
```

### Schritt 1 — Offene Trades laden

Das Backend liest zunächst alle **offenen Positionen** aus der Datenbank:

```sql
SELECT *
FROM trades
WHERE status = 'open'
  AND basket   = @basket    -- 'B' (BER) | 'M' (MUN) | beide (ALL)
  AND exchange = @exchange  -- 'EIX' | 'HAM'
```

`basket` und `exchange` kommen direkt aus den Header-Filtern des Frontends (siehe `FilterParams`).

### Schritt 2 — Symbol/ISIN → Kategorie auflösen

Das Backend braucht eine **Mapping-Tabelle** (oder eine statische Konfiguration), die jedem Symbol/ISIN eine Kategorie zuweist:

```sql
-- Beispiel-Tabelle: asset_category_map
symbol        | isin         | category
--------------+--------------+----------
GC=F          | -            | gold
GOLD_MINING   | US12345678   | gold
SI=F          | -            | silver
SILJ          | US98765432   | silver
BTC/USD       | -            | crypto
ETH/USD       | -            | eth
PL=F          | -            | platinum
CL=F          | -            | oil
BZ=F          | -            | oil
```

Im Code sieht das in C# ungefähr so aus:

```csharp
// CategoryResolver.cs
public static AssetCategory? Resolve(string symbol, string? isin)
{
    return symbol switch
    {
        "GC=F" or "GOLD_MINING" or "IAU"  => AssetCategory.Gold,
        "SI=F" or "SILJ" or "PSLV"        => AssetCategory.Silver,
        "BTC/USD" or "BTC-PERP"            => AssetCategory.Crypto,
        "ETH/USD" or "ETH-PERP"            => AssetCategory.Eth,
        "PL=F" or "PPLT"                   => AssetCategory.Platinum,
        "CL=F" or "BZ=F" or "USO"         => AssetCategory.Oil,
        _ => ResolveByIsin(isin) // Fallback: ISIN-Lookup in DB
    };
}
```

Trades, die keiner Kategorie zugeordnet werden können, werden in einen `unknown`-Bucket geworfen und im Frontend nicht angezeigt — aber geloggt.

### Schritt 3 — Aggregation pro Kategorie

Nach der Zuordnung aggregiert das Backend die Daten:

```csharp
// Beispiel: PositionAggregate pro Kategorie berechnen
var grouped = openTrades.GroupBy(t => t.Category);

foreach (var group in grouped)
{
    var longTrades  = group.Where(t => t.Side == "long");
    var shortTrades = group.Where(t => t.Side == "short");

    var longEur  = longTrades.Sum(t => t.Quantity * t.Last);
    var shortEur = shortTrades.Sum(t => t.Quantity * t.Last);
    var total    = longEur + shortEur;

    yield return new PositionAggregate(
        Category:  group.Key.ToString().ToLower(),
        LongPct:   total > 0 ? Math.Round(longEur  / total * 100, 1) : 0,
        ShortPct:  total > 0 ? Math.Round(shortEur / total * 100, 1) : 0,
        LongEur:   longEur,
        ShortEur:  shortEur,
        Basket:    filter.Basket,
        Exchange:  filter.Exchange
    );
}
```

### Schritt 4 — API-Endpoints

Das Frontend erwartet folgende Endpoints. Alle akzeptieren `location` und `exchange` als Query-Parameter:

```
GET /api/positions/aggregates?location=BER&exchange=EIX
    → PositionAggregate[] (eine Zeile pro Kategorie)

GET /api/trades?category=gold&location=BER&exchange=EIX&limit=5
    → Trade[] (letzte N offene Trades dieser Kategorie)

GET /api/market/tickers?location=BER&exchange=EIX
    → MarketTicker[]

GET /api/market/chart/{category}?location=BER&exchange=EIX
    → ChartPoint[]

GET /api/market/table/{category}?location=BER&exchange=EIX
    → PanelTableRow[]
```

### Schritt 5 — Panel-Rendering im Frontend

Das Dashboard rendert für jede der 6 Kategorien ein `CategoryPanel`.  
Das Panel bekommt alle aggregierten Daten ausschließlich über Props — es kennt keine Stores:

```
CategoryPanel (category="gold")
├── MiniLineChart      ← chartData["gold"]
├── SentimentGauge     ← longPct / shortPct aus PositionAggregate
├── DataTableMini      ← panelTables["gold"]  (Sector Heat)
└── RecentTradesList   ← trades["gold"]       (letzte 5 Trades)
```

Der gesamte Datenfluss ist **filter-getrieben**: Wechselt der Nutzer im Header von `ALL` auf `BER`, werden alle 5 Endpoints neu aufgerufen — diesmal mit `location=BER`. Die Panels rendern automatisch die gefilterten Daten.

---

## Header-Filter (Über-Filter)

Die beiden Filter im Header sind **globale Über-Filter**: Jede Änderung löst einen vollständigen Reload aller Daten aus.

| Filter   | Typ       | Werte          | Wirkung                                  |
|----------|-----------|----------------|------------------------------------------|
| Location | `string`  | ALL / BER / MUN | Basket-Filter: alle / B=Berlin / M=München |
| Exchange | `string`  | EIX / HAM      | Exchange-Filter: EIX oder HAM            |

Beide Filter werden als `FilterParams`-Objekt durch die gesamte App propagiert:

```typescript
// src/types/dto.ts
export interface FilterParams {
  location: 'ALL' | 'BER' | 'MUN'
  exchange: 'EIX' | 'HAM'
}
```

**Datenfluss bei Filter-Änderung:**

```
User klickt "BER"
    │
    ▼
HeaderBar emittiert filterChange({ location: 'BER', exchange: 'EIX' })
    │
    ▼
Dashboard.handleFilterChange(filter)
    │
    ├── marketStore.fetchAll(filter)
    ├── positionsStore.fetchAggregates(filter)
    └── tradesStore.fetchAll(filter)
              │
              ▼
        Services übergeben filter als Query-Params ans Backend
              │
              ▼
        Backend filtert nach basket='B' AND exchange='EIX'
              │
              ▼
        Panels rendern die gefilterten Daten
```

---

## Backend-Integration (.NET / Azure SQL)

### Schritt 1: Axios installieren

```bash
npm install axios
```

### Schritt 2: `http.client.ts` aktivieren

```typescript
// src/services/http.client.ts
import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
```

### Schritt 3: Service-Implementierungen ersetzen

Die Mock-Klassen einfach durch HTTP-Implementierungen ersetzen — das Interface bleibt identisch:

```typescript
// src/services/trades.service.ts
import { http } from './http.client'

class HttpTradesService implements ITradesService {
  async getRecentTrades(category: AssetCategory, filter: FilterParams, limit = 5): Promise<Trade[]> {
    const { data } = await http.get<Trade[]>('/api/trades', {
      params: { category, location: filter.location, exchange: filter.exchange, limit },
    })
    return data
  }
}

export const tradesService: ITradesService = new HttpTradesService()
```

```typescript
// src/services/positions.service.ts
import { http } from './http.client'

class HttpPositionsService implements IPositionsService {
  async getPositionAggregates(filter: FilterParams): Promise<PositionAggregate[]> {
    const { data } = await http.get<PositionAggregate[]>('/api/positions/aggregates', {
      params: { location: filter.location, exchange: filter.exchange },
    })
    return data
  }
}

export const positionsService: IPositionsService = new HttpPositionsService()
```

```typescript
// src/services/market.service.ts
import { http } from './http.client'

class HttpMarketDataService implements IMarketDataService {
  async getTopTickers(filter: FilterParams): Promise<MarketTicker[]> {
    const { data } = await http.get<MarketTicker[]>('/api/market/tickers', {
      params: { location: filter.location, exchange: filter.exchange },
    })
    return data
  }
  async getCategoryChart(category: AssetCategory, filter: FilterParams): Promise<ChartPoint[]> {
    const { data } = await http.get<ChartPoint[]>(`/api/market/chart/${category}`, {
      params: { location: filter.location, exchange: filter.exchange },
    })
    return data
  }
  async getPanelTable(category: AssetCategory, filter: FilterParams): Promise<PanelTableRow[]> {
    const { data } = await http.get<PanelTableRow[]>(`/api/market/table/${category}`, {
      params: { location: filter.location, exchange: filter.exchange },
    })
    return data
  }
}

export const marketService: IMarketDataService = new HttpMarketDataService()
```

### Schritt 4: `.env` anlegen

```bash
cp .env.example .env
# VITE_API_BASE_URL=https://your-api.azurewebsites.net
```

### .NET DTO-Spiegel (C#)

```csharp
public enum AssetCategory { Gold, Silver, Crypto, Platinum, Eth, Oil }
public enum BasketCode     { B, M }
public enum ExchangeCode   { EIX, HAM }

public record MarketTicker(
    string Symbol, string DisplayName, decimal Price, decimal ChangePct, string Time);

public record ChartPoint(string Time, decimal Value);

public record PositionAggregate(
    string Category, decimal LongPct, decimal ShortPct,
    decimal LongEur, decimal ShortEur,
    string Basket, string Exchange);

public record Trade(
    string Id, string Category, string Timestamp,
    string Symbol, string Side, decimal Quantity,
    string PositionLabel, decimal Last, decimal ChangePct,
    string Basket, string Exchange);

public record PanelTableRow(string Label, string Vol, decimal? ChgPct);
```

---

## Design Tokens (Dark Mode)

| Token             | Wert      | Verwendung                       |
|-------------------|-----------|----------------------------------|
| `bg`              | `#111111` | Seiten-Hintergrund               |
| `surface`         | `#262626` | Karten-Hintergrund               |
| `surface2`        | `#181818` | Tiefere Ebenen, innere Container |
| `border`          | `#2E2E2E` | Rahmen, Trennlinien              |
| `text-primary`    | `#EBEBEB` | Haupttext                        |
| `text-secondary`  | `#888888` | Labels, sekundäre Infos          |
| `positive`        | `#22C55E` | Long, positive Änderung          |
| `negative`        | `#EF4444` | Short, negative Änderung         |
| `gold`            | `#F5C542` | Gold-Kategorie Akzent            |
| `silver`          | `#C0C0C0` | Silber-Kategorie Akzent          |
| `crypto`          | `#FF8A3D` | Crypto-Kategorie Akzent          |

---

## Mock-Daten-Modus

Aktuell laufen alle Daten über Mock-Services mit künstlicher Verzögerung (300–400ms),
um Loading States realitätsnah zu demonstrieren. Die Daten werden bei jedem
App-Start neu generiert (Chart-Punkte sind leicht randomisiert).

Jeder Mock-Trade hat `basket` (`'B'` oder `'M'`) und `exchange` (`'EIX'` oder `'HAM'`) gesetzt,
sodass die Header-Filter auch im Mock-Modus funktionieren und sichtbar Daten filtern.
