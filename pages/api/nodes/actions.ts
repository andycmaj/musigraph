import { NextApiRequest, NextApiResponse } from 'next';
import withCookies from 'micro-cookie';
import getSpotifyClient from 'lib/spotifyClient';
import getActions from 'lib/nodeVisitor/nodeActions';
import { NodesQuery } from '.';

const handler = withCookies(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { nodeId, nodeType } = (req.query as unknown) as NodesQuery;

    const { accessToken, refreshToken } = JSON.parse(req.cookies.token).result;
    const spotifyClient = getSpotifyClient(accessToken, refreshToken);

    const nodes = await getActions(
      parseInt(nodeId, 10),
      nodeType,
      spotifyClient
    );

    res.status(200);
    res.json(nodes);
  }
);

export default handler;
