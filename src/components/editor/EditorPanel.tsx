import React, { useRef, useEffect } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Play, CheckCircle, Terminal as TerminalIcon, AlertCircle, Crosshair } from 'lucide-react';
import type { ExecutionResult } from '../../types/exam';
import type { Theme } from '../../hooks/useTheme';

interface EditorPanelProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRunCode: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  executionResult: ExecutionResult | null;
  theme: Theme;
  highlightLines?: number[];
  focusedLine?: number | null;
  onJumpToLine?: (line: number) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  code,
  onChange,
  onRunCode,
  onSubmit,
  isRunning,
  executionResult,
  theme,
  highlightLines = [],
  focusedLine,
  onJumpToLine,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const applyDecorations = (editor: any, monaco: any, lines: number[]) => {
    if (!editor || !monaco) return;

    const lineDecorations = (lines || []).map((line) => ({
      range: new monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        className: 'monaco-hint-line-highlight',
        glyphMarginClassName: 'monaco-hint-glyph',
        overviewRuler: {
          color: 'rgba(239, 68, 68, 0.85)',
          position: 1, // OverviewRulerLane.Right
        },
        hoverMessage: {
          value: `**Socratic Investigation Notice**\n\nA potential defect or structural clue points around line ${line}. Review your syntax, delimiters, or loop conditions here.`,
        },
      },
    }));

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      lineDecorations
    );
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    applyDecorations(editor, monaco, highlightLines);
  };

  // Re-apply decorations whenever highlightLines change
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      applyDecorations(editorRef.current, monacoRef.current, highlightLines);
    }
  }, [highlightLines]);

  // Scroll to focusedLine when user clicks a hint badge or line action
  useEffect(() => {
    if (focusedLine && editorRef.current) {
      editorRef.current.revealLineInCenter(focusedLine);
      editorRef.current.setPosition({ lineNumber: focusedLine, column: 1 });
      editorRef.current.focus();
    }
  }, [focusedLine]);

  return (
    <main className="panel editor-panel">
      <div className="editor-top-bar">
        <div className="file-tab-group">
          <div className="file-tab active">
            <span className="file-name">solution.py</span>
            <span className="lang-tag">Python 3</span>
          </div>

          {highlightLines.length > 0 && (
            <button
              type="button"
              className="line-defect-pill"
              onClick={() => onJumpToLine && onJumpToLine(highlightLines[0])}
              title="Click to jump to flagged line in code editor"
            >
              <AlertCircle size={12} className="defect-icon" />
              <span>
                {highlightLines.length === 1
                  ? `Line ${highlightLines[0]} Flagged`
                  : `Lines ${highlightLines.join(', ')} Flagged`}
              </span>
              <Crosshair size={11} className="defect-crosshair" />
            </button>
          )}
        </div>

        <div className="editor-actions">
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="action-btn run-btn"
          >
            <Play size={13} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={isRunning}
            className="action-btn submit-btn"
          >
            <CheckCircle size={13} />
            <span>Submit</span>
          </button>
        </div>
      </div>

      <div className="monaco-wrapper">
        <Editor
          height="100%"
          language="python"
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13.5,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            glyphMargin: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            padding: { top: 12 },
          }}
        />
      </div>

      <div className="terminal-drawer">
        <div className="terminal-header">
          <TerminalIcon size={13} />
          <span>Output & Diagnostics</span>
        </div>
        <div className="terminal-body">
          {isRunning ? (
            <div className="terminal-running">Executing code in sandbox...</div>
          ) : executionResult ? (
            <div className="terminal-output-container">
              {executionResult.stdout && (
                <pre className={`terminal-stdout ${executionResult.isSuccess ? 'terminal-success' : ''}`}>
                  {executionResult.stdout}
                </pre>
              )}
              {executionResult.stderr && (
                <pre className="terminal-stderr">{executionResult.stderr}</pre>
              )}
              {!executionResult.stdout && !executionResult.stderr && (
                <div className="terminal-placeholder">Program completed with no output.</div>
              )}
            </div>
          ) : (
            <div className="terminal-placeholder">
              Click &quot;Run Code&quot; to execute and see stdout/stderr diagnostics.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
