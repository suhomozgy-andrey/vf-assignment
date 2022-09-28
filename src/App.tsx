import { CheckableResult } from './components/CheckableResult';
import { Button } from './components/Button';
import styles from './App.module.scss';
import { useRoveFocus } from './hooks/useRoveFocus';
import { useGetQuestions } from './hooks/useGetQuestions';
import { useSubmitAnswers } from './hooks/useSubmitAnswers';

const App = () => {
	const { loading: questionsLoading, error: fetchError, preparedQuestions } = useGetQuestions();
	const {
		answers,
		isReadyForSubmit,
		handleSetAnswer,
		handleSubmit,
		submitted,
		submitError,
		submitting,
		isItemEnabled
	} = useSubmitAnswers({
		preparedQuestions
	});

	const { currentFocus, setCurrentFocus } = useRoveFocus(
		preparedQuestions.map((question) => ({
			id: question.id,
			disabled: !isItemEnabled(question.id)
		}))
	);

	return (
		<div className={styles.app}>
			{!submitted && (
				<>
					{!!fetchError && <div>Error happened, please refresh the page</div>}
					{!fetchError && questionsLoading && preparedQuestions.length === 0 && <span>Loading...</span>}
					{!fetchError && !questionsLoading && preparedQuestions.length > 0 && (
						<div className={styles.listWrapper}>
							<div className={styles.list}>
								{preparedQuestions.map((question) => (
									<CheckableResult
										onAnswerSet={handleSetAnswer}
										key={question.id}
										item={question}
										disabled={!isItemEnabled(question.id)}
										setFocus={setCurrentFocus}
										focus={currentFocus === question.id}
										answer={answers[question.id]}
									/>
								))}
							</div>
							{submitError && <span className={styles.submissionError}>{submitError}</span>}
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
