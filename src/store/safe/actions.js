import ActionTypes from '~/store/safe/types';
import core from '~/services/core';
import isDeployed from '~/utils/isDeployed';

import {
  generateNonce,
  getNonce,
  getSafeAddress,
  hasNonce,
  hasSafeAddress,
  removeNonce,
  removeSafeAddress,
  setNonce,
  setSafeAddress,
} from '~/services/safe';

export function initializeSafe() {
  return async dispatch => {
    dispatch({
      type: ActionTypes.SAFE_INITIALIZE,
    });

    const nonce = hasNonce() ? getNonce() : null;
    const address = hasSafeAddress() ? getSafeAddress() : null;

    if (nonce && !address) {
      dispatch({
        type: ActionTypes.SAFE_INITIALIZE_ERROR,
      });

      throw new Error('Invalid Safe state');
    }

    dispatch({
      type: ActionTypes.SAFE_INITIALIZE_SUCCESS,
      meta: {
        address,
        nonce,
      },
    });
  };
}

export function createSafeWithNonce() {
  return async dispatch => {
    try {
      if (hasNonce()) {
        dispatch({
          type: ActionTypes.SAFE_CREATE_ERROR,
        });

        throw new Error('Nonce is already given');
      }

      dispatch({
        type: ActionTypes.SAFE_CREATE,
      });

      // Generate a salt nonce
      const nonce = generateNonce();

      // Predict Safe address
      const address = await core.safe.prepareDeploy(nonce);

      // Store them when successful
      setSafeAddress(address);
      setNonce(nonce);

      dispatch({
        type: ActionTypes.SAFE_CREATE_SUCCESS,
        meta: {
          address,
          nonce,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_CREATE_ERROR,
      });

      throw error;
    }
  };
}

export function checkSafeState() {
  return async (dispatch, getState) => {
    const { safe, wallet } = getState();

    // Waiting to deploy a Safe ..
    if (safe.nonce) {
      return;
    }

    // Already knows Safe address ..
    if (safe.address) {
      return;
    }

    // Try to find a Safe owned by us
    const address = await core.safe.getAddress(wallet.address);

    if (address) {
      dispatch({
        type: ActionTypes.SAFE_FOUND,
        meta: {
          address,
        },
      });
    }
  };
}

export function deploySafe() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (safe.isLocked) {
      return;
    }

    dispatch({
      type: ActionTypes.SAFE_DEPLOY,
    });

    try {
      await core.safe.deploy(safe.address);

      // @TODO: Remove this
      await isDeployed(safe.address);

      removeNonce();

      dispatch({
        type: ActionTypes.SAFE_DEPLOY_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_DEPLOY_ERROR,
      });

      throw error;
    }
  };
}

export function getSafeOwners() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    // Safe is not deployed yet
    if (safe.nonce) {
      return;
    }

    dispatch({
      type: ActionTypes.SAFE_OWNERS,
    });

    try {
      const owners = await core.safe.getOwners(safe.address);

      dispatch({
        type: ActionTypes.SAFE_OWNERS_SUCCESS,
        meta: {
          owners,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_OWNERS_ERROR,
      });

      throw error;
    }
  };
}

export function addSafeOwner(address) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    dispatch({
      type: ActionTypes.SAFE_OWNERS_ADD,
    });

    try {
      await core.safe.addOwner(safe.address, address);

      dispatch({
        type: ActionTypes.SAFE_OWNERS_ADD_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_OWNERS_ADD_ERROR,
      });

      throw error;
    }
  };
}

export function removeSafeOwner(address) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    dispatch({
      type: ActionTypes.SAFE_OWNERS_REMOVE,
    });

    try {
      await core.safe.removeOwner(safe.address, address);

      dispatch({
        type: ActionTypes.SAFE_OWNERS_REMOVE_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_OWNERS_REMOVE_ERROR,
      });

      throw error;
    }
  };
}

export function resetSafe() {
  removeNonce();
  removeSafeAddress();

  return {
    type: ActionTypes.SAFE_RESET,
  };
}
