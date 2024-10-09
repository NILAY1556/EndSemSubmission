import { useState } from "react";
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
    <div className="App">
      {!schemaCreated ? (
        <SchemaForm onSchemaCreated={handleSchemaCreated} />
      ) : (
        <GharPage schema={schema} />
      )}
    </div>
  );
}

export default App;
