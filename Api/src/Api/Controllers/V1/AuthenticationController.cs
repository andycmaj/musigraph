using System;
using System.Threading.Tasks;
using AspNet.Security.OAuth.Spotify;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Api.V1.Controllers
{
    [Route("api/v1/[controller]")]
    public class AuthenticationController : Controller
    {
        [HttpGet("signin/spotify")]
        public async Task<IActionResult> SpotifySignIn()
        {
            // Instruct the middleware corresponding to the requested external identity
            // provider to redirect the user agent to its own authorization endpoint.
            // Note: the authenticationScheme parameter must match the value configured in Startup.cs
            return Challenge(
                new AuthenticationProperties {
                    RedirectUri = "https://musigraph.app?linked=spotify",
                    AllowRefresh = true,
                },
                SpotifyAuthenticationDefaults.AuthenticationScheme
            );
        }
    }
}