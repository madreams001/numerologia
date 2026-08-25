# Astrology Specification

## Purpose

Define calculation rules for natal chart generation, planetary positions, aspects, and transits.

## Requirements

### Requirement: Natal Chart Generation

The system SHALL generate a natal chart from birth date, time, and place, returning positions of all 10 planets in zodiac signs and houses.

#### Scenario: Complete chart

- GIVEN birth date 15/03/1990, time 14:30, place "Buenos Aires, Argentina"
- WHEN natal chart is calculated
- THEN positions for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto are returned with sign and house

#### Scenario: Missing time

- GIVEN birth date only (no time)
- WHEN natal chart is calculated
- THEN planets are calculated without house assignments, with a warning

### Requirement: Ascendant Calculation

The system SHALL calculate the Ascendant (Rising Sign) based on birth time and location.

#### Scenario: Valid time provided

- GIVEN birth time 14:30 and location "Buenos Aires"
- WHEN Ascendant is calculated
- THEN the correct rising sign is returned

### Requirement: Medium Coeli

The system SHALL calculate the Medium Coeli (MC) based on birth time and location.

### Requirement: Planetary Aspects

The system SHALL detect aspects between planets using standard orbs: Conjunction (0°), Sextile (60°), Square (90°), Trine (120°), Opposition (180°).

#### Scenario: Conjunction detected

- GIVEN Sun at 24° Aries and Moon at 25° Aries
- WHEN aspects are calculated
- THEN a Conjunction is reported with 1° orb

#### Scenario: No aspect

- GIVEN Sun at 0° Aries and Moon at 45° Gemini
- WHEN aspects are calculated
- THEN no major aspect is reported

### Requirement: Transits

The system SHALL calculate current planetary transits by comparing current positions against natal chart positions.

#### Scenario: Transit overlay

- GIVEN a natal chart and current date
- WHEN transits are calculated
- THEN current planet positions are shown relative to natal positions with aspect info

### Requirement: Zodiac Data

The system SHALL use Western tropical zodiac with 12 signs: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.

### Requirement: House System

The system SHALL support Placidus house system by default.

## Coverage

- Happy paths: Full natal chart, aspects, transits
- Edge cases: Missing birth time, high-latitude locations
- Error states: Invalid location, future dates
