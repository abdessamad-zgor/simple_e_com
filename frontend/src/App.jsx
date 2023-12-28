import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(()=>{
    fetch('http://localhost:8080/api.php')
    .then(res=>res.json())
    .then(prods=>setProducts(prods.map(p=>({_id: p._id.$oid, ...p}))))
  }, [])

  const handleAddProduct = (newProduct) => {
    fetch('http://localhost:8080/api.php', {
      method: 'POST',
      body: JSON.stringify(newProduct)
    }).then((p)=>{
      let new_p = {_id: p.id.$oid, ...p}
      setProducts([...products, {...new_p }]);
      setAddModalOpen(false);
    })
  };

  const handleEditProduct = (editedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === selectedProductId ? { ...product, ...editedProduct } : product
      )
    );
    setAddModalOpen(false);
  };

  const handleDeleteProduct = () => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== selectedProductId)
    );
    setDeleteModalOpen(false);
  };

  return (
    <div className="App">
      <h1>Product List</h1>
      <button onClick={() => setAddModalOpen(true)}>Add Product</button>
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.title} />
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
          <button onClick={() => setSelectedProductId(product.id)}>Edit</button>
          <button onClick={() => setDeleteModalOpen(true)}>Delete</button>
        </div>
      ))}

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setAddModalOpen(false)}
        contentLabel="Add Product Modal"
      >
        <AddEditProductModal
          onClose={() => setAddModalOpen(false)}
          onSubmit={selectedProductId ? handleEditProduct : handleAddProduct}
          selectedProduct={selectedProductId ? products.find((p) => p.id === selectedProductId) : null}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        contentLabel="Delete Confirmation Modal"
      >
        <DeleteConfirmationModal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteProduct}
        />
      </Modal>
    </div>
  );
};



const AddEditProductModal = (props) => {
  const { onClose, onSubmit, selectedProduct } = props
  const [title, setTitle] = useState(selectedProduct?.title || '');
  const [price, setPrice] = useState(selectedProduct?.price || '');
  const [description, setDescription] = useState(selectedProduct?.description || '');
  const [image, setImage] = useState(selectedProduct?.image || '');

  const handleSubmit = () => {
    onSubmit({ title, price, description, image });
  };

  return (
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{selectedProduct ? 'Edit Product' : 'Add Product'}</h2>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <label>Image URL:</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        <button onClick={handleSubmit}>{selectedProduct ? 'Edit' : 'Add'}</button>
      </div>
  );
};

AddEditProductModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedProduct: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string,
  }),
};

const DeleteConfirmationModal = (props) => {
  const { onClose, onConfirm } = props
  return (
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Delete Product</h2>
        <p>Are you sure you want to delete this product?</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
  );
};
DeleteConfirmationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
export default App;
