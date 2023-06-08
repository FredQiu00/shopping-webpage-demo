import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ModifyProduct from './ModifyProduct';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [addItem, setAddItem] = useState(false);
  const [modifyItem, setModifyItem] = useState(null);

  React.useEffect(() => {
    fetchDB();
  }, []);

  const fetchDB = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'GET',
      });
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleDelete = (itemId) => {
    setDeleteItemId(itemId);
  };

  React.useEffect(() => {
    if (deleteItemId) {
      deleteProduct(deleteItemId);
    }
  }, [deleteItemId]);

  const deleteProduct = async (itemId) => {
    try {
      await fetch(`http://localhost:8000/api/products/${itemId}`, {
        method: 'DELETE',
      });
      setAllProducts((products) =>
        products.filter((product) => product._id !== itemId)
      );
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setDeleteItemId(null);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const data = await response.json();
        setAllProducts([...allProducts, data]);
      } else {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleUpdateItem = async (itemId, updatedItem) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedItem),
        }
      );
      if (response.ok) {
        setAllProducts((products) =>
          products.map((product) =>
            product._id === itemId ? updatedItem : product
          )
        );
      } else {
        throw new Error('Failed to update item');
      }
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Product List</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.prod_name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <Button
                  className="action-button change"
                  onClick={() => setModifyItem(product._id)}
                >
                  Change Context
                </Button>
                <Button
                  className="action-button delete"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete Item
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button className="add-item" onClick={() => setAddItem(true)}>
        Add Item
      </Button>
      <Button className="back-button" onClick={() => navigate('/')}>
        Log Off
      </Button>
      <ModifyProduct
        show={addItem}
        handleClose={() => setAddItem(false)}
        handleAction={handleAddItem}
        actionLabel="Add Item"
      />
      {modifyItem && (
        <ModifyProduct
          show={!!modifyItem}
          handleClose={() => setModifyItem(null)}
          handleAction={(updatedItem) =>
            handleUpdateItem(modifyItem, updatedItem)
          }
          actionLabel="Update Item"
          initialData={allProducts.find((product) => product._id === modifyItem)}
        />
      )}
    </div>
  );
};

export default Admin;