import { Node, NodeType } from 'lib/node';
import appConfig, { DataSource } from 'lib/appConfig';
import discogsVisitor from './discogsNodeVisitor';

export interface AdjacentNodesResult {
  source: Node;
  nodes: Node[];
}

export interface NodeVisitor {
  getAdjacentNodes: (
    nodeId: string,
    nodeType: NodeType
  ) => Promise<AdjacentNodesResult>;
}

const visitor: NodeVisitor = {
  getAdjacentNodes: async (nodeId, nodeType) => {
    let visitor: NodeVisitor = null;
    if (appConfig.dataSource === DataSource.Discogs) {
      visitor = discogsVisitor;
    } else {
      throw new Error(`data source not supported: '${appConfig.dataSource}'`);
    }

    return visitor.getAdjacentNodes(nodeId, nodeType);
  },
};

export default visitor;
