import CirclesCore from '@circles/core';

import web3 from '~/services/web3';
import { getAccount } from '~/services/wallet';

const core = new CirclesCore(web3, {
  apiServiceEndpoint: process.env.API_SERVICE_EXTERNAL,
  graphNodeEndpoint: process.env.GRAPH_NODE_EXTERNAL,
  hubAddress: process.env.HUB_ADDRESS,
  proxyFactoryAddress: process.env.PROXY_FACTORY_ADDRESS,
  relayServiceEndpoint: process.env.RELAY_SERVICE_EXTERNAL,
  safeMasterAddress: process.env.SAFE_ADDRESS,
  subgraphName: process.env.SUBGRAPH_NAME,
});

async function requestCore(moduleName, method, options) {
  return await core[moduleName][method](getAccount(), options);
}

// Safe module

const safe = {
  getSafeStatus: async (safeAddress) => {
    return await requestCore('safe', 'getSafeStatus', {
      safeAddress,
    });
  },

  predictAddress: async (nonce) => {
    return await requestCore('safe', 'predictAddress', {
      nonce,
    });
  },

  prepareDeploy: async (nonce) => {
    return await requestCore('safe', 'prepareDeploy', {
      nonce,
    });
  },

  isFunded: async (safeAddress) => {
    return await requestCore('safe', 'isFunded', {
      safeAddress,
    });
  },

  deploy: async (safeAddress) => {
    return await requestCore('safe', 'deploy', {
      safeAddress,
    });
  },

  getOwners: async (safeAddress) => {
    return await requestCore('safe', 'getOwners', {
      safeAddress,
    });
  },

  removeOwner: async (safeAddress, ownerAddress) => {
    return await requestCore('safe', 'removeOwner', {
      safeAddress,
      ownerAddress,
    });
  },

  addOwner: async (safeAddress, ownerAddress) => {
    return await requestCore('safe', 'addOwner', {
      safeAddress,
      ownerAddress,
    });
  },

  getAddresses: async (ownerAddress) => {
    return await requestCore('safe', 'getAddresses', {
      ownerAddress,
    });
  },
};

// User module

const user = {
  register: async (nonce, safeAddress, username, email, avatarUrl) => {
    return await requestCore('user', 'register', {
      nonce,
      email,
      safeAddress,
      username,
      avatarUrl,
    });
  },

  resolve: async (addresses) => {
    return await requestCore('user', 'resolve', {
      addresses,
    });
  },

  search: async (query) => {
    return await requestCore('user', 'search', {
      query,
    });
  },
};

// Trust module

const trust = {
  isTrusted: async (safeAddress) => {
    return await requestCore('trust', 'isTrusted', {
      safeAddress,
    });
  },

  getNetwork: async (safeAddress) => {
    return await requestCore('trust', 'getNetwork', {
      safeAddress,
    });
  },

  addConnection: async (user, canSendTo) => {
    return await requestCore('trust', 'addConnection', {
      user,
      canSendTo,
    });
  },

  removeConnection: async (user, canSendTo) => {
    return await requestCore('trust', 'removeConnection', {
      user,
      canSendTo,
    });
  },
};

// Token module

const token = {
  isFunded: async (safeAddress) => {
    return await requestCore('token', 'isFunded', {
      safeAddress,
    });
  },

  deploy: async (safeAddress) => {
    return await requestCore('token', 'deploy', {
      safeAddress,
    });
  },

  getBalance: async (safeAddress) => {
    return await requestCore('token', 'getBalance', {
      safeAddress,
    });
  },

  getAddress: async (safeAddress) => {
    return await requestCore('token', 'getAddress', {
      safeAddress,
    });
  },

  getPaymentNote: async (transactionHash) => {
    return await requestCore('token', 'getPaymentNote', {
      transactionHash,
    });
  },

  findTransitiveTransfer: async (from, to, value) => {
    return await requestCore('token', 'findTransitiveTransfer', {
      from,
      to,
      value,
    });
  },

  transfer: async (from, to, value, paymentNote) => {
    return await requestCore('token', 'transfer', {
      from,
      to,
      value,
      paymentNote,
    });
  },

  checkUBIPayout: async (safeAddress) => {
    return await requestCore('token', 'checkUBIPayout', {
      safeAddress,
    });
  },

  requestUBIPayout: async (safeAddress) => {
    return await requestCore('token', 'requestUBIPayout', {
      safeAddress,
    });
  },
};

// Activity module

const activity = {
  ActivityTypes: core.activity.ActivityTypes,
  ActivityFilterTypes: core.activity.ActivityFilterTypes,

  getLatest: async (safeAddress, filter, limit, timestamp = 0, offset = 0) => {
    return await requestCore('activity', 'getLatest', {
      filter,
      limit,
      offset,
      safeAddress,
      timestamp,
    });
  },
};

// Utils module

const { fromFreckles, toFreckles, requestAPI, matchAddress } = core.utils;

const utils = {
  fromFreckles,
  matchAddress,
  requestAPI,
  toFreckles,
};

// Errors

const { CoreError, TransferError, RequestError } = core;

const errors = {
  CoreError,
  TransferError,
  RequestError,
};

export default {
  activity,
  errors,
  safe,
  token,
  trust,
  user,
  utils,
};
