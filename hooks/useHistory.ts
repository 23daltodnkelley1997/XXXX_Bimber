
import { useState, useCallback } from 'react';

export const useHistory = <T,>(initialState: T): [T, (newState: T) => void, () => void, () => void, boolean, boolean] => {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const setState = (newState: T) => {
        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
    };

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }, [currentIndex]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    }, [currentIndex, history.length]);
    
    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    return [history[currentIndex], setState, undo, redo, canUndo, canRedo];
};
