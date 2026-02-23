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
  setLinkDistance: (link: GraphLinkObject) => number;
  setLinkStrength?: (link: GraphLinkObject) => number;
  setLinkWidth?: (link: GraphLinkObject) => number;
  setLineDash?: (link: GraphLinkObject) => number[];
}

function Graph({
  data,
  containerRef,
  customRender,
  setLinkColor,
  setNodeSize,
  setLinkDistance,
  setLinkStrength,
  setLinkWidth,
  setLineDash,
}: GraphProps) {
  const fgRef =
    useRef<ForceGraphMethods<GraphNodeType, GraphLinkObject>>(undefined);
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });
  const [actualData, setActualData] = useState(data);

  const resetView = () => {
    fgRef.current?.zoomToFit(400);
    setActualData((prevData) => {
      // Force re-render by creating a new object reference
      return { nodes: [...prevData.nodes], links: [...prevData.links] };
    });
  };

  useEffect(() => {
    fgRef.current?.d3Force("link")?.distance(setLinkDistance);
    fgRef.current?.d3Force("link")?.strength(setLinkStrength);
    fgRef.current?.d3Force("center")?.strength(0.5);
  }, [setLinkDistance, setLinkStrength, data]);

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
    <div className="relative">
      <button
        type="button"
        className="btn btn-primary absolute top-2 right-2 z-10"
        onClick={() => {
          resetView();
        }}
      >
        reset view
      </button>
      <ForceGraph
        ref={fgRef}
        width={size.width}
        height={size.height}
        graphData={actualData}
        nodeLabel="id"
        nodeAutoColorBy="id"
        linkWidth={setLinkWidth}
        linkColor={setLinkColor}
        linkDirectionalArrowLength={1}
        linkDirectionalArrowRelPos={1}
        nodeCanvasObject={customRender}
        nodeVal={setNodeSize}
        linkLineDash={setLineDash}
      />
    </div>
  );
}

export default Graph;
