import React, { ReactNode } from 'react';
import { StackProps } from './StackProps';

export const VStack: React.FC<StackProps> = (
    {
        children,
        spacing = 15.0,
        className = ""
    }
) => {
    return (
        <div
            className={`flex flex-col ${className}`}
            style={{ gap: spacing }}
        >
            {children}
        </div>
    );
};
