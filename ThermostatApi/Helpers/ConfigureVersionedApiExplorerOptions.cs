using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;

public class ConfigureVersionedApiExplorerOptions : IConfigureOptions<ApiExplorerOptions>
{
    public void Configure(ApiExplorerOptions options)
    {
        options.GroupNameFormat = "'v'VVV"; // e.g., v1, v2
        options.SubstituteApiVersionInUrl = true;
    }
}
