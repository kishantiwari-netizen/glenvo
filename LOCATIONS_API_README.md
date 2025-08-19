# Locations API Documentation

This API provides efficient access to country, state/province, and city data for Canada and USA, including currency and country codes. The API uses static data for optimal performance.

## Base URL

```
http://localhost:3000/api/locations
```

## Endpoints

### 1. Get All Countries

Retrieve all supported countries with their currency and country codes.

**Endpoint:** `GET /api/locations/countries`

**Response:**

```json
{
  "success": true,
  "message": "Countries retrieved successfully",
  "data": [
    {
      "code": "US",
      "name": "United States",
      "currency": "US Dollar",
      "currencyCode": "USD"
    },
    {
      "code": "CA",
      "name": "Canada",
      "currency": "Canadian Dollar",
      "currencyCode": "CAD"
    }
  ]
}
```

### 2. Get States/Provinces by Country

Retrieve all states or provinces for a specific country.

**Endpoint:** `GET /api/locations/countries/{countryCode}/states`

**Parameters:**

- `countryCode` (path): Country code (US or CA)

**Example:** `GET /api/locations/countries/US/states`

**Response:**

```json
{
  "success": true,
  "message": "States retrieved successfully",
  "data": [
    {
      "code": "CA",
      "name": "California",
      "countryCode": "US"
    },
    {
      "code": "NY",
      "name": "New York",
      "countryCode": "US"
    }
  ]
}
```

### 3. Get Cities by State/Province

Retrieve all cities for a specific state or province.

**Endpoint:** `GET /api/locations/countries/{countryCode}/states/{stateCode}/cities`

**Parameters:**

- `countryCode` (path): Country code (US or CA)
- `stateCode` (path): State/province code

**Example:** `GET /api/locations/countries/US/states/CA/cities`

**Response:**

```json
{
  "success": true,
  "message": "Cities retrieved successfully",
  "data": [
    {
      "name": "Los Angeles",
      "stateCode": "CA",
      "countryCode": "US"
    },
    {
      "name": "San Francisco",
      "stateCode": "CA",
      "countryCode": "US"
    }
  ]
}
```

### 4. Get All States/Provinces

Retrieve all states and provinces from all supported countries.

**Endpoint:** `GET /api/locations/states`

**Response:**

```json
{
  "success": true,
  "message": "All states retrieved successfully",
  "data": [
    {
      "code": "CA",
      "name": "California",
      "countryCode": "US"
    },
    {
      "code": "ON",
      "name": "Ontario",
      "countryCode": "CA"
    }
  ]
}
```

### 5. Get All Cities

Retrieve all cities from all supported countries.

**Endpoint:** `GET /api/locations/cities`

**Response:**

```json
{
  "success": true,
  "message": "All cities retrieved successfully",
  "data": [
    {
      "name": "Los Angeles",
      "stateCode": "CA",
      "countryCode": "US"
    },
    {
      "name": "Toronto",
      "stateCode": "ON",
      "countryCode": "CA"
    }
  ]
}
```

## Supported Countries

### United States (US)

- **Currency:** US Dollar (USD)
- **States:** All 50 states including Alabama, Alaska, Arizona, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming
- **Cities:** 5 major cities per state (250 total cities)

### Canada (CA)

- **Currency:** Canadian Dollar (CAD)
- **Provinces & Territories:** All 13 provinces and territories including Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Nova Scotia, Northwest Territories, Nunavut, Ontario, Prince Edward Island, Quebec, Saskatchewan, Yukon
- **Cities:** 5 major cities per province/territory (65 total cities)

## Performance Features

1. **Static Data:** Uses in-memory static data for instant responses
2. **No Database Queries:** Eliminates database latency
3. **Optimized Structure:** Hierarchical data structure for efficient lookups
4. **Caching Ready:** Data is already in memory, ready for caching

## Error Handling

The API returns appropriate error messages for:

- Invalid country codes
- Invalid state/province codes
- Missing parameters

**Error Response Example:**

```json
{
  "success": false,
  "message": "Country with code XX not found",
  "error": "Country with code XX not found"
}
```

## Usage Examples

### Frontend Integration

```javascript
// Get all countries
const countries = await fetch("/api/locations/countries").then((r) => r.json());

// Get states for USA
const states = await fetch("/api/locations/countries/US/states").then((r) =>
  r.json()
);

// Get cities for California
const cities = await fetch("/api/locations/countries/US/states/CA/cities").then(
  (r) => r.json()
);
```

### React Component Example

```jsx
import React, { useState, useEffect } from "react";

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    fetch("/api/locations/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data.data));
  }, []);

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    fetch(`/api/locations/countries/${countryCode}/states`)
      .then((res) => res.json())
      .then((data) => setStates(data.data));
  };

  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
    fetch(
      `/api/locations/countries/${selectedCountry}/states/${stateCode}/cities`
    )
      .then((res) => res.json())
      .then((data) => setCities(data.data));
  };

  return (
    <div>
      <select onChange={(e) => handleCountryChange(e.target.value)}>
        <option>Select Country</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} ({country.currencyCode})
          </option>
        ))}
      </select>

      {states.length > 0 && (
        <select onChange={(e) => handleStateChange(e.target.value)}>
          <option>Select State/Province</option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      )}

      {cities.length > 0 && (
        <select>
          <option>Select City</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
```

## API Documentation

For interactive API documentation, visit:

```
http://localhost:3000/api-docs
```

The Swagger documentation includes all endpoints with request/response examples and parameter descriptions.
