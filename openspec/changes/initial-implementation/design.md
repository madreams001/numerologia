# Technical Design — Numerología & Astrología

## Architecture Overview

React SPA with modular architecture. Each calculation system is an independent module with its own logic, knowledge base, and UI components.

```
src/
├── App.tsx                    # Router, main layout
├── components/
│   ├── InputForm.tsx          # Name, date, time, place form
│   ├── ResultsTabs.tsx        # Tab container [Numerología][Astrología][Sinastria]
│   ├── NumerologiaTab.tsx     # Displays numerology results
│   ├── AstrologiaTab.tsx      # Displays astrology results
│   └── SinastriaTab.tsx       # Displays compatibility results
├── modules/
│   ├── numerologia/
│   │   ├── calculations.ts    # All numerology math
│   │   └── index.ts           # Public API
│   ├── astrologia/
│   │   ├── calculations.ts    # Chart generation via kaabalah
│   │   └── index.ts           # Public API
│   └── sinastria/
│       ├── calculations.ts    # Two-chart comparison
│       └── index.ts           # Public API
├── knowledge/
│   ├── numerologia/           # JSON interpretation files
│   ├── astrologia/            # Astrological data
│   ├── sinastria/             # Cross-system rules
│   └── textos/                # UI strings
└── utils/
    ├── numerology-map.ts      # Letter→Number conversion table
    └── reduce.ts              # Digit reduction with master numbers
```

## Data Flow

```
User Input → Validation → Module Calculation → Knowledge Lookup → UI Display
```

1. InputForm validates required fields (name, date)
2. Passes data to appropriate module(s)
3. Module calculates numbers/positions
4. Knowledge base provides interpretations
5. Results rendered in tabs

## Key Design Decisions

### Library: kaabalah
- Primary library for both numerology and astrology
- TypeScript native, tree-shakable
- Swiss Ephemeris via WASM for astrological precision
- If kaabalah gaps found, complement with celestine

### Knowledge Base: JSON files
- Static JSON for interpretations, definitions, rules
- Loaded at build time (imported directly)
- No runtime database needed
- User's books processed into structured JSON

### State Management: React useState/useReducer
- No Redux needed — single-page calculation tool
- Form state → calculation results → display
- No persistence required (recalculate each time)

### Styling: CSS Modules or Tailwind
- Dark theme with CSS variables
- #1a1a2e background, #e0e0e0 text, purple/gold accents
- Responsive desktop layout (1024px+)

## Module Interfaces

### Numerology Module
```typescript
interface NumerologyInput {
  fullName: string;
  birthDate: Date;
}

interface NumerologyResult {
  lifePath: number;
  birthday: number;
  lifeCycles: Cycle[];
  personalYear: number;
  expression: number;
  soulUrge: number;
  personality: number;
  motivation: number | null;
  intuition: number | null;
  tendency: number;
}
```

### Astrology Module
```typescript
interface AstrologyInput {
  birthDate: Date;
  birthTime?: string;
  birthPlace: string;
}

interface AstrologyResult {
  planets: PlanetPosition[];
  ascendant: ZodiacSign;
  mc: ZodiacSign;
  aspects: Aspect[];
}
```

## Error Handling

- Invalid date: show validation error, block calculation
- Missing time: calculate without houses, show warning
- Invalid place: suggest alternatives, block calculation
- Library errors: fallback to manual calculation where possible

## Testing Strategy

- Unit tests for calculation functions (once test runner set up)
- Snapshot tests for UI components
- Integration tests for form → calculation → display flow
