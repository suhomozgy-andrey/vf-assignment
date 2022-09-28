import * as React from 'react';

interface IFetchErrorProps {
	active?: boolean;
	errorText: string;
}

export const FetchError: React.FC<IFetchErrorProps> = ({ active, errorText }) =>
	active ? <div>{errorText}</div> : null;
