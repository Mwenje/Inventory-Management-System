const API_BASE_URL = "http://localhost:5000/api";
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const logout = document.getElementById("logout");
const productForm = document.getElementById("productForm");

// Handle Login
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "dashboard.html";
  } else {
    alert(data.error);
  }

  // Handle Registration
  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("registerRole").value;

    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registration successful, please login!");
    } else {
      alert(data.error);
    }
  });
});

// Handle Logout
logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
});

// Check User Role & Load Products
window.onload = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("userName").innerText = user.name;
  document.getElementById("userRole").innerText = user.role;

  if (user.role === "admin") {
    document.getElementById("adminSection").style.display = "block";
  }

  const res = await fetch(`${API_BASE_URL}/products`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const products = await res.json();
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerText = `${product.name} - $${product.price}`;
    productList.appendChild(li);
  });

  // Handle Adding Products (Admin Only)
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;

    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, price }),
    });

    if (res.ok) {
      alert("Product added!");
      window.location.reload();
    } else {
      alert("Failed to add product.");
    }
  });
};
