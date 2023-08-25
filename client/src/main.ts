import { createApp } from "vue";
import "@/assets/css/global.css"; // imports the global CSS before all other CSS files
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "./assets/css/global.css";
import "./assets/css/custom.scss";
import 'vue3-toastify/dist/index.css';
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
