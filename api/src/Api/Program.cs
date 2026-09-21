using Api.Repositories;
using Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSingleton<IModelRepository, InMemoryModelRepository>();
builder.Services.AddScoped<IModelService, ModelService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

// Health check endpoint, used by the Kubernetes readiness probe.
app.MapGet("/health-check", () => "APPLICATION_IS_OK");

app.Run();
