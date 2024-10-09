import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { PlusCircle } from "lucide-react";

const SchemaForm = () => {
  const [fields, setFields] = useState([{ name: "", type: "String" }]);
  const navigate = useNavigate();

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
        // Store the schema in localStorage for use in GharPage
        localStorage.setItem("userSchema", JSON.stringify(fields));
        // Redirect to GharPage
        navigate("/ghar");
      } else {
        alert("Failed to create schema");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-white bg-gray-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-8 text-black">
        Create MongoDB Schema
      </h2>
      <div className="w-full bg-white max-w-2xl bg-gray-100 p-8 rounded-lg">
        <form className="flex-col space-y-6" onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div className="flex space-x-4" key={index}>
              <Input
                placeholder="Field name"
                value={field.name}
                onChange={(e) =>
                  handleFieldChange(index, "name", e.target.value)
                }
                className="flex space-x-4"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value)
                }
                className="w-full p-2 border rounded-md bg-white"
              >
                <option value="String">String</option>
                <option value="Number">Number</option>
                <option value="Date">Date</option>
                <option value="Boolean">Boolean</option>
              </select>
            </div>
          ))}
          <Button
            type="button"
            className="w-40 bg-black hover:bg-gray-800 text-white"
            onClick={addField}
          >
            <PlusCircle
              style={{ marginRight: "10px", height: "20px", width: "20px" }}
            />{" "}
            Add Field
          </Button>
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            Create Schema
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SchemaForm;
