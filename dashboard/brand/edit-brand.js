document.addEventListener("DOMContentLoaded", () => {
    // checkAuth();
    loadBrandDetails();

    const form = document.getElementById("editBrandForm");
    form.addEventListener("submit", handleFormSubmit);

    document.getElementById("dropzone").addEventListener("click", function () {
        document.getElementById("brandLogo").click();
    });

    document.getElementById("brandLogo").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById("previewLogo").src = e.target.result;
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

// Get brand ID from URL
function getBrandId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

// Load brand details
async function loadBrandDetails() {
    const brandId = getBrandId();
    const token = sessionStorage.getItem("sb:token");

    try {
        const response = await fetch(`https://ecowiser-flax.vercel.app/api/brands/${brandId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch brand details");
        }

        const { brand } = await response.json();

        document.getElementById("brandName").value = brand.name;
        document.getElementById("brandDescription").value = brand.description;
        document.getElementById("previewLogo").src = brand.logo;
    } catch (error) {
        console.error("Error loading brand details:", error);
        alert("Failed to load brand details");
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const brandId = getBrandId();
    const form = event.target;
    const token = sessionStorage.getItem("sb:token");
    const formData = new FormData(form);

    const logoInput = document.getElementById("brandLogo");
    const logoFile = logoInput.files[0];
    if (logoFile) {
        formData.append("logo", logoFile);
    }

    try {
        const response = await fetch(`https://ecowiser-flax.vercel.app/api/brands/${brandId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to update brand");
        }

        alert("Brand updated successfully");
        window.location.href = "/dashboard/brand";
    } catch (error) {
        console.error("Error updating brand:", error);
        alert(error.message || "Failed to update brand");
    }
}
