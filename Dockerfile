# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ThermostatApi/ThermostatApi.csproj ThermostatApi/
COPY ThermostatApi/NuGet.config ThermostatApi/
RUN dotnet restore "ThermostatApi/ThermostatApi.csproj"

# Copy everything else and build
COPY ThermostatApi/ ThermostatApi/
WORKDIR /src/ThermostatApi
RUN dotnet build "ThermostatApi.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "ThermostatApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ThermostatApi.dll"]
