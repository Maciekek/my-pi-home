import React from 'react';
import C from 'classnames';

const Icon = ({ type, backgroundColor, size = 15, scale = 1, opacity = 1, isOutlined, className, onClick }) => (
  <span
    onClick={onClick || (() => undefined)}
    className={C(
      'icon',
      'material-icons',
      { 'material-icons--outlined': isOutlined },
      { 'icon--clickable': onClick },
      className,
    )}
    style={{ backgroundColor, opacity, fontSize: size, transform: `scale(${scale})` }}
  >
    {type}
  </span>
);

export { Icon };
