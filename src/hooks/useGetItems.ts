import * as React from 'react';
import { ICheckResultItem, fetchChecks } from '../api';

export const useGetItems = () => {
	const [items, setItems] = React.useState<Array<ICheckResultItem>>([]);
	const [error, setError] = React.useState<unknown>(null);
	const [loading, setLoading] = React.useState<boolean>(false);

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

	return { items, error, loading, preparedItems };
};
