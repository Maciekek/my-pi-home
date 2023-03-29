import React from 'react';
import _ from 'lodash';

const Switcher = ({ checked, onClick }) => {
  console.log(_.toNumber(checked));
  return (
    <div>
      <label className="rocker">
        <input type="checkbox" checked={_.toNumber(checked)} onClick={onClick} />
        <span className="switch-left">On</span>
        <span className="switch-right">Off</span>
      </label>
    </div>
  );
};

export { Switcher };
