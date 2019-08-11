import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { send } from 'micro';
import withSpotifyOAuth from 'lib/withSpotifyOAuth';
import redirect from 'micro-redirect';
import url from 'url';

/**
 * This sets `cookie` on `res` object
 */
const cookie = (
  res: NextApiResponse,
  req: NextApiRequest,
  name,
  value,
  options: any = {}
) => {
  const stringValue =
    typeof value === 'object' ? JSON.stringify(value) : String(value);

  options.domain = url.parse(req.url).host;
  options.path = '/';
  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge = 3600;
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options));
};

// const withCookie = handler => (request, response) => {};

const handler = (req: NextApiRequest, res: NextApiResponse, auth: any) => {
  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    console.error(auth.err);
    return send(res, 403, 'Forbidden');
  }

  // cookie name must be "token" to use next-cookies
  cookie(res, req, 'token', auth);

  redirect(res, 302, '/?linked=spotify');
};

export default withSpotifyOAuth(handler);
