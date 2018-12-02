using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using SimpleInjector;
using AspNetCore.ApplicationBlocks;

namespace Api.Startup
{
        public class DefaultMiddlewareStartupFilter : IStartupFilter
        {
            private readonly Container container;
            private readonly IHostingEnvironment environment;
            private readonly DiagnosticListener diagnosticListener;

            public DefaultMiddlewareStartupFilter(
                Container container,
                IHostingEnvironment environment,
                DiagnosticListener diagnosticListener
            )
            {
                this.container = container;
                this.environment = environment;
                this.diagnosticListener = diagnosticListener;
            }

            public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next) =>
                builder =>
                {
                    Console.WriteLine($"APPINIT (7): {nameof(DefaultMiddlewareStartupFilter)}.{nameof(DefaultMiddlewareStartupFilter.Configure)}");

                    builder.UseCors(corsBuilder =>
                        corsBuilder
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .WithOrigins(
                                "http://localhost:3000",
                                "https://5c02fcb0b312746073d1b154--musinav.netlify.com",
                                "https://musigraph.app",
                                "https://*.musigraph.app"
                            )
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                    );

                    builder.UseDefaultApiMiddleware(
                        container,
                        environment,
                        diagnosticListener,
                        useAuthentication: false
                    );

                    next(builder);
                };
        }
}