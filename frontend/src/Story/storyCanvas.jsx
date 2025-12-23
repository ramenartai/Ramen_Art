import React, { useState, useEffect, useCallback } from "react";
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  useReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Handle, Position } from '@xyflow/react';
import getLayoutedElements from "./position";

const StoryNode = ({ data }) => {
  const getColors = (type) => {
    switch (type) {
      case 'arc':
        return { bg: '#FFF7E6', border: '#F59E0B', title: '#B45309' };
      case 'chapter':
        return { bg: '#E0F2FE', border: '#3B82F6', title: '#1D4ED8' };
      case 'scene':
        return { bg: '#ECFDF3', border: '#22C55E', title: '#15803D' };
      default:
        return { bg: '#F3F4F6', border: '#6B7280', title: '#111827' };
    }
  };

  const { bg, border, title } = getColors(data.type);

  return (
    <div
      style={{
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 10,
        padding: '8px 10px',
        minWidth: 180,
        position: 'relative'
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: border }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: border }}
      />
      <div style={{ fontWeight: 700, color: title }}>
        {data.label}
      </div>
      {data.subtitle && (
        <div style={{ fontSize: 11 }}>
          {data.subtitle}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  storyNode: StoryNode
};

const storyJSONtoFlow = (storyJson) => {
  const nodes = [];
  const edges = [];

  nodes.push({
    id: 'story-metadata',
    type: 'storyNode',
    data: { 
      label: storyJson.story_metadata?.title || 'Story Title',
      subtitle: storyJson.story_metadata?.genre?.join(', ') || '',
      type: 'arc'
    }
  });

  storyJson.story_arcs?.forEach((arc) => {
    const arcNodeId = `arc-${arc.arc_id}`;
    nodes.push({
      id: arcNodeId,
      type: 'storyNode',
      data: { 
        label: arc.arc_title,
        subtitle: arc.arc_summary || '',
        type: 'arc'
      }
    });
    edges.push({
      id: `story-to-arc-${arc.arc_id}`,
      source: 'story-metadata',
      target: arcNodeId,
      type: 'default',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
    });
    
    arc.chapters?.forEach((chapter) => {
      const chapterNodeId = `chapter-${chapter.chapter_id}`;
      nodes.push({
        id: chapterNodeId,
        type: 'storyNode',
        data: { 
          label: chapter.chapter_title,
          subtitle: chapter.chapter_purpose,
          type: 'chapter'
        }
      });
      edges.push({
        id: `arc-to-chapter-${chapter.chapter_id}`,
        source: arcNodeId,
        target: chapterNodeId,
        type: 'default',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        }
      });

      chapter.scenes?.forEach((scene) => {
        const sceneNodeId = `scene-${scene.scene_id}`;
        nodes.push({
          id: sceneNodeId,
          type: 'storyNode',
          data: { 
            label: scene.emotional_beat || 'Scene',
            subtitle: `${scene.characters_involved?.join(', ') || ''}`,
            type: 'scene'
          }
        });

        edges.push({
          id: `chapter-to-scene-${scene.scene_id}`,
          source: chapterNodeId,
          target: sceneNodeId,
          type: 'default',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          }
        });
      });
    });
  });

  return { nodes, edges };
};

// Inner component that uses useReactFlow()
const StoryCanvasContent = ({ storyJson }) => {
  const { fitView } = useReactFlow();
  const [isLoading, setIsLoading] = useState(false);

  const defaultNodes = [
    {
      id: '1',
      type: 'storyNode',
      position: { x: 250, y: 100 },
      data: { label: 'Chapter 1', subtitle: 'The new arc starts', type: 'arc' }
    },
    {
      id: '2',
      type: 'storyNode',
      position: { x: 450, y: 200 },
      data: { label: 'Chapter 2', subtitle: 'The first chapter of the main character', type: 'chapter' }
    }
  ];
  const defaultEdges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'default'
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);

  useEffect(() => {
    if (!storyJson) {
      setNodes(defaultNodes);
      setEdges(defaultEdges);
      return;
    }
    
    setIsLoading(true);
    const { nodes: newNodes, edges: newEdges } = storyJSONtoFlow(storyJson);
    const { nodes: layoutedNodes } = getLayoutedElements(newNodes, newEdges, 'TB');
    
    // Batch updates with RAF for smoothness
    requestAnimationFrame(() => {
      setNodes(layoutedNodes);
      setEdges(newEdges);
      setIsLoading(false);
      
      // Smooth fitView after render
      setTimeout(() => {
        fitView({ 
          padding: 0.2,
          includeHiddenNodes: false,
          duration: 500
        });
      }, 50);
    });
  }, [storyJson, setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onLayout = useCallback((direction = 'TB') => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges, direction);
    setNodes(layoutedNodes);
    
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 500 });
    }, 100);
  }, [nodes, edges, setNodes, fitView]);

  return (
    <>
      <div className="canvas-area" style={{ width: "100%", height: "100%", position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          animated="true"
          fitView={false}
          className="story-canvas-flow"
          minZoom={0.2}
          maxZoom={2}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            background: 'rgba(255,255,255,0.95)',
            padding: '20px 30px',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            fontSize: 14,
            color: '#374151'
          }}>
            🎨 Arranging your story...
          </div>
        )}
      </div>

      {/* Layout buttons */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        display: 'flex',
        gap: 8
      }}>
      </div>
    </>
  );
};

// Wrapper with ReactFlowProvider
const StoryCanvas = ({ storyJson }) => {
  return (
    <ReactFlowProvider>
      <StoryCanvasContent storyJson={storyJson} />
    </ReactFlowProvider>
  );
};

export default StoryCanvas;
