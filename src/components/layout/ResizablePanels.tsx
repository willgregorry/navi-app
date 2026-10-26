import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialLeftWidth?: number;
  initialRightWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  minRightWidth?: number;
  maxRightWidth?: number;
}

export const ResizablePanels: React.FC<ResizablePanelsProps> = ({
  leftPanel,
  centerPanel,
  rightPanel,
  initialLeftWidth = 340,
  initialRightWidth = 340,
  minLeftWidth = 260,
  maxLeftWidth = 560,
  minRightWidth = 280,
  maxRightWidth = 560,
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [rightWidth, setRightWidth] = useState(initialRightWidth);
  const [isDragging, setIsDragging] = useState<'left' | 'right' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragInfoRef = useRef<{ startX: number; startLeftWidth: number; startRightWidth: number }>({
    startX: 0,
    startLeftWidth: initialLeftWidth,
    startRightWidth: initialRightWidth,
  });

  const handleStartDrag = useCallback(
    (side: 'left' | 'right', e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(side);
      dragInfoRef.current = {
        startX: e.clientX,
        startLeftWidth: leftWidth,
        startRightWidth: rightWidth,
      };
    },
    [leftWidth, rightWidth]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - dragInfoRef.current.startX;

      if (isDragging === 'left') {
        const newWidth = Math.min(
          maxLeftWidth,
          Math.max(minLeftWidth, dragInfoRef.current.startLeftWidth + delta)
        );
        setLeftWidth(newWidth);
      } else if (isDragging === 'right') {
        // Dragging right handle: moving mouse left increases right panel width
        const newWidth = Math.min(
          maxRightWidth,
          Math.max(minRightWidth, dragInfoRef.current.startRightWidth - delta)
        );
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minLeftWidth, maxLeftWidth, minRightWidth, maxRightWidth]);

  return (
    <div
      ref={containerRef}
      className={`three-panel-resizable-container ${isDragging ? 'is-resizing' : ''}`}
    >
      {/* Invisible overlay while dragging so Monaco Editor / iframes don't swallow mouse events */}
      {isDragging && <div className="resize-drag-shield" />}

      {/* Left Panel */}
      <div
        className="resizable-panel-wrapper"
        style={{ width: `${leftWidth}px`, minWidth: `${minLeftWidth}px`, maxWidth: `${maxLeftWidth}px` }}
      >
        {leftPanel}
      </div>

      {/* Left Resize Handle */}
      <div
        className={`panel-resize-handle ${isDragging === 'left' ? 'dragging' : ''}`}
        onMouseDown={(e) => handleStartDrag('left', e)}
        title="Drag to resize Problem panel"
      >
        <div className="handle-grip-line" />
      </div>

      {/* Center Panel (Flex 1) */}
      <div className="resizable-center-wrapper">
        {centerPanel}
      </div>

      {/* Right Resize Handle */}
      <div
        className={`panel-resize-handle ${isDragging === 'right' ? 'dragging' : ''}`}
        onMouseDown={(e) => handleStartDrag('right', e)}
        title="Drag to resize Diagnostics panel"
      >
        <div className="handle-grip-line" />
      </div>

      {/* Right Panel */}
      <div
        className="resizable-panel-wrapper"
        style={{ width: `${rightWidth}px`, minWidth: `${minRightWidth}px`, maxWidth: `${maxRightWidth}px` }}
      >
        {rightPanel}
      </div>
    </div>
  );
};
