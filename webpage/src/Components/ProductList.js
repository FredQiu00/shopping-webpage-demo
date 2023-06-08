import React from 'react';
import ProductCard from './Product';
import './ProductList.css';

const ProductList = ({products, fetchProducts}) => {
  const filteredProd = products.filter(product => product.quantity !== 0);

  return (
    <div className="products-container">
      {filteredProd.map(product => (
        <ProductCard key={product._id} product={product} fetchProducts={fetchProducts} />
      ))}
    </div>
  );
};

export default ProductList;
