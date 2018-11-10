using System.Collections.Generic;

namespace Server.Models
{
    public class Release
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MainArtist { get; set; }
        public IReadOnlyList<Artist> Performers { get; set; }
    }
}