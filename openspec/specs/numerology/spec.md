# Numerology Specification

## Purpose

Define calculation rules for all numerology numbers derived from birth date and full name.

## Requirements

### Requirement: Life Path Number

The system SHALL calculate the Life Path Number by summing all digits of the birth date (DD+MM+YYYY) and reducing to a single digit, preserving master numbers 11, 22, 33.

#### Scenario: Standard reduction

- GIVEN birth date 15/03/1990
- WHEN Life Path is calculated
- THEN result is 1+5+0+3+1+9+9+0 = 28 → 2+8 = 10 → 1+0 = **1**

#### Scenario: Master number preserved

- GIVEN birth date 11/07/1985
- WHEN Life Path is calculated
- THEN result is 1+1+0+7+1+9+8+5 = 32 → 3+2 = **5** (32 is not master, reduce normally)

#### Scenario: Direct master number

- GIVEN birth date 22/11/1970
- WHEN Life Path is calculated
- THEN intermediate sum is 22 (master) → preserved as **22**

### Requirement: Birthday Number

The system SHALL return the day of month as the Birthday Number, preserving master numbers 11 and 22.

#### Scenario: Standard day

- GIVEN birth day 15
- THEN Birthday Number is **6** (1+5)

#### Scenario: Master day

- GIVEN birth day 22
- THEN Birthday Number is **22** (not reduced)

### Requirement: Life Cycles

The system SHALL calculate 3 life periods of approximately 27-28 years each, derived from the birth date.

#### Scenario: Three cycles returned

- GIVEN any valid birth date
- WHEN Life Cycles are calculated
- THEN 3 periods are returned with start/end ages and governing numbers

### Requirement: Personal Year

The system SHALL calculate the Personal Year by summing the current year digits + birth date digits, reduced to 1-9.

#### Scenario: Current year calculation

- GIVEN birth date 15/03/1990 and current year 2026
- WHEN Personal Year is calculated
- THEN result is (2+0+2+6) + (1+5+0+3+1+9+9+0) = 10 + 28 = 38 → 3+8 = 11 → preserved as **11**

### Requirement: Expression Number

The system SHALL calculate the Expression Number by converting each letter of the full name to its numerology value (A=1..I=9, J=1..R=9, S=1..Z=8) and summing all values, reduced to 1-9 with master number preservation.

#### Scenario: Full name calculation

- GIVEN name "MARIA ELENA LOPEZ"
- WHEN Expression is calculated
- THEN each letter is converted, summed, and reduced

### Requirement: Soul Urge Number

The system SHALL calculate the Soul Urge by summing only the vowels (A, E, I, O, U) of the full name.

#### Scenario: Vowels only

- GIVEN name "MARIA ELENA LOPEZ"
- WHEN Soul Urge is calculated
- THEN only M**A**R**I****A** **E**L**E**N**A** L**O**P**E**Z vowels are summed

### Requirement: Personality Number

The system SHALL calculate the Personality Number by summing only the consonants of the full name.

### Requirement: Motivation Number

The system SHALL calculate the Motivation Number from the first name only.

### Requirement: Intuition Number

The system SHALL calculate the Intuition Number from the middle name only. If no middle name, return null.

### Requirement: Tendency Number

The system SHALL calculate the Tendency Number from the last name only.

### Requirement: Master Number Preservation

The system SHALL NOT reduce master numbers (11, 22, 33) at any calculation step. All intermediate and final results preserve these values.

#### Scenario: Master in intermediate step

- GIVEN a calculation producing intermediate 22
- WHEN reduction is applied
- THEN 22 is kept, not reduced to 4

### Requirement: Letter-to-Number Mapping

The system SHALL use the standard numerology chart: A=1,B=2,C=3,D=4,E=5,F=6,G=7,H=8,I=9,J=1,K=2,L=3,M=4,N=5,O=6,P=7,Q=8,R=9,S=1,T=2,U=3,V=4,W=5,X=6,Y=7,Z=8.

## Coverage

- Happy paths: ✅ All calculation types
- Edge cases: Master numbers, missing middle name
- Error states: Invalid date, empty name
