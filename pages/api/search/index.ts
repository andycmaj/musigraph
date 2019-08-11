import { NextApiRequest, NextApiResponse } from 'next';
import searcher from 'lib/search';
import { NodeType } from 'lib/node';

interface SearchQuery {
  query: string;
  type: NodeType;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, type } = (req.query as unknown) as SearchQuery;

  const nodes = await searcher.search(query, type);

  res.status(200);
  res.json(nodes);
};

export default handler;
