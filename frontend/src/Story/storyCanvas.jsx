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
        return {
          bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          border: '#8b5cf6',
          title: '#a78bfa',
          shadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
        };
      case 'chapter':
        return {
          bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          border: '#3b82f6',
          title: '#60a5fa',
          shadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
        };
      case 'scene':
        return {
          bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)',
          border: '#ec4899',
          title: '#f472b6',
          shadow: '0 8px 25px rgba(236, 72, 153, 0.3)'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '#6366f1',
          title: '#818cf8',
          shadow: '0 4px 15px rgba(99, 102, 241, 0.2)'
        };
    }
  };

  const { bg, border, title, shadow } = getColors(data.type);

  return (
    <div
      style={{
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 16,
        padding: '14px 18px',
        minWidth: 200,
        position: 'relative',
        backdropFilter: 'blur(10px)',
        boxShadow: shadow,
        transition: 'all 0.3s ease'
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: border,
          width: 12,
          height: 12,
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: `0 0 10px ${border}`
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: border,
          width: 12,
          height: 12,
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: `0 0 10px ${border}`
        }}
      />
      <div style={{
        fontWeight: 700,
        color: title,
        fontSize: 15,
        marginBottom: data.subtitle ? 6 : 0,
        fontFamily: "'Inter', sans-serif"
      }}>
        {data.label}
      </div>
      {data.subtitle && (
        <div style={{
          fontSize: 12,
          color: '#a0a0b8',
          lineHeight: 1.4,
          fontFamily: "'Inter', sans-serif"
        }}>
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
      type: 'arc',
      fullData: {
        nodeType: 'story',
        ...storyJson.story_metadata,
        world_building: storyJson.world_building,
        characters: storyJson.main_characters,
        ending: storyJson.ending_direction
      }
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
        type: 'arc',
        fullData: {
          nodeType: 'arc',
          ...arc
        }
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
          type: 'chapter',
          fullData: {
            nodeType: 'chapter',
            ...chapter
          }
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
            type: 'scene',
            fullData: {
              nodeType: 'scene',
              ...scene
            }
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

// Detail Panel Component
const DetailPanel = ({ data, onClose }) => {
  if (!data) return null;

  const { nodeType } = data;

  return (
    <div className="story-detail-panel">
      <div className="detail-panel-header">
        <span className={`detail-type-badge detail-type-${nodeType}`}>
          {nodeType === 'story' ? '📚 Story' : nodeType === 'arc' ? '📖 Arc' : nodeType === 'chapter' ? '📄 Chapter' : '🎬 Scene'}
        </span>
        <button className="detail-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="detail-panel-content">
        {/* Story Metadata */}
        {nodeType === 'story' && (
          <>
            <h2 className="detail-title">{data.title}</h2>
            {data.genre && (
              <div className="detail-section">
                <h4>Genres</h4>
                <div className="detail-tags">
                  {data.genre.map((g, i) => (
                    <span key={i} className="detail-tag">{g}</span>
                  ))}
                </div>
              </div>
            )}
            {data.tone && (
              <div className="detail-section">
                <h4>Tone</h4>
                <p>{data.tone}</p>
              </div>
            )}
            {data.target_audience && (
              <div className="detail-section">
                <h4>Target Audience</h4>
                <p>{data.target_audience}</p>
              </div>
            )}
            {data.themes && (
              <div className="detail-section">
                <h4>Themes</h4>
                <div className="detail-tags">
                  {data.themes.map((t, i) => (
                    <span key={i} className="detail-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {data.world_building && (
              <div className="detail-section">
                <h4>World Building</h4>
                <p><strong>Setting:</strong> {data.world_building.setting}</p>
                {data.world_building.power_system && (
                  <div className="detail-subsection">
                    <strong>{data.world_building.power_system.name}:</strong>
                    <p>{data.world_building.power_system.description}</p>
                  </div>
                )}
              </div>
            )}
            {data.characters && (
              <div className="detail-section">
                <h4>Main Characters</h4>
                {data.characters.map((char, i) => (
                  <div key={i} className="character-card">
                    <h5>{char.name} <small>({char.role})</small></h5>
                    <p><strong>Goals:</strong> {char.goals}</p>
                    <p><strong>Fears:</strong> {char.fears}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Arc Details */}
        {nodeType === 'arc' && (
          <>
            <h2 className="detail-title">{data.arc_title}</h2>
            <div className="detail-section">
              <h4>Summary</h4>
              <p>{data.arc_summary}</p>
            </div>
            {data.chapters && (
              <div className="detail-section">
                <h4>Chapters ({data.chapters.length})</h4>
                <ul className="detail-list">
                  {data.chapters.map((ch, i) => (
                    <li key={i}>
                      <strong>{ch.chapter_title}</strong>
                      <br /><small>{ch.chapter_purpose}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Chapter Details */}
        {nodeType === 'chapter' && (
          <>
            <h2 className="detail-title">{data.chapter_title}</h2>
            <div className="detail-section">
              <h4>Purpose</h4>
              <p>{data.chapter_purpose}</p>
            </div>
            {data.scenes && (
              <div className="detail-section">
                <h4>Scenes ({data.scenes.length})</h4>
                {data.scenes.map((sc, i) => (
                  <div key={i} className="scene-detail-card">
                    <div className="scene-header">
                      <strong>{sc.emotional_beat || `Scene ${i + 1}`}</strong>
                      {sc.cliffhanger && <span className="cliffhanger-badge">Cliffhanger</span>}
                    </div>
                    {sc.setting && (
                      <p className="scene-setting">📍 {sc.setting}</p>
                    )}
                    {sc.characters_involved && sc.characters_involved.length > 0 && (
                      <div className="scene-characters">
                        <strong>Characters:</strong>
                        <div className="detail-tags">
                          {sc.characters_involved.map((c, ci) => (
                            <span key={ci} className="detail-tag detail-tag-small">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {sc.scene_summary && (
                      <p className="scene-summary">{sc.scene_summary}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Scene Details */}
        {nodeType === 'scene' && (
          <>
            <h2 className="detail-title">{data.emotional_beat || 'Scene'}</h2>
            {data.setting && (
              <div className="detail-section">
                <h4>Setting</h4>
                <p>{data.setting}</p>
              </div>
            )}
            {data.characters_involved && (
              <div className="detail-section">
                <h4>Characters</h4>
                <div className="detail-tags">
                  {data.characters_involved.map((c, i) => (
                    <span key={i} className="detail-tag">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {data.scene_summary && (
              <div className="detail-section">
                <h4>Summary</h4>
                <p>{data.scene_summary}</p>
              </div>
            )}
            {data.cliffhanger && (
              <div className="detail-section">
                <span className="cliffhanger-badge-large">🔥 Cliffhanger</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Inner component that uses useReactFlow()
const StoryCanvasContent = ({ storyJson }) => {
  const { fitView } = useReactFlow();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

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

  const onNodeClick = useCallback((event, node) => {
    if (node.data.fullData) {
      setSelectedNode(node.data.fullData);
    }
  }, []);

  return (
    <>
      <div className="canvas-area" style={{ width: "100%", height: "100%", position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
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
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(37, 37, 56, 0.98) 100%)',
            padding: '24px 36px',
            borderRadius: 20,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.3)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontSize: 15,
            color: '#ffffff',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backdropFilter: 'blur(20px)'
          }}>
            <span style={{ animation: 'spin 2s linear infinite', display: 'inline-block' }}>🎨</span>
            Arranging your story...
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

      {/* Detail Panel */}
      <DetailPanel data={selectedNode} onClose={() => setSelectedNode(null)} />
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
