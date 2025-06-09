import React, { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [stock, setStock] = useState("");
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const garageData = JSON.parse(localStorage.getItem("garageData"));
  const garageId = garageData.garageId;

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    setSelectedVariant(null);
    setStock("");
  }, [selectedProductId]);

  const selectedProduct = products.find((p) => p.productId === selectedProductId);
  const variantOptions = selectedProduct?.variants || [];
  const unit = selectedProduct?.productUnit || "";

  const handleAddProduct = () => {
    if (!selectedProductId) {
      alert("Please select a product");
      return;
    }

    const variantText = selectedVariant
      ? `${selectedVariant.variantType}: ${selectedVariant.variantValue}`
      : "No Variant";

    if (!stock || isNaN(stock) || Number(stock) <= 0) {
      alert("Please enter a valid stock amount");
      return;
    }

    console.log(selectedProduct)
    console.log(selectedVariant);
    

    const garageProductData = {
      garageId,
      productId: selectedProduct.productId,
      variantId: selectedVariant.variantId,
      stock: Number(stock),
      productUnit: unit,
    };

    fetch("http://localhost:8080/api/products/garage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(garageProductData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add product");
        return res.json();
      })
      .then(() => {
        setModalData({
          productName: selectedProduct.productName,
          productVariant: variantText,
        });
        setShowModal(true);
        setSelectedProductId("");
        setSelectedVariant(null);
        setStock("");
      })
      .catch((error) => alert(error.message));
  };

  // Close modal helper
  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div className="container mt-4">
      <h2>Add Product to Garage</h2>

      <div className="mb-3">
        <label htmlFor="productSelect" className="form-label">
          Select Product
        </label>
        <select
          id="productSelect"
          className="form-select"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">-- Select Product --</option>
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </select>
      </div>

      {selectedProductId && (
        <>
          <div className="mb-3">
            <label htmlFor="variantSelect" className="form-label">
              Select Variant
            </label>
            {variantOptions.length > 0 ? (
              <select
                id="variantSelect"
                className="form-select"
                value={selectedVariant ? selectedVariant.variantId : ""}
                onChange={(e) => {
                  const variantId = Number(e.target.value);
                  const variant = variantOptions.find((v) => v.variantId === variantId);
                  setSelectedVariant(variant);
                }}
              >
                <option value="">-- Select Variant --</option>
                {variantOptions.map((variant) => (
                  <option key={variant.variantId} value={variant.variantId}>
                    {variant.variantType}: {variant.variantValue}
                  </option>
                ))}
              </select>
            ) : (
              <input type="text" className="form-control" value="No Variant" disabled />
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="stockInput" className="form-label">
              Enter Stock ({unit})
            </label>
            <input
              type="number"
              id="stockInput"
              className="form-control"
              value={stock}
              min="0"
              onChange={(e) => setStock(e.target.value)}
              placeholder={`Enter number of ${unit.toLowerCase()}...`}
            />
          </div>

          <button className="btn btn-primary" onClick={handleAddProduct}>
            <PlusCircle size={20} className="me-1" />
            Add Product
          </button>
        </>
      )}

      {/* Modal */}
      {showModal && modalData && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
          onClick={closeModal}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5>Product Added</h5>
            <p>
              Product <b>{modalData.productName}</b> with variant <b>{modalData.productVariant}</b> added successfully.
            </p>
            <button
              className="btn btn-secondary"
              onClick={closeModal}
              style={{ position: "absolute", top: 10, right: 10 }}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
