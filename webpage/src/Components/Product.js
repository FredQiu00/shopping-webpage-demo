import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { CartContext } from './CartContext';
import { UserContext } from './UserContext';
import { updateQuantity, updatePurchaseHistory } from './CartDisplay';
import './Product.css';

const ProductCard = ({ product, fetchProducts }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const oneTimePurchase = async () => {
    try {
      // Update prod data
      const updatedQuantity = product.quantity - 1;
      if (updatedQuantity >= 0) {
        const response = await fetch('http://localhost:8000/api/products', {
          method: 'GET',
        });
        let data = await response.json();
        const siftedData = data.filter(item => item.quantity !== 0);
        const updatedProducts = siftedData.map((prod) => {
          if (prod._id === product._id) {
            // If it's the product being purchased, decrement quantity, increment sold, and add to record
            return { ...prod, quantity: updatedQuantity, sold: product.sold + 1, record: product.sold + 1 };
          } else {
            // If it's not the product being purchased, just add the last sold value (or 0 if there are no sales yet) to the record
            return { ...prod, record: prod.sold};
          }
        });
        await Promise.all(updatedProducts.map((prod) => updateQuantity(prod, prod.quantity, prod.sold, prod.record)));
        alert(`Checkout completed. Total price: $${product.price}`);
        fetchProducts();

        // Update User data
        let updatedHistory = { [product.prod_name]: 1 };
        await updatePurchaseHistory(user, [[updatedHistory]]);
      }
    } catch (err) {
      alert('An error occurred during checkout. Please try again.');
    }
  }

  return (
    <Card className="card">
      <Card.Body className="container">
        <img src={`${process.env.PUBLIC_URL}/images/${product.prod_name}.jpg`} alt={product.prod_name} className="product-image" />
        <Card.Title>{product.prod_name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">${product.price}</Card.Subtitle>
        <Card.Text>{product.description}</Card.Text>
        <div className="button-container">
          <Button variant="primary" onClick={() => addToCart(product)}>
            Add to Cart
          </Button>
          <Button variant="success" onClick={oneTimePurchase}>
            Buy Now
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
