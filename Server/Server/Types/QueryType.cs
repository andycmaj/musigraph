using System.Collections.Generic;
using AspNetCore.ApplicationBlocks.Commands;
using HotChocolate.Types;
using Server.Models;
using Server.Resolvers;

namespace Server.Types
{
    public class QueryType : ObjectType
    {
        private readonly ICommandRouter commandRouter;

        public QueryType(ICommandRouter commandRouter)
        {
            this.commandRouter = commandRouter;
        }

        protected override void Configure(IObjectTypeDescriptor descriptor)
        {
            descriptor
                .Field("artist")
                .Type<ArtistType>()
                .Resolver(context => commandRouter.ExecuteFunctionAsync(
                    new GetArtistCommand(context.Argument<int>("id"))
                ))
                .Argument("id", arg => arg.DefaultValue(12628));

            descriptor
                .Field("artistSearch")
                .Type<ListType<ArtistType>>()
                .Resolver(context => commandRouter.ExecuteFunctionAsync(
                    new FindArtistCommand(context.Argument<string>("name"))
                ))
                .Argument("name", arg => arg.DefaultValue("John Scofield"));
        }
    }
}