# Numerología & Astrología — AGENTS.md

## Proyecto
App web de cálculos de numerología y astrología. Personal tool, puede abrirse al público.

## Stack
- React + TypeScript
- Vite (bundler)
- kaabalah (numerología + astrología)
- Deploy: local → Vercel

## Cálculos — Numerología
- Número de Vida (Life Path)
- Número de Cumpleaños
- Ciclos de Vida (3 períodos ~27-28 años)
- Año Personal
- Número de Expresión (nombre completo = nombres + apellidos)
- Deseo del Alma (vocales del nombre completo)
- Personalidad (consonantes del nombre completo)
- Motivación (todos los nombres)
- Intuición (segundo nombre / segundo nombre de pila)
- Tendencia (apellidos)
- El formulario separa "Nombres" y "Apellidos" en dos campos. Expresión/Deseo/Personalidad/Gematría usan el nombre completo (`nombres + apellidos`); Motivación/Intuición usan `nombres`; Tendencia usa `apellidos`.
- Números maestros: 11, 22, 33 (no se reducen)

## Cálculos — Astrología
- Carta natal (fecha, hora, lugar)
- Ascendente & Medio Cielo
- Planetas en signos y casas
- Aspectos: Conjunión, Sextil, Cuadrado, Trígono, Oposición
- Tránsitos
- Sinastria (comparación de dos cartas)

## UI
- Dark theme (#1a1a2e), texto claro (#e0e0e0), acentos púrpura/dorado
- Formulario: nombre, fecha, hora (opcional), lugar
- Tabs: [Numerología] [Astrología] [Sinastria]
- Minimalista, sin imágenes por ahora

## Estructura de archivos
```
src/
├── components/
├── modules/
│   ├── numerologia/
│   ├── astrologia/
│   └── sinastria/
├── knowledge/
│   ├── numerologia/
│   ├── astrologia/
│   └── sinastria/
├── utils/
└── App.tsx
```

## Knowledge Base
- Libro de numerología del usuario se procesa como JSON estructurado
- Interpretaciones, definiciones, reglas de compatibilidad
- Se refinará con el tiempo

## Fases de desarrollo
1. Numerología básica + UI
2. Knowledge base desde documentos
3. Módulo de astrología
4. Cruzamiento sinástrico
5. Deploy a Vercel
6. Mejoras UI/UX
