import { useAccountStore } from "@/stores/AccountStore";
import { nextTick } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

function checkIfAuthenticated(to: any, from: any, next: any) {
  if (localStorage.getItem("UserLoggedIn") == "true") next();
  else next("/login");
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
    name: "shopsavvy",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "/search",
        name: "search",
        component: () => import("../views/SearchResultsView.vue"),
        beforeEnter: [checkIfAuthenticated],
      },
      {
        path: "/details",
        name: "product-details",
        component: () => import("../views/ProductDetails.vue"),
        beforeEnter: [checkIfAuthenticated],
      },
      {
        path: "cart",
        name: "cart",
        component: () => import("../views/cart-page/CartView.vue"),
        beforeEnter: [checkIfAuthenticated],
      },
      {
        path: "summary",
        name: "summary",
        component: () => import("../views/SummaryView.vue"),
        beforeEnter: [checkIfAuthenticated],
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/layouts/LoginLayout.vue"),
    children: [
      {
        path: "/signup",
        name: "signup",
        component: () => import("@/views/SignUp.vue"),
      },
      {
        path: "/login",
        name: "login-page",
        component: () => import("@/views/LoginView.vue"),
      },
    ],
  },
  {
    path: "/wideLayout",
    name: "wideLayout",
    component: () => import("@/layouts/WideViewLayout.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/HomeView.vue"),
        beforeEnter: [checkIfAuthenticated],
      },
      {
        path: "/account",
        name: "account",
        component: () => import("@/views/AccountView.vue"),
        beforeEnter: [checkIfAuthenticated],
      },
      {
        path: "/contact",
        name: "contact",
        component: () => import("@/views/ContactUsView.vue"),
        beforeEnter: [checkIfAuthenticated],
      },
      {
        path: "/lists",
        name: "savedList",
        component: () => import("@/views/SavedListView.vue"),
        beforeEnter: [checkIfAuthenticated],
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("@/views/ErrorNotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
