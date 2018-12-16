# `Iqviate.Console` Generator

This generator will create a fully functional AspNetCore console application, optionally with AWS Lambda support.

- [`Iqviate.Console` Generator](#iqviateconsole-generator)
  - [Generator Options](#generator-options)
  - [Directory Structure](#directory-structure)
  - [Running](#running)
    - [`dotnet` cli](#dotnet-cli)
    - [Docker](#docker)
  - [Configuration](#configuration)
    - [Default `AppConfig`](#default-appconfig)
    - [Working With DI `Container` Dependencies](#working-with-di-container-dependencies)
    - [Consuming Application Config](#consuming-application-config)
    - [Modifying Application Config](#modifying-application-config)
  - [Running Bootstrap Actions at Startup Time](#running-bootstrap-actions-at-startup-time)
  - [Logging and Metrics](#logging-and-metrics)
  - [Reference](#reference)

## Generator Options

```bash
IQVIA's standard console application (C#)
Options:
  -L|--LambdaSupport  Specify `true` if this console app will be run as a Lambda function.
                      bool - Optional
                      Default: false

  -La|--LambdaName    Unique Lambda function name
                      text - Optional
                      Default: LAMBDA_FUNCTION_NAME_PLACEHOLDER```
```

## Directory Structure

```bash
{solution root}/src/GraphWorker/
  Dockerfile
  docker-compose.yml
  Program.cs
  IAppConfig.cs
  AppConfig.cs
  appsettings.json
  GraphWorker.csproj
  * LambdaEntrypoint.cs
  * dummy.cshtml
  * aws-lambda-tools-defaults.json
```

> `*` = only included when `LambdaSupport` is specified

- `Program.cs`: Application entrypoint
- `IAppConfig.cs`, `AppConfig.cs`: Application-specific configuration backed by `Microsoft.Extensions.Configuration.IConfiguration`.
- `appsettings.json`: Default application-specific configuration values. Can be overridden by environment variables.
- `LambdaEntrypoint.cs`: Lambda entrypoint used instead of `Program.cs` when running as a lambda.
- `aws-lambda-tools-default.json`: Configuration used when running `dotnet lambda` commands.

## Running

### `dotnet` cli

```bash
$ dotnet run
```

### Docker

```bash
$ dotnet publish -c Release
$ docker-compose build && docker-compose up
```

## Configuration

Basic [Application Blocks](http://applicationblocks.apidocs.iqvia.io/api/) such as [Event Logging](https://gitlab.ims.io/tools/AspNetCore.Logging#event-logging), [Dependency Injection](http://applicationblocks.apidocs.iqvia.io/api/AspNetCore.ApplicationBlocks.Console/ConsoleApplicationContext/C153E8D9.html), and [Commands](https://gitlab.ims.io/tools/AspNetCore.Patterns#patterns-library) are included and configured by default. You can customize how most things are configured.

### Default `AppConfig`

The default `IAppConfig` is empty but is a subclass of [`IApplicationConfiguration`](http://applicationblocks.apidocs.iqvia.io/api/AspNetCore.ApplicationBlocks.Configuration/IApplicationConfiguration/), so you get some general configuration for free.
Specifically, the following values are available via `IApplicationConfiguration`.

```json
  "Application": {
    "Name": "Iqviate.Templates.FrontEnd",
    "Version": "Development",
    "Host": "devbox",
    "ProductionLikeEnvironments": [ "Production" ]
  },
```

### Working With DI `Container` Dependencies

If you want to add additional dependencies to your `Container` (you almost certainly will), you can pass a list of additional [`IModules`](https://gitlab.ims.io/tools/AspNetCore.Patterns/blob/master/src/AspNetCore.Patterns.SimpleInjector/IModule.cs) to the [`ConsoleApplicationBuilder` constructor](http://applicationblocks.apidocs.iqvia.io/api/AspNetCore.ApplicationBlocks.Console/ConsoleApplicationBuilder/9EA3675E.html) in [`Program.cs`](https://gitlab.ims.io/tools/Iqviate.Templates/blob/master/src/console/Program.cs#L13).

`IModules` should contain logical groupings of dependencies, for example, by feature, area, command, or task.

:point_right: [`container.Verify()`](http://simpleinjector.readthedocs.io/en/latest/diagnostics.html#how-to-view-diagnostic-results) will be called as the last step before bootstrapping in [`ConsoleApplicationBuilder.Build(...)`](https://gitlab.ims.io/tools/AspNetCore.ApplicationBlocks/blob/master/src/AspNetCore.ApplicationBlocks.Console/ConsoleApplicationBuilder.cs#L183), so you won't be able to modify the `Container` after this point.

### Consuming Application Config

[`IAppConfig`](https://gitlab.ims.io/tools/Iqviate.Templates/blob/master/src/frontend/IAppConfig.cs) is the interface you'll use to access all of your application's configuration in a strongly-typed, injectable way.

Calling [`container.AddApplicationConfiguration<,>(...)`](https://gitlab.ims.io/tools/Iqviate.Templates/blob/master/src/frontend/Startup.cs#L30) (:construction: doc link for ApplicationBlocks `AddApplicationConfiguration`), in `Startup`'s constructor, initializes (from configuration providers) and registers (in the `Container`) an instance of `IAppConfig` for you to inject into any other service registered in the `Container`.

```csharp
class MyClass
{
  public MyClass(IAppConfig config)
  {
    this.config = config;
  }
}
```

Since `AppConfig` has to inherit from [`ApplicationConfiguration`](http://applicationblocks.apidocs.iqvia.io/api/AspNetCore.ApplicationBlocks.Configuration/ApplicationConfiguration/), you can use it to access generic configuration values in [`IApplicationConfiguration`](http://applicationblocks.apidocs.iqvia.io/api/AspNetCore.ApplicationBlocks.Configuration/IApplicationConfiguration/) such as `Environment`, `ApplicationName`, and `Version`.

### Modifying Application Config

:point_right: The [Configuration ApplicationBlock](http://applicationblocks.apidocs.iqvia.io/api/AspNetCore.ApplicationBlocks.Configuration/ConfigurationExtensions/) is really just a thin layer on top of [AspNetCore's Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration).

`IAppConfig` is implemented, by default, by `AppConfig`. If you want to add or update configuration in your application, you can modify the `IAppConfig` interface and then update the implementation of that interface in `AppConfig`.

The implementation in `AppConfig` is where you will retrieve the configuration value using the appropriate key. `AppConfig` reads values from the [`IConfiguration`](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration) instance created by the underlying [hosting WebHost](https://github.com/aspnet/MetaPackages/blob/release/2.0/src/Microsoft.AspNetCore/WebHost.cs#L152).

- example `appsettings.json`

    ```json
    {
      "subsection": {
        "suboption1": "subvalue1_from_json"
      },
    }
    ```
- example `AppConfig.cs`

    ```csharp
    public class AppConfig : ApplicationConfiguration, IAppConfig
    {
        private readonly IConfiguration frameworkConfiguration;

        public AppConfig(IHostingEnvironment hostingEnvironment, IConfiguration frameworkConfiguration)
            : base(hostingEnvironment, frameworkConfiguration)
        {
            this.frameworkConfiguration = frameworkConfiguration;
        }
    }
    ```

:point_right: To override hierarchical config values (nested JSON values in `appsettings.json`, for example) using environment variables, a colon (`:`) may not work on all platforms. Double underscore (`__`) can be used instead, and is supported by all platforms.

The [default config providers](https://github.com/aspnet/MetaPackages/blob/release/2.0/src/Microsoft.AspNetCore/WebHost.cs#L157) are, in lowest-to-highest order of precedence:

- default [`appsettings.json`](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration#json-configuration)
- environment-specific `appsettings.{Environment}.json`
- [environment variables](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration#configuration-by-environment)
- [command line arguments](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration#commandline-configuration-provider)

## Running Bootstrap Actions at Startup Time

If you need to execute any bootstrapping tasks before your console begins executing, add an [`IBootstrapper`](http://applicationblocks.apidocs.iqvia.io/api/AspNetCore.ApplicationBlocks.Bootstrapping/IBootstrapper/) implementation to your solution for each of those tasks. `IBootstrappers` are registered in and initialized by the `Container`, so you can inject any dependencies you need into their constructors.

A example of a bootstrapper would [ensure an S3 bucket exists for AspNetCore DataProtection key sharing](https://gitlab.ims.io/channels/TheChunnel/blob/master/src/TheChunnel.FrontEnd/Bootstrappers/EnsureS3KeySynkBucket.cs).

Bootstrappers are discovered when you [create your `ConsoleApplicationBuilder`](https://gitlab.ims.io/tools/Iqviate.Templates/blob/master/src/console/Program.cs#L10) and executed when you call [`Build(...)`](https://gitlab.ims.io/tools/Iqviate.Templates/blob/master/src/console/Program.cs#L17), right before your application begins to [execute inside the `ConsoleApplicationContext` scope](https://gitlab.ims.io/tools/Iqviate.Templates/blob/master/src/console/Program.cs#L21).

## Logging and Metrics

Event Logging and Metrics, using [`AspNetCore.Logging`](https://gitlab.ims.io/tools/AspNetCore.Logging#event-logging) are configured for you by the [Logging ApplicationBlock](http://applicationblocks.apidocs.iqvia.io/api/AspNetCore.ApplicationBlocks.Logging/LoggingExtensions/).

To enable logging to Splunk via Kinesis or directly, see [remarks on logging configuration](http://applicationblocks.apidocs.iqvia.io/api/AspNetCore.ApplicationBlocks.Logging/LoggingExtensions/D4F78B79.html#Examples) in the Logging ApplicationBlock API docs.

Inject an [`IEventLogger<T>`](http://logging.apidocs.iqvia.io/api/AspNetCore.Logging/IEventLogger/) anywhere you need to do logging.

## Reference

- [AspNetCore.ApplicationBlocks](https://gitlab.ims.io/tools/AspNetCore.ApplicationBlocks)
- [Configuration in AspNetCore](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1&tabs=basicconfiguration)
- [SimpleInjector](http://simpleinjector.readthedocs.io/en/latest/index.html)