import React from 'react';
import ProductCard from './Product';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'GET',
      });
      console.log(response);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  return (
    <div className="products-container">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
