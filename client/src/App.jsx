import { useEffect, useState } from "react";
import { Flashcard } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";

function App() {
  // const [testResult, setTestResult] = useState(null);

  // useEffect(() => {
  //   fetch("/api/test-db")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("DB test:", data);
  //       setTestResult(data);
  //     })
  //     .catch((err) => console.error(err));
  // }, []);
  // return (
  //   <div>
  //     <h1>Flashcard App</h1>
  //     <h2>Testing MERN Connection...</h2>
  //     {testResult ? (
  //       <pre>{JSON.stringify(testResult, null, 2)}</pre>
  //     ) : (
  //       "Loading..."
  //     )}
  //   </div>
  // );

  return (
    <div>
      <Flashcard
        front={{ html: <div>Who's the biggest land mammal?</div> }}
        back={{ html: <div>African bush elephant</div> }}
      />
    </div>
  );
}

export default App;
