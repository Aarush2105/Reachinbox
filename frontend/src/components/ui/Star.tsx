import { useState } from "react";

interface StarButtonProps {
  initialStarred?: boolean;
  onToggle?: (starred: boolean) => void;
}

export default function StarButton({ initialStarred = false, onToggle }: StarButtonProps) {
  const [starred, setStarred] = useState(initialStarred);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !starred;
    setStarred(next);
    onToggle?.(next);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 4,
        color: starred ? "#F5A623" : "#C8C8C8",
        fontSize: 16,
        lineHeight: 1,
        transition: "color 0.15s",
      }}
    >
      {starred ? "★" : "☆"}
    </button>
  );
}