using AspNetCore.ApplicationBlocks.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Server
{
    public class AppConfig : ApplicationConfiguration, IAppConfig
    {
        private readonly IConfiguration frameworkConfiguration;

        public AppConfig(IHostingEnvironment hostingEnvironment, IConfiguration frameworkConfiguration)
            : base(hostingEnvironment, frameworkConfiguration)
        {
            this.frameworkConfiguration = frameworkConfiguration;
        }
    }
}