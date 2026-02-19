import { useMemo, useRef, useState } from "react";
import Graph from "./graph/Graph";
import type { NodeObject } from "react-force-graph-2d";
import { useUserOfProject } from "@/hooks/useUser";
import { useTasks } from "@/hooks/useTasks";
import { useProject } from "@/hooks/useProjects";
import type {
  GraphLinkObject,
  GraphNodeData,
  NodeColor,
  TaskNodeType,
} from "./graph/types";
import { toStatusId, toTaskId, toUserId } from "./graph/utils";

function useGraphData(
  users: ReturnType<typeof useUserOfProject>["data"],
  tasks: ReturnType<typeof useTasks>["data"],
  statuses: string[],
) {
  return useMemo<GraphNodeData>(() => {
    if (!users) return { nodes: [], links: [] };
    const newData: GraphNodeData = {
      nodes: [
        ...users.map((user) => ({
          type: "user" as TaskNodeType,
          id: toUserId(user.username),
        })),
        ...(tasks?.map((task) => ({
          type: "task" as TaskNodeType,
          id: toTaskId(task.id),
        })) ?? []),
        ...statuses.map((status: unknown, index: number) => ({
          type: "status" as TaskNodeType,
          id: toStatusId(index),
          displayName: status,
          index: index,
        })),
      ],
      links: [],
    };
    for (const task of tasks ?? []) {
      newData.links.push({
        source: toTaskId(task.id),
        target: toStatusId(task.status),
      });
      const createdBy = users.find((u) => u.id === task.createdById);
      if (createdBy) {
        newData.links.push({
          source: toUserId(createdBy.username),
          target: toTaskId(task.id),
        });
      }
      const assignedUsers = users.find((u) => task.assignedToId === u.id);
      if (assignedUsers) {
        newData.links.push({
          source: toTaskId(task.id),
          target: toUserId(assignedUsers.username),
        });
      }
    }
    return newData;
  }, [users, tasks, statuses]);
}

interface GraphViewProps {
  projectId: number;
}
function GraphView({ projectId }: GraphViewProps) {
  const { data: users } = useUserOfProject(projectId);
  const { data: tasks } = useTasks(projectId);
  const { data: project } = useProject(projectId);
  const statuses = useMemo(() => {
    return ["To Do", "In Progress", "Done", ...(project?.customStatuses ?? [])];
  }, [project?.customStatuses]);
  const [maxNodeSize, setMaxNodeSize] = useState<Record<TaskNodeType, number>>({
    user: 0,
    task: 0,
    status: 0,
    unknown: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const rootStyle = getComputedStyle(document.documentElement);
  const data = useGraphData(users, tasks, statuses);

  const divideToLength = (str: string, maxLength: number) => {
    const words = str.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + " " + word).trim().length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += " " + word;
      }
    }
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    return lines.join("\n");
  };

  const getLabel = (node: NodeObject): [TaskNodeType, string] => {
    const id = node.id?.toString() ?? "";
    const type = node.type as TaskNodeType;
    const value = id.replace(`${type} `, "");
    switch (type) {
      case "user": {
        const username = value;
        const user = users?.find((u) => u.username === username);
        return ["user", (user?.displayName ?? username).replaceAll(" ", "\n")];
      }
      case "task": {
        const taskId = parseInt(value, 10);
        const task = tasks?.find((t) => t.id === taskId);
        return ["task", divideToLength(task?.title ?? `Task ${taskId}`, 40)];
      }
      case "status":
        return ["status", node.displayName];
      default:
        return ["unknown", id];
    }
  };
  const getColor = (type: TaskNodeType): NodeColor => {
    switch (type) {
      case "user":
        return {
          background: rootStyle.getPropertyValue("--color-primary"),
          border: rootStyle.getPropertyValue("--color-primary-content"),
          content: rootStyle.getPropertyValue("--color-primary-content"),
        };
      case "task":
        return {
          background: rootStyle.getPropertyValue("--color-neutral"),
          border: rootStyle.getPropertyValue("--color-neutral-content"),
          content: rootStyle.getPropertyValue("--color-neutral-content"),
        };
      case "status":
        return {
          background: rootStyle.getPropertyValue("--color-accent"),
          border: rootStyle.getPropertyValue("--color-accent-content"),
          content: rootStyle.getPropertyValue("--color-accent-content"),
        };
      default:
        return {
          background: rootStyle.getPropertyValue("--color-neutral"),
          border: rootStyle.getPropertyValue("--color-neutral-content"),
          content: rootStyle.getPropertyValue("--color-neutral-content"),
        };
    }
  };

  const calculteNodeSize = (
    ctx: CanvasRenderingContext2D,
    label: string,
    globalScale: number,
  ) => {
    const [type, displayLabel] = getLabel({ id: label });
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = displayLabel.split("\n").reduce((max, line) => {
      const lineWidth = ctx.measureText(line).width;
      return Math.max(max, lineWidth);
    }, 0);
    const textHeight = fontSize * label.split("\n").length; // Approximate text height based on number of lines
    const padding = 4 / globalScale;
    const size = Math.max(textWidth, textHeight) / 2 + padding;
    const maxSize = Math.max(maxNodeSize[type] ?? 0, size);
    setMaxNodeSize((prev) => ({ ...prev, [type]: maxSize }));
    return [maxSize, fontSize];
  };

  const renderMultiline = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    lineHeight: number,
  ) => {
    for (const [i, line] of text.split("\n").entries()) {
      ctx.fillText(
        line,
        x,
        y + (i - (text.split("\n").length - 1) / 2) * lineHeight,
      );
    }
  };

  const renderNode = (
    node: NodeObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
  ) => {
    const [type, label] = getLabel(node);
    const nodePos = { x: node.x ?? 0, y: node.y ?? 0 };
    const color = getColor(type);
    const [nodeSize, fontSize] = calculteNodeSize(ctx, label, globalScale);

    switch (type) {
      case "status":
        {
          // node.fy = 0;
          // Draw rectangle background
          const rectWidth = nodeSize * 2;
          const rectHeight = nodeSize;
          ctx.beginPath();
          ctx.rect(
            nodePos.x - rectWidth / 2,
            nodePos.y - rectHeight / 2,
            rectWidth,
            rectHeight,
          );
          ctx.fillStyle = color.background;
          ctx.fill();
          ctx.lineWidth = 1 / globalScale;
          ctx.strokeStyle = color.border;
          ctx.stroke();

          // Draw label
          ctx.fillStyle = color.content;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, nodePos.x, nodePos.y);
        }
        return;
      case "task": {
        // Draw rounded rectangle background
        const rectHeight = (fontSize + 8) * label.split("\n").length;
        const rectWidth = nodeSize * 2;
        const radius = rectHeight / 2 / globalScale;
        ctx.beginPath();
        ctx.moveTo(
          nodePos.x - rectWidth / 2 + radius,
          nodePos.y - rectHeight / 2,
        );
        ctx.lineTo(
          nodePos.x + rectWidth / 2 - radius,
          nodePos.y - rectHeight / 2,
        );
        ctx.quadraticCurveTo(
          nodePos.x + rectWidth / 2,
          nodePos.y - rectHeight / 2,
          nodePos.x + rectWidth / 2,
          nodePos.y - rectHeight / 2 + radius,
        );
        ctx.lineTo(
          nodePos.x + rectWidth / 2,
          nodePos.y + rectHeight / 2 - radius,
        );
        ctx.quadraticCurveTo(
          nodePos.x + rectWidth / 2,
          nodePos.y + rectHeight / 2,
          nodePos.x + rectWidth / 2 - radius,
          nodePos.y + rectHeight / 2,
        );
        ctx.lineTo(
          nodePos.x - rectWidth / 2 + radius,
          nodePos.y + rectHeight / 2,
        );
        ctx.quadraticCurveTo(
          nodePos.x - rectWidth / 2,
          nodePos.y + rectHeight / 2,
          nodePos.x - rectWidth / 2,
          nodePos.y + rectHeight / 2 - radius,
        );
        ctx.lineTo(
          nodePos.x - rectWidth / 2,
          nodePos.y - rectHeight / 2 + radius,
        );
        ctx.quadraticCurveTo(
          nodePos.x - rectWidth / 2,
          nodePos.y - rectHeight / 2,
          nodePos.x - rectWidth / 2 + radius,
          nodePos.y - rectHeight / 2,
        );
        ctx.fillStyle = color.background;
        ctx.fill();
        ctx.lineWidth = 1 / globalScale;
        ctx.strokeStyle = color.border;
        ctx.stroke();

        // Draw label
        ctx.fillStyle = color.content;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        renderMultiline(ctx, label, nodePos.x, nodePos.y, fontSize + 2);
        return;
      }
      case "user": {
        // node.fy = 2 * nodeSize;
        // Draw circle background
        ctx.beginPath();
        ctx.arc(nodePos.x, nodePos.y, nodeSize, 0, 2 * Math.PI);
        ctx.fillStyle = color.background;
        ctx.fill();
        ctx.lineWidth = 1 / globalScale;
        ctx.strokeStyle = color.border;
        ctx.stroke();

        // Draw label
        ctx.fillStyle = color.content;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // ctx.fillText(label, nodePos.x, nodePos.y);
        renderMultiline(ctx, label, nodePos.x, nodePos.y, fontSize + 2);
        return;
      }
      default:
        return;
    }
  };

  const setNodeSize = (node: NodeObject) => {
    const [type] = getLabel(node);
    return (maxNodeSize[type] ?? 50) * 2;
  };

  const setLinkColor = (link: GraphLinkObject) => {
    const source = link.source!;
    const target = link.target!;
    if (typeof source !== "object" || typeof target !== "object") {
      return rootStyle.getPropertyValue("--color-neutral");
    }
    const types = [source.type, target.type].sort().join("-");
    if (types === "status-task") {
      return rootStyle.getPropertyValue("--color-neutral");
    }
    if (types === "task-user") {
      return rootStyle.getPropertyValue("--color-primary");
    }
    return rootStyle.getPropertyValue("--color-neutral");
  };

  const getMaxNodeSize = () => {
    return Math.max(...Object.values(maxNodeSize)) * 5;
  };

  return (
    <div ref={containerRef} className="size-full">
      <Graph
        data={data}
        containerRef={containerRef}
        customRender={renderNode}
        setLinkColor={setLinkColor}
        setNodeSize={setNodeSize}
        linkDistance={getMaxNodeSize()}
      />
    </div>
  );
}

export default GraphView;
