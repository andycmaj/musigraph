import { clone } from 'ramda';
import createApiActions from './createApiActions';
import { API_URL } from '../constants';

export const RESET_PATH = 'RESET_PATH';
export const CLEAR_PATH = 'CLEAR_PATH';
export const CHANGE_SELECTED_NODE = 'CHANGE_SELECTED_NODE';
export const GET_CARD_ACTIONS = 'GET_CARD_ACTIONS';
export const UPDATE_ACTIVE_CARD = 'UPDATE_ACTIVE_CARD';

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

export const changeSelectedNode = (changedCard, selectedNode) =>
  createApiActions(CHANGE_SELECTED_NODE, {
    url: `${API_URL}/nodes?nodeId=${selectedNode.id}&nodeType=${
      selectedNode.type
    }`,
    actionTypeOverrides: {
      request: {
        payload: () => ({ changedCard: clone(changedCard) }),
      },
      success: {
        payload: (action, state, response) =>
          response.json().then(newCard => ({
            changedCard: clone(changedCard),
            selectedNode,
            newCard,
          })),
      },
    },
  });

export const getCardActions = (changedCard, selectedNode) =>
  createApiActions(GET_CARD_ACTIONS, {
    url: `${API_URL}/nodes/actions?nodeId=${selectedNode.id}&nodeType=${
      selectedNode.type
    }`,
    actionTypeOverrides: {
      request: {
        payload: () => ({
          changedCard: clone(changedCard),
        }),
      },
      success: {
        payload: (action, state, response) =>
          response.json().then(actions => ({
            changedCard: clone(changedCard),
            actions,
          })),
      },
    },
  });

export const updateActiveCard = activeCardIndex => ({
  type: UPDATE_ACTIVE_CARD,
  payload: {
    activeCardIndex,
  },
});
