import { NextApiRequest, NextApiResponse } from 'next';
import nodeVisitor from 'lib/nodeVisitor';
import { NodeType } from 'lib/node';

export interface NodesQuery {
  nodeId: string;
  nodeType: NodeType;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { nodeId, nodeType } = (req.query as unknown) as NodesQuery;

  const nodes = await nodeVisitor.getAdjacentNodes(nodeId, nodeType);

  res.status(200);
  res.json(nodes);
};

export default handler;
