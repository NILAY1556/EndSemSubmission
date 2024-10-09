import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GharPage from "./components/GharPage";
import "./App.css";
import SchemaForm from "./components/SchemaForm";

function App() {
  const [schemaCreated, setSchemaCreated] = useState(false);
  const [schema, setSchema] = useState(null);

  const handleSchemaCreated = (newSchema) => {
    setSchema(newSchema);
    setSchemaCreated(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SchemaForm />} />
          <Route path="/ghar" element={<GharPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
