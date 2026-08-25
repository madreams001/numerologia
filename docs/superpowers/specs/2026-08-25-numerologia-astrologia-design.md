# Diseño: App de Numerología y Astrología

**Fecha:** 25 de agosto de 2026
**Estado:** Borrador para revisión

---

## 1. Resumen

App web minimalista para cálculos e interpretaciones de numerología y astrología. Herramienta personal con posibilidad de evolucionar a público general.

## 2. Arquitectura

### Estructura de carpetas
```
numerologia/
├── src/
│   ├── components/        # Componentes React
│   ├── modules/
│   │   ├── numerologia/   # Lógica de cálculos numéricos
│   │   ├── astrologia/    # Lógica astrológica
│   │   └── sinastria/     # Cruce entre ambos sistemas
│   ├── knowledge/         # Base de conocimiento (JSON)
│   └── utils/             # Funciones comunes
├── docs/                  # Libros/documentos originales
└── public/
```

### Stack
- **Frontend:** React (Create React App o Vite)
- **Deploy inicial:** Local
- **Deploy futuro:** Vercel

## 3. Base de Conocimiento

### Numerología
```
knowledge/
├── numerologia/
│   ├── numeros.json           # Definiciones 1-9, 11, 22, 33
│   ├── ciclos.json            # Ciclos de vida y períodos
│   ├── compatibilidad.json    # Reglas de compatibilidad
│   └── interpretaciones.json  # Textos para cada combinación
```

### Astrología
```
knowledge/
├── astrologia/
│   ├── signos.json       # Signos, elementos, cualidades
│   ├── casas.json        # Las 12 casas astrológicas
│   ├── aspectos.json     # Tipos de aspectos y significados
│   └── planetas.json     # Planetas y sus significados
```

### Cruce
```
knowledge/
├── sinastria/
│   └── cruzamientos.json  # Reglas numerología + astrología
```

### Textos
```
knowledge/
├── textos/
│   ├── saludos.json
│   └── errores.json
```

## 4. Cálculos de Numerología

### Fecha de nacimiento
- **Número de Vida** — suma de todos los dígitos de la fecha
- **Número de Cumpleaños** — día del mes
- **Ciclos de Vida** — 3 períodos de ~27-28 años
- **Año Personal** — año actual + suma de fecha de nacimiento

### Nombre completo
- **Tabla de conversión:** A=1, B=2, ... I=9, J=1, K=2, ... R=9, S=1, T=2, ... Z=8
- **Número de Expresión** — suma de todas las letras del nombre completo
- **Número de Alma (Deseo)** — suma de vocales (A, E, I, O, U)
- **Número de Personalidad** — suma de consonantes
- **Número de Motivación** — nombre de pila
- **Número de Intuición** — segundo nombre
- **Número de Tendencia** — apellido

### Reducción
- Todos los números se reducen a un solo dígito (1-9)
- Excepción: números maestros (11, 22, 33) se mantienen

## 5. Cálculos de Astrología

### Carta natal (requiere: fecha, hora, lugar)
- Posiciones de planetas: Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón
- Signos zodiacales por planeta
- 12 casas astrológicas
- Ascendente (Rising)
- Medium Coeli (MC)

### Aspectos
- Conjunción (0°) — fusión
- Sextil (60°) — armonía suave
- Cuadratura (90°) — tensión
- Trígono (120°) — armonía natural
- Oposición (180°) — polaridad

### Transits
- Posiciones actuales vs carta natal
- Permite ver energías activas en el momento

### Compatibilidad/Sinastria
- Comparar dos cartas
- Cruzar numerología + astrología

## 6. Interfaz de Usuario

### Pantalla principal — Formulario
```
┌─────────────────────────────────────────┐
│           NUMEROLOGÍA & ASTROLOGÍA      │
├─────────────────────────────────────────┤
│  Nombre completo: [________________]    │
│  Fecha de nacimiento: [DD/MM/AAAA]      │
│  Hora de nacimiento: [HH:MM] (opcional) │
│  Lugar de nacimiento: [_____________]   │
│                                         │
│  [CALCULAR]                             │
└─────────────────────────────────────────┘
```

### Pantalla de resultados — Pestañas
```
┌─────────────────────────────────────────┐
│  [Numerología] [Astrología] [Sinastria]│
├─────────────────────────────────────────┤
│                                         │
│  NÚMERO DE VIDA: 7                      │
│  "El buscador de la verdad..."          │
│                                         │
│  NÚMERO DE EXPRESIÓN: 3                 │
│  "La creatividad y la comunicación..."  │
│                                         │
│  [Ver análisis completo →]              │
└─────────────────────────────────────────┘
```

### Estilo visual
- Fondo oscuro (#1a1a2e)
- Texto claro (#e0e0e0)
- Acentos púrpura/dorado
- Minimalista, sin imágenes por ahora

## 7. Flujo de Datos

```
Usuario ingresa datos → Módulo calcula → Base de conocimiento interpreta → Resultado
```

## 8. Fases de Desarrollo

1. **Fase 1:** Cálculos básicos de numerología + interfaz
2. **Fase 2:** Base de conocimiento con documentos del usuario
3. **Fase 3:** Módulo de astrología
4. **Fase 4:** Cruce sinástrico
5. **Fase 5:** Deploy a Vercel
6. **Fase 6:** Mejoras de UI/UX
