import * as React from 'react';
import { ICheckResultItem, ICheckResultSubmitItem } from '../../api';

import styles from './styles.module.scss';

interface ICheckableResultProps {
	item: ICheckResultItem;
	onAnswerSet: (result: ICheckResultSubmitItem) => void;
}

export const CheckableResult: React.FC<ICheckableResultProps> = ({ item, onAnswerSet }) => {
	const [answer, setAnswer] = React.useState<'yes' | 'no'>();
	const handleSetAnswer = (answer: 'yes' | 'no') => () => {
		setAnswer(() => answer);
		onAnswerSet({
			checkId: item.id,
			value: answer
		});
	};
	return (
		<div className={styles.wrapper}>
			<div>{item.description}</div>
			<div>
				<button onClick={handleSetAnswer('yes')}>yes</button>
				<button onClick={handleSetAnswer('no')}>no</button>
			</div>
		</div>
	);
};
