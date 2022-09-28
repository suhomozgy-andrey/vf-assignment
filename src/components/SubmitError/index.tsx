import * as React from 'react';

import styles from './SubmitError.module.scss';

interface ISubmitErrorProps {
	submitError?: string;
}

export const SubmitError: React.FC<ISubmitErrorProps> = ({ submitError }) => (
	<span className={styles.submissionError}>{submitError}</span>
);
