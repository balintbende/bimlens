using Api.Data;
using Api.Repositories;
using Api.Services;
using Api.Storage;
using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddDbContext<BimlensDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

builder.Services.Configure<StorageOptions>(builder.Configuration.GetSection(StorageOptions.SectionName));
builder.Services.AddSingleton(sp =>
{
    var options = sp.GetRequiredService<IOptions<StorageOptions>>().Value;
    // Connection string for Azurite/local dev; otherwise the account URL with an Azure identity.
    var connectionString = builder.Configuration.GetConnectionString("BlobStorage");
    var service = !string.IsNullOrEmpty(connectionString)
        ? new BlobServiceClient(connectionString)
        : new BlobServiceClient(
            options.ServiceUri ?? throw new InvalidOperationException(
                "Set ConnectionStrings:BlobStorage or Storage:ServiceUri."),
            new DefaultAzureCredential());
    return service.GetBlobContainerClient(options.Container);
});

builder.Services.AddScoped<IModelRepository, EfModelRepository>();
builder.Services.AddSingleton<IFileStorage, AzureBlobFileStorage>();
builder.Services.AddScoped<IModelService, ModelService>();

var app = builder.Build();

// Apply pending migrations on startup; EF takes a database lock, so concurrent replicas are safe.
using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<BimlensDbContext>().Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

// Health check endpoint, used by the Kubernetes readiness probe.
app.MapGet("/health-check", () => "APPLICATION_IS_OK");

app.Run();
