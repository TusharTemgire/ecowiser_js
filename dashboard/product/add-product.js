document.addEventListener("DOMContentLoaded", () => {
    // checkAuth();
    populateBrands();

    const form = document.getElementById("addProductForm");
    form.addEventListener("submit", handleFormSubmit);
});

// Check authentication
function checkAuth() {
    const token = sessionStorage.getItem("sb:token");
    if (!token) {
        window.location.href = "/auth/login.html";
    }
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

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const token = sessionStorage.getItem("sb:token");

    // Create a new FormData object to handle the form input and file upload
    const formData = new FormData(form);

    // Get the file input element and append the file to FormData
    const imageInput = document.getElementById("productImage"); // Assuming the image input has this ID
    const imageFile = imageInput.files[0]; // Get the selected file

    if (imageFile) {
        formData.append("image", imageFile); // Append the file to the FormData object
    }

    try {
        const response = await fetch("https://ecowiser-flax.vercel.app/api/products", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,  // Pass the token here in the header
            },
            body: formData, // Send the FormData object, including the file
        });

        if (!response.ok) {
            throw new Error("Failed to save product");
        }

        alert("Product added successfully");
        window.location.href = "/dashboard/products";
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Failed to save product");
    }
}


document.getElementById("dropzone").addEventListener("click", function () {
    document.getElementById("productImage").click();
});