import React from 'react';

const Page = ({children}) => {
  return (
    <div className={"page"}>
      <div className={'col-12'}>
        {children}
      </div>
    </div>
  )
};

export {Page};