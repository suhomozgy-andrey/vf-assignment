import classnames from 'classnames';
import * as React from 'react';
import { CheckResultValueEnum, ICheckResultItem, ICheckResultSubmitItem } from '../../api';
import { Button } from '../Button';

import styles from './styles.module.scss';

interface ICheckableResultProps {
	item: ICheckResultItem;
	onAnswerSet: (result: ICheckResultSubmitItem) => void;
	disabled?: boolean;
}

export const CheckableResult: React.FC<ICheckableResultProps> = ({ item, onAnswerSet, disabled }) => {
	const [answer, setAnswer] = React.useState<CheckResultValueEnum>();
	const [focused, setFocused] = React.useState(false);
	const handleSetAnswer = (answer: CheckResultValueEnum) => () => {
		setAnswer(() => answer);
		onAnswerSet({
			checkId: item.id,
			value: answer
		});
	};

	const handleFocus = () => {
		setFocused(true);
	};
	const handleBlur = () => {
		setFocused(false);
	};
	return (
		<div
			className={classnames(styles.wrapper, {
				[styles.disabled]: disabled,
				[styles.answered]: !!answer,
				[styles.focused]: focused
			})}
			tabIndex={-1}
			onFocus={handleFocus}
			onBlur={handleBlur}
		>
			<div className={styles.title}>
				{item.priority} - {item.description}
			</div>
			<div>
				<Button
					className={classnames(styles.button)}
					disabled={disabled}
					variant={answer === CheckResultValueEnum.YES ? 'primary' : 'default'}
					onClick={handleSetAnswer(CheckResultValueEnum.YES)}
				>
					Yes
				</Button>
				<Button
					className={classnames(styles.button)}
					disabled={disabled}
					variant={answer === CheckResultValueEnum.NO ? 'primary' : 'default'}
					onClick={handleSetAnswer(CheckResultValueEnum.NO)}
				>
					No
				</Button>
			</div>
		</div>
	);
};
