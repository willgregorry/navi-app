import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, Terminal as TerminalIcon } from 'lucide-react';
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
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  code,
  onChange,
  onRunCode,
  onSubmit,
  isRunning,
  executionResult,
  theme,
}) => {
  return (
    <main className="panel editor-panel">
      <div className="editor-top-bar">
        <div className="file-tab active">
          <span className="file-name">solution.py</span>
          <span className="lang-tag">Python 3</span>
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
          options={{
            fontSize: 13.5,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
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
            <pre className={executionResult.isSuccess ? 'output-success' : 'output-error'}>
              {executionResult.stderr || executionResult.stdout || 'Program completed with no output.'}
            </pre>
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
