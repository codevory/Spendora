const signUpForm = document.getElementById("signup-form");

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("full-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const username = document.getElementById("userName").value.trim();
  const password = document.getElementById("register-password").value.trim();
  let currency = new FormData(e.target).get("currency");
  const errorMessage = document.getElementById("register-form-error-message");
  let userLabel = document.getElementById("user-label");

  userLabel.textContent = "Guest!";
  errorMessage.textContent = "";
  console.log(currency);
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        username,
        password,
        currency,
      }),
    });
    const userResp = await fetch("/");
    const user = await userResp.json();
    console.log(user);

    const data = await res.json();
    if (res.ok) {
      errorMessage.textContent = res.message;
      window.location.href = "/";
    } else {
      errorMessage.textContent =
        data.error || "Registration failed ,kindly try again";
    }
  } catch (err) {
    console.error("Network error:", err);
    errorMessage.textContent = "Unable to connect. Please try again.";
  }
});
