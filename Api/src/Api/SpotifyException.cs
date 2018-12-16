using System;

namespace Api
{
    public class SpotifyException : Exception
    {
        public int StatusCode { get; }

        public SpotifyException(string message, int statusCode)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}