import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, Terminal as TerminalIcon } from 'lucide-react';
import type { ExecutionResult } from '../../types/exam';

interface EditorPanelProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRunCode: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  executionResult: ExecutionResult | null;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  code,
  onChange,
  onRunCode,
  onSubmit,
  isRunning,
  executionResult,
}) => {
  return (
    <main className="panel editor-panel">
      <div className="editor-top-bar">
        <div className="file-tab active">
          <span>solution.py</span>
          <span className="lang-tag">Python 3</span>
        </div>

        <div className="editor-actions">
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="action-btn run-btn"
          >
            <Play size={14} />
            <span>{isRunning ? 'Menjalankan...' : 'Jalankan Kode'}</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={isRunning}
            className="action-btn submit-btn"
          >
            <CheckCircle size={14} />
            <span>Kumpulkan Jawaban</span>
          </button>
        </div>
      </div>

      <div className="monaco-wrapper">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={onChange}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
          }}
        />
      </div>

      <div className="terminal-drawer">
        <div className="terminal-header">
          <TerminalIcon size={14} />
          <span>Keluaran Terminal (Stdout / Stderr)</span>
        </div>
        <div className="terminal-body">
          {isRunning ? (
            <div className="terminal-running">Menjalankan kode di sandbox...</div>
          ) : executionResult ? (
            <pre className={executionResult.isSuccess ? 'output-success' : 'output-error'}>
              {executionResult.stderr || executionResult.stdout || 'Program selesai tanpa output.'}
            </pre>
          ) : (
            <div className="terminal-placeholder">
              Keluaran program dan pesan eror akan ditampilkan di sini setelah Anda mengklik Jalankan Kode.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
