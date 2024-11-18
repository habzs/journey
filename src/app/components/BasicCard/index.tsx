import { cn } from "@/app/utils/cn";

interface BasicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const BasicCard: React.FC<BasicCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-large shadow-lg border p-6 space-y-6 w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BasicCard;
