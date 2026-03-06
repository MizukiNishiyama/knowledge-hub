"use client";

import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionLineType,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import CustomNode from "./MindMapNode";
import { MindMapUpdate, SuggestionItem } from "@/data/transcript";

const nodeTypes = { custom: CustomNode };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 80 });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
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
    // Collect all nodes and edges from updates
    const nodeMap = new Map<string, Node>();
    const edgeMap = new Map<string, Edge>();
    const latestUpdate = updates[updates.length - 1];
    const newNodeIds = new Set(latestUpdate?.nodes.map((n) => n.id) || []);

    updates.forEach((update) => {
      update.nodes.forEach((n) => {
        nodeMap.set(n.id, {
          id: n.id,
          type: "custom",
          position: { x: 0, y: 0 },
          data: {
            label: n.label,
            nodeType: n.type,
            detail: n.detail,
            isNew: newNodeIds.has(n.id),
            suggestions: allSuggestions[n.id] || [],
          },
        });
      });

      update.edges.forEach((e) => {
        const edgeId = `${e.source}-${e.target}`;
        edgeMap.set(edgeId, {
          id: edgeId,
          source: e.source,
          target: e.target,
          label: e.label,
          type: "smoothstep",
          animated: newNodeIds.has(e.target),
          markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
          style: {
            stroke: newNodeIds.has(e.target)
              ? "rgba(79, 143, 247, 0.6)"
              : "rgba(144, 144, 168, 0.25)",
            strokeWidth: newNodeIds.has(e.target) ? 2 : 1.5,
          },
          labelStyle: {
            fill: "rgba(144, 144, 168, 0.5)",
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
  }, [updates, allSuggestions, setNodes, setEdges]);

  const onInit = useCallback((reactFlowInstance: any) => {
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, duration: 600 });
    }, 100);
  }, []);

  // Fit view on each update
  useEffect(() => {
    // This will re-trigger fit view when nodes change
  }, [nodes]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative">
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-50" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide text-white/90">
            STRUCTURE MAP
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/30">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500/50" /> Topic
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500/50" /> Decision
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500/50" /> Action
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500/50" /> Risk
          </span>
        </div>
      </div>

      {/* React Flow */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="rgba(144, 144, 168, 0.05)"
            gap={24}
            size={1}
          />
          <Controls
            showInteractive={false}
            position="bottom-right"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
