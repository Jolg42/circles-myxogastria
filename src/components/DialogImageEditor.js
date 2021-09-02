import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
//import { useDispatch } from 'react-redux';
import Dialog from '~/components/Dialog';
//import { useUserdata } from '~/hooks/username';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
//import logError from '~/utils/debug';

const [values, setValues] = useState({
  avatarUrl: '',
  email: '',
  username: '',
});

const [isDisabled, setIsDisabled] = useState(false);


const onChange = (updatedValues) => {
  onValuesChange({
    ...values,
    ...updatedValues,
  });
};

const onDisabledChange = (updatedValue) => {
  setIsDisabled(updatedValue);
};

const updateAccount (username, email, avatarUrl) => {
  console.log("UPDATE ACCOUNT ", username, email, avatarUrl)
}

// const onSave = async () => {
//   dispatch(showSpinnerOverlay());

//   try {
//     await dispatch(
//       updateAccount(values.username, values.email, values.avatarUrl),
//     );

//     dispatch(
//       notify({
//         text: translate('Onboarding.successOnboardingComplete'), // change
//         type: NotificationsTypes.SUCCESS,
//       }),
//     );
//   } catch (error) {
//     logError(error);

//     const errorMessage = formatErrorMessage(error);

//     dispatch(
//       notify({
//         text: translate('Onboarding.errorSignup', { // change
//           errorMessage,
//         }),
//         type: NotificationsTypes.ERROR,
//       }),
//     );
//   }

//   dispatch(hideSpinnerOverlay());
// };

const DialogImageEditor = ({ values, onDisabledChange, onChange }) => {
  const handleUpload = (avatarUrl) => {
    onChange({
      avatarUrl,
    });
  };

  return (
    <Dialog>
      <Fragment>
        <Typography align="center" gutterBottom variant="h2">
          {translate('Onboarding.headingAvatar')}
        </Typography>
        <Typography>{translate('Onboarding.bodyAvatar')}</Typography>
        <Box mt={4}>
          <AvatarUploader
            value={values.avatarUrl}
            onLoadingChange={onDisabledChange}
            onUpload={handleUpload}
            />
        </Box>
      </Fragment>
    </Dialog>
  );
};

DialogImageEditor.PropTypes = {
  onChange: PropTypes.func.isRequired,
  onDisabledChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
}

export default DialogImageEditor;