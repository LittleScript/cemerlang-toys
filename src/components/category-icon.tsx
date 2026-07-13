import {
  Baby,
  Bike,
  Blocks,
  Boxes,
  Bot,
  Car,
  ChefHat,
  Dice5,
  Dices,
  Gamepad2,
  Heart,
  Music,
  PartyPopper,
  Pencil,
  Puzzle,
  Shirt,
  Sparkles,
  Swords,
  Volleyball,
  Waves,
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
  Blocks,
  Music,
  Gamepad2,
  Waves,
  Pencil,
  Dices,
  Shirt,
  Bike,
} as const;

export type CategoryIconName = keyof typeof ICONS;

export const CATEGORY_ICON_NAMES = Object.keys(ICONS) as CategoryIconName[];

export function CategoryIcon({
  name,
  ...props
}: { name?: string | null } & Omit<LucideProps, "name">) {
  const Icon = (name && ICONS[name as CategoryIconName]) || Boxes;
  return <Icon {...props} />;
}
