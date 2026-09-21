# bimlens

Upload IFC building models and browse what's been stored.

bimlens is the application used across my infrastructure portfolio projects. It is built once here and published to GHCR; the infrastructure repos only deploy it:

| Repo | What it shows |
|---|---|
| [gitops-flux-lab](https://github.com/balintbende/gitops-flux-lab) | GitOps delivery with Flux and Helm |
| [aws-terraform-lab](https://github.com/balintbende/aws-terraform-lab) | AWS infrastructure with Terraform (image pulled via ECR pull-through cache) |
| [azure-terraform-lab](https://github.com/balintbende/azure-terraform-lab) | Azure infrastructure with Terraform (image pulled via ACR cache rule) |

## Layout

| Path | What | Stack |
|---|---|---|
| [`api/`](api) | REST backend | ASP.NET Core (.NET 10), C# |
| [`web/`](web) | Frontend | React 19, TypeScript, Vite, Tailwind CSS |

## Images

Each app has its own workflow in [`.github/workflows`](.github/workflows), triggered only by changes under its folder.

| Image | Tags |
|---|---|
| `ghcr.io/balintbende/bimlens/api` | `<branch>-<short-sha>-<unix-ts>` (immutable), `<branch>` (moving) |
| `ghcr.io/balintbende/bimlens/web` | `<branch>-<short-sha>-<unix-ts>` (immutable), `<branch>` (moving) |

## Development

See [`api/README.md`](api/README.md) and [`web/README.md`](web/README.md). The web dev server proxies `/api` to the API on `localhost:5292`.

To run the whole stack in containers, run `docker compose up --build` and open `http://localhost:8080`. nginx in the web image serves the SPA and proxies `/api` to the api container. The API is also exposed directly on `localhost:5292`.
