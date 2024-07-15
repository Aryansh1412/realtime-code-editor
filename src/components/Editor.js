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
    async function init() {
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
        console.log("changes", changes);
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
        console.log(code);
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      };
    }
    
  }, [socketRef.current]);
  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
// import React, { useEffect, useRef } from "react";
// import Codemirror from "codemirror-5.65.16";
// // import "codemirror-5.65.16/lib/codemirror.css";
// import "codemirror-5.65.16/theme/dracula.css";
// import "codemirror-5.65.16/mode/javascript/javascript";
// import "codemirror-5.65.16/addon/edit/closetag";
// import "codemirror-5.65.16/addon/edit/closebrackets";
// import ACTIONS from "../Actions";

// const Editor = ({ socketRef, roomId, onCodeChange }) => {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     // Initialize CodeMirror editor
//     editorRef.current = Codemirror.fromTextArea(
//       document.getElementById("realtimeEditor"),
//       {
//         mode: { name: "javascript", json: true },
//         theme: "dracula",
//         autoCloseTags: true,
//         autoCloseBrackets: true,
//         lineNumbers: true,
//       }
//     );

//     // Set up change event handler
//     editorRef.current.on("change", (instance, changes) => {
//       const { origin } = changes;
//       const code = instance.getValue();
//       onCodeChange(code);

//       if (origin !== "setValue") {
//         // Emit code change event through socket
//         socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//           roomId,
//           code,
//         });
//       }
//     });

//     // Clean up on unmount
//     return () => {
//       if (editorRef.current) {
//         editorRef.current.toTextArea();
//       }
//     };
//   }, [socketRef, roomId, onCodeChange]);

//   useEffect(() => {
//     if (socketRef.current) {
//       const handleCodeChange = ({ code }) => {
//         if (code !== null && editorRef.current) {
//           // Check to avoid setting the same value twice
//           if (editorRef.current.getValue() !== code) {
//             editorRef.current.setValue(code);
//           }
//         }
//       };

//       socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

//       // Clean up socket event listener on unmount
//       return () => {
//         socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
//       };
//     }
//   }, [socketRef.current]);

//   return <textarea id="realtimeEditor"></textarea>;
// };

// export default Editor;
