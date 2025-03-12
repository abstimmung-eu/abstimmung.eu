import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, className = '' }: PageHeaderProps) {
    return (
        <div className={`mb-10 space-y-2 ${className}`}>
            <h1 className="text-3xl font-bold tracking-tighter">{title}</h1>
            {description && (
                <p className="text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
