import type { GraphData, LinkObject } from "react-force-graph-2d";

export type TaskNodeType = "user" | "task" | "status" | "unknown";

export interface NodeColor {
  background: string;
  border: string;
  content: string;
}

export type GraphNodeType = {
  type: TaskNodeType;
  displayName?: string;
};

export type GraphLinkObject = LinkObject<GraphNodeType>;

export type GraphNodeData = GraphData<GraphNodeType, GraphLinkObject>;
