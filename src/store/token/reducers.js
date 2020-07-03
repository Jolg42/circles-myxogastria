import update from 'immutability-helper';

import ActionTypes from '~/store/token/types';

const initialState = {
  address: null,
  balance: null,
  isFunded: false,
  isLoading: false,
  lastPayout: 0,
};

const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TOKEN_FUNDED_UPDATE:
      return update(state, {
        isFunded: { $set: action.meta.isFunded },
      });
    case ActionTypes.TOKEN_UPDATE_SUCCESS:
      return update(state, {
        address: { $set: action.meta.address },
        lastPayout: { $set: action.meta.lastPayout },
      });
    case ActionTypes.TOKEN_BALANCE_UPDATE:
      return update(state, {
        isLoading: { $set: true },
      });
    case ActionTypes.TOKEN_BALANCE_UPDATE_SUCCESS:
      return update(state, {
        balance: { $set: action.meta.balance },
        isLoading: { $set: false },
      });
    case ActionTypes.TOKEN_BALANCE_UPDATE_ERROR:
      return update(state, {
        isLoading: { $set: false },
      });
    case ActionTypes.TOKEN_UBI_PAYOUT_SUCCESS:
      return update(state, {
        lastPayout: { $set: action.meta.lastPayout },
      });
    case ActionTypes.TOKEN_RESET:
      return update(state, { $set: initialState });
    default:
      return state;
  }
};

export default tokenReducer;
