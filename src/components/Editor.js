import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    editorRef.current = Codemirror.fromTextArea(
      document.getElementById("realtimeEditor"),
      {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );

    editorRef.current.on("change", (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChange(code);

      if (origin !== "setValue") {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
        socketRef.current.emit(ACTIONS.TYPING, { roomId, typing: true });
      }
    });

    let typingTimeout;
    editorRef.current.on("change", () => {
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socketRef.current.emit(ACTIONS.TYPING, { roomId, typing: false });
      }, 1000);
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
      }
    };
  }, [socketRef, roomId, onCodeChange]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });

      socketRef.current.on(ACTIONS.TYPING, ({ username, typing }) => {
        // Handle typing indicator here if needed
      });

      socketRef.current.on(ACTIONS.STATUS_UPDATE, ({ username, status }) => {
        // Handle status update here if needed
      });

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
        socketRef.current.off(ACTIONS.TYPING);
        socketRef.current.off(ACTIONS.STATUS_UPDATE);
      };
    }
  }, [socketRef.current]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
