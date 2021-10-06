const BehaviourActions = {
  CONFIRM_OPERATION: 'CONFIRM_OPERATION',
  CLOSE_MODAL: 'CLOSE_MODAL',
};

const confirmOperation = (payload) => {
  return {
    type: BehaviourActions.CONFIRM_OPERATION,
    payload,
  };
};

const closeModal = () => {
  return {
    type: BehaviourActions.CLOSE_MODAL,
  };
};

export { BehaviourActions, confirmOperation, closeModal };
