<script setup lang="ts">
import router from "@/router";
import axios from "axios";
import { toast, ToastOptions } from "vue3-toastify";
import { useAccountStore } from "@/stores/AccountStore";

const accountStore = useAccountStore();

const toastOptions = {
  autoClose: 3000,
  type: toast.TYPE.INFO,
  hideProgressBar: false,
  position: toast.POSITION.TOP_RIGHT,
  toastStyle: {
    fontSize: "1rem",
    fontFamily: "Raleway",
  },
  style: {
    width: "18rem",
  },
} as ToastOptions;

function showFailedToast() {
  toast.error(
    "The email or password you entered is incorrect. Please try again.",
    toastOptions as ToastOptions
  );
}

function showServerErrorToast() {
  toast.warning(
    "An unexpected error occurred, please try again.",
    toastOptions as ToastOptions
  );
}

async function logIn() {
  const usernameElement = document.getElementById(
    "username"
  ) as HTMLInputElement;
  let username = usernameElement.value;
  const pwElement = document.getElementById("password") as HTMLInputElement;
  let password = pwElement.value;

  const options = {
    method: "POST",
    url: "http://localhost:3000/auth",
    data: { username: username, password: password },
  };

  axios
    .request(options)
    .then((response) => {
      if (response.status == 200) {
        const accountDetails = response.data[0];

        accountStore.setAccountDetails(
          accountDetails.name,
          accountDetails.email,
          accountDetails.gasMileage,
          accountDetails._id
        );

        accountStore.logInUser();

        router.push({ name: "home" });
      }
    })
    .catch((error) => {
      if (error.response.status == 401) {
        showFailedToast();
      } else {
        showServerErrorToast();
      }
    });
}
</script>

<style scoped>
html,
body {
  background: var(--primary-color) !important;
  justify-content: center;
  align-items: center;
}

.center-container {
  display: flex;
  align-items: center;
  height: 100vh;
  justify-content: center;
  background: var(--primary-color) !important;
}

h1 {
  font-weight: normal;
  display: grid;
  text-align: center;
  color: var(--accent-text-color);
  padding-bottom: 20px;
}

.login-card {
  display: flex;
  height: 34em;
  background: var(--primary-color);
  font-size: 16px;
  justify-content: center;
}

.form {
  flex-direction: column;
  align-items: center;
  background-color: whitesmoke;
  padding-top: 40px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  width: 50%;
  padding-left: 50px;
  padding-right: 50px;
}

.form h2 {
  font-family: var(-- --title-font-family);
  margin: 40px;
}

.box {
  padding: 10px 15px;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 1px solid #5a5a5a;
  outline: none;
  border-radius: 1.5rem;
}

#submit {
  padding: 12px 30px;
  width: 40%;
  margin-top: 25px;
  background-color: var(--tertiary-color);
  color: white;
  font-weight: bold;
  border: none;
  outline: none;
  border-radius: 20px;
}

#submit:hover {
  cursor: pointer;
  background-color: var(--tertiary-color-dark);
}
.form a {
  text-decoration: none;
  display: block;
  color: var(--accent-text-color);
}

.form a:hover {
  text-decoration: underline;
}

/* Left Side */
.side {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
.side img {
  opacity: 0.85;
  height: 100%;
  width: 100%;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.inputs {
  display: block;
  text-align: center;
  margin-top: 25px;
}

#shop-name {
  font-size: 36px;
  font-weight: bold;
}

.forgot-pw {
  font-size: 13px;
  text-align: right;
  color: var(--accent-text-color);
  margin-top: 10px !important;
}

#signup-link {
  margin-top: 2rem;
}

#signup {
  margin-top: 2rem;
}

#error-msg {
  color: red;
  font-size: 14px;
}
</style>

<template>
  <div class="center-container">
    <div class="login-card">
      <div class="side">
        <img
          alt="ShopSavvy Shopping Bag"
          src="@/assets/images/shopsavvybag.jpg"
        />
      </div>
      <form @submit.prevent="logIn" class="form" id="loginForm">
        <h1>Welcome to <span id="shop-name"> ShopSavvy!</span></h1>
        <div class="inputs">
          <input
            type="email"
            name="email"
            id="username"
            class="box"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            id="password"
            class="box"
            placeholder="Password"
          />
          <br />
          <a class="forgot-pw" href="#">Forgot Password?</a>
          <br />
          <input type="submit" value="Sign In" id="submit" onsubmit="logIn()" />
          <br />
          <router-link to="/signup" id="signup" href="#"
            >Don't Have An Account? Sign Up.</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>
