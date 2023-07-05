import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ModifyProduct from './ModifyProduct';
import './ServerManage.css';
import SearchBar from './SearchBar';
import ProductInfoTable from './ProductInfoTable';

const ProdServer = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [addItem, setAddItem] = useState(false);
  const [modifyItem, setModifyItem] = useState(null);

  useEffect(() => {
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

  useEffect(() => {
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
        `http://localhost:8000/api/products/update-inventory/${itemId}`,
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
      <SearchBar
        category="product"
        allProducts={allProducts}
        setModifyItem={setModifyItem}
        handleDelete={handleDelete}
      />
      <ProductInfoTable allProducts={allProducts} setModifyItem={setModifyItem} handleDelete={handleDelete} />
      <Button className='back-button' onClick={() => navigate('/admin')}>
        Back
      </Button>
      <Button className="add-item" onClick={() => setAddItem(true)}>
        Add Item
      </Button>
      <Button className="stat" onClick={() => navigate('./stats')}>
        View Stats
      </Button>
      <Button className="logoff-button" onClick={() => navigate('/login')}>
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

export default ProdServer;