import classnames from 'classnames';
import * as React from 'react';
import { CheckResultValueEnum, ICheckResultItem, ICheckResultSubmitItem } from '../../api';
import { Button } from '../Button';

import styles from './styles.module.scss';

interface ICheckableResultProps {
	item: ICheckResultItem;
	onAnswerSet: (result: ICheckResultSubmitItem) => void;
	answer?: CheckResultValueEnum;
	disabled?: boolean;
	focus: boolean;
	setFocus: React.Dispatch<React.SetStateAction<string> | string>;
}

export const CheckableResult: React.FC<ICheckableResultProps> = ({
	item,
	onAnswerSet,
	disabled,
	focus,
	setFocus,
	answer
}) => {
	const [focused, setFocused] = React.useState(false);
	const handleSetAnswer = React.useCallback(
		(answer: CheckResultValueEnum) => () => {
			onAnswerSet({
				checkId: item.id,
				value: answer
			});
		},
		[item.id, onAnswerSet]
	);

	const handleFocus = () => {
		if (disabled) return;
		setFocused(true);
	};
	const handleBlur = () => {
		setFocused(false);
	};
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (focus && ref?.current) {
			ref?.current?.focus();
		}
	}, [focus]);

	const handleSelect = React.useCallback(() => {
		if (disabled) return;
		setFocus(item.id);
	}, [disabled, setFocus, item.id]);

	const handleKeyDown = React.useCallback(
		(e: KeyboardEvent) => {
			const key = e.key || e.keyCode;

			if (key === 49 || key === '1') {
				handleSetAnswer(CheckResultValueEnum.YES)();
				e.preventDefault();
			} else if (key === 50 || key === '2') {
				handleSetAnswer(CheckResultValueEnum.NO)();
				e.preventDefault();
			}
		},
		[handleSetAnswer]
	);

	React.useEffect(() => {
		const currentRef = ref?.current;
		currentRef?.addEventListener('keydown', handleKeyDown, false);
		return () => {
			currentRef?.removeEventListener('keydown', handleKeyDown, false);
		};
	}, [handleKeyDown]);

	return (
		<div
			className={classnames(styles.wrapper, {
				[styles.disabled]: disabled,
				[styles.answered]: !!answer,
				[styles.focused]: focused && !disabled
			})}
			tabIndex={focus && !disabled ? 0 : -1}
			onFocus={handleFocus}
			onBlur={handleBlur}
			ref={ref}
			onKeyPress={handleSelect}
		>
			<div className={styles.title}>{item.description}</div>
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
