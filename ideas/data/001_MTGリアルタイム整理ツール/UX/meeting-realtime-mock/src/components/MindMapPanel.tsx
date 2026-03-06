"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionLineType,
  MarkerType,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import CustomNode from "./MindMapNode";
import { ComparisonTableNode, GanttChartNode, MetricsCardNode } from "./RichNodes";
import { MindMapUpdate, SuggestionItem, tagLabels } from "@/data/transcript";

const nodeTypes = {
  custom: CustomNode,
  comparisonTable: ComparisonTableNode,
  ganttChart: GanttChartNode,
  metricsCard: MetricsCardNode,
};

const DEFAULT_WIDTH = 270;
const DEFAULT_HEIGHT = 110;

// Rich node sizes for dagre layout
const richNodeSizes: Record<string, { width: number; height: number }> = {
  comparisonTable: { width: 380, height: 180 },
  ganttChart: { width: 520, height: 200 },
  metricsCard: { width: 300, height: 140 },
};

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 80 });

  nodes.forEach((node) => {
    const size = richNodeSizes[node.type || ""] || { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
    g.setNode(node.id, { width: size.width, height: size.height });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    const size = richNodeSizes[node.type || ""] || { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - size.width / 2,
        y: nodeWithPosition.y - size.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

interface MindMapPanelProps {
  updates: MindMapUpdate[];
}

export default function MindMapPanel({ updates }: MindMapPanelProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const rfInstance = useRef<ReactFlowInstance | null>(null);
  const isFirstUpdate = useRef(true);

  const allSuggestions = useMemo(() => {
    const map: Record<string, SuggestionItem[]> = {};
    updates.forEach((u) => {
      u.suggestions?.forEach((s) => {
        if (!map[s.nodeId]) map[s.nodeId] = [];
        map[s.nodeId].push(s);
      });
    });
    return map;
  }, [updates]);

  useEffect(() => {
    const nodeMap = new Map<string, Node>();
    const edgeMap = new Map<string, Edge>();
    const latestUpdate = updates[updates.length - 1];
    const newNodeIds = new Set(latestUpdate?.nodes.map((n) => n.id) || []);

    updates.forEach((update) => {
      update.nodes.forEach((n) => {
        // Determine if this is a rich node type
        const richType = (n as any).richType as string | undefined;
        const richData = (n as any).richData as any;

        nodeMap.set(n.id, {
          id: n.id,
          type: richType || "custom",
          position: { x: 0, y: 0 },
          data: {
            label: n.label,
            nodeType: n.type,
            detail: n.detail,
            speaker: n.speaker,
            summary: n.summary,
            evidence: n.evidence,
            isNew: newNodeIds.has(n.id),
            suggestions: allSuggestions[n.id] || [],
            ...richData,
          },
        });
      });

      update.edges.forEach((e) => {
        const edgeId = `${e.source}-${e.target}`;
        const isNew = newNodeIds.has(e.target);
        edgeMap.set(edgeId, {
          id: edgeId,
          source: e.source,
          target: e.target,
          label: e.label,
          type: "smoothstep",
          animated: isNew,
          markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10 },
          style: {
            stroke: isNew ? "#3b82f6" : "#d1d5db",
            strokeWidth: isNew ? 2 : 1.2,
          },
          labelStyle: {
            fill: "#9ca3af",
            fontSize: 9,
          },
        });
      });
    });

    const allNodes = Array.from(nodeMap.values());
    const allEdges = Array.from(edgeMap.values());

    const { nodes: layoutedNodes, edges: layoutedEdges } =
      getLayoutedElements(allNodes, allEdges);

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    setTimeout(() => {
      if (!rfInstance.current) return;

      if (isFirstUpdate.current) {
        rfInstance.current.fitView({ padding: 0.3, duration: 500 });
        isFirstUpdate.current = false;
        return;
      }

      const newNodes = layoutedNodes.filter((n) => newNodeIds.has(n.id));
      if (newNodes.length === 0) return;

      const focusNodeIds = new Set<string>();
      newNodeIds.forEach((id) => focusNodeIds.add(id));
      latestUpdate?.edges.forEach((e) => {
        focusNodeIds.add(e.source);
        focusNodeIds.add(e.target);
      });

      const focusNodes = layoutedNodes.filter((n) => focusNodeIds.has(n.id));
      if (focusNodes.length === 0) return;

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      focusNodes.forEach((n) => {
        const size = richNodeSizes[n.type || ""] || { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
        minX = Math.min(minX, n.position.x);
        maxX = Math.max(maxX, n.position.x + size.width);
        minY = Math.min(minY, n.position.y);
        maxY = Math.max(maxY, n.position.y + size.height);
      });

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const bboxWidth = maxX - minX + 200;
      const bboxHeight = maxY - minY + 200;

      const flowElement = document.querySelector('.react-flow') as HTMLElement;
      if (!flowElement) return;
      const { width: vw, height: vh } = flowElement.getBoundingClientRect();

      const zoomX = vw / bboxWidth;
      const zoomY = vh / bboxHeight;
      const targetZoom = Math.min(Math.max(Math.min(zoomX, zoomY), 0.45), 1.2);

      rfInstance.current.setViewport(
        {
          x: vw / 2 - centerX * targetZoom,
          y: vh / 2 - centerY * targetZoom,
          zoom: targetZoom,
        },
        { duration: 600 }
      );
    }, 80);
  }, [updates, allSuggestions, setNodes, setEdges]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    rfInstance.current = instance;
    setTimeout(() => {
      instance.fitView({ padding: 0.3, duration: 500 });
    }, 100);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 relative">
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-50" />
          </div>
          <h2 className="text-[13px] font-semibold tracking-wide text-gray-700 uppercase">
            Structure Map
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          {(["fact", "proposal", "concern", "decision", "action"] as const).map((tag) => (
            <span key={tag} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: tagLabels[tag].color }} />
              {tagLabels[tag].label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e5e7eb" gap={20} size={1} />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </div>
    </div>
  );
}
