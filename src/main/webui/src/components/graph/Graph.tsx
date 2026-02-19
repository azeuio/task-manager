import React, { useEffect, useRef, useState } from "react";
import ForceGraph from "react-force-graph-2d";
import type { ForceGraphMethods, NodeObject } from "react-force-graph-2d";
import type { GraphLinkObject, GraphNodeData, GraphNodeType } from "./types";

interface ContainerSize {
  width: number;
  height: number;
}

interface GraphProps {
  data: GraphNodeData;
  containerRef: React.RefObject<HTMLDivElement | null>;
  customRender?: (
    node: NodeObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
  ) => Promise<void> | void;
  setLinkColor: (link: GraphLinkObject) => string;
  setNodeSize: (node: NodeObject) => number;
  linkDistance: number;
}

function Graph({
  data,
  containerRef,
  customRender,
  setLinkColor,
  setNodeSize,
  linkDistance,
}: GraphProps) {
  const fgRef =
    useRef<ForceGraphMethods<GraphNodeType, GraphLinkObject>>(undefined);
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });

  useEffect(() => {
    fgRef.current?.d3Force("link")?.distance(linkDistance);
    fgRef.current?.d3Force("center")?.strength(0.1);
  }, [linkDistance]);

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: containerRef?.current?.offsetWidth ?? 0,
        height: containerRef?.current?.offsetHeight ?? 0,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  return (
    <ForceGraph
      ref={fgRef}
      width={size.width}
      height={size.height}
      graphData={data}
      nodeLabel="id"
      nodeAutoColorBy="id"
      linkWidth={3}
      linkColor={setLinkColor}
      linkDirectionalArrowLength={1}
      linkDirectionalArrowRelPos={1}
      nodeCanvasObject={customRender}
      nodeVal={setNodeSize}
    />
  );
}

export default Graph;
