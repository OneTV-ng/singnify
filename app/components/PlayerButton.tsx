import React from "react";
import { LucideIcon } from "lucide-react"; // Assuming LucideIcon is the type for the icon prop

type PlayerButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: LucideIcon;
  active?: boolean;
  className?: string;
  disabled?: boolean;
};

const PlayerButton: React.FC<PlayerButtonProps> = ({
  onClick,
  icon: Icon,
  active = false,
  className = "",
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-full hover:bg-secondary/10 ${
      active ? "text-primary" : ""
    } ${className}`}
  >
    <Icon className="h-5 w-5" />
  </button>
);

export default PlayerButton;