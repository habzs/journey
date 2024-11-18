import clsx from "clsx";
import { ReactNode } from "react";

interface WidthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const WidthLayout: React.FC<WidthLayoutProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "px-4 md:px-15 viewport-content-container py-8 max-w-8xl mx-auto container items-center w-full flex flex-col",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default WidthLayout;
