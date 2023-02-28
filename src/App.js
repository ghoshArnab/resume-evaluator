import "./App.css";
import mammoth from "mammoth";
import { useState } from "react";

export default function App() {
  const [renderedDoc, setRenderedDoc] = useState();

  function parseWordDocxFile(inputElement) {
    let files = inputElement.files || [];
    if (!files.length) return;
    let file = files[0];

    console.time();
    let reader = new FileReader();
    reader.onloadend = function (event) {
      let arrayBuffer = reader.result;
      mammoth
        .extractRawText({ arrayBuffer: arrayBuffer })
        .then(function (resultObject) {
          let rendered = resultObject.value;
          console.log(rendered);
          setRenderedDoc(rendered);
        });
      console.timeEnd();
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="App">
      <div className="header">
        <h2>Resume Evaluator</h2>
        <input type="file" onChange={(e) => parseWordDocxFile(e.target)} />
        {/* <button onClick={parseWordDocxFile(deafultFile)}> Recargar </button> */}
      </div>
      {renderedDoc ? (
        <div className="rendered-doc">
          <div className="tools">
            <button className="">🖊</button>
            <button className="">🏁</button>
            <button className="">📑</button>
          </div>
          <div dangerouslySetInnerHTML={{ __html: renderedDoc }} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
