import { createApiActionTypes } from '../actions/createApiActions';
import reduceReducers from 'reduce-reducers';
import { props, concat, uniqBy, differenceWith } from 'ramda';
import { LOAD_GRAPH, GET_ADJACENT_NODES } from '../actions/graph';
import fetchReducer from './fetchReducer';

const defaultState = {
  loading: false,
  originNode: null,
  graphData: {
    nodes: [],
    links: [],
  },
};

const getAdjacentNodeActions = createApiActionTypes(GET_ADJACENT_NODES);

const addNewNodes = (existingNodes, newNodes) =>
  uniqBy(props(['id', 'type']))(concat(existingNodes, newNodes));

// const getUniqueNewNodes = (existingNodes, newNodes) =>
//   differenceWith(
//     (x, y) => x.id === y.id && x.type === y.type,
//     newNodes,
//     existingNodes
//   );

const addNewLinks = (existingLinks, sourceNode, newNodes) => {
  const newLinks = newNodes.map(node => ({
    source: sourceNode.id,
    target: node.id,
    isHidden: true
  }));
  return uniqBy(props(['source', 'target']))(concat(existingLinks, newLinks));
};

const graphReducer = (state = defaultState, { type, payload, error }) => {
  switch (type) {
    case getAdjacentNodeActions.success.type:
      return {
        ...state,
        graphData: {
          nodes: addNewNodes(state.data.nodes, payload.adjacentNodes),
          links: addNewLinks(
            state.data.links,
            payload.sourceNode,
            payload.adjacentNodes
          ),
        },
      };
    default:
      return state;
  }
};

export default reduceReducers(
  graphReducer,
  fetchReducer(LOAD_GRAPH, defaultState)
);
