using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Api.Startup;

namespace Api
{
    public partial class Program
    {
        public static async Task Main(string[] args)
        {
            var host = BuildWebHost(args);
            await host.RunAsync();
        }

        private static IWebHost BuildWebHost(string[] args)
        {
            void ExtendFrameworkConfigurationBuilder(WebHostBuilderContext context, IConfigurationBuilder configBuilder)
            {
                Console.WriteLine($"APPINIT (1): {nameof(IWebHostBuilder.ConfigureAppConfiguration)}");
                // Add additional Configuration Providers here
            }

            void ExtendFrameworkLoggerFactory(WebHostBuilderContext context, ILoggingBuilder loggingBuilder)
            {
                Console.WriteLine($"APPINIT (2): {nameof(WebHostBuilderExtensions.ConfigureLogging)}");
                // Add additional Loggers here
            }

            void AddDefaultRegistrations(WebHostBuilderContext context, IServiceCollection services)
            {
                Console.WriteLine($"APPINIT (3): {nameof(IWebHostBuilder.ConfigureServices)}");
                // Add ASPNET.CORE Framework and SimpleInjector Registrations
            }

            return WebHost
                .CreateDefaultBuilder(args)
                .ConfigureAppConfiguration(ExtendFrameworkConfigurationBuilder)
                .ConfigureLogging(ExtendFrameworkLoggerFactory)
                .ConfigureServices(AddDefaultRegistrations)
                .UseStartup<CustomStartup>()
                .Build();
        }
    }
}