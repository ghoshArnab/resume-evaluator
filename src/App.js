import "./App.css";
import axios from "axios";
import mammoth from "mammoth";
import { useState } from "react";

export default function App() {
  const [renderedDoc, setRenderedDoc] = useState();

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // communicate with API
    // post input value 'prompt' to API end point
    axios
      .post("http://localhost:5555/chat", { prompt })
      .then((res) => {
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
      </div>
      {renderedDoc ? (
        <>
          <div className="rendered-doc">
            <div className="tools">
              <button className="">🖊</button>
              <button className="">🏁</button>
              <button className="">📑</button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: renderedDoc }} />
          </div>
          <div className="wrapper">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything... :)"
              />
              <button type="submit">Ask</button>
            </form>
            <p className="response-area">{loading ? "loading..." : response}</p>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
