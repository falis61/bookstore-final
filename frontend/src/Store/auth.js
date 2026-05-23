import { createSlice } from "@reduxjs/toolkit";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const storedToken = getStoredItem("token");
const storedRole = getStoredItem("role");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: !!storedToken,
    role: storedRole || "user",
    cartCount: 0,
    favourites: [],
    favouriteBundles: [],
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = "user";
      state.cartCount = 0;
      state.favourites = [];
      state.favouriteBundles = [];
    },
    ChangeRole(state, action) {
      state.role = action.payload;
    },
    setCartCount(state, action) {
      state.cartCount = action.payload;
    },
    incrementCartCount(state) {
      state.cartCount += 1;
    },
    decrementCartCount(state) {
      if (state.cartCount > 0) {
        state.cartCount -= 1;
      }
    },
    setFavourites(state, action) {
      state.favourites = action.payload;
    },
    setFavouriteBundles(state, action) {
      state.favouriteBundles = action.payload;
    },
    addFavourite(state, action) {
      if (!state.favourites.includes(action.payload)) {
        state.favourites.push(action.payload);
      }
    },
    addFavouriteBundle(state, action) {
      if (!state.favouriteBundles.includes(action.payload)) {
        state.favouriteBundles.push(action.payload);
      }
    },
    removeFavourite(state, action) {
      state.favourites = state.favourites.filter(
        (id) => id !== action.payload
      );
    },
    removeFavouriteBundle(state, action) {
      state.favouriteBundles = state.favouriteBundles.filter(
        (id) => id !== action.payload
      );
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;