using System;
using Api.Strategies;
using App.Metrics.Health;
using AspNetCore.ApplicationBlocks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SimpleInjector;

namespace Api.Startup
{
    /// <summary>
    /// Use this class to extend the default FrontEnd initialization that happens in Program.BuildWebHost
    /// </summary>
    public class CustomStartup
    {
        private readonly Container container;
        private readonly IHostingEnvironment environment;

        public CustomStartup(IConfiguration configuration, IHostingEnvironment environment, ILoggerFactory loggerFactory)
        {
            System.Console.WriteLine($"APPINIT (4): new {nameof(CustomStartup)}");

            container = new Container()
                .ForFrontEnd()
                .WithModules(
                    new DiscogsClientModule(),
                    new SpotifyClientModule()
                );
            this.environment = environment;
        }

        // This method gets called by the WebHostBuilder after WebHostBuilder.ConfigureServices.
        // Use this method to add additional services to the ASPNETCORE DI
        public void ConfigureServices(IServiceCollection services)
        {
            System.Console.WriteLine($"APPINIT (5): {nameof(CustomStartup.ConfigureServices)}");

            services.IntegrateSimpleInjector(container);

            Func<IHealthBuilder, IHealthBuilder> configureHealthCheck =
                builder =>
                {
                    // Configure custom health-checks here
                    // https://www.app-metrics.io/health-checks/pre-defined-checks/
                    return builder.HealthChecks.AddProcessPrivateMemorySizeCheck("Private Memory Size", 3L * 1024 * 1024 * 1024);
                };

            services.AddCors();

            services.AddDefaultApiServices(
                container,
                environment,
                configureHealthCheck : configureHealthCheck
            );

            // Startup filters are executed in order with respect to registration
            services.AddTransient<IStartupFilter, ApplicationBlocksStartupFilter>();
            services.AddTransient<IStartupFilter, DefaultMiddlewareStartupFilter>();
        }

        // This method gets called by the WebHostBuilder after all IStartupFilters have been executed.
        // Use this method to add additional Middleware to the end of the Middelware chain built by
        // the IStartupFilters
        public void Configure(IApplicationBuilder builder, Container container)
        {
            System.Console.WriteLine($"APPINIT (8): {nameof(CustomStartup.Configure)}");

            container.RegisterSingleton<IStrategyFactory, StrategyFactory>();

            container.Verify();

            // Run all IBootstrapper instances found in DependencyContext
            container.RunBootstrappers();
        }
    }
}