"use client";

import React, { useEffect, useRef, useState } from 'react';
import { OrbitProgress } from 'react-loading-indicators';
import { addMessage, setApiKey } from '../lib/claudeService';

export default function Workspace({ question }) {
  // Refs for terminal and CheerpX
  const terminalContainerRef = useRef(null);
  const xtermRef = useRef(null);
  const cxReadFuncRef = useRef(null);
  // New ref to store the disposable onData listener
  const dataListenerRef = useRef(null);

  // Component state
  const [code, setCode] = useState(question.starterCode);
  const [loading, setLoading] = useState(true);
  const [cheerpXInstance, setCheerpXInstance] = useState(null);
  const [claudeQuery, setClaudeQuery] = useState("");
  const [claudeOutput, setClaudeOutput] = useState("");

  // Initialize Claude API key
  useEffect(() => {
    const savedKey = localStorage.getItem("anthropic-api-key");
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // insert api key here
      const testKey = "";
      setApiKey(testKey);
      localStorage.setItem("anthropic-api-key", testKey);
    }
  }, []);

  // Initialize xterm.js terminal instance
  useEffect(() => {
    let terminal;
    Promise.all([
      import('xterm'),
      import('xterm/css/xterm.css')
    ])
      .then(([xtermModule]) => {
        const Terminal = xtermModule.Terminal;
        if (xtermRef.current) {
          xtermRef.current.dispose();
        }
        terminal = new Terminal({
          convertEol: true,
          cursorBlink: true,
          fontFamily: "monospace",
          fontSize: 14,
          theme: {
            background: "#000000",
            foreground: "#32cd32"
          }
        });
        if (terminalContainerRef.current) {
          terminal.open(terminalContainerRef.current);
        }
        xtermRef.current = terminal;
      })
      .catch(err => console.error("Failed to load xterm:", err));

    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose();
        xtermRef.current = null;
      }
    };
  }, []);

  // Initialize CheerpX Linux
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadCheerpX = async () => {
        if (!window.CheerpX) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cxrtnc.leaningtech.com/1.0.8/cx.js";
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }
        if (!window.CheerpX) {
          console.error("CheerpX is not available on window.");
          return;
        }
        try {
          const cloudDevice = await window.CheerpX.CloudDevice.create(
            "wss://disks.webvm.io/debian_large_20230522_5044875331.ext2"
          );
          const idbDevice = await window.CheerpX.IDBDevice.create(`block_${question.id}`);
          const overlayDevice = await window.CheerpX.OverlayDevice.create(cloudDevice, idbDevice);
          const webDevice = await window.CheerpX.WebDevice.create("");
          const dataDevice = await window.CheerpX.DataDevice.create();

          const mounts = [
            { type: "ext2", path: "/", dev: overlayDevice },
            { type: "dir", path: "/app", dev: webDevice },
            { type: "dir", path: "/data", dev: dataDevice },
            { type: "devs", path: "/dev" },
          ];

          const cx = await window.CheerpX.Linux.create({ mounts });
          setCheerpXInstance(cx);

          if (terminalContainerRef.current && typeof cx.setConsole === 'function') {
            cx.setConsole(terminalContainerRef.current);
          }

          // Set a custom console to write CheerpX output to the terminal.
          const writeData = (buf, vt) => {
            if (vt !== 1) return;
            const output = new TextDecoder().decode(new Uint8Array(buf));
            if (xtermRef.current) {
              xtermRef.current.write(output);
            }
          };

          cxReadFuncRef.current = cx.setCustomConsole(
            writeData,
            xtermRef.current.cols,
            xtermRef.current.rows
          );

          // Dispose of any previous onData listener if it exists.
          if (dataListenerRef.current) {
            dataListenerRef.current.dispose();
          }
          // Add a new onData listener and save its disposable.
          dataListenerRef.current = xtermRef.current.onData((data) => {
            for (let i = 0; i < data.length; i++) {
              cxReadFuncRef.current(data.charCodeAt(i));
            }
          });

          //shell loop.
          (async function startShell() {
            while (true) {
              try {
                await cx.run("/bin/bash", ["--login"], {
                  env: [
                    "HOME=/home/user",
                    "USER=user",
                    "SHELL=/bin/bash",
                    "EDITOR=vim",
                    "LANG=en_US.UTF-8",
                    "LC_ALL=C",
                  ],
                  cwd: "/home/user",
                  uid: 1000,
                  gid: 1000,
                });
              } catch (shellError) {
                console.error("Shell terminated unexpectedly:", shellError);
                if (xtermRef.current) {
                  xtermRef.current.write("\r\nShell terminated. Restarting...\r\n");
                }
              }
            }
          })();

          setLoading(false);
        } catch (error) {
          console.error("Failed to initialize CheerpX Linux:", error);
          setLoading(false);
        }
      };

      loadCheerpX();

      // Cleanup function 
      return () => {
        if (dataListenerRef.current) {
          dataListenerRef.current.dispose();
          dataListenerRef.current = null;
        }
      };
    }
  }, [question]);

  // Helper to execute a bash command via CheerpX.
  async function executeBashCommand(command) {
    if (!cheerpXInstance) {
      throw new Error("CheerpX instance not initialized");
    }
    let output = "";
    try {
      await cheerpXInstance.run("/bin/bash", ["-c", command], {
        env: [
          "HOME=/home/user",
          "USER=user",
          "SHELL=/bin/bash",
          "EDITOR=vim",
          "LANG=en_US.UTF-8",
          "LC_ALL=C",
        ],
        cwd: "/home/user",
        uid: 1000,
        gid: 1000,
        onOutput: (data) => {
          output += data;
        }
      });
      return output;
    } catch (err) {
      throw err;
    }
  }

  // Handler to process tool (bash command) requests from Claude.
  const handleTool = async (toolInput) => {
    console.log("Received toolInput:", toolInput);
    let command;
    if (typeof toolInput === 'object' && toolInput.command) {
      command = toolInput.command;
    } else if (typeof toolInput === 'string') {
      command = toolInput;
    } else {
      command = String(toolInput);
    }
  
    try {
      const output = await executeBashCommand(command);
      return output + "\n# End of AI command";
    } catch (err) {
      return "Error executing command: " + err.message;
    }
  };

  // Handle submission of a Claude query.
  const handleClaudeQuery = async () => {
    if (!claudeQuery.trim()) return;
    addMessage(
      claudeQuery,
      async (toolInput) => {
        console.log("Claude tool requested:", toolInput);
        return await handleTool(toolInput);
      },
      (text) => {
        setClaudeOutput((prev) => prev + text);
      }
    );
    setClaudeQuery("");
  };

  const handleRunCode = async () => {
    if (xtermRef.current) {
      xtermRef.current.write("\r\nShell is running interactively.\r\n");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <OrbitProgress color="#32cd32" size="small" />
          <span className="ml-2">Loading CheerpX Linux...</span>
        </div>
      )}

      {/* Header */}
      <header className="p-4 border-b border-green-600">
        <h1 className="text-2xl font-bold">Linux Challenge Terminal</h1>
      </header>


      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-6 border-r border-green-600 flex flex-col">
          <div className="flex-1 overflow-auto">
            <h2 className="text-xl font-bold mb-4">Instructions</h2>
            <p className="whitespace-pre-wrap text-lg">{question.description}</p>
            <div className="mt-6">
              <h3 className="text-lg font-bold">Example</h3>
              <div className="mt-2">
                <p className="font-bold">Input:</p>
                <p>{question.example.input}</p>
              </div>
              <div className="mt-2">
                <p className="font-bold">Expected Output:</p>
                <p>{question.example.output}</p>
              </div>
            </div>
          </div>



          <div className="mt-4 flex items-center">
            <input
              type="text"
              value={claudeQuery}
              onChange={(e) => setClaudeQuery(e.target.value)}
              placeholder="Ask Claude..."
              className="flex-1 p-2 border border-green-600 rounded bg-black text-green-400"
            />
            <button
              onClick={handleClaudeQuery}
              className="ml-2 bg-green-700 px-4 py-2 rounded hover:bg-green-600 transition-all"
            >
              Submit
            </button>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleRunCode}
              disabled={true}
              className="bg-green-700 px-4 py-2 rounded cursor-not-allowed"
            >
              Shell Running
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="ml-auto bg-green-700 text-black px-3 py-1 rounded hover:bg-green-600 transition-all duration-200"
            >
              Reset Terminal
            </button>
          </div>
        </div>

        <div className="w-1/2 flex flex-col">
          {/* Terminal Panel */}
          <div className="flex-1 border-b border-green-600 p-4 overflow-auto">
            <h2 className="text-xl font-bold mb-2">Terminal</h2>
            <div
              ref={terminalContainerRef}
              className="bg-black p-4 rounded overflow-auto h-full"
            ></div>
          </div>
          {/* Claude Response Panel */}
          <div className="flex-1 p-4 overflow-auto">
            <h2 className="text-xl font-bold mb-2">Claude's Response</h2>
            <div className="bg-black border border-green-600 rounded p-4 h-full overflow-auto">
              <pre className="whitespace-pre-wrap">
                {claudeOutput || "No responses yet. Ask Claude a question above."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
