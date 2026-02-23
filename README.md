# Multi-Asset Terminal

> Dark-Mode Dashboard für Gold, Silber und Crypto — Vue 3 + Vite + TypeScript + TailwindCSS

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
│   ├── HeaderBar.vue           # Sticky Header mit Node-Info + Controls
│   ├── LoadingSkeleton.vue     # Wiederverwendbares Skeleton-Element
│   ├── MiniLineChart.vue       # SVG-Liniendiagramm (ohne externe Libs)
│   ├── PositionsSummary.vue    # Long/Short Zusammenfassung je Kategorie
│   ├── RecentTradesList.vue    # Letzte 5 Trades pro Kategorie
│   ├── SentimentGauge.vue      # SVG-Halbkreis-Gauge (Long vs. Short %)
│   └── TopTickerBar.vue        # Sticky Ticker-Leiste oben
│
├── mocks/
│   ├── mock.market.ts          # Mock Tickers, Charts, Panel-Tabellen
│   ├── mock.positions.ts       # Mock Positions-Aggregate
│   └── mock.trades.ts          # Mock Trade-Liste (15 Trades, 5 pro Kat.)
│
├── pages/
│   └── Dashboard.vue           # Haupt-Seite — orchestriert alle Stores
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

## Backend-Integration (.NET / Azure SQL)

Die App ist so aufgebaut, dass das Backend **ohne Refactoring** eingesteckt werden kann:

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

Beispiel für `market.service.ts`:

```typescript
import { http } from './http.client'

class HttpMarketDataService implements IMarketDataService {
  async getTopTickers() {
    const { data } = await http.get<MarketTicker[]>('/api/market/tickers')
    return data
  }
  async getCategoryChart(category: AssetCategory) {
    const { data } = await http.get<ChartPoint[]>(`/api/market/chart/${category}`)
    return data
  }
  async getPanelTable(category: AssetCategory) {
    const { data } = await http.get<PanelTableRow[]>(`/api/market/table/${category}`)
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
public record MarketTicker(string Symbol, string DisplayName, decimal Price, decimal ChangePct, string Time);
public record ChartPoint(string Time, decimal Value);
public record PositionAggregate(string Category, decimal LongPct, decimal ShortPct, decimal LongEur, decimal ShortEur);
public record Trade(string Id, string Category, string Timestamp, string Symbol, string Side, decimal Quantity, string PositionLabel, decimal Last, decimal ChangePct);
public record PanelTableRow(string Label, string Vol, decimal? ChgPct);
```

---

## Design Tokens

| Token          | Wert      | Verwendung                     |
|----------------|-----------|-------------------------------|
| `bg`           | `#0B0F14` | Seiten-Hintergrund             |
| `surface`      | `#0F1621` | Karten-Hintergrund             |
| `surface2`     | `#121C29` | Tiefere Ebenen, Hover          |
| `border`       | `#243041` | Rahmen                         |
| `text-primary` | `#E6EDF6` | Haupttext                      |
| `text-secondary`| `#9FB0C3`| Sekundärer Text, Labels        |
| `positive`     | `#22C55E` | Long, positive Änderung        |
| `negative`     | `#EF4444` | Short, negative Änderung       |
| `gold`         | `#F5C542` | Gold-Kategorie Akzent          |
| `silver`       | `#8AB4F8` | Silber-Kategorie Akzent        |
| `crypto`       | `#FF8A3D` | Crypto-Kategorie Akzent        |

---

## Mock-Daten-Modus

Aktuell laufen alle Daten über Mock-Services mit künstlicher Verzögerung (300–400ms),
um Loading States realitätsnah zu demonstrieren. Die Daten werden bei jedem
App-Start neu generiert (Chart-Punkte sind leicht randomisiert).
