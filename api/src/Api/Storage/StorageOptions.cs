namespace Api.Storage;

public class StorageOptions
{
    public const string SectionName = "Storage";

    public string Container { get; set; } = "models";

    // Used when no "BlobStorage" connection string is set, e.g. https://<account>.blob.core.windows.net
    // (authenticates with DefaultAzureCredential: managed/workload identity in Azure, az login locally).
    public Uri? ServiceUri { get; set; }
}
