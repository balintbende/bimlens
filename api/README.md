# api

Backend for **bimlens**.

Receives parsed IFC model data from `web` and stores it. Exposes a REST API with controller / service / repository layering (SOLID).

## Stack

- ASP.NET Core .NET 10
- C#
- OpenAPI (built-in)


## Development

```bash
cd src
dotnet run --project Api/Api.csproj
```

Runs at `http://localhost:5292`. Use `Api/Api.http` to test endpoints.

## Docker

Built from the repo root (matches CI):

```bash
docker build -t bimlens-api .
docker run --rm -p 8080:8080 bimlens-api
```
