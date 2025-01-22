document.addEventListener("DOMContentLoaded", () => {
    // checkAuth();
    populateBrands();
    loadProductDetails();

    const form = document.getElementById("editProductForm");
    form.addEventListener("submit", handleFormSubmit);

    document.getElementById("dropzone").addEventListener("click", function () {
        document.getElementById("productImage").click();
    });

    document.getElementById("productImage").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById("previewImage").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

// Check authentication
function checkAuth() {
    const token = sessionStorage.getItem("sb:token");
    if (!token) {
        window.location.href = "/auth/login.html";
    }
}

// Get product ID from URL
function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

// Populate brand options
async function populateBrands() {
    const token = sessionStorage.getItem("sb:token");
    const brandSelect = document.getElementById("productBrand");

    try {
        const response = await fetch("https://ecowiser-flax.vercel.app/api/brands", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch brands");
        }

        const data = await response.json();
        data.brands.forEach((brand) => {
            const option = document.createElement("option");
            option.value = brand.name;
            option.textContent = brand.name;
            brandSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching brands:", error);
        alert("Failed to load brands");
    }
}

// Load product details
async function loadProductDetails() {
    const productId = getProductId();
    const token = sessionStorage.getItem("sb:token");

    try {
        const response = await fetch(`https://ecowiser-flax.vercel.app/api/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch product details");
        }

        const { product } = await response.json();

        document.getElementById("productName").value = product.name;
        document.getElementById("productDescription").value = product.description;
        document.getElementById("productCategory").value = product.category;
        document.getElementById("productBrand").value = product.brand;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("previewImage").src = product.image;
    } catch (error) {
        console.error("Error loading product details:", error);
        alert("Failed to load product details");
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const productId = getProductId();
    const form = event.target;
    const token = sessionStorage.getItem("sb:token");
    const formData = new FormData(form);

    const imageInput = document.getElementById("productImage");
    const imageFile = imageInput.files[0];
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        const response = await fetch(`https://ecowiser-flax.vercel.app/api/products/${productId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to update product");
        }

        alert("Product updated successfully");
        window.location.href = "/dashboard/product";
    } catch (error) {
        console.error("Error updating product:", error);
        alert(error.message || "Failed to update product");
    }
}
