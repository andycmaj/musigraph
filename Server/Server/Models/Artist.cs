using System.Collections.Generic;

namespace Server.Models
{
    public class Artist
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IReadOnlyList<Release> PerformsOn { get; set; }
    }
}