import React, { FC, MouseEvent } from 'react';
import C from 'classnames';

interface IconProps {
  type: string;
  backgroundColor?: string;
  size?: number;
  scale?: number;
  opacity?: number;
  isOutlined?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
}

const Icon: FC<IconProps> = ({
  type,
  backgroundColor,
  size = 15,
  scale = 1,
  opacity = 1,
  isOutlined,
  className,
  onClick,
}) => (
  <span
    onClick={e => (onClick ? onClick(e) : () => {})}
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
