import { useEffect, useState } from "react";

function App() {
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetch("/api/test-db")
      .then((res) => res.json())
      .then((data) => {
        console.log("DB test:", data);
        setTestResult(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Flashcard App</h1>
      <h2>Testing MERN Connection...</h2>
      {testResult ? (
        <pre>{JSON.stringify(testResult, null, 2)}</pre>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default App;
