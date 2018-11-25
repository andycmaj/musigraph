using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using SimpleInjector;
using AspNetCore.ApplicationBlocks;
using HotChocolate;
using GraphiQl;

namespace Server.Startup
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
                    builder.UseDefaultApiMiddleware(
                        container,
                        environment,
                        diagnosticListener,
                        useSwagger: false,
                        useAuthentication: false
                    );

                    next(builder);
                };
        }
}