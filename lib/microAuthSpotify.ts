import querystring from 'querystring';
import url from 'url';
import uuid from 'uuid';
import rp from 'request-promise';
import redirect from 'micro-redirect';

const provider = 'spotify';

const microAuthSpotify = ({
  clientId,
  clientSecret,
  callbackUrl = '/auth/spotify/callback',
  path = '/auth/spotify',
  scopes = '',
}) => {
  // https://accounts.spotify.com/authorize?client_id={clientID}&scope={scopes}&response_type=code&redirect_uri=https://api.musigraph.app/api/v1/authentication/callback/spotify&state=CfDJ8NT9SXiLqTRBtjYKJGxJCZSxGuDjig-FbedqNuAw4qWGUncP8xwkPMmm6d3IYcl1ea5Sh4wPignegy5-Ut70GG3pm29lIuE_E29gbemJ2JGQEu3RjsMKBXLEbPJ2qaecnmrtWNigIWDnZlxx2426hJLFIXjhXf07g-GwoxPkEK2b-YHlAt58QDn4a3b5ilmCa63dunHwXicRXGobSA3PcoUiax2qPtDgSwuwgbZT3IHQ08sox-myF5MOvbwI9QW1g1CsMpNCYphRgLc18Wi43Eg
  const getRedirectUrl = state => {
    return `https://accounts.spotify.com/en/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=${scopes}&state=${state}&response_type=code`;
  };

  return fn => async (req, res, ...args) => {
    console.log('auth spotify');
    const { pathname, query } = url.parse(req.url);

    if (pathname === path) {
      try {
        const state = uuid.v4();
        const redirectUrl = getRedirectUrl(state);
        // states.push(state);
        return redirect(res, 302, redirectUrl);
      } catch (err) {
        args.push({ err, provider });
        return fn(req, res, ...args);
      }
    }

    const callbackPath = url.parse(callbackUrl).pathname;
    if (pathname === callbackPath) {
      try {
        const { code } = querystring.parse(query);

        // TODO: next js isn't appropriate for in-memory
        // state, since all handlers can be run as lambdas
        // if (!states.includes(state)) {
        //   const err = new Error('Invalid state');
        //   args.push({ err, provider });
        //   return fn(req, res, ...args);
        // }
        // states.splice(states.indexOf(state), 1);

        const response = await rp({
          method: 'POST',
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code,
            // eslint-disable-next-line @typescript-eslint/camelcase
            client_id: clientId,
            // eslint-disable-next-line @typescript-eslint/camelcase
            client_secret: clientSecret,
            // eslint-disable-next-line @typescript-eslint/camelcase
            grant_type: 'authorization_code',
            // eslint-disable-next-line @typescript-eslint/camelcase
            redirect_uri: callbackUrl,
          },
          json: true,
        });

        if (response.error) {
          args.push({ err: response.error, provider });
          return fn(req, res, ...args);
        }

        /*
        {"access_token":"**",
        "token_type":"Bearer",
        "expires_in":3600,
        "refresh_token":"**",
        "scope":""}
        */
        const accessToken = response.access_token;
        const refreshToken = response.refresh_token;

        const user = await rp({
          url: 'https://api.spotify.com/v1/me',
          json: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log('user', user);

        const result = {
          provider,
          accessToken,
          refreshToken,
          info: user,
        };

        args.push({ result });
        return fn(req, res, ...args);
      } catch (err) {
        args.push({ err, provider });
        return fn(req, res, ...args);
      }
    }

    return fn(req, res, ...args);
  };
};

export default microAuthSpotify;
