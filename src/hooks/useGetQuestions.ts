import * as React from 'react';
import { ICheckResultItem, fetchChecks } from '../api';

export const useGetQuestions = () => {
	const [questions, setQuestions] = React.useState<Array<ICheckResultItem>>([]);
	const [error, setError] = React.useState<unknown>(null);
	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		setLoading(true);
		fetchChecks()
			.then((result) => {
				setQuestions(result);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setError(error);
			});
	}, []);

	const preparedQuestions = React.useMemo(() => questions.sort((a, b) => a.priority - b.priority), [questions]);

	return { error, loading, preparedQuestions };
};
