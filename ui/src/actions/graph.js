import createApiActions from './createApiActions';
import { API_URL } from '../constants';

export const GET_ADJACENT_NODES = 'GET_ADJACENT_NODES';
export const LOAD_GRAPH = 'LOAD_GRAPH';

const normalizeNodes = originNode => nodes => ({
  originNode,
  data: {
    nodes: [originNode, ...nodes.slice(0, 5)],
    links: nodes.slice(0, 5).map(node => ({
      source: originNode.id,
      target: node.id,
    })),
  },
});

export const getAdjacentNodes = node =>
  createApiActions(GET_ADJACENT_NODES, {
    url: `${API_URL}/nodes?nodeId=${node.id}&nodeType=${node.type}`,
    actionTypeOverrides: {
      success: {
        payload: (action, state, response) =>
          response.json().then(data => ({
            sourceNode: node,
            adjacentNodes: data,
          })),
      },
    },
  });

export const loadGraph = originNode =>
  createApiActions(LOAD_GRAPH, {
    url: `${API_URL}/nodes?nodeId=${originNode.id}&nodeType=${originNode.type}`,
    actionTypeOverrides: {
      request: {
        payload: (action, state) => ({
          originNode,
        }),
      },
      success: {
        payload: (action, state, response) =>
          response.json().then(normalizeNodes(originNode)),
      },
    },
  });
