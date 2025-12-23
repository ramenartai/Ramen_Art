import React, { useState, useEffect, useCallback } from "react";
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Background,
  Controls,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';


// each node
const StoryNode = ({ data }) => {
  const getColors = (type) => {
    switch (type) {
      case 'arc':
        return { bg: '#FFF7E6', border: '#F59E0B', title: '#B45309' };
      case 'chapter':
        return { bg: '#E0F2FE', border: '#3B82F6', title: '#1D4ED8' };
      case 'scene':
        return { bg: '#ECFDF3', border: '#22C55E', title: '#15803D' };
      case 'character':
        return { bg: '#F5F3FF', border: '#8B5CF6', title: '#6D28D9' };
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
        maxWidth: 260,
        fontSize: 12,
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 12,
          color: title,
          marginBottom: 4,
          whiteSpace: 'normal'
        }}
      >
        {data.label}
      </div>
      {data.subtitle && (
        <div
          style={{
            fontSize: 11,
            color: '#374151',
            whiteSpace: 'normal',
            lineHeight: 1.35
          }}
        >
          {data.subtitle}
        </div>
      )}
    </div>
  );
};


// Node types mapping
const nodeTypes = {
  storyNode: StoryNode
};

const defaultEdgeStyle = {
  strokeWidth: 2,
  stroke: '#999'
};

const defaultMarker = { type: 'arrowclosed', color: '#999' };

const storyJSONtoFlow = (storyJson) => {
  const nodes = [];
  const edges = [];

  // add main elements
  nodes.push({
    id: 'story-metadata',
    type: 'storyNode',
    position: { x: 100, y: 100 },
    data: { 
      label: storyJson.story_metadata?.title || 'Story Title',
      subtitle: storyJson.story_metadata?.genre?.join(', ') || '',
      type: 'arc'
    }
  })

  // story arcs as chapters
  storyJson.story_arcs?.forEach((arc, arcIndex) => {
    const arcNodeId = `arc-${arc.arc_id}`;
    nodes.push({
      id: arcNodeId,
      type: 'storyNode',
      position: { x: 400 + arcIndex * 300, y: 150 },
      data: { 
        label: arc.arc_title,
        subtitle: arc.arc_summary || '',
        type: 'arc'
      }
    });
    // Connect arc to main story
    edges.push({
      id: `story-to-arc-${arc.arc_id}`,
      source: 'story-metadata',
      target: arcNodeId,
      style: defaultEdgeStyle,
      markerEnd: defaultMarker
    });
    // Add chapters and scenes
    arc.chapters?.forEach((chapter, chIndex) => {
      const chapterNodeId = `chapter-${chapter.chapter_id}`;
      nodes.push({
        id: chapterNodeId,
        type: 'storyNode',
        position: { x: 400 + arcIndex * 300, y: 250 + chIndex * 120 },
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
        style: defaultEdgeStyle,
        markerEnd: defaultMarker
      });

      // Add scenes
      chapter.scenes?.forEach((scene, sceneIndex) => {
        const sceneNodeId = `scene-${scene.scene_id}`;
        nodes.push({
          id: sceneNodeId,
          type: 'storyNode',
          position: { x: 700 + arcIndex * 300 + sceneIndex * 100, y: 270 + chIndex * 120 },
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
        style: defaultEdgeStyle,
        markerEnd: defaultMarker
        });
      });
    });
  });

  return { nodes, edges };
};


const StoryCanvas = ({ storyJson }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // whenever chat sends new storyJson, rebuild flow
  useEffect(() => {
    if (!storyJson) {
      setNodes([]);
      setEdges([]);
      return;
    }
    const { nodes: newNodes, edges: newEdges } = storyJSONtoFlow(storyJson);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [storyJson, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

    return (
    <div className="canvas-area" style={{ width: "100%", height: "100%" }}>
      {nodes.length > 0 ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="story-canvas-flow"
          minZoom={0.2}
          maxZoom={2}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      ) : (
        <div className="story-default-empty">
          <div className="story-default-icon">+</div>
          <div className="story-default-text">
            <h3>No Story Loaded</h3>
            <p>Generate a new story from the AI panel to start visualizing.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryCanvas;
