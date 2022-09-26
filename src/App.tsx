import * as React from 'react';

import { CheckResultValueEnum, fetchChecks, ICheckResultItem, ICheckResultSubmitItem } from './api';
import { CheckableResult } from './components/CheckableResult';
import { Button } from './components/Button';
import styles from './App.module.scss';
import { useRoveFocus } from './hooks/useRoveFocus';

const App = () => {
	const [submitted, setSubmitted] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<unknown>(null);
	const [items, setItems] = React.useState<Array<ICheckResultItem>>([]);

	React.useEffect(() => {
		setLoading(true);
		fetchChecks()
			.then((result) => {
				setItems(result);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setError(error);
			});
	}, []);

	const preparedItems = React.useMemo(() => items.sort((a, b) => a.priority - b.priority), [items]);

	const [answers, setAnswers] = React.useState<Record<string, CheckResultValueEnum>>({});

	const isItemEnabled = React.useCallback(
		(id: string) => {
			if (preparedItems[0].id === id) return true;

			const currentItemIndex = preparedItems.findIndex((item) => item.id === id);

			return (
				Object.keys(answers).includes(preparedItems[currentItemIndex - 1].id) &&
				answers[preparedItems[currentItemIndex - 1].id] === CheckResultValueEnum.YES
			);
		},
		[preparedItems, answers]
	);

	const isReadyForSubmit =
		Object.values(answers).length > 0 &&
		(Object.values(answers).some((answer) => answer === CheckResultValueEnum.NO) ||
			(Object.values(answers).every((answer) => answer === CheckResultValueEnum.YES) &&
				Object.values(answers).length === items?.length));

	const handleSetAnswer = (answer: ICheckResultSubmitItem) => {
		setAnswers((answers) => ({ ...answers, [answer.checkId]: answer.value }));
	};

	const handleSubmit = React.useCallback(() => {
		if (!isReadyForSubmit) return;
		console.log('answers', answers);

		setSubmitted(true);
	}, [answers, isReadyForSubmit]);

	const { currentFocus, setCurrentFocus } = useRoveFocus(
		preparedItems.map((item) => ({
			id: item.id,
			disabled: !isItemEnabled(item.id)
		}))
	);

	return (
		<div className={styles.app}>
			{!submitted && (
				<>
					{!!error && <div>Error happened, please refresh the page</div>}
					{!error && loading && !items && <span>Loading...</span>}
					{!error && !loading && items && (
						<div className={styles.listWrapper}>
							<div className={styles.list}>
								{preparedItems.map((resultItem) => (
									<CheckableResult
										onAnswerSet={handleSetAnswer}
										key={resultItem.id}
										item={resultItem}
										disabled={!isItemEnabled(resultItem.id)}
										setFocus={setCurrentFocus}
										focus={currentFocus === resultItem.id}
									/>
								))}
							</div>
							<Button
								variant='primary'
								disabled={!isReadyForSubmit}
								className={styles.submitButton}
								onClick={handleSubmit}
							>
								Submit
							</Button>
						</div>
					)}
					<br />
					{Object.values(answers).length > 0 && <code>{JSON.stringify(answers, null, 2)}</code>}
				</>
			)}
			{submitted && <div>Submitted successfully!</div>}
		</div>
	);
};

export default App;
