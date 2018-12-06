import createApiActions from './createApiActions';
import { API_URL } from '../constants';

export const RESET_PATH = 'RESET_PATH';
export const CLEAR_PATH = 'CLEAR_PATH';
export const CHANGE_NODE_VALUE = 'CHANGE_NODE_VALUE';

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
        payload: () => ({ changedCrumb }),
      },
      success: {
        payload: (action, state, response) =>
          response.json().then(newCrumb => ({
            changedCrumb,
            selectedNode,
            newCrumb,
          })),
      },
    },
  });
