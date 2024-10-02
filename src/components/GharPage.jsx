import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    if (newItem.name && newItem.description) {
      try {
        const response = await fetch(`${API_BASE_URL}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setNewItem({ name: '', description: '' });
        fetchItems();
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleUpdateItem = async (id) => {
    if (editingItem) {
      try {
        const response = await fetch(`${API_BASE_URL}/items/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setEditingItem(null);
        fetchItems();
      } catch (error) {
        console.error('Error updating item:', error);
      }
    } else {
      setEditingItem(items.find(item => item._id === id));
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">CRUD App</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="flex-grow"
        />
        <Input
          placeholder="Item description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className="flex-grow"
        />
        <Button onClick={handleAddItem} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <CardTitle>
                {editingItem && editingItem._id === item._id ? (
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                ) : (
                  item.name
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingItem && editingItem._id === item._id ? (
                <Input
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              ) : (
                <p>{item.description}</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleUpdateItem(item._id)}>
                <Pencil className="mr-2 h-4 w-4" /> {editingItem && editingItem._id === item._id ? 'Save' : 'Update'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item._id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}