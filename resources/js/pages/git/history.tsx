// compoennt that renders the git commit history
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from '@inertiajs/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type GitHistoryProps = {
    year: string;
    month: string | null;
    day: string | null;
    heatmap: Record<string, number>;
};

type DayInfo = {
    date: Date;
    dateStr: string;
    count: number;
    inYear: boolean;
};

type MonthInfo = {
    name: string;
    index: number;
    startPosition: number;
    span: number;
};

export default function GitHistory({ year, month, day, heatmap }: GitHistoryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isWideScreen, setIsWideScreen] = useState(false);

    // Cell sizing configuration
    const cellSize = 12;
    const cellSpacing = 3;
    const cellWidth = cellSize + cellSpacing * 2;
    const labelWidth = 40;
    const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    // Instead of regular function declarations, use useCallback
    const isSelectedDate = useCallback(
        (dateStr: string) => {
            if (!month || !day) return false;

            const dateParts = dateStr.split('-');
            const cellYear = dateParts[0];
            const cellMonth = dateParts[1];
            const cellDay = dateParts[2];

            return cellYear === year && cellMonth === month && cellDay === day;
        },
        [year, month, day],
    );

    const getCellColor = useCallback((count: number) => {
        if (count === 0) return '#e2e4e7';
        if (count <= 2) return '#9be9a8';
        if (count <= 3) return '#40c463';
        if (count <= 4) return '#30a14e';
        if (count <= 5) return '#216e39';
        if (count <= 6) return '#216e39';
        return '#1a5a2e';
    }, []); // No dependencies since it only uses the count parameter

    // Generate calendar data
    const { weeks, months, calendarWidth } = useMemo(() => {
        // Helper function to format date consistently
        const formatDateString = (date: Date): string => {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };

        // Helper function to create month key for tracking positions
        const getMonthKey = (date: Date): string => {
            return `${date.getFullYear()}-${date.getMonth()}`;
        };

        // Helper function to determine if a date is in the target year
        const isInTargetYear = (date: Date): boolean => {
            return date.getFullYear().toString() === year;
        };

        // Generate dates for the year with proper week alignment
        const generateCalendarData = () => {
            // Initialize calendar boundaries
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31`);

            // Adjust to start from Sunday (beginning of the week)
            const firstDay = new Date(startDate);
            firstDay.setDate(firstDay.getDate() - firstDay.getDay());

            // Adjust to end on Saturday (end of the week)
            const lastDay = new Date(endDate);
            lastDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

            const weeks: DayInfo[][] = [];
            const monthPositions: Record<string, number> = {};
            const currentDay = new Date(firstDay);

            // Build weeks array and track month positions
            while (currentDay <= lastDay) {
                const week: DayInfo[] = [];

                // Generate days for the current week
                for (let i = 0; i < 7; i++) {
                    const dateStr = formatDateString(currentDay);

                    // Track first day of each month for positioning month labels
                    if (currentDay.getDate() === 1) {
                        const monthKey = getMonthKey(currentDay);
                        if (!monthPositions[monthKey]) {
                            monthPositions[monthKey] = weeks.length;
                        }
                    }

                    // Create the day info object
                    week.push({
                        date: new Date(currentDay),
                        dateStr,
                        count: heatmap[dateStr] || 0,
                        inYear: isInTargetYear(currentDay),
                    });

                    // Move to next day
                    currentDay.setDate(currentDay.getDate() + 1);
                }

                weeks.push(week);
            }

            return { weeks, monthPositions };
        };

        // Generate month labels with proper positioning
        const generateMonthLabels = (monthPositions: Record<string, number>) => {
            const months: MonthInfo[] = [];

            for (let month = 0; month < 12; month++) {
                const date = new Date(parseInt(year), month, 1);
                const monthKey = getMonthKey(date);
                const startPosition = monthPositions[monthKey] || 0;

                // Calculate span between this month and next
                const nextMonthKey = month < 11 ? `${year}-${month + 1}` : `${parseInt(year) + 1}-0`;
                const endPosition = monthPositions[nextMonthKey];
                const span = endPosition ? endPosition - startPosition : 5;

                months.push({
                    name: date.toLocaleString('de-DE', { month: 'short' }),
                    index: month,
                    startPosition,
                    span,
                });
            }

            return months;
        };

        // Generate the calendar data
        const { weeks, monthPositions } = generateCalendarData();
        const months = generateMonthLabels(monthPositions);
        const calendarWidth = weeks.length * cellWidth;

        return { weeks, months, calendarWidth };
    }, [year, heatmap, cellWidth]);

    // Format date for tooltip - memoize this function to avoid recreating on every render
    const formatDate = useMemo(() => {
        return (dateStr: string) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        };
    }, []);

    // Debounced window resize handler
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let lastWidth = containerRef.current?.clientWidth || 0;

        const checkSize = () => {
            if (containerRef.current) {
                const currentWidth = containerRef.current.clientWidth;

                // Only update state if the width changes significantly or crosses the threshold
                const isCurrentlyWide = currentWidth > calendarWidth + labelWidth;
                if (isCurrentlyWide !== isWideScreen || Math.abs(currentWidth - lastWidth) > 50) {
                    setIsWideScreen(isCurrentlyWide);
                    lastWidth = currentWidth;
                }
            }
        };

        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkSize, 150); // 150ms debounce
        };

        // Initial check
        checkSize();

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [calendarWidth, isWideScreen]);

    // Memoize grid columns style to prevent recalculation
    const gridCols = useMemo(
        () => (isWideScreen ? `repeat(${weeks.length}, 1fr)` : `repeat(${weeks.length}, ${cellWidth}px)`),
        [isWideScreen, weeks.length, cellWidth],
    );

    // Memoize container style
    const containerStyle = useMemo(
        () => ({
            minWidth: `${calendarWidth + labelWidth}px`,
            width: isWideScreen ? '100%' : 'auto',
        }),
        [calendarWidth, labelWidth, isWideScreen],
    );

    // Memoize grid style
    const gridStyle = useMemo(
        () => ({
            gridTemplateColumns: gridCols,
            width: isWideScreen ? `calc(100% - ${labelWidth}px)` : 'auto',
        }),
        [gridCols, isWideScreen, labelWidth],
    );

    // Memoize month labels grid style
    const monthLabelsStyle = useMemo(
        () => ({
            gridTemplateColumns: gridCols,
            width: isWideScreen ? `calc(100% - ${labelWidth}px)` : 'auto',
            height: '20px',
        }),
        [gridCols, isWideScreen, labelWidth],
    );

    // Create a memoized cell component to reduce re-renders
    const DayCell = useMemo(() => {
        return ({ day, weekIndex, dayIndex }: { day: DayInfo; weekIndex: number; dayIndex: number }) => {
            const selected = isSelectedDate(day.dateStr);
            return (
                <Link
                    href={
                        selected
                            ? `/git/${day.dateStr.split('-')[0]}`
                            : `/git/${day.dateStr.split('-')[0]}/${day.dateStr.split('-')[1]}/${day.dateStr.split('-')[2]}`
                    }
                    key={`${weekIndex}-${dayIndex}`}
                    className={`relative ${!day.inYear ? 'opacity-50' : ''}`}
                    style={{ paddingBottom: '100%' }}
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className={`absolute inset-0 cursor-pointer border border-gray-200 transition-all duration-200 ${
                                    selected
                                        ? 'm-0 scale-90 border-2 border-blue-500!'
                                        : 'm-0.5 hover:m-0 hover:scale-90 hover:border-2 hover:border-blue-500 md:m-0.75 xl:m-1'
                                }`}
                                style={{ backgroundColor: day.inYear ? getCellColor(day.count) : '#ebedf0' }}
                            />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="rounded-md border-none bg-zinc-800 px-3 py-2 text-white">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">{formatDate(day.dateStr)}</span>
                                <span>{day.count === 0 ? 'Keine Abstimmungen' : `${day.count} Abstimmung${day.count !== 1 ? 'en' : ''}`}</span>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </Link>
            );
        };
    }, [isSelectedDate, getCellColor, formatDate]); // Only include external dependencies

    return (
        <div className="w-full font-sans" ref={containerRef}>
            <div className="mt-5 w-full overflow-x-auto">
                <div style={containerStyle}>
                    {/* Month labels */}
                    <div className="mb-2 flex">
                        <div style={{ width: `${labelWidth - 10}px` }} />
                        <div className="relative grid text-xs text-gray-600" style={monthLabelsStyle}>
                            {months.map((month, i) => (
                                <div
                                    key={i}
                                    className="absolute px-1 text-left"
                                    style={{
                                        gridColumnStart: month.startPosition + 1,
                                        gridColumnEnd: month.startPosition + month.span + 1,
                                        width: '100%',
                                    }}
                                >
                                    {month.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calendar grid with weekday labels */}
                    <div className="flex">
                        {/* Weekday labels */}
                        <div className="grid grid-rows-7 pt-0.5 pr-2 text-xs text-gray-600" style={{ width: `${labelWidth - 10}px` }}>
                            {weekdays.map((day, i) => (
                                <div key={i} className="flex h-full items-center justify-end">
                                    {i % 2 === 1 ? day : ''}
                                </div>
                            ))}
                        </div>

                        {/* Calendar cells */}
                        <div className="grid gap-0" style={gridStyle}>
                            <TooltipProvider>
                                {weekdays.map((_, dayIndex) => (
                                    <React.Fragment key={dayIndex}>
                                        {weeks.map((week, weekIndex) => {
                                            const day = week[dayIndex];
                                            if (!day) return null;

                                            return <DayCell key={`${weekIndex}-${dayIndex}`} day={day} weekIndex={weekIndex} dayIndex={dayIndex} />;
                                        })}
                                    </React.Fragment>
                                ))}
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-5 flex items-center text-xs text-gray-600">
                <span className="mr-2">Weniger</span>
                {['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'].map((color, i) => (
                    <div key={i} className="mx-1 h-4 w-4" style={{ backgroundColor: color }} />
                ))}
                <span className="ml-2">Mehr</span>
            </div>
        </div>
    );
}
