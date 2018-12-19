import { createApiActionTypes } from '../actions/createApiActions';
import { findIndex } from 'ramda';
import {
  RESET_PATH,
  CLEAR_PATH,
  CHANGE_NODE_VALUE,
  GET_CRUMB_ACTIONS,
} from '../actions/path';
import { SET_SEARCH_TYPE } from '../actions/search';

const defaultState = {
  crumbs: [],
};

const {
  request: { type: resetPathRequest },
  success: { type: resetPathSuccess },
} = createApiActionTypes(RESET_PATH);

const {
  request: { type: getCrumbActionsRequest },
  success: { type: getCrumbActionsSuccess },
} = createApiActionTypes(GET_CRUMB_ACTIONS);

const changeNodeActions = createApiActionTypes(CHANGE_NODE_VALUE);

const replaceTailCrumbs = (crumbs, changedCrumb, newCrumb) => {
  const index = findIndex(crumb => crumb.source.id === changedCrumb.source.id)(
    crumbs
  );
  return [
    ...crumbs.slice(0, index),
    {
      ...crumbs[index],
      loading: false,
    },
    newCrumb,
  ];
};

const toggleCrumbLoading = (crumbs, changedCrumb, loading) =>
  crumbs.map(
    crumb =>
      crumb.source.id === changedCrumb.source.id
        ? {
            ...crumb,
            loading,
          }
        : crumb
  );

const setCrumbActionsLoading = (crumbs, changedCrumb) =>
  crumbs.map(
    crumb =>
      crumb.source.id === changedCrumb.source.id
        ? {
            ...crumb,
            actionsLoading: true,
          }
        : crumb
  );

const setCrumbActionsLoaded = (crumbs, changedCrumb, actions) =>
  crumbs.map(
    crumb =>
      crumb.source.id === changedCrumb.source.id
        ? {
            ...crumb,
            actionsLoading: false,
            actions,
          }
        : crumb
  );

const crumbsReducer = (state = defaultState, { type, payload, error }) => {
  switch (type) {
    case CLEAR_PATH:
    case SET_SEARCH_TYPE:
      return {
        ...state,
        crumbs: [],
      };
    case resetPathRequest:
      return {
        ...state,
        initialCrumbLoading: true,
      };
    case resetPathSuccess:
      const { source, nodes } = payload;
      return {
        crumbs: [{ source, nodes }],
      };
    case changeNodeActions.request.type: {
      const { changedCrumb } = payload;
      return {
        ...state,
        crumbs: toggleCrumbLoading(state.crumbs, changedCrumb, true),
      };
    }
    case changeNodeActions.success.type: {
      const { changedCrumb, newCrumb } = payload;
      return {
        ...state,
        crumbs: replaceTailCrumbs(state.crumbs, changedCrumb, newCrumb),
      };
    }
    case getCrumbActionsRequest: {
      const { changedCrumb } = payload;
      return {
        ...state,
        crumbs: setCrumbActionsLoading(state.crumbs, changedCrumb),
      };
    }
    case getCrumbActionsSuccess: {
      const { changedCrumb, actions } = payload;
      return {
        ...state,
        crumbs: setCrumbActionsLoaded(state.crumbs, changedCrumb, actions),
      };
    }
    default:
      return state;
  }
};

export default crumbsReducer;
