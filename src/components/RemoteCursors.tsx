import type { CursorsMap } from "@/lib/types";
import { Group, Circle, Text } from "react-konva";

interface RemoteCursorsProps {
  cursors: CursorsMap;
  userId: string | undefined;
  userName: string | undefined;
}

export function RemoteCursors({
  cursors,
  userId,
  userName,
}: RemoteCursorsProps) {
  return (
    <>
      {Object.entries(cursors).map(([uid, pos]) =>
        uid !== String(userId) ? (
          <Group key={uid} x={pos.x} y={pos.y}>
            <Circle
              x={0}
              y={0}
              radius={7}
              fill="#3b82f6"
              opacity={0.7}
              shadowBlur={3}
            />
            <Text
              text={userName || "Anonymous"}
              fontSize={12}
              fill="black"
              y={10}
              align="center"
            />
          </Group>
        ) : null
      )}
    </>
  );
}
