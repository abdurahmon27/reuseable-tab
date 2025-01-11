import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Divider } from '@telegram-apps/telegram-ui';

interface Tab {
    id: string;
    label: ReactNode;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultActiveTab?: string;
    onChange?: (tabId: string) => void;
}

export const CustomTab: React.FC<TabsProps> = ({
    tabs,
    defaultActiveTab,
    onChange,
}) => {
    const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
    const [dividerStyle, setDividerStyle] = useState({
        width: 0,
        left: 0,
        transition: 'all 0.3s ease',
    });

    const updateDividerPosition = () => {
        const activeTabElement = tabRefs.current[activeTab];
        if (activeTabElement) {
            const { offsetLeft, offsetWidth } = activeTabElement;
            setDividerStyle(prev => ({
                ...prev,
                width: offsetWidth,
                left: offsetLeft,
            }));
        }
    };

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setShowLeftScroll(container.scrollLeft > 0);
            setShowRightScroll(
                container.scrollLeft < container.scrollWidth - container.clientWidth
            );
        }
    };

    useEffect(() => {
        checkScroll();
        updateDividerPosition();
        const handleResize = () => {
            checkScroll();
            updateDividerPosition();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeTab]);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth / 2;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    return (
        <div className="flex w-full flex-col">
            <div
                className="relative flex w-full items-center rounded-t-md"
                style={{
                    backgroundColor: 'var(--tg-theme-bg-color)',
                }}
            >
                {showLeftScroll && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 z-10 flex h-full items-center justify-center px-2"
                        style={{
                            backgroundColor: 'var(--tg-theme-bg-color)',
                            color: 'var(--tg-theme-text-color)',
                        }}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                )}

                <div
                    ref={scrollContainerRef}
                    className="hide-scrollbar flex w-full overflow-x-auto scroll-smooth rounded-md relative"
                    onScroll={checkScroll}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            ref={(el) => (tabRefs.current[tab.id] = el)}
                            onClick={() => handleTabClick(tab.id)}
                            className="flex flex-shrink-0 items-center gap-2 px-2 py-3 text-sm font-medium transition-all duration-200 ease-in-out"
                            style={{
                                color: activeTab === tab.id
                                    ? 'var(--tg-theme-accent-text-color)'
                                    : 'var(--tg-theme-subtitle-text-color)',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <div
                        className="absolute bottom-0 h-0.5 rounded-full"
                        style={{
                            ...dividerStyle,
                            backgroundColor: 'var(--tg-theme-accent-text-color)',
                        }}
                    />
                </div>

                {showRightScroll && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 z-10 flex h-full items-center justify-center  px-2"
                        style={{
                            backgroundColor: 'var(--tg-theme-bg-color)',
                            color: 'var(--tg-theme-text-color)',
                        }}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div
                className="p-4 rounded-b-md"
                style={{
                    backgroundColor: 'var(--tg-theme-bg-color)',
                    color: 'var(--tg-theme-text-color)',
                }}
            >
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`transition-opacity duration-200 ${activeTab === tab.id ? 'block opacity-100' : 'hidden opacity-0'
                            }`}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomTab;
