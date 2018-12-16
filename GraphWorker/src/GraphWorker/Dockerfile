FROM microsoft/dotnet:2.1.2-aspnetcore-runtime

# The .NET Core tools collect usage data in order to improve your experience. The data is anonymous and does not include commandline arguments. The data is collected by Microsoft and shared with the community.
# You can opt out of telemetry by setting a DOTNET_CLI_TELEMETRY_OPTOUT environment variable to 1 using your favorite shell.
# You can read more about .NET Core tools telemetry @ https://aka.ms/dotnet-cli-telemetry.
ENV DOTNET_CLI_TELEMETRY_OPTOUT 1

WORKDIR /app

COPY bin/Release/netcoreapp2.1/publish /app

ENTRYPOINT [ "dotnet" ]
