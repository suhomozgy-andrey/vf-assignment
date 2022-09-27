import { CheckableResult } from './components/CheckableResult';
import { Button } from './components/Button';
import styles from './App.module.scss';
import { useRoveFocus } from './hooks/useRoveFocus';
import { useGetItems } from './hooks/useGetItems';
import { useSubmitAnswers } from './hooks/useSubmitAnswers';

const App = () => {
	const { loading: itemsLoading, error: fetchError, items, preparedItems } = useGetItems();
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
		items,
		preparedItems
	});

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
					{!!fetchError && <div>Error happened, please refresh the page</div>}
					{!fetchError && itemsLoading && !items && <span>Loading...</span>}
					{!fetchError && !itemsLoading && items && (
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
