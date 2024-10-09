import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";

const SchemaForm = ({ onSchemaCreated }) => {
  const [fields, setFields] = useState([{ name: "", type: "String" }]);

  const addField = () => {
    setFields([...fields, { name: "", type: "String" }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      });
      if (response.ok) {
        alert("Schema created successfully!");
        onSchemaCreated(fields); // Pass the created schema back to parent
      } else {
        alert("Failed to create schema");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Your Schema</h2>
      {fields.map((field, index) => (
        <div key={index}>
          <Input
            placeholder="Field name"
            value={field.name}
            onChange={(e) => handleFieldChange(index, "name", e.target.value)}
          />
          <select
            value={field.type}
            onChange={(e) => handleFieldChange(index, "type", e.target.value)}
          >
            <option value="String">String</option>
            <option value="Number">Number</option>
            <option value="Date">Date</option>
            <option value="Boolean">Boolean</option>
          </select>
        </div>
      ))}
      <Button type="button" onClick={addField}>
        Add Field
      </Button>
      <Button type="submit">Create Schema</Button>
    </form>
  );
};

export default SchemaForm;
