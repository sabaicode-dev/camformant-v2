import { useCallback, useEffect, useRef } from 'react';

interface UseMessageScrollProps {
    messages: any[];
    isLoading: boolean;
    onLoadMore: () => Promise<void>;
}

export const useMessageScroll = ({ messages, isLoading, onLoadMore }: UseMessageScrollProps) => {
    const scrollTimeout = useRef<NodeJS.Timeout>();
    const lastScrollHeight = useRef<number>(0);

    const preserveScroll = useCallback((scrollElement: HTMLDivElement) => {
        const newScrollHeight = scrollElement.scrollHeight;
        const scrollDiff = newScrollHeight - lastScrollHeight.current;
        scrollElement.scrollTop = scrollDiff;
        lastScrollHeight.current = newScrollHeight;
    }, []);

    const scrollToBottom = useCallback((scrollElement: HTMLDivElement) => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
    }, []);

    const handleScroll = useCallback(async (event: React.UIEvent<HTMLDivElement>) => {
        const scrollElement = event.currentTarget;

        if (isLoading || !scrollElement) return;

        const { scrollTop, scrollHeight } = scrollElement;


        if (scrollTop === 0) {
            // lastScrollHeight.current = scrollHeight;
            event.currentTarget.scrollTop = 20;
            // Clear any existing timeout
            // if (scrollTimeout.current) {
            //     clearTimeout(scrollTimeout.current);
            // }

            // Set a new timeout to prevent multiple calls
            // scrollTimeout.current = setTimeout(async () => {
            //     await onLoadMore();
            //     preserveScroll(scrollElement);
            // }, 200);
        }
    }, [isLoading, onLoadMore, preserveScroll]);

    // Initial scroll to bottom and message updates
    useEffect(() => {
        return () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

    return {
        handleScroll,
        scrollToBottom,
        preserveScroll
    };
};