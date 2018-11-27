using System;
using AspNetCore.ApplicationBlocks;
using AspNetCore.ApplicationBlocks.Commands;
using AspNetCore.ApplicationBlocks.Configuration;
using AspNetCore.ApplicationBlocks.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SimpleInjector;

namespace Api.Startup
{
    public class ApplicationBlocksStartupFilter : IStartupFilter
    {
        private readonly Container container;
        private readonly IConfiguration configuration;
        private readonly IHostingEnvironment environment;
        private readonly ILoggerFactory loggerFactory;

        public ApplicationBlocksStartupFilter(
            Container container,
            IConfiguration configuration,
            IHostingEnvironment environment,
            ILoggerFactory loggerFactory
        )
        {
            this.container = container;
            this.configuration = configuration;
            this.environment = environment;
            this.loggerFactory = loggerFactory;
        }

        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next) =>
            builder =>
            {
                Console.WriteLine($"APPINIT (6): {nameof(ApplicationBlocksStartupFilter)}.{nameof(ApplicationBlocksStartupFilter.Configure)}");

                container
                    .AddApplicationConfiguration<IAppConfig, AppConfig>(configuration, environment)
                    .AddEventLogging()
                    .AddCommands()
                    .AddBootstrappers()
                    .ConfigureForMvc(builder);

                next(builder);
            };
    }
}