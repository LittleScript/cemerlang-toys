import {
  Baby,
  Boxes,
  Bot,
  Car,
  ChefHat,
  Dice5,
  Heart,
  PartyPopper,
  Puzzle,
  Sparkles,
  Swords,
  Volleyball,
  type LucideProps,
} from "lucide-react";

const ICONS = {
  Car,
  Bot,
  Heart,
  Puzzle,
  ChefHat,
  Volleyball,
  Swords,
  Baby,
  Dice5,
  PartyPopper,
  Sparkles,
  Boxes,
} as const;

export type CategoryIconName = keyof typeof ICONS;

export function CategoryIcon({
  name,
  ...props
}: { name?: string | null } & Omit<LucideProps, "name">) {
  const Icon = (name && ICONS[name as CategoryIconName]) || Boxes;
  return <Icon {...props} />;
}
