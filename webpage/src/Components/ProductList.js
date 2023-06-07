import React from 'react';
import ProductCard from './Product';
import './ProductList.css';

const ProductList = () => {
  const products = [
    { id: 1, name: 'Product 1', description: 'This is product 1', price: 10 },
    { id: 2, name: 'Product 2', description: 'This is product 2', price: 20 },
    { id: 3, name: 'Product 3', description: 'This is product 3', price: 30 },
    { id: 4, name: 'Product 4', description: 'This is product 4', price: 40 },
    { id: 5, name: 'Product 5', description: 'This is product 5', price: 50 },
  ];

  return (
    <div className="products-container">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
