<script setup lang="ts"></script>

<style scoped>
footer {
  width: 100%;
  margin-top: auto;
}

#logo {
  width: 150px;
}
.top-container {
  background: var(--light-grey);
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}

.top-container .links {
  font-size: 16px;
  align-self: center;
}

.top-container a,
a:visited {
  text-decoration: none;
  color: var(--dark-grey);
}
.top-container a:hover {
  color: var(--secondary-color-dark);
}
.separator {
  padding-left: 10px;
  padding-right: 10px;
}
.bottom-container {
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: whitesmoke;
  padding: 0.5rem 1rem;
}

.bottom-container a {
  color: whitesmoke;
  text-decoration: none;
}

.bottom-container a:hover {
  color: var(--secondary-color);
}
</style>

<template>
  <footer>
    <div class="top-container">
      <section class="links">
        <img id="logo" src="@/assets/logo/logo-transparent.png" />
      </section>
      <section class="links">
        <router-link to="/contact">Contact Us</router-link>
        <span class="separator"> | </span>
        <router-link to="/home">About Us</router-link>
        <span class="separator"> | </span>
        <router-link to="/home">Follow Us</router-link>
      </section>
    </div>
    <div class="bottom-container">
      <p>&copy; 2023 ShopSavvy. All Rights Reserved.</p>
      <div>
        <router-link to="/home">Terms & Conditions</router-link>
        <span class="separator"> | </span>
        <router-link to="/home">Privacy Policy</router-link>
      </div>
    </div>
  </footer>
</template>
