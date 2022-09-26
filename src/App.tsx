import * as React from 'react';
import './App.scss';

import { fetchChecks, ICheckResultItem, ICheckResultSubmitItem } from './api';
import { CheckableResult } from './components/CheckableResult';

const App = () => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<unknown>(null);
	const [items, setItems] = React.useState<Array<ICheckResultItem>>();

	const [answers, setAnswers] = React.useState<Record<string, 'yes' | 'no'>>({});

	const isReadyForSubmit =
		Object.values(answers).length > 0 &&
		(Object.values(answers).some((answer) => answer === 'no') ||
			(Object.values(answers).every((answer) => answer === 'yes') && Object.values(answers).length === items?.length));

	React.useEffect(() => {
		console.log('useEffect');

		setLoading(true);
		fetchChecks()
			.then((result) => {
				console.log('Result', result);
				setItems(result);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Log error', error);
				setLoading(false);
				setError(error);
			});
	}, []);

	const handleSetAnswer = (answer: ICheckResultSubmitItem) => {
		setAnswers((answers) => ({ ...answers, [answer.checkId]: answer.value }));
	};

	return (
		<div className='App'>
			{!!error && <div>Error happened, please refresh the page</div>}
			{loading && !items && <span>Loading...</span>}
			{!loading &&
				items &&
				items.map((resultItem) => (
					<CheckableResult onAnswerSet={handleSetAnswer} key={resultItem.id} item={resultItem} />
				))}
			<button disabled={!isReadyForSubmit}>Submit</button>
			{Object.values(answers).length > 0 && <>{JSON.stringify(answers, null, 2)}</>}
		</div>
	);
};

export default App;
