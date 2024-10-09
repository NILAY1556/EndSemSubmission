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

  const exampleSchemas = {
    default: [{ name: "", type: "String" }],
    student: [
      { name: "name", type: "String" },
      { name: "rollNo", type: "Number" },
      { name: "cpi", type: "String" },
    ],
    product: [
      { name: "productName", type: "String" },
      { name: "price", type: "Number" },
      { name: "inStock", type: "Boolean" },
    ],
    event: [
      { name: "eventName", type: "String" },
      { name: "date", type: "Date" },
      { name: "attendees", type: "Number" },
    ],
    tasks: [
      {
        name: "taskName",
        type: "String",
      },
      {
        name: "isCompleted",
        type: "Boolean",
      },
      {
        name: "dueDate",
        type: "Date",
      },
    ],
  };

  const handleExampleSelect = (e) => {
    const selectedExample = e.target.value;
    setFields(exampleSchemas[selectedExample]);
  };

  return (
    <div className="min-h-screen bg-white bg-gray-100 flex space-y-5 flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-black">
        Welcome to the Ultimate CRUDing ! <br />
      </h1>
      <h3>
        {" "}
        <b>
          <i>
            <span className="bg-[#dee2e6] ">E</span>verything
          </i>{" "}
          e<span className="bg-[#dee2e6] ">V</span>eryw
          <span className="bg-[#dee2e6] ">H</span>ere{" "}
          <i>
            a<span className="bg-[#dee2e6] ">L</span>l
          </i>{" "}
          <span className="bg-[#dee2e6] ">A</span>t o
          <span className="bg-[#dee2e6] ">N</span>ce
        </b>
      </h3>
      <p>
        Are you tired of being limited by boring, run-of-the-mill CRUD apps that
        only do one thing? Do you dream of a world where you can create a{" "}
        <b className="bg-[#dee2e6]">to-do list</b> , manage your{" "}
        <b className="bg-[#dee2e6] ">e-commerce cart</b>, track your{" "}
        <b className="bg-[#dee2e6] ">expenses</b>, and even organize your cat's
        birthday party <i>all in one place</i>?
      </p>
      <ul>
        <li>
          <b>Flexibility :</b> Create any schema you want, from simple to
          complex.
        </li>
        <li>
          <b>Power :</b> Built on the MEAN stack, ensuring robust performance
          and scalability.
        </li>
        <li>
          <b>Ease of Use :</b> User-friendly interface makes data management a
          breeze.
        </li>
        <li>
          {" "}
          <b>Fun :</b> Because who said CRUD operations can't be entertaining?
        </li>
      </ul>
      <h2 className="text-3xl font-bold mb-8 text-black">
        You got it! Want to organize your cat's birthday party? Um,
      </h2>
      <div className="space-y-3">
        <label htmlFor="exampleSelect">
          <h2>
            {" "}
            <b>Lazy as me?</b>... Choose from readyMate schema:{" "}
          </h2>
        </label>
        <select
          className="w-50 p-2 border rounded-md bg-[#dee2e6]"
          id="exampleSelect"
          onChange={handleExampleSelect}
        >
          <option className="bg-white text-black" value="default">
            Custom
          </option>
          <option className="bg-white text-black" value="tasks">
            Task
          </option>
          <option className="bg-white text-black" value="student">
            Student
          </option>
          <option className="bg-white text-black" value="product">
            Product
          </option>
          <option className="bg-white text-black" value="event">
            Event
          </option>
        </select>
      </div>
      <div className="w-full bg-white max-w-2xl bg-gray-100 p-8 rounded-lg">
        <form className="flex-col space-y-5" onSubmit={handleSubmit}>
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
            className="w-40 bg-[#343a40] hover:bg-gray-800 text-white"
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
