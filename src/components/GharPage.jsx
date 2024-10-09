import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./Card";
import Button from "./Button";
import Input from "./Input";
import { Pencil, Trash2 } from "lucide-react";

function GharPage() {
  const [schema, setSchema] = useState([]);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({});
  const [schemaType, setSchemaType] = useState("Custom");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const savedSchema = JSON.parse(localStorage.getItem("userSchema") || "[]");
    const savedSchemaType = localStorage.getItem("schemaType") || "Custom";
    setSchema(savedSchema);
    setSchemaType(savedSchemaType);
    const initialNewItem = savedSchema.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {});
    setNewItem(initialNewItem);
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({ ...editingItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateItem(editingItem);
      } else {
        await createItem(newItem);
      }
      fetchItems();
      // Reset newItem to initial state based on schema
      const resetNewItem = schema.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {});
      setNewItem(resetNewItem);
      setEditingItem(null);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  const createItem = async (item) => {
    const response = await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error("Failed to create item");
    }
  };

  const updateItem = async (item) => {
    const response = await fetch(
      `http://localhost:5000/api/items/${item._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update item");
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderInputField = (field, value, onChange) => {
    switch (field.type) {
      case "Number":
        return (
          <Input
            key={field.name}
            name={field.name}
            type="number"
            placeholder={field.name}
            value={value}
            onChange={onChange}
          />
        );
      case "Date":
        return (
          <Input
            key={field.name}
            name={field.name}
            type="date"
            placeholder={field.name}
            value={value}
            onChange={onChange}
          />
        );
      case "Boolean":
        return (
          <div key={field.name}>
            <label>
              {field.name}:
              <input
                type="checkbox"
                name={field.name}
                checked={value}
                onChange={(e) =>
                  onChange({
                    target: { name: field.name, value: e.target.checked },
                  })
                }
              />
            </label>
          </div>
        );
      default:
        return (
          <Input
            key={field.name}
            name={field.name}
            type="text"
            placeholder={field.name}
            value={value}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col space-y-6 items-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-black">
        {schemaType} CRUD Operations
      </h1>
      <div className="w-full max-w-2xl bg-gray-200 p-8 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {schema.map((field) =>
            renderInputField(
              field,
              (editingItem || newItem)[field.name],
              handleInputChange
            )
          )}
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white"
            type="submit"
          >
            {editingItem ? "Update" : "Add"} Item
          </Button>
          {editingItem && (
            <Button type="button" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
          )}
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <CardTitle> </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(item).map(
                ([key, value]) =>
                  key !== "_id" &&
                  key !== "__v" && (
                    <p key={key}>
                      {key}: {value.toString()}
                    </p>
                  )
              )}
            </CardContent>
            <CardFooter className="flex space-x-10">
              <Button
                className="mr-2 bg-black hover:bg-black text-white"
                onClick={() => setEditingItem(item)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                className="bg-black hover:bg-black text-white"
                onClick={() => deleteItem(item._id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GharPage;

// import React, { useState, useEffect } from 'react';
// import Button from './Button';
// import Input from './Input';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
// import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:5000/api';

// export default function HomePage() {
//   const [items, setItems] = useState([]);
//   const [newItem, setNewItem] = useState({ name: '', description: '' });
//   const [editingItem, setEditingItem] = useState(null);

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/items`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setItems(data);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//     }
//   };

//   const handleAddItem = async () => {
//     if (newItem.name && newItem.description) {
//       try {
//         const response = await fetch(`${API_BASE_URL}/items`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newItem),
//         });
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         setNewItem({ name: '', description: '' });
//         fetchItems();
//       } catch (error) {
//         console.error('Error adding item:', error);
//       }
//     }
//   };

//   const handleUpdateItem = async (id) => {
//     if (editingItem) {
//       try {
//         const response = await fetch(`${API_BASE_URL}/items/${id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(editingItem),
//         });
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         setEditingItem(null);
//         fetchItems();
//       } catch (error) {
//         console.error('Error updating item:', error);
//       }
//     } else {
//       setEditingItem(items.find(item => item._id === id));
//     }
//   };

//   const handleDeleteItem = async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/items/${id}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       fetchItems();
//     } catch (error) {
//       console.error('Error deleting item:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6 text-center">CRUD App</h1>

//       <div className="mb-6 flex flex-col sm:flex-row gap-2">
//         <Input
//           placeholder="Item name"
//           value={newItem.name}
//           onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
//           className="flex-grow"
//         />
//         <Input
//           placeholder="Item description"
//           value={newItem.description}
//           onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
//           className="flex-grow"
//         />
//         <Button onClick={handleAddItem} className="w-full sm:w-auto">
//           <PlusCircle className="mr-2 h-4 w-4" /> Add Item
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {items.map((item) => (
//           <Card key={item._id}>
//             <CardHeader>
//               <CardTitle>
//                 {editingItem && editingItem._id === item._id ? (
//                   <Input
//                     value={editingItem.name}
//                     onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
//                   />
//                 ) : (
//                   item.name
//                 )}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {editingItem && editingItem._id === item._id ? (
//                 <Input
//                   value={editingItem.description}
//                   onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
//                 />
//               ) : (
//                 <p>{item.description}</p>
//               )}
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" size="sm" onClick={() => handleUpdateItem(item._id)}>
//                 <Pencil className="mr-2 h-4 w-4" /> {editingItem && editingItem._id === item._id ? 'Save' : 'Update'}
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item._id)}>
//                 <Trash2 className="mr-2 h-4 w-4" /> Delete
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
