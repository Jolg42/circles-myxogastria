import React, { useState } from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Button from '~/components/Button';
import person from '%/images/person.svg';
import styles from '~/styles/variables';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import { FAQ_URL } from '~/components/ExternalLinkList';
import { formatCirclesValue } from '~/utils/format';

const ISSUANCE_RATE_MONTH = process.env.ISSUANCE_RATE_MONTH || 50;

const BalanceDisplay = () => {
  const { token, safe } = useSelector((state) => state);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  if (token.balance === null) {
    if (!safe.pendingNonce) {
      return <CircularProgress />;
    } else {
      return null;
    }
  }

  const balance = web3.utils.fromWei(token.balance);

  const onClick = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  const onCloseClick = () => {
    setIsTooltipVisible(false);
  };

  return (
    <BalanceStyle title={balance} onClick={onClick}>
      <span>{formatCirclesValue(token.balance)}</span>

      <BalanceTooltipWrapperStyle isVisible={isTooltipVisible}>
        <BalanceTooltipStyle isVisible={isTooltipVisible}>
          <BalancePersonStyle />

          <BalanceTooltipContentStyle>
            <h3>{translate('BalanceDisplay.thisIsYourUBI')}</h3>
            <p>
              {translate('BalanceDisplay.issuanceRate', {
                rate: ISSUANCE_RATE_MONTH,
              })}
            </p>
          </BalanceTooltipContentStyle>

          <BalanceTooltipButtonsStyle>
            <Button onClick={onCloseClick}>
              {translate('BalanceDisplay.gotIt')}
            </Button>

            <a href={FAQ_URL} rel="noopener noreferrer" target="_blank">
              <Button isOutline>{translate('BalanceDisplay.learnMore')}</Button>
            </a>
          </BalanceTooltipButtonsStyle>
        </BalanceTooltipStyle>
      </BalanceTooltipWrapperStyle>
    </BalanceStyle>
  );
};

const BalanceStyle = styled.div`
  cursor: pointer;

  span {
    @media ${styles.media.desktop} {
      font-size: 4rem;
    }

    font-weight: ${styles.base.typography.weightLight};
    font-size: 3rem;
  }
`;

const BalanceTooltipWrapperStyle = styled.div`
  position: absolute;

  top: ${styles.components.header.height};
  right: 0;
  left: 0;

  z-index: ${styles.zIndex.balanceTooltip};

  display: ${(props) => {
    return props.isVisible ? 'block' : 'none';
  }};
`;

const BalanceTooltipStyle = styled.div`
  display: flex;

  max-width: 50rem;

  margin: 0 auto;
  padding: 2rem;

  border-radius: 1.6rem;

  color: ${styles.monochrome.black};

  background-color: ${styles.monochrome.white};

  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);

  flex-wrap: wrap;

  h3 {
    margin-top: 0.5rem;
    margin-bottom: 1rem;

    font-weight: ${styles.base.typography.weight};
    font-size: 1.6em;
  }

  &::before {
    position: absolute;

    top: -2rem;
    left: 50%;

    display: block;

    width: 0;
    height: 0;

    border-right: 1.5rem solid transparent;
    border-bottom: 2rem solid ${styles.monochrome.white};
    border-left: 1.5rem solid transparent;

    content: '';

    transform: translate3d(-50%, 0, 0);
  }
`;

const BalancePersonStyle = styled.div`
  float: left;

  width: 6rem;
  height: 10rem;

  margin-right: 1.5rem;

  background-image: url(${person});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  transform: scaleX(-1);
`;

const BalanceTooltipContentStyle = styled.div`
  text-align: left;

  flex: 1;

  h3,
  p {
    margin-right: 0;
    margin-left: 0;
  }
`;

const BalanceTooltipButtonsStyle = styled.div`
  width: 100%;
`;

export default BalanceDisplay;
