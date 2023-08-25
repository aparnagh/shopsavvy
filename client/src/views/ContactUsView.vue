<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>
<script lang="ts">
import { Account } from "@/types";
import { defineComponent } from "vue";
import axios from "axios";
import { useAccountStore } from "@/stores/AccountStore";

export default defineComponent({
  data() {
    return {
      account: {} as Account,
    };
  },
  mounted() {
    const accountStore = useAccountStore();
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

.title {
  text-align: center;
  padding-bottom: 40px;
  padding-top: 25px;
  color: var(--dark-grey);
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

.icon {
  width: 30px;
  height: 30px;
}

.inactive {
  color: var(--light-grey);
}
.card-contact {
  padding: 30px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  display: flex;
  width: 60%;
  background-color: white;
}

.card p {
  text-align: center;
}

.active {
  font-weight: bold;
}

a,
a:active {
  text-decoration: none;
  color: var(--dark-grey);
}

.label,
label {
  color: #777777;
  font-weight: bold;
  padding-bottom: 5px;
}

input {
  padding: 5px 8px;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 1px solid #5a5a5a;
  outline: none;
  border-radius: 20px;
  margin-left: 10px;
  background-color: whitesmoke;
}

#message {
  border-radius: 20px;
  min-height: 172px;
  padding-left: 10px;
  padding-top: 8px;
  margin-left: 10px;
  background-color: whitesmoke;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--dark-grey);
  font-size: 16px;
}

form {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.active {
  font-weight: bold;
}

.image-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
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
.tab:hover .icon {
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
          <router-link to="/account" class="tab"
            ><Icon class="icon inactive" icon="mdi:user-circle-outline"></Icon
            >Account Overview</router-link
          >
          <router-link to="/lists" class="tab"
            ><Icon class="icon inactive" icon="mdi:cart-heart"></Icon>Saved
            Carts</router-link
          >
          <router-link to="/" class="active tab"
            ><Icon
              class="icon active"
              icon="mdi:question-mark-circle-outline"
            ></Icon
            >Contact Us</router-link
          >
        </div>
      </div>
      <div class="card-contact">
        <form>
          <div class="form-fields">
            <label for="name">Name</label>
            <input
              :value="account.name"
              type="text"
              id="name"
              name="name"
              required
            />
          </div>

          <div class="form-fields">
            <label for="email">Email</label>
            <input
              :value="account.email"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>

          <div class="form-fields">
            <label for="message">Message</label>
            <textarea id="message" name="message" required></textarea>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
