document.addEventListener("DOMContentLoaded", () => {
//   checkAuth();
  loadProducts();

  // Event Listeners
//   const logoutBtn = document.getElementById("logoutBtn");
//   if (logoutBtn) {
//       logoutBtn.addEventListener("click", handleLogout);
//   }

  const productSearch = document.getElementById("productSearch");
  const clearProductSearch = document.getElementById("clearProductSearch");
  productSearch.addEventListener("input", handleSearch);
  clearProductSearch.addEventListener("click", clearSearch);

  const selectAllCheckbox = document.getElementById("selectAll");
  selectAllCheckbox.addEventListener("change", handleSelectAll);

  const deleteSelectedBtn = document.getElementById("deleteSelected");
  deleteSelectedBtn.addEventListener("click", deleteSelectedProducts);
});

// Authentication check
function checkAuth() {
  const token = sessionStorage.getItem("sb:token");
  if (!token) {
      window.location.href = "/auth/login.html"; // Redirect to login if no token
  }
}

// Load products
async function loadProducts() {
  const token = sessionStorage.getItem("sb:token");
  try {
      const response = await fetch("https://ecowiser-flax.vercel.app/api/products", {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching products:", errorData.message);
          alert(errorData.message || "Failed to fetch products");
          return;
      }

      const data = await response.json();
      renderProducts(data.products);
  } catch (error) {
      console.error("Error loading products:", error);
      alert("An error occurred while loading products");
  }
}

// Render products in the table
function renderProducts(products) {
  const tableBody = document.getElementById("productsTableBody");
  tableBody.innerHTML = ""; // Clear existing rows

  if (!products || products.length === 0) {
      tableBody.innerHTML = `
          <tr>
              <td colspan="7" class="text-center">No products available</td>
          </tr>
      `;
      return;
  }

  products.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>
              <input type="checkbox" class="product-checkbox" value="${product._id}" />
          </td>
          <td>
              <img sty src="${product.image}" alt="${product.name}" class="product-image" />
          </td>
          <td>${product.name}</td>
          <td>${product.brand}</td>
          <td>${product.category}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>
              <button onclick="editProduct('${product._id}')" class="btn btn-icon">
                  <i class="fas fa-edit"></i>
              </button>
              <button onclick="deleteProduct('${product._id}')" class="btn btn-icon text-danger">
                  <i class="fas fa-trash"></i>
              </button>
          </td>
      `;
      tableBody.appendChild(row);
  });
}

// Search functionality
function handleSearch(e) {
  const searchValue = e.target.value.toLowerCase();
  const clearBtn = document.getElementById("clearProductSearch");
  clearBtn.classList.toggle("hidden", !searchValue);

  const rows = document.querySelectorAll("#productsTableBody tr");
  rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchValue) ? "" : "none";
  });
}

function clearSearch() {
  const searchInput = document.getElementById("productSearch");
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input"));
}

// Select all checkbox functionality
function handleSelectAll(e) {
  const checkboxes = document.querySelectorAll(".product-checkbox");
  checkboxes.forEach((checkbox) => (checkbox.checked = e.target.checked));
  updateSelectedActions();
}

function updateSelectedActions() {
  const selectedProducts = document.querySelectorAll(".product-checkbox:checked");
  const selectedActions = document.getElementById("selectedActions");
  const selectedCount = document.getElementById("selectedCount");

  selectedActions.classList.toggle("hidden", selectedProducts.length === 0);
  selectedCount.textContent = selectedProducts.length;
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const token = sessionStorage.getItem("sb:token");
  try {
      const response = await fetch(`https://ecowiser-flax.vercel.app/api/products/${productId}`, {
          method: "DELETE",
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error("Failed to delete product");
      }

      alert("Product deleted successfully");
      loadProducts();
  } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product");
  }
}

// Edit product
function editProduct(productId) {
  window.location.href = `/dashboard/product/edit-product.html?id=${productId}`;
}

// Delete selected products
async function deleteSelectedProducts() {
  if (!confirm("Are you sure you want to delete the selected products?")) return;

  const token = sessionStorage.getItem("sb:token");
  const selectedCheckboxes = document.querySelectorAll(".product-checkbox:checked");
  const productIds = Array.from(selectedCheckboxes).map((checkbox) => checkbox.value);

  try {
      const deletePromises = productIds.map((id) =>
          fetch(`https://ecowiser-flax.vercel.app/api/products/${id}`, {
              method: "DELETE",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          })
      );

      await Promise.all(deletePromises);
      alert("Selected products deleted successfully");
      loadProducts();
  } catch (error) {
      console.error("Error deleting selected products:", error);
      alert("An error occurred while deleting the selected products");
  }
}

// Logout
// function handleLogout() {
//   sessionStorage.removeItem("sb:token");
//   window.location.href = "/auth/login.html";
// }
