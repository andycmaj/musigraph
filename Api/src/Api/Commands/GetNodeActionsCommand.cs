using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Api.Models;
using AspNetCore.ApplicationBlocks.Commands;
using DiscogsClient;
using DiscogsClient.Data.Result;

namespace Api.Commands
{
    public class GetNodeActionsCommand : IFunction<IList<Models.Action>>
    {
        public int NodeId { get; set; }
        public NodeType NodeType { get; set; }

        public class Handler : IFunctionHandlerAsync<GetNodeActionsCommand, IList<Models.Action>>
        {
            private readonly IDiscogsDataBaseClient discogs;
            private readonly ISpotify spotify;

            public Handler(
                IDiscogsDataBaseClient discogs,
                ISpotify spotify
            )
            {
                this.discogs = discogs;
                this.spotify = spotify;
            }

            public async Task<IList<Models.Action>> ExecuteAsync(GetNodeActionsCommand function)
            {
                switch (function.NodeType)
                {
                    case NodeType.Artist:
                        // TODO: get from cache or passed up in command
                        var artist = await discogs.GetArtistAsync(function.NodeId);
                        return await GetArtistActions(artist);
                    case NodeType.Release:
                        // TODO: get from cache or passed up in command
                        var release = await discogs.GetReleaseAsync(function.NodeId);
                        return await GetReleaseActions(release);
                    default:
                        throw new NotImplementedException();
                }
            }

            private async Task<IList<Models.Action>> GetReleaseActions(DiscogsRelease discogsRelease)
            {
                var actions = new List<Models.Action>();

                actions.Add(new Models.Action {
                    Label = "Info",
                    Type = ActionType.ExternalLink,
                    Url = discogsRelease.GetInfoUrl()
                });

                var results = await spotify.FindAlbumsAsync(
                    discogsRelease.title,
                    SanitizeArtistName(discogsRelease.artists[0].name)
                );
                var release = results.FirstOrDefault();

                if (release != null)
                {
                    var tracks = await spotify.GetAlbumTracksAsync(release.Id, limit: 1);
                    var track = tracks.SingleOrDefault();

                    if (!string.IsNullOrEmpty(track?.PreviewUrl))
                    {
                        actions.Add(new Models.Action {
                            Label = track.Name,
                            Type = ActionType.Audio,
                            Url = track.PreviewUrl
                        });
                    }
                }

                return actions;
            }

            private string SanitizeArtistName(string name) =>
                Regex.Replace(name, @"\(\d+\)", string.Empty);

            private async Task<IList<Models.Action>> GetArtistActions(DiscogsArtist discogsArtist)
            {
                var actions = new List<Models.Action>();

                actions.Add(new Models.Action {
                    Label = "Info",
                    Type = ActionType.ExternalLink,
                    Url = discogsArtist.GetInfoUrl()
                });

                var results = await spotify.FindArtistsAsync(SanitizeArtistName(discogsArtist.name));
                var artist = results.FirstOrDefault();

                if (artist != null)
                {
                    var tracks = await spotify.GetArtistTopTracksAsync(artist.Id);
                    if (tracks.Any())
                    {
                        var track = tracks.First();
                        actions.Add(new Models.Action {
                            Label = track.Name,
                            Type = ActionType.Audio,
                            Url = track.PreviewUrl
                        });
                    }
                }

                return actions;
            }
        }
    }
}