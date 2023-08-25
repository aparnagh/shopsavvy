<script setup lang="ts">
import router from "@/router";
import { Icon } from "@iconify/vue";
import { useCartStore } from "@/stores/CartStore";
import { useAccountStore } from "@/stores/AccountStore";

const cartStore = useCartStore();
const accountStore = useAccountStore();

const viewCart = () => {
  router.push({ name: "cart" });
};

const logOut = () => {
  accountStore.logOutUser();
  router.push({ name: "login-page" });
};
</script>

<style scoped>
header {
  background: var(--primary-color);
  display: flex;
  flex-direction: row;
  padding: 1em;
  gap: 1em;
  justify-content: space-between;
}

.store-logo {
  color: whitesmoke;
}

.account-cart {
  color: whitesmoke;
  justify-content: flex-end;
  display: flex;
  gap: 30px;
}

a {
  color: whitesmoke;
  text-decoration: none;
}

a:hover {
  color: var(--secondary-color);
}
.icon {
  width: 40px;
  height: 30px;
  position: relative;
  top: 1px;
  cursor: pointer;
  margin-right: 7px;
}

.icon:hover {
  color: var(--secondary-color);
}

#brand {
  text-decoration: none;
}

#brand:hover {
  color: whitesmoke;
}
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: whitesmoke;
  min-width: 7.8em;
  box-shadow: 0em 0.25em 1em 0em rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.link {
  color: black;
  padding: 0.5em 1em;
  text-decoration: none;
  display: block;
  border-bottom: 0.01em solid black;
}

.link:hover {
  color: var(--tertiary-color);
  font-weight: bold;
}

.account-icon {
  padding-left: 6.5em;
}

.cart-count {
  position: absolute;
  top: 10px;
  right: 1.5rem;
  background-color: #7c377d;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <header class="container">
    <section class="store-logo">
      <h1><router-link id="brand" to="/home">ShopSavvy</router-link></h1>
    </section>
    <section class="account-cart">
      <div class="dropdown">
        <div class="account-icon">
          <span>
            <Icon class="icon" icon="mdi:user-circle-outline"></Icon
          ></span>
        </div>
        <div class="dropdown-content">
          <router-link class="link" to="/account"> My Account </router-link>
          <router-link class="link" to="/lists"> Saved Carts </router-link>
          <span class="link" @click="logOut()"> Log Out </span>
        </div>
      </div>
      <div>
        <Icon
          class="icon"
          icon="ic:outline-shopping-cart"
          @click="viewCart()"
        ></Icon>
      </div>
      <div class="cart-count">{{ cartStore.count }}</div>
    </section>
  </header>
</template>
