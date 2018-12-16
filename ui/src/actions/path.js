import { clone } from 'ramda';
import createApiActions from './createApiActions';
import { API_URL } from '../constants';

export const RESET_PATH = 'RESET_PATH';
export const CLEAR_PATH = 'CLEAR_PATH';
export const CHANGE_NODE_VALUE = 'CHANGE_NODE_VALUE';
export const GET_CRUMB_ACTIONS = 'GET_CRUMB_ACTIONS';

export const clearPath = () => ({
  type: CLEAR_PATH,
});

export const resetPath = initialNode =>
  createApiActions(RESET_PATH, {
    url: `${API_URL}/nodes?nodeId=${initialNode.id}&nodeType=${
      initialNode.type
    }`,
    actionTypeOverrides: {
      request: {
        payload: () => ({ initialNode }),
      },
    },
  });

export const changeNodeValue = (changedCrumb, selectedNode) =>
  createApiActions(CHANGE_NODE_VALUE, {
    url: `${API_URL}/nodes?nodeId=${selectedNode.id}&nodeType=${
      selectedNode.type
    }`,
    actionTypeOverrides: {
      request: {
        payload: () => ({ changedCrumb: clone(changedCrumb) }),
      },
      success: {
        payload: (action, state, response) =>
          response.json().then(newCrumb => ({
            changedCrumb: clone(changedCrumb),
            selectedNode,
            newCrumb,
          })),
      },
    },
  });

export const getCrumbActions = (changedCrumb, selectedNode) =>
  createApiActions(GET_CRUMB_ACTIONS, {
    url: `${API_URL}/nodes/actions?nodeId=${selectedNode.id}&nodeType=${
      selectedNode.type
    }`,
    actionTypeOverrides: {
      request: {
        payload: () => ({
          changedCrumb: clone(changedCrumb),
        }),
      },
      success: {
        payload: (action, state, response) =>
          response.json().then(actions => ({
            changedCrumb: clone(changedCrumb),
            actions,
          })),
      },
    },
  });
