# UI Specification

## Purpose

Define the user interface for input collection and result display.

## Requirements

### Requirement: Input Form

The system SHALL display a form with fields: full name (text), birth date (date picker), birth time (time picker, optional), birth place (text/autocomplete).

#### Scenario: Valid submission

- GIVEN all required fields filled
- WHEN user clicks "CALCULAR"
- THEN results are displayed in tabbed interface

#### Scenario: Missing required field

- GIVEN name or date is empty
- WHEN user clicks "CALCULAR"
- THEN an error message highlights the missing field

### Requirement: Results Tabs

The system SHALL display results in 3 tabs: [Numerología] [Astrología] [Sinastria].

#### Scenario: Tab switching

- GIVEN results are displayed
- WHEN user clicks a tab
- THEN the corresponding content is shown

### Requirement: Numerology Tab

The system SHALL display all numerology numbers with their names, values, and interpretations from the knowledge base.

#### Scenario: Number display

- GIVEN a Life Path Number of 7
- WHEN Numerología tab is active
- THEN "Número de Vida: 7" and its interpretation text are shown

### Requirement: Astrology Tab

The system SHALL display natal chart summary: Sun/Moon/Ascendant signs, planetary positions table, and detected aspects.

### Requirement: Sinastria Tab

The system SHALL display two-chart comparison when two profiles are entered, showing compatibility analysis.

### Requirement: Dark Theme

The system SHALL use dark background (#1a1a2e), light text (#e0e0e0), and purple/gold accents.

### Requirement: Responsive Layout

The system SHALL work on desktop browsers (1024px+). Mobile optimization is not required for initial version.

## Coverage

- Happy paths: Form submission, tab switching, result display
- Edge cases: Optional fields, empty results
- Error states: Validation errors, missing data
