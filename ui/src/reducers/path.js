import createApiActions, {
  createApiActionTypes,
} from '../actions/createApiActions';
import { whereEq, findIndex, omit } from 'ramda';
import {
  RESET_PATH,
  CLEAR_PATH,
  CHANGE_NODE_VALUE,
  GET_CRUMB_ACTIONS,
} from '../actions/path';

const defaultState = {
  crumbs: [],
};

const {
  request: { type: resetPathRequest },
  success: { type: resetPathSuccess },
} = createApiActionTypes(RESET_PATH);

const {
  request: { type: getCrumbActionsRequest },
} = createApiActionTypes(GET_CRUMB_ACTIONS);

const changeNodeActions = createApiActionTypes(CHANGE_NODE_VALUE);

const replaceTailCrumbs = (crumbs, changedCrumb, newCrumb) => {
  const index = findIndex(whereEq(omit(['loading'], changedCrumb)))(crumbs);
  console.log([changedCrumb, index]);
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
      crumb === changedCrumb
        ? {
            ...crumb,
            loading,
          }
        : crumb
  );

const toggleCrumbActionsLoading = (crumbs, changedCrumb, actionsLoading) =>
  crumbs.map(
    crumb =>
      crumb === changedCrumb
        ? {
            ...crumb,
            actionsLoading,
          }
        : crumb
  );

const crumbsReducer = (state = defaultState, { type, payload, error }) => {
  switch (type) {
    case CLEAR_PATH:
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
        crumbs: toggleCrumbActionsLoading(state.crumbs, changedCrumb, true),
      };
    }
    default:
      return state;
  }
};

export default crumbsReducer;
