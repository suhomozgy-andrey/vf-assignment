export interface ICheckResultItem {
	id: string;
	priority: number;
	description: string;
}

export interface ICheckResultSubmitItem {
	checkId: string;
	value: 'yes' | 'no';
}

export const fetchChecks = (): Promise<Array<ICheckResultItem>> => {
	return new Promise((resolve, reject) =>
		setTimeout(
			() =>
				Math.random() <= 0.8
					? resolve([
							{
								id: 'aaa',
								priority: 10,
								description: 'Face on the picture matches face on the document'
							},
							{
								id: 'bbb',
								priority: 5,
								description: 'Veriff supports presented document'
							},
							{
								id: 'ccc',
								priority: 7,
								description: 'Face is clearly visible'
							},
							{
								id: 'ddd',
								priority: 3,
								description: 'Document data is clearly visible'
							}
					  ])
					: reject({ success: false }),
			500
		)
	);
};

export const submitCheckResults = (results: ICheckResultSubmitItem): Promise<ICheckResultSubmitItem> => {
	return new Promise((resolve, reject) =>
		setTimeout(() => (Math.random() <= 0.8 ? resolve(results) : reject({ success: false })), 500)
	);
};
