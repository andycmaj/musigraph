using AspNetCore.ApplicationBlocks.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Api
{
    public class AppConfig : ApplicationConfiguration, IAppConfig
    {
        private readonly IConfiguration frameworkConfiguration;

        public AppConfig(IHostingEnvironment hostingEnvironment, IConfiguration frameworkConfiguration)
            : base(hostingEnvironment, frameworkConfiguration)
        {
            this.frameworkConfiguration = frameworkConfiguration;
        }

        public string DiscogsApiToken => GetString("Discogs:ApiToken");
    }
}