using HotChocolate.Types;
using Server.Models;

namespace Server.Types
{
    public class ReleaseType : ObjectType<Release>
    {
        protected override void Configure(IObjectTypeDescriptor<Release> descriptor)
        {
            descriptor.Name("Release");

            // descriptor.Field("id")
            //     .Type<NonNullType<IdType>>();

            // descriptor.Field("name")
            //     .Type<StringType>();

            // descriptor.Field("performers")
            //     .Type<ListType<ArtistType>>();
        }
    }
}