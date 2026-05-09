import { getInitials } from "../../utils/emailUtils";

interface AvatarProps {
  name: string;
  size?: number;
}

export default function Avatar({ name, size = 32 }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6BCB8B, #3DAA65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 600,
        color: "#fff",
        flexShrink: 0,
        fontFamily: "inherit",
      }}
    >
      {getInitials(name)}
    </div>
  );
}