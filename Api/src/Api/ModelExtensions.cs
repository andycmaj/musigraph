using DiscogsClient.Data.Result;

namespace Api
{
    public static class ModelExtensions
    {
        public static string GetReleaseId(this DiscogsArtistRelease release) =>
            (release.type == "master"
                ? release.main_release
                : release.id).ToString();

        public static string GetReleaseId(this DiscogsRelease release) =>
            release.id.ToString();

        public static string GetInfoUrl(this DiscogsArtistRelease release) =>
            $"https://www.discogs.com/{release.type}/{release.GetReleaseId()}";

        public static string GetInfoUrl(this DiscogsRelease release) =>
            $"https://www.discogs.com/release/{release.GetReleaseId()}";

        public static string GetInfoUrl(this DiscogsReleaseArtist artist) =>
            $"https://www.discogs.com/artist/{artist.id}";

        public static string GetInfoUrl(this DiscogsArtist artist) =>
            $"https://www.discogs.com/artist/{artist.id}";
    }
}