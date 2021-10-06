import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingIndicator = () => {
  return (
    <div className={'page centered m-5'}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
};

export { LoadingIndicator };
