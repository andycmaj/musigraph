using AspNetCore.ApplicationBlocks.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace GraphWorker
{
    public class AppConfig : ApplicationConfiguration, IAppConfig
    {
        public AppConfig(IHostingEnvironment hostingEnvironment, IConfiguration frameworkConfiguration)
            : base(hostingEnvironment, frameworkConfiguration)
        {
        }
    }
}