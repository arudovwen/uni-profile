import { createStore } from "vuex";

// import createPersistedState from "vuex-persistedstate";

const store = createStore({
  // plugins: [createPersistedState()],
  state: {
    loggedUser: {},
    cartItems: [],
    refreshToken: "",
    jwToken: "",
    isLoggedIn: false,
    roles: [],
    userId: "",
    markets: [],
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    loggedUser: (state) => state.loggedUser,
    userId: (state) => state.userId,
    token: (state) => (state.loggedUser ? state.loggedUser.jwToken : null),
 
    cartItems: (state) => state.cartItems,
    accessToken: (state) => state.jwToken,
    refreshToken: (state) => state.refreshToken,
    cartTotal: (state) => state.cartItems.length,
    markets: (state) => state.markets,
    totalAmount: (state) => {
      return state.cartItems
        .map((item) => item.packagePrice * item.quantity)
        .reduce((a, b) => {
          return Number(a) + Number(b);
        }, 0);
    },
  },
  mutations: {
    setUser(state, data) {
      state.loggedUser = data;
      state.roles = data.roles;
      state.isLoggedIn = true;
      state.userId = data.id;
      state.refreshToken = data.refreshToken;
      state.jwToken = data.jwToken;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setMarkets(state, data) {
      state.markets = data;
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
    setAccessToken(state, token) {
      state.jwToken = token;
    },

    clearUserData(state) {
      state.loggedUser = {};
      state.refreshToken = "";
      state.jwToken = "";
      state.isLoggedIn = false;
      state.userId = "";
    },
    clearCart(state) {
      state.cartItems = [];
    },
    addToCart(state, item) {
      state.cartItems = [...state.cartItems, item];
    },
    updateCart(state, item) {
      state.cartItems = [...item];
    },
    removeFromCart(state, packageId) {
      state.cartItems = state.cartItems.filter(
        (item) => item.packageId !== packageId
      );
    },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async handleAddToCart({ state, commit }, item) {
      let check = state.cartItems.some((i) => i.packageId == item.packageId);
      if (check) {
        return { status: false, message: "Already in cart" };
      }
      commit("addToCart", item);
      return { status: true, message: "Added to cart" };
    },
    async handleCartUpdate({ state, commit }, item) {
      let updatedItem = state.cartItems.map((i) => {
        if (i.packageId == item.packageId) {
          i.quantity = item.quantity;
        }
        return i;
      });

      commit("updateCart", updatedItem);
    },
    async handleToken({ commit }, token) {
      commit("setAccessToken", token);
      return { status: true, message: "updated" };
    },
  },
  modules: {},
});


export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(store);
    // Install the store instance as a plugin
  });