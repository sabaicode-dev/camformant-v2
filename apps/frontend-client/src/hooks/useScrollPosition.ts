import { useCallback, useRef } from 'react';

interface ScrollPosition {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}

export const useScrollPosition = (threshold: number = 50) => {
    const lastScrollPosition = useRef<ScrollPosition>({
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
    });

    const isNearTop = useCallback((element: HTMLDivElement): boolean => {
        const { scrollTop } = element;
        return scrollTop <= threshold;
    }, [threshold]);

    const shouldFetchMore = useCallback((element: HTMLDivElement): boolean => {
        const currentPosition = {
            scrollTop: element.scrollTop,
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
        };

        // Only fetch if we're near the top and haven't fetched at this position before
        const shouldFetch = isNearTop(element) &&
            (currentPosition.scrollTop !== lastScrollPosition.current.scrollTop ||
                currentPosition.scrollHeight !== lastScrollPosition.current.scrollHeight);

        if (shouldFetch) {
            lastScrollPosition.current = currentPosition;
        }

        return shouldFetch;
    }, [isNearTop]);

    return { shouldFetchMore };
};