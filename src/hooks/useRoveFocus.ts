import * as React from 'react';

const getPreviousElementFromArray = (currentId: string, array: Array<{ id: string; disabled: boolean }>): string => {
	if (!currentId) return array.find((el) => !el.disabled)?.id ?? '';

	const currentFocusedItemIndex = array.findIndex((el) => el.id === currentId);

	const nextFocusedItemIndex = currentFocusedItemIndex === 0 ? array.length - 1 : currentFocusedItemIndex - 1;
	const nextFocusedItem = array[nextFocusedItemIndex];
	if (nextFocusedItem.disabled) {
		return getPreviousElementFromArray(nextFocusedItem.id, array);
	}
	return nextFocusedItem.id;
};
const getNextElementFromArray = (currentId: string, array: Array<{ id: string; disabled: boolean }>): string => {
	if (!currentId) return array.find((el) => !el.disabled)?.id ?? '';

	const currentFocusedItemIndex = array.findIndex((el) => el.id === currentId);

	const nextFocusedItemIndex = currentFocusedItemIndex === array.length - 1 ? 0 : currentFocusedItemIndex + 1;
	const nextFocusedItem = array[nextFocusedItemIndex];
	if (nextFocusedItem.disabled) {
		return getNextElementFromArray(nextFocusedItem.id, array);
	}
	return nextFocusedItem.id;
};

export const useRoveFocus = (items: Array<{ id: string; disabled: boolean }>) => {
	const [currentFocus, setCurrentFocus] = React.useState<string>('');
	const handleKeyDown = React.useCallback(
		(e: KeyboardEvent) => {
			const key = e.key || e.keyCode;

			if (key === 40 || key === 'ArrowDown') {
				e.preventDefault();
				setCurrentFocus(getNextElementFromArray(currentFocus, items));
			} else if (key === 38 || key === 'ArrowUp') {
				e.preventDefault();
				setCurrentFocus(getPreviousElementFromArray(currentFocus, items));
			}
		},
		[currentFocus, items]
	);

	React.useEffect(() => {
		document.addEventListener('keydown', handleKeyDown, false);
		return () => {
			document.removeEventListener('keydown', handleKeyDown, false);
		};
	}, [handleKeyDown]);

	return { currentFocus, setCurrentFocus };
};
