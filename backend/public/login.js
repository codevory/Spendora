const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("login-form-error-message");
  const userLabel = document.getElementById("user-label");

  errorMessage.textContent = "";
  console.log(password);
  try {
    let res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      const userResp = await fetch("/api/auth/me");
      const userData = await userResp.json();
      console.log(userData);
      userLabel.textContent = ` ${userData.username}`;
    } else {
      errorMessage.textContent =
        data.error || "Failed to login,kindly try again";
    }
  } catch (error) {
    console.error(error.message);
  }
});
