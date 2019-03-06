import { createApiActionTypes } from '../actions/createApiActions';
import { findIndex } from 'ramda';
import {
  RESET_PATH,
  CLEAR_PATH,
  CHANGE_SELECTED_NODE,
  GET_CARD_ACTIONS,
  UPDATE_ACTIVE_CARD,
} from '../actions/path';
import { SET_SEARCH_TYPE } from '../actions/search';

const defaultState = {
  cards: [],
  initialCardLoading: false,
  activeCardIndex: 0,
};

const {
  request: { type: resetPathRequest },
  success: { type: resetPathSuccess },
} = createApiActionTypes(RESET_PATH);

const {
  request: { type: getCardActionsRequest },
  success: { type: getCardActionsSuccess },
} = createApiActionTypes(GET_CARD_ACTIONS);

const changeSelectedNode = createApiActionTypes(CHANGE_SELECTED_NODE);

const replaceTailCards = (cards, changedCard, newCard) => {
  const index = findIndex(card => card.source.id === changedCard.source.id)(
    cards
  );
  return [
    ...cards.slice(0, index),
    {
      ...cards[index],
      loading: false,
    },
    newCard,
  ];
};

const toggleCardLoading = (cards, changedCard, loading) =>
  cards.map(card =>
    card.source.id === changedCard.source.id
      ? {
          ...card,
          loading,
        }
      : card
  );

const setCardActionsLoading = (cards, changedCard) =>
  cards.map(card =>
    card.source.id === changedCard.source.id
      ? {
          ...card,
          actionsLoading: true,
        }
      : card
  );

const setCardActionsLoaded = (cards, changedCard, actions) =>
  cards.map(card =>
    card.source.id === changedCard.source.id
      ? {
          ...card,
          actionsLoading: false,
          actions,
        }
      : card
  );

export const getActiveCard = ({ cards, activeCardIndex }) => {
  return cards.length ? cards[activeCardIndex] : {};
}

const cardsReducer = (state = defaultState, { type, payload, error }) => {
  switch (type) {
    case CLEAR_PATH:
    case SET_SEARCH_TYPE:
      return {
        ...state,
        cards: [],
      };
    case resetPathRequest:
      return {
        ...state,
        initialCardLoading: true,
      };
    case UPDATE_ACTIVE_CARD:
      return {
        ...state,
        activeCardIndex: payload.activeCardIndex,
      };
    case resetPathSuccess:
      const { source, nodes } = payload;
      return {
        cards: [{ source, nodes }],
        activeCardIndex: 0,
      };
    case changeSelectedNode.request.type: {
      const { changedCard } = payload;
      return {
        ...state,
        cards: toggleCardLoading(state.cards, changedCard, true),
      };
    }
    case changeSelectedNode.success.type: {
      const { changedCard, newCard } = payload;
      const cards = replaceTailCards(state.cards, changedCard, newCard);
      return {
        ...state,
        cards,
        activeCardIndex: cards.length - 1,
      };
    }
    case getCardActionsRequest: {
      const { changedCard } = payload;
      return {
        ...state,
        cards: setCardActionsLoading(state.cards, changedCard),
      };
    }
    case getCardActionsSuccess: {
      const { changedCard, actions } = payload;
      return {
        ...state,
        cards: setCardActionsLoaded(state.cards, changedCard, actions),
      };
    }
    default:
      return state;
  }
};

export default cardsReducer;
