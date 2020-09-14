import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';

import Button from '~/components/Button';
import Footer from '~/components/Footer';
import QRCodeScanner from '~/components/QRCodeScanner';
import UsernameFinder from '~/components/UsernameFinder';
import View from '~/components/View';
import translate from '~/services/locale';

const MODE_QR = Symbol('qr');
const MODE_USERNAME = Symbol('username');

const SafeFinder = (props) => {
  const [mode, setMode] = useState(MODE_QR);
  const [usernameInput, setUsernameInput] = useState('');

  const onFooterClick = () => {
    setMode(MODE_QR);
    setUsernameInput('');
  };

  const onUserInputChange = (value) => {
    if (mode !== MODE_USERNAME) {
      setMode(MODE_USERNAME);
    }

    setUsernameInput(value);
  };

  const onSelect = (safeAddress) => {
    setUsernameInput('');

    props.onSelect(safeAddress);
  };

  const onUserSelect = (user) => {
    props.onSelect(user.safeAddress);
  };

  const isHidden = mode !== MODE_QR;

  return (
    <Fragment>
      <View>
        <UsernameFinder
          input={usernameInput}
          onInputChange={onUserInputChange}
          onSelect={onUserSelect}
        />

        <SafeFinderQRScanner isHidden={isHidden} onSuccess={onSelect} />
      </View>

      <SafeFinderFooter isHidden={!isHidden} onClick={onFooterClick} />
    </Fragment>
  );
};

const SafeFinderQRScanner = (props) => {
  if (props.isHidden) {
    return null;
  }

  const onSuccess = (result) => {
    props.onSuccess(result);
  };

  return <QRCodeScanner onSuccess={onSuccess} />;
};

const SafeFinderFooter = (props) => {
  if (props.isHidden) {
    return null;
  }

  const onClick = () => {
    props.onClick();
  };

  return (
    <Footer>
      <Button onClick={onClick}>{translate('SafeFinder.tapToScanQR')}</Button>
    </Footer>
  );
};

SafeFinder.propTypes = {
  isOnlyText: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

SafeFinderQRScanner.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

SafeFinderFooter.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SafeFinder;
