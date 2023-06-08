import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { CartContext } from './CartContext';
import { updateQuantity } from './CartDisplay';
import './Product.css';

const ProductCard = ({ product, fetchProducts }) => {
  const { addToCart } = useContext(CartContext);

  const oneTimePurchase = () => {
    try {
      const updatedQuantity = product.quantity - 1;
      if (updatedQuantity >= 0) {
        updateQuantity(product, updatedQuantity);
        alert(`Checkout completed. Total price: $${product.price}`);
        fetchProducts();
      }
    } catch (err) {
      alert('An error occurred during checkout. Please try again.');
    }
  }

  return (
    <Card className="card">
      <Card.Body className="container">
        <Card.Title>{product.prod_name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">${product.price}</Card.Subtitle>
        <Card.Text>{product.description}</Card.Text>
        <div className="button-container">
          <Button variant="primary" onClick={() => addToCart(product)}>
            Add to Cart
          </Button>
          <Button variant="success" onClick={oneTimePurchase}>Buy Now</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
