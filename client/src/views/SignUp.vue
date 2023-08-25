<script setup lang="ts">
import { toast, ToastOptions } from 'vue3-toastify';
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  helpers,
  maxLength,
  minLength,
  required,
  email,
  maxValue,
  minValue,
} from "@vuelidate/validators";
import { isValidPassword } from "@/utils";
import router from "@/router";
import axios from "axios";

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  carMPG: "",
});

const rules = {
  name: {
    required: helpers.withMessage("Please provide a name.", required),
    minLength: helpers.withMessage(
      "Name must have at least 2 letters.",
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      "Name can have at most 45 letters.",
      maxLength(45)
    ),
  },
  email: {
    required: helpers.withMessage("Please provide an email.", required),
    email: helpers.withMessage("Please provide a valid email.", email),
  },
  password: {
    required: helpers.withMessage("Please provide a password.", required),
    password: helpers.withMessage(
      "Please enter a password that contains at least one uppercase letter, one lowercase letter, one number, and one special character.",
      (value: string) => !helpers.req(value) || isValidPassword(value)
    ),
  },
  confirmPassword: {
    required: helpers.withMessage("Please re-enter your password.", required),
    sameAs: helpers.withMessage(
      "Passwords do not match.",
      (value: string) => (value === form.password)
    ),
  },
  carMPG: {
    maxValue: helpers.withMessage(
      "Please enter a valid car MPG.",
      maxValue(65)
    ),
    minValue: helpers.withMessage("Please enter a valid car MPG.", minValue(0)),
  },
};

const $v = useVuelidate(rules, form);

const options = {
  autoClose: 3000,
  type: toast.TYPE.INFO,
  hideProgressBar: false,
  position: toast.POSITION.TOP_RIGHT,
  toastStyle: {
    fontSize: '1rem',
    fontFamily: "Raleway",
  },
  style: {
    width: '18rem'
  }
} as ToastOptions;

function showSuccessToast() {
  toast.success('Account Created! You will be redirected to Login shortly.', options as ToastOptions)
}

function showFailedToast() {
  toast.error('An account with this email already exists.', options as ToastOptions)
}

function showServerErrorToast() {
  toast.warning('An unexpected error occurred, please try again.', options as ToastOptions)
}

function showFormErrorToast() {
  toast.error('Error: Please fix the problems below and try again.', options as ToastOptions)
}

async function signUp() {
  const isFormCorrect = await $v.value.$validate();
  if (!isFormCorrect) {
    showFormErrorToast()
  } else {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var dateStr = mm + '/' + dd + '/' + yyyy;

    const options = {
    method: 'POST', 
    url: 'http://localhost:3000/account', 
    data: {"name": form.name,"email": form.email,"password": form.password,"gasMileage": form.carMPG, "dateOfCreation": dateStr}
  } 
  // verify that the account was created successfully
  axios.request(options).then((response) => {
    if (response.status == 200) {
      // redirect them to home page
      showSuccessToast()
      setTimeout(() => router.push({name: "login-page"}), 3000);
    }
  }).catch((error) => {
    if (error.response.status == 401) {
      showFailedToast()
    }
    else {
      showServerErrorToast()
    }
  })
  }
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

.signup-page {
  display: flex;
  width: 100%;
  height: 34rem;
  background: var(--primary-color);
  font-size: 16px;
  justify-content: center;
  width: 70vw;
}

/* Sign Up Form */
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
  font-family: var(--title-font-family);
  margin: 40px;
}

.box {
  padding: 10px 15px;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 5px;
  border: 1px solid #5a5a5a;
  outline: none;
  border-radius: 1.5rem;
}

#submit {
  padding: 12px 30px;
  width: 40%;
  margin-top: 0.65em;
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

#signin-link {
  margin-top: 3em;
  margin-bottom: 3rem;
}

.error {
  color: red;
  text-align: right;
  font-size: 0.6rem;
  font-style: italic;
  margin-top: 0.1em;
  font-size: small;
}

#login-page {
  margin-top: 1rem;
}
</style>

<template>
  <div class="center-container">
    <div class="signup-page">
      <div class="side">
        <img alt="ShopSavvy Shopping" src="@/assets/images/shopsavvybag.jpg" />
      </div>
      <form @submit.prevent="signUp" class="form">
        <h1>Welcome to <span id="shop-name"> ShopSavvy!</span></h1>
        <div class="inputs">
          <div>
            <input
              type="text"
              name="name"
              class="box"
              placeholder="Name"
              v-model.lazy="$v.name.$model"
            />
            <template v-if="$v.name.$error">
              <span
                class="error"
                v-for="error of $v.name.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}</span
              >
            </template>
          </div>
          <div>
            <input
              type="email"
              name="email"
              class="box"
              placeholder="Email"
              v-model.lazy="$v.email.$model"
            />
            <template v-if="$v.email.$error">
              <span
                class="error"
                v-for="error of $v.email.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}</span
              >
            </template>
          </div>
          <div>
            <input
              type="password"
              name="password"
              class="box"
              placeholder="Password"
              v-model.lazy="$v.password.$model"
            />
            <template v-if="$v.password.$error">
              <span
                class="error"
                v-for="error of $v.password.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}</span
              >
            </template>
          </div>
          <div>
            <input
              type="password"
              id="confirmPassword"
              name="re-enter password"
              class="box"
              placeholder="Re-enter Password"
              v-model.lazy="$v.confirmPassword.$model"
            />
            <template v-if="$v.confirmPassword.$error">
              <span
                class="error"
                v-for="error of $v.confirmPassword.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}</span
              >
            </template>
          </div>
          <div>
            <input
              type="text"
              id="carMPG"
              name="mpg"
              class="box"
              placeholder="Car MPG (Optional)"
              v-model.lazy="$v.carMPG.$model"
            />
            <template v-if="$v.carMPG.$error">
              <span
                class="error"
                v-for="error of $v.carMPG.$errors"
                :key="error.$uid"
              >
                {{ error.$message }}</span
              >
            </template>
          </div>
          <input type="submit" value="Sign Up" id="submit" />
          <br />
          <router-link to="/login" id="login-page"
            >Already a Member? Sign In.</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>
