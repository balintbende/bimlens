# api

Backend for **bimlens**.

Receives IFC files from `web`. Metadata (name, size, blob name) goes to PostgreSQL (EF Core), the file itself to Azure Blob Storage (Azurite locally). Exposes a REST API with controller / service / repository layering (SOLID).

## Stack

- ASP.NET Core .NET 10
- C#
- OpenAPI (built-in)
- EF Core + Npgsql (PostgreSQL), migrations applied on startup
- Azure.Storage.Blobs


## Development

Start Postgres and Azurite first (from the repo root); `appsettings.Development.json` points at them:

```bash
docker compose -f docker-compose-data-store.yml up -d
```

```bash
cd src
dotnet run --project Api/Api.csproj
```

Runs at `http://localhost:5292`. Use `Api/Api.http` to test endpoints.

## Configuration

| Key | Purpose |
|---|---|
| `ConnectionStrings:Postgres` | Npgsql connection string |
| `ConnectionStrings:BlobStorage` | Blob connection string (Azurite / account key) |
| `Storage:ServiceUri` | Used instead of the connection string, e.g. `https://<account>.blob.core.windows.net`; authenticates with `DefaultAzureCredential` (managed / workload identity) |
| `Storage:Container` | Blob container, default `models` |

Add a migration after changing the model:

```bash
cd src/Api
dotnet ef migrations add <Name> --output-dir Data/Migrations
```

## Docker

Built from the repo root (matches CI):

```bash
docker build -t bimlens-api .
docker run --rm -p 8080:8080 bimlens-api
```
