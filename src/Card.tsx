import { Card as GameCard } from "./game/types";

export const Card = ({
  card,
  hidden = false,
  onClick,
}: {
  hidden?: boolean;
  card?: GameCard;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const colorMap = {
    red: "red",
    yellow: "orange",
    blue: "aqua",
    green: "green",
    wild: "gray",
  };
  return card ? (
    <div
      onClick={(e) => {
        if (!hidden && onClick) {
          onClick(e);
        }
      }}
      style={{
        backgroundColor: hidden
          ? "darkgray"
          : card.color === "wild" && card.assignedColor
          ? colorMap[card.assignedColor]
          : colorMap[card.color],
        color: "black",
      }}
    >
      <span>{hidden ? "<uno>" : card.face}</span>
    </div>
  ) : (
    <></>
  );
};
