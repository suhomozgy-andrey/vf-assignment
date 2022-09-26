import classnames from 'classnames';
import * as React from 'react';

import styles from './styles.module.scss';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'default';
}

export const Button: React.FC<IButtonProps> = ({ className, variant, ...rest }) => (
	<button
		className={classnames(
			styles.button,
			{
				[styles.primary]: variant === 'primary'
			},
			className
		)}
		{...rest}
	>
		{rest.children}
	</button>
);
