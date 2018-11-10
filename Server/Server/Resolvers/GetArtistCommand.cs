using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Commands;
using HotChocolate.Resolvers;
using Server.Models;
using DiscogsClient;

namespace Server.Resolvers
{
    public class GetArtistCommand : IFunction<Artist>
    {
        public GetArtistCommand(int artistId)
        {
            ArtistId = artistId;
        }

        public int ArtistId { get; }

        public class GetArtistCommandHandler
            : IFunctionHandlerAsync<GetArtistCommand, Artist>
        {
            private readonly IDiscogsDataBaseClient discogsClient;

            public GetArtistCommandHandler(IDiscogsDataBaseClient discogsClient)
            {
                this.discogsClient = discogsClient;
            }

            public async Task<Artist> ExecuteAsync(GetArtistCommand command)
            {
                var artist = await discogsClient.GetArtistAsync(command.ArtistId);

                return new Artist {
                    Id = artist.id,
                    Name = artist.name,
                };
            }
        }
    }
}