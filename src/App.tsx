import * as React from 'react';

import { CheckResultValueEnum, fetchChecks, ICheckResultItem, ICheckResultSubmitItem, submitCheckResults } from './api';
import { CheckableResult } from './components/CheckableResult';
import { Button } from './components/Button';
import styles from './App.module.scss';
import { useRoveFocus } from './hooks/useRoveFocus';

const App = () => {
	const [submitted, setSubmitted] = React.useState<boolean>(false);
	const [submitError, setSubmitError] = React.useState<string>();
	const [submitting, setSubmitting] = React.useState<boolean>(false);
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
		(id: string): boolean => {
			if (preparedItems[0].id === id) return true;

			const currentItemIndex = preparedItems.findIndex((item) => item.id === id);
			const previousAnswer = preparedItems[currentItemIndex - 1];
			return (
				Object.keys(answers).includes(previousAnswer.id) &&
				answers[previousAnswer.id] === CheckResultValueEnum.YES &&
				isItemEnabled(previousAnswer.id)
			);
		},
		[preparedItems, answers]
	);

	const isReadyForSubmit = React.useCallback(() => {
		const answerValues = Object.values(answers);
		return answerValues.length === items?.length || answerValues.some((answer) => answer === CheckResultValueEnum.NO);
	}, [answers, items?.length]);

	const handleSetAnswer = (answer: ICheckResultSubmitItem) => {
		setAnswers((answers) => ({ ...answers, [answer.checkId]: answer.value }));
	};

	const handleSubmit = React.useCallback(() => {
		if (!isReadyForSubmit()) return;
		setSubmitting(true);
		setSubmitError(undefined);
		submitCheckResults(
			Object.keys(answers).map((key) => ({
				checkId: key,
				value: answers[key]
			}))
		)
			.then((data) => {
				console.log('Submitted answers: ', data);

				setSubmitting(false);
				setSubmitted(true);
			})
			.catch((error) => {
				setSubmitting(false);
				setSubmitError('Submission failed, please try again...');
				console.error(error);
			});
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
										answer={answers[resultItem.id]}
									/>
								))}
							</div>
							{submitError && <>{submitError}</>}
							<Button
								variant='primary'
								disabled={!isReadyForSubmit() || submitting}
								className={styles.submitButton}
								onClick={handleSubmit}
							>
								{submitting ? 'Please wait...' : 'Submit'}
							</Button>
						</div>
					)}
				</>
			)}
			{submitted && <div>Submitted successfully!</div>}
		</div>
	);
};

export default App;
