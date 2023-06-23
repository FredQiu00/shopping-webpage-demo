import React from 'react';
import { Button } from 'react-bootstrap';

const ProductInfoTable = ({ allProducts, setModifyItem, handleDelete }) => {

  return (
    <table className="info-table">
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
  );
};

export default ProductInfoTable;