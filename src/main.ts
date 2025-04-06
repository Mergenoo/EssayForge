import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { useRouter } from "vue-router";

const router = useRouter;
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router); 
app.mount("#app");
