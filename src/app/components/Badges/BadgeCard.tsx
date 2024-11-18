import { Chip, Image } from "@nextui-org/react";
import BasicCard from "@/app/components/BasicCard";
import { Badge } from "@/app/models/badges";
import { badgeAchievementLevelOptions } from "@/app/utils/constants";

interface BadgeCardProps {
  badge: Badge;
  truncated?: boolean;
  onClick: () => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  truncated = false,
  onClick,
}) => {
  // Find the corresponding label for the achievement level
  const achievementLevelLabel = badgeAchievementLevelOptions.find(
    (option) => option.value === badge.achievementLevel
  )?.label;

  return (
    <BasicCard
      className="rounded-3xl space-y-3 transition-transform duration-300 justify-between cursor-pointer hover:scale-105"
      style={{ backgroundColor: badge.color }}
      onClick={onClick}
    >
      <Image alt={badge.name} className="p-6" src={badge.imageUrl} />
      <p className="font-bold text-lg">{badge.name}</p>
      {!truncated && <p className="text-xs">{badge.description}</p>}
      <Chip color="success" variant="solid" className="text-xs">
        {achievementLevelLabel}
      </Chip>
    </BasicCard>
  );
};

export default BadgeCard;
