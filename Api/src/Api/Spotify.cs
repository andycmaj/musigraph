using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Spotify;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Polly;
using SerilogEventLogger;
using SpotifyAPI.Web;
using SpotifyAPI.Web.Enums;
using SpotifyAPI.Web.Models;

namespace Api
{
    public class Spotify : ISpotify
    {
        private readonly SpotifyWebAPI spotify;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IEventLogger<Spotify> logger;

        public Spotify(
            SpotifyWebAPI spotify,
            IHttpContextAccessor httpContextAccessor,
            IEventLogger<Spotify> logger
        )
        {
            this.spotify = spotify;
            this.httpContextAccessor = httpContextAccessor;
            this.logger = logger;
        }

        private async Task<T> ExecuteWithRetryPolicy<T>(Func<Task<T>> apiCall)
            where T : BasicModel
        {
            return await Policy
                .HandleResult<T>(item => item.HasError())
                .RetryAsync(2, async (result, retryCount) =>
                {
                    logger.ErrorEvent("SpotifyApiFailure", new {
                        result.Result.Error,
                        StatusCode = result.Result.StatusCode()
                    });

                    // access token expired
                    if (retryCount == 1 && result.Result.StatusCode() == HttpStatusCode.Unauthorized)
                    {
                        await RefreshAccessToken();
                        spotify.AccessToken =
                            await httpContextAccessor.HttpContext.GetTokenAsync("access_token");
                    }

                    // refresh token expired
                    if (retryCount == 2)
                    {
                        throw new SpotifyException("Could not refresh Spotify token", 401);
                    }
                })
                .ExecuteAsync(apiCall);
        }

        private async Task RefreshAccessToken()
        {
            var context = httpContextAccessor.HttpContext;
            var userResult = await context.AuthenticateAsync(SpotifyAuthenticationDefaults.AuthenticationScheme);
            var user = userResult.Principal;
            var authProperties = userResult.Properties;

            var refreshToken = authProperties.GetTokenValue("refresh_token");

            var options = context.RequestServices.GetRequiredService<IOptionsMonitor<SpotifyAuthenticationOptions>>().Get(context.User.Identities.First().AuthenticationType);

            var pairs = new Dictionary<string, string> {
                { "client_id", options.ClientId },
                { "client_secret", options.ClientSecret },
                { "grant_type", "refresh_token" },
                { "refresh_token", refreshToken }
            };
            var content = new FormUrlEncodedContent(pairs);
            var refreshResponse = await options.Backchannel.PostAsync(options.TokenEndpoint, content, context.RequestAborted);
            refreshResponse.EnsureSuccessStatusCode();

            var payload = JObject.Parse(await refreshResponse.Content.ReadAsStringAsync());

            // Persist the new acess token
            authProperties.UpdateTokenValue("access_token", payload.Value<string>("access_token"));
            refreshToken = payload.Value<string>("refresh_token");
            if (!string.IsNullOrEmpty(refreshToken))
            {
                authProperties.UpdateTokenValue("refresh_token", refreshToken);
            }
            if (int.TryParse(payload.Value<string>("expires_in"), NumberStyles.Integer, CultureInfo.InvariantCulture, out var seconds))
            {
                var expiresAt = DateTimeOffset.UtcNow + TimeSpan.FromSeconds(seconds);
                authProperties.UpdateTokenValue("expires_at", expiresAt.ToString("o", CultureInfo.InvariantCulture));
            }
            await context.SignInAsync(user, authProperties);

            logger.InfoEvent("RefreshedSpotifyAuth", new { user.Identity.Name });

            await Task.CompletedTask;
        }

        public async Task<IList<SimpleAlbum>> FindAlbumsAsync(string title, string artist)
        {
            var exactAlbumQuery = $"album: \"{title}\" artist: \"{artist}\"";
            var results = await ExecuteWithRetryPolicy(() => spotify.SearchItemsAsync(exactAlbumQuery, SearchType.Album, market: "US"));
            return results.Albums?.Items;
        }

        public async Task<IList<FullArtist>> FindArtistsAsync(string name)
        {
            var exactArtistQuery = $"artist: \"{name}\"";
            var results = await ExecuteWithRetryPolicy(() => spotify.SearchItemsAsync(exactArtistQuery, SearchType.Artist, market: "US"));
            return results.Artists?.Items ?? new List<FullArtist>();
        }

        public async Task<IList<SimpleTrack>> GetAlbumTracksAsync(string albumId, int limit = 10)
        {
            var result = await ExecuteWithRetryPolicy(() => spotify.GetAlbumTracksAsync(albumId, limit));
            return result.Items ?? new List<SimpleTrack>();
        }

        public async Task<IList<FullTrack>> GetArtistTopTracksAsync(string artistId, int limit = 10)
        {
            var result = await ExecuteWithRetryPolicy(() => spotify.GetArtistsTopTracksAsync(artistId, "US"));
            return result.Tracks ?? new List<FullTrack>();
        }
    }
}