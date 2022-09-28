import { CheckableResult } from './components/CheckableResult';
import { Button } from './components/Button';
import styles from './App.module.scss';
import { useRoveFocus } from './hooks/useRoveFocus';
import { useGetQuestions } from './hooks/useGetQuestions';
import { useSubmitAnswers } from './hooks/useSubmitAnswers';
import { SubmitError } from './components/SubmitError';
import { Loader } from './components/Loader';
import { FetchError } from './components/FetchError';

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
					<FetchError active={!!fetchError} errorText='Error happened, please refresh the page' />
					<Loader active={!fetchError && questionsLoading && preparedQuestions.length === 0} />
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
							<SubmitError submitError={submitError} />
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
