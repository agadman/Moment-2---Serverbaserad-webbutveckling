# Work Experience API

Detta repository innehåller ett REST API byggt med Node.js, Express och PostgreSQL. API:et hanterar arbetserfarenheter som en del av ett projekt i kursen Backend-baserad webbutveckling. Grundläggande CRUD-funktionalitet (Create, Read, Update, Delete) är implementerad.


## Länk

En liveversion av API:et finns tillgänglig här: https://moment-2-frontend.onrender.com


## Installation & databas

API:et använder en PostgreSQL-databas. Klona detta repo. Installera beroenden genom npm install. Skapa en .env-fil med följande innehåll:

DB_HOST=din_host
DB_PORT=5432
DB_USERNAME=användarnamn
DB_PASSWORD=lösenord
DB_DATABASE=databasnamn

Starta servern genom npm run start. Databasen skapar automatiskt tabellen workexperience (om den inte redan finns) med följande fält:

| Fält        | Typ     | Beskrivning                      |
|-------------|----------|----------------------------------|
| id          | SERIAL   | Primärnyckel, autogenererad      |
| companyname | TEXT     | Företagets namn                  |
| jobtitle    | TEXT     | Jobbtitel                        |
| location    | TEXT     | Plats                            |
| startdate   | DATE     | Startdatum                       |
| enddate     | DATE     | Slutdatum                        |
| description | TEXT     | Beskrivning av arbetsuppgifter   |


## API-endpoints

| Metod | Endpoint                     | Beskrivning                                      |
|--------|------------------------------|--------------------------------------------------|
| GET    | /api/workexperience          | Hämtar alla arbetslivserfarenheter               |
| POST   | /api/workexperience          | Skapar en ny arbetslivserfarenhet                |
| PUT    | /api/workexperience/:id      | Uppdaterar arbetslivserfarenhet med angivet ID   |
| DELETE | /api/workexperience/:id      | Raderar arbetslivserfarenhet med angivet ID      |


## Exempel på JSON-objekt

{
  "companyname": "Företagsnamn",
  "jobtitle": "Frontend utvecklare",
  "location": "Stockholm",
  "startdate": "2024-01-01",
  "enddate": "2025-03-31",
  "description": "Arbetade med frontend utveckling i ett litet team."
}