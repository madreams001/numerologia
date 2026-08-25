# Tasks: Numerología & Astrología — Initial Implementation

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1200-1500 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Project scaffold + numerology core | PR 1 | npm test | npm run dev | src/modules/numerologia/ |
| 2 | Astrology module + knowledge base | PR 2 | npm test | npm run dev | src/modules/astrologia/, knowledge/ |
| 3 | UI components + integration | PR 3 | npm run dev | browser | src/components/ |

## Phase 1: Project Foundation

- [ ] 1.1 Initialize Vite + React + TypeScript project (npm create vite, tsconfig, vite.config.ts)
- [ ] 1.2 Create src/modules/numerologia/calculations.ts with letter-to-number map and reduce() utility
- [ ] 1.3 Implement Life Path Number calculation with master number preservation
- [ ] 1.4 Implement Birthday Number, Personal Year, Life Cycles calculations
- [ ] 1.5 Implement Expression, Soul Urge, Personality, Motivation, Intuition, Tendency calculations
- [ ] 1.6 Create src/utils/reduce.ts for digit reduction with master number logic
- [ ] 1.7 Add unit tests for all numerology calculations
- [ ] 1.8 Create initial knowledge base JSON files (numerologia/numeros.json, interpretaciones.json)

## Phase 2: Astrology Module

- [ ] 2.1 Install kaabalah dependency (npm install kaabalah)
- [ ] 2.2 Create src/modules/astrologia/calculations.ts wrapping kaabalah astrology API
- [ ] 2.3 Implement natal chart generation (planets in signs/houses)
- [ ] 2.4 Implement Ascendant and MC calculation
- [ ] 2.5 Implement aspect detection (conjunction, sextile, square, trine, opposition)
- [ ] 2.6 Implement transit calculation (current vs natal)
- [ ] 2.7 Create astrology knowledge base JSON (signos.json, casas.json, aspectos.json, planetas.json)
- [ ] 2.8 Add unit tests for astrology calculations

## Phase 3: UI Integration

- [ ] 3.1 Create src/components/InputForm.tsx with name, date, time, place fields
- [ ] 3.2 Create src/components/ResultsTabs.tsx with tab switching logic
- [ ] 3.3 Create src/components/NumerologiaTab.tsx displaying all numerology numbers
- [ ] 3.4 Create src/components/AstrologiaTab.tsx displaying natal chart summary
- [ ] 3.5 Create src/components/SinastriaTab.tsx (placeholder for future)
- [ ] 3.6 Wire App.tsx with form → calculation → results flow
- [ ] 3.7 Apply dark theme CSS (#1a1a2e background, #e0e0e0 text, purple/gold accents)
- [ ] 3.8 Create sinastria knowledge base JSON (cruzamientos.json)
- [ ] 3.9 Create UI text resources (textos/saludos.json, textos/errores.json)

## Phase 4: Integration & Polish

- [ ] 4.1 Verify all calculations produce correct results end-to-end
- [ ] 4.2 Test form validation and error handling
- [ ] 4.3 Ensure responsive layout works at 1024px+
- [ ] 4.4 Add placeholder content for Sinastria tab
- [ ] 4.5 Final commit with all changes
