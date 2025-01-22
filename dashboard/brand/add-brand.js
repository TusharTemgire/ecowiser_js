document.addEventListener("DOMContentLoaded", () => {
    checkAuth();

    const form = document.getElementById("addBrandForm");
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

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const token = sessionStorage.getItem("sb:token");
    const formData = new FormData(form);

    const logoInput = document.getElementById("brandLogo");
    const logoFile = logoInput.files[0];
    if (logoFile) {
        formData.append("logo", logoFile);
    }

    try {
        const response = await fetch("https://ecowiser-flax.vercel.app/api/brands", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to add brand");
        }

        alert("Brand added successfully");
        window.location.href = "/dashboard/brand";
    } catch (error) {
        console.error("Error adding brand:", error);
        alert(error.message || "Failed to add brand");
    }
}
