FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
# Restore as its own layer so it's cached unless the csproj changes.
COPY ["src/Api/Api.csproj", "Api/"]
RUN dotnet restore "Api/Api.csproj"
COPY src/ .
RUN dotnet publish "Api/Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
# Run as non-root for better security (ASP.NET Core listens on 8080).
USER $APP_UID
ENTRYPOINT ["dotnet", "Api.dll"]
