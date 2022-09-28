import * as React from 'react';

interface ILoaderProps {
	active?: boolean;
}

export const Loader: React.FC<ILoaderProps> = ({ active }) => (active ? <span>Loading...</span> : null);
