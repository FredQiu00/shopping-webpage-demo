import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { CartContext } from './CartContext';
import './Product.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

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
          <Button variant="success">Buy Now</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
