using Api.Strategies;
using AspNet.Security.OAuth.Spotify;
using AspNetCore.ApplicationBlocks.DependencyInjection;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using SimpleInjector;
using SpotifyAPI.Web;
using SpotifyAPI.Web.Auth;

namespace Api.Startup
{
    public class SpotifyClientModule : IModule
    {
        public void RegisterServices(Container container)
        {
            container.Register<SpotifyWebAPI>(() =>
            {
                var httpContext = container.GetInstance<IHttpContextAccessor>().HttpContext;
                var config = container.GetInstance<IAppConfig>();

                if (httpContext != null &&
                    httpContext.User.Identity.AuthenticationType == SpotifyAuthenticationDefaults.AuthenticationScheme &&
                    httpContext.User.Identity.IsAuthenticated
                )
                {
                    var accessToken = httpContext.GetTokenAsync("access_token").Result;
                    var refreshToken = httpContext.GetTokenAsync("refresh_token").Result;

                    return new SpotifyWebAPI
                    {
                        UseAuth = true,
                        TokenType = "Bearer",
                        AccessToken = accessToken
                    };
                }

                var clientCredsToken =
                    new CredentialsAuth(config.SpotifyClientId, config.SpotifyClientSecret)
                    .GetToken()
                    .Result;

                // Use Client Token auth otherwise
                return new SpotifyWebAPI()
                {
                    UseAuth = true,
                    TokenType = clientCredsToken.TokenType,
                    AccessToken = clientCredsToken.AccessToken
                };
            }, Lifestyle.Scoped);

            container.Register<ISpotify, Spotify>(Lifestyle.Scoped);
            container.Register<SpotifySearchStrategy>();
        }
    }
}