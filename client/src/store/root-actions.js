const rootActionTypes = {
  TEST: 'TEST',
};

const testAction = () => ({
  type: rootActionTypes.TEST,
});

const rootActions = {
  testAction,
};

export { rootActionTypes, rootActions };
