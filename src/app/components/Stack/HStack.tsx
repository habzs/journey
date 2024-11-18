import { StackProps } from "./StackProps";

export const HStack: React.FC<StackProps> = (
    {
        children,
        spacing = 15.0,
        className = ""
    }
) => {
    return (
        <div
            className={`flex md:flex-row ${className}`}
            style={{ gap: spacing }}
        >
            {children}
        </div>
    );
};