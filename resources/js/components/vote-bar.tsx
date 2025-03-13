import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface VoteBarData {
    label?: string;
    total: number;
    for: number;
    against: number;
    abstention?: number;
    for_percentage?: number;
    against_percentage?: number;
    abstention_percentage?: number;
}

interface VoteBarProps {
    data: VoteBarData;
    className?: string;
    showLabel?: boolean;
    height?: string;
}

export default function VoteBar({ data, className = "", showLabel = true, height = "h-6" }: VoteBarProps) {
    // Calculate percentages if they're not provided
    const forPercentage = data.for_percentage ?? (data.total > 0 ? Math.round((data.for / data.total) * 100) : 0);
    const againstPercentage = data.against_percentage ?? (data.total > 0 ? Math.round((data.against / data.total) * 100) : 0);
    const abstentionPercentage = data.abstention_percentage ?? 
        (data.abstention !== undefined && data.total > 0 ? 
            Math.round((data.abstention / data.total) * 100) : 0);

    return (
        <div className={`flex flex-col ${className}`}>
            {(showLabel && data.label) && (
                <div className="mb-1 flex items-center justify-between">
                    <div className="font-medium">{data.label}</div>
                    <div className="text-muted-foreground text-xs">{data.total} Stimmen</div>
                </div>
            )}
            <div className={`relative w-full overflow-hidden rounded-none bg-gray-100 ${height}`}>
                <div className="absolute inset-0 flex">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="flex h-full items-center justify-center bg-green-600 text-xs font-medium text-white"
                                style={{ width: `${forPercentage}%` }}
                            >
                                {forPercentage > 8 && `${forPercentage}%`}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Dafür: {data.for} ({forPercentage}%)
                            </p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="flex h-full items-center justify-center bg-red-600 text-xs font-medium text-white"
                                style={{ width: `${againstPercentage}%` }}
                            >
                                {againstPercentage > 8 && `${againstPercentage}%`}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Dagegen: {data.against} ({againstPercentage}%)
                            </p>
                        </TooltipContent>
                    </Tooltip>
                    {(data.abstention !== undefined) && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="flex h-full items-center justify-center bg-gray-400 text-xs font-medium text-white"
                                    style={{ width: `${abstentionPercentage}%` }}
                                >
                                    {abstentionPercentage > 8 && `${abstentionPercentage}%`}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Enthaltung: {data.abstention} ({abstentionPercentage}%)
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );
} 