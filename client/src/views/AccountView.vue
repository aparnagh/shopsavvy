<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<script lang="ts">
import { Account } from "@/types";
import { defineComponent } from "vue";
import axios from "axios";
import { useAccountStore } from "@/stores/AccountStore";

const accountStore = useAccountStore();

export default defineComponent({
  data() {
    return {
      account: {} as Account,
      initial: "",
    };
  },
  mounted() {
    const id = accountStore.getAccountId;
    const options = {
      method: "GET",
      url: `http://localhost:3000/account/${id}`,
    };

    axios
      .request(options)
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          this.account = response.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
});

function getInitials(name: string) {
  var parts = name.split(" ");
  var initials = "";
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].length > 0 && parts[i] !== "") {
      initials += parts[i][0];
    }
  }
  return initials;
}
</script>

<style scoped>
.account-page {
  margin: 0 auto;
  width: clamp(350px, 90%, 1500px);
  padding-top: 10px;
  padding-bottom: 40px;
}
.account-container {
  padding-top: 50px;
  display: flex;
  flex-direction: row;
  gap: 130px;
}

.tab-panel {
  display: flex;
  flex-direction: column;
}

.account-image {
  background: var(--tertiary-color);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
}

.account-image span {
  font-size: 40px;
  color: whitesmoke;
  font-weight: bolder;
}

.name-text {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  align-self: center;
  gap: 5px;
}

.name-text span {
  font-weight: bold;
}

.image-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.tabs {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.tabs a {
  display: flex;
  gap: 10px;
  align-items: center;
}

.tab:hover {
  color: var(--dark-grey);
  font-weight: bold;
}

.tab:hover .icon {
  color: var(--dark-grey);
}

.icon {
  width: 30px;
  height: 30px;
}

.icon:hover {
  color: var(--dark-grey);
}

.inactive {
  color: var(--light-grey);
}
.card-overview {
  padding: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: space-around;
  width: 60%;
  max-height: 300px;
  background-color: white;
  text-align: center;
}

.card p {
  text-align: center;
}

.label {
  color: var(--dark-grey);
  font-weight: bold;
}

.active {
  font-weight: bold;
}

a,
a:active {
  text-decoration: none;
  color: var(--dark-grey);
}
</style>

<template>
  <div class="account-page">
    <div class="account-container" v-if="account != null">
      <div class="tab-panel">
        <div class="image-container">
          <div class="account-image">
            <span v-if="account.name"> {{ getInitials(account.name) }} </span>
          </div>
          <div class="name-text">
            Hello, <span>{{ account.name }}</span>
          </div>
        </div>
        <div class="tabs">
          <router-link class="tab active" to="/"
            ><Icon class="icon" icon="mdi:user-circle-outline"></Icon>Account
            Overview</router-link
          >
          <router-link class="tab" to="/lists"
            ><Icon class="icon inactive" icon="mdi:cart-heart"></Icon>Saved
            Carts</router-link
          >
          <router-link class="tab" to="/contact"
            ><Icon
              class="icon inactive"
              icon="mdi:question-mark-circle-outline"
            ></Icon
            >Contact Us</router-link
          >
        </div>
      </div>
      <div class="card-overview">
        <div>
          <p class="label">Full Name</p>
          <p>{{ account.name }}</p>
        </div>
        <div>
          <p class="label">Email</p>
          <p>{{ account.email }}</p>
        </div>
        <div>
          <p class="label">Car Miles Per Gallon (MPG)</p>
          <p v-if="account.gasMileage">{{ account.gasMileage }} mpg</p>
          <p v-else>-</p>
        </div>
        <div>
          <p class="label">Date of Account Creation</p>
          <p>{{ account.dateOfCreation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
