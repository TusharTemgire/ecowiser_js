document.addEventListener("DOMContentLoaded", () => {
    // checkAuth();
    loadBrands();

    const searchInput = document.getElementById("brandSearch");
    const clearSearchBtn = document.getElementById("clearBrandSearch");
    searchInput.addEventListener("input", handleSearch);
    clearSearchBtn.addEventListener("click", clearSearch);

    const selectAllCheckbox = document.getElementById("selectAll");
    selectAllCheckbox.addEventListener("change", handleSelectAll);

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }

    const deleteSelectedBtn = document.getElementById("deleteSelected");
    deleteSelectedBtn.addEventListener("click", deleteSelectedBrands);
});

// Check authentication
function checkAuth() {
    const token = sessionStorage.getItem("sb:token");
    if (!token) {
        window.location.href = "/auth/login.html";
    }
}

// Load all brands
async function loadBrands() {
    const token = sessionStorage.getItem("sb:token");
    const brandsTableBody = document.getElementById("brandsTableBody");

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
        const brands = data.brands;

        brandsTableBody.innerHTML = ""; // Clear existing rows

        if (brands.length === 0) {
            brandsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No brands found</td>
                </tr>
            `;
            return;
        }

        brands.forEach(brand => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="checkbox" class="brand-checkbox" value="${brand._id}"></td>
                <td><img src="${brand.logo}" alt="${brand.name}" class="product-image"></td>
                <td>${brand.name}</td>
                <td>${brand.description}</td>
                <td>
                    <button class="btn-icon btn" onclick="editBrand('${brand._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn " onclick="deleteBrand('${brand._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            brandsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading brands:", error);
        alert("Failed to load brands");
    }
}

// Search functionality
function handleSearch(event) {
    const searchValue = event.target.value.toLowerCase();
    const clearBtn = document.getElementById("clearBrandSearch");
    clearBtn.classList.toggle("hidden", !searchValue);

    const rows = document.querySelectorAll("#brandsTableBody tr");
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? "" : "none";
    });
}

function clearSearch() {
    const searchInput = document.getElementById("brandSearch");
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
}

// Select all functionality
function handleSelectAll(event) {
    const checkboxes = document.querySelectorAll(".brand-checkbox");
    checkboxes.forEach(checkbox => checkbox.checked = event.target.checked);
    updateSelectedActions();
}

// Update selected actions visibility
function updateSelectedActions() {
    const selectedBrands = document.querySelectorAll(".brand-checkbox:checked");
    const selectedActions = document.getElementById("selectedActions");
    const selectedCount = document.getElementById("selectedCount");

    selectedActions.classList.toggle("hidden", selectedBrands.length === 0);
    selectedCount.textContent = selectedBrands.length;
}

// Edit brand
function editBrand(brandId) {
    window.location.href = `/dashboard/brand/edit-brand.html?id=${brandId}`;
}

// Delete brand
async function deleteBrand(brandId) {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    const token = sessionStorage.getItem("sb:token");

    try {
        const response = await fetch(`https://ecowiser-flax.vercel.app/api/brands/${brandId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete brand");
        }

        alert("Brand deleted successfully");
        loadBrands(); // Reload the brand list
    } catch (error) {
        console.error("Error deleting brand:", error);
        alert("Failed to delete brand");
    }
}

// Delete selected brands
async function deleteSelectedBrands() {
    const selectedCheckboxes = document.querySelectorAll(".brand-checkbox:checked");
    const brandIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

    if (brandIds.length === 0 || !confirm("Are you sure you want to delete selected brands?")) return;

    const token = sessionStorage.getItem("sb:token");

    try {
        const deletePromises = brandIds.map(id =>
            fetch(`https://ecowiser-flax.vercel.app/api/brands/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        );

        await Promise.all(deletePromises);
        alert("Selected brands deleted successfully");
        loadBrands();
    } catch (error) {
        console.error("Error deleting selected brands:", error);
        alert("Failed to delete selected brands");
    }
}

// Logout
function handleLogout() {
    sessionStorage.removeItem("sb:token");
    window.location.href = "/auth/login.html";
}
