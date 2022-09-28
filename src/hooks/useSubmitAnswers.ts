import * as React from 'react';
import { ICheckResultItem, CheckResultValueEnum, ICheckResultSubmitItem, submitCheckResults } from '../api';

interface IUseSubmitAnswersProps {
	preparedQuestions: Array<ICheckResultItem>;
}

export const useSubmitAnswers = ({ preparedQuestions }: IUseSubmitAnswersProps) => {
	const [submitted, setSubmitted] = React.useState<boolean>(false);
	const [submitError, setSubmitError] = React.useState<string>();
	const [submitting, setSubmitting] = React.useState<boolean>(false);
	const [answers, setAnswers] = React.useState<Record<string, CheckResultValueEnum>>({});

	const isReadyForSubmit = React.useCallback(() => {
		const answerValues = Object.values(answers);
		return (
			answerValues.length === preparedQuestions?.length ||
			answerValues.some((answer) => answer === CheckResultValueEnum.NO)
		);
	}, [answers, preparedQuestions?.length]);

	const handleSetAnswer = (answer: ICheckResultSubmitItem) => {
		setAnswers((answers) => ({ ...answers, [answer.checkId]: answer.value }));
	};

	const isItemEnabled = React.useCallback(
		(id: string): boolean => {
			if (preparedQuestions[0].id === id) return true;

			const currentItemIndex = preparedQuestions.findIndex((item) => item.id === id);
			const previousAnswer = preparedQuestions[currentItemIndex - 1];
			return (
				Object.keys(answers).includes(previousAnswer.id) &&
				answers[previousAnswer.id] === CheckResultValueEnum.YES &&
				isItemEnabled(previousAnswer.id)
			);
		},
		[preparedQuestions, answers]
	);

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

	return {
		isReadyForSubmit,
		handleSetAnswer,
		handleSubmit,
		submitted,
		submitError,
		submitting,
		answers,
		isItemEnabled
	};
};
