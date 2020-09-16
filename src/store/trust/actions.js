import ActionTypes from '~/store/trust/types';
import core from '~/services/core';
import logError from '~/utils/debug.js';
import resolveUsernames from '~/services/username';
import { NEEDED_TRUST_CONNECTIONS } from '~/utils/constants';
import { addPendingActivity } from '~/store/activity/actions';

const { ActivityTypes } = core.activity;

export function checkTrustState() {
  return async (dispatch, getState) => {
    const { safe, trust } = getState();
    const safeAddress = safe.pendingAddress || safe.currentAccount;

    // Safe address does not exist or is not deployed yet
    if (!safeAddress) {
      return;
    }

    try {
      const network = await core.trust.getNetwork(safeAddress);

      // Check if we reached a trusted status (to be ready for final Safe
      // deployment)
      let isTrusted = trust.isTrusted;
      let trustConnections = trust.trustConnections;

      if (!trust.isTrusted) {
        const result = await core.trust.isTrusted(safeAddress, {
          limit: NEEDED_TRUST_CONNECTIONS,
        });
        isTrusted = result.isTrusted;
        trustConnections = result.trustConnections;
      }

      // Resolve usernames
      const results = await resolveUsernames(
        network.map((connection) => {
          return connection.safeAddress;
        }),
      );

      const resolvedNetwork = network
        .map((connection) => {
          return {
            ...connection,
            username: results[connection.safeAddress].username,
          };
        })
        .sort((itemA, itemB) => {
          return itemA.username
            .toLowerCase()
            .localeCompare(itemB.username.toLowerCase());
        });

      dispatch({
        type: ActionTypes.TRUST_UPDATE,
        meta: {
          isTrusted,
          network: resolvedNetwork,
          trustConnections,
        },
      });
    } catch (error) {
      logError(error);
    }
  };
}

export function trustUser(safeAddress) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.currentAccount) {
      return;
    }

    const user = safeAddress;
    const canSendTo = safe.currentAccount;
    const txHash = await core.trust.addConnection(user, canSendTo);

    dispatch(
      addPendingActivity({
        txHash,
        type: ActivityTypes.ADD_CONNECTION,
        data: {
          user,
          canSendTo,
        },
      }),
    );
  };
}

export function untrustUser(safeAddress) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.currentAccount) {
      return;
    }

    const user = safeAddress;
    const canSendTo = safe.currentAccount;
    const txHash = await core.trust.removeConnection(user, canSendTo);

    dispatch(
      addPendingActivity({
        txHash,
        type: ActivityTypes.REMOVE_CONNECTION,
        data: {
          user,
          canSendTo,
        },
      }),
    );
  };
}
