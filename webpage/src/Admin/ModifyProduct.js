import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import styles from './ModifyProduct.module.css';

const ModifyProduct = ({ show, handleClose, handleAction, actionLabel, initialData }) => {
  const [prod_name, setProdName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = () => {
    const newItem = {
      ...initialData,
      prod_name,
      description,
      price,
      quantity
    };
    handleAction(newItem);
    resetDefault();
  };

  const handleCancel = () => {
    handleClose();
    resetDefault();
  };

  const resetDefault = () => {
    setProdName('');
    setDescription('');
    setPrice(0);
    setQuantity(0);
  };

  return (
    <div className={styles.modifyProductContainer}>
      <Modal show={show} onHide={handleClose} className="add-product-modal">
        <Modal.Header>
          <Modal.Title>{actionLabel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="prodName" className='form-group'>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={prod_name}
                onChange={(e) => setProdName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="description" className='form-group'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="price" className='form-group'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="quantity" className='form-group'>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModifyProduct;