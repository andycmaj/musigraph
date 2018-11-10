using AspNetCore.ApplicationBlocks.Commands;
using HotChocolate.Types;
using Server.Models;
using Server.Resolvers;

namespace Server.Types
{
    public class ArtistType : ObjectType<Artist>
    {
        private readonly ICommandRouter commandRouter;

        public ArtistType(ICommandRouter commandRouter)
        {
            this.commandRouter = commandRouter;
        }

        protected override void Configure(IObjectTypeDescriptor<Artist> descriptor)
        {
            descriptor.Name("Artist");

            // descriptor.Field(a => a.Id)
            //     .Type<NonNullType<IdType>>();

            // descriptor.Field("name")
            //     .Type<StringType>();

            descriptor
                .Field(artist => artist.PerformsOn)
                .Type<ListType<ReleaseType>>()
                .Resolver(context => commandRouter.ExecuteFunctionAsync(
                    new ResolvePerformsOnCommand(context.Parent<Artist>().Id)
                ));
        }
    }
}