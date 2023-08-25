import { Account } from "@/types";
import { defineStore } from "pinia";
import { useCartStore } from "./CartStore";

const ACCOUNT_STORAGE_KEY = "Account";
const USER_LOGGED_IN_KEY = "UserLoggedIn";

export const useAccountStore = defineStore("AccountStore", {
  state: () => {
    const account = {} as Account;
    const isLoggedIn = false;

    const accountString = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (accountString !== null) {
      Object.assign(account, JSON.parse(accountString) as Account);
    }

    const userLoggedInString = localStorage.getItem(USER_LOGGED_IN_KEY);
    if (userLoggedInString !== null) {
      Object.assign(isLoggedIn, JSON.parse(userLoggedInString) as boolean);
    }

    return {
      account: account,
      isLoggedIn: isLoggedIn,
    };
  },
  getters: {
    getAccountId(): string {
      return this.account._id;
    },
  },
  actions: {
    setAccountDetails(
      name: string,
      email: string,
      gasMileage: number,
      id: string
    ) {
      this.account.name = name;
      this.account.email = email;
      this.account.gasMileage = gasMileage;
      this.account._id = id;

      localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(this.account));
    },

    logInUser() {
      this.isLoggedIn = true;

      localStorage.setItem(USER_LOGGED_IN_KEY, JSON.stringify(this.isLoggedIn));
    },

    logOutUser() {
      this.isLoggedIn = false;
      this.account = {} as Account;
      const cartStore = useCartStore();
      cartStore.clearCart();

      localStorage.setItem(USER_LOGGED_IN_KEY, JSON.stringify(this.isLoggedIn));
    },
  },
});
