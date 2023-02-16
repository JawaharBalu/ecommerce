import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import InputField from "./components/inputField/InputField";
import SearchAppBar from "./components/header/Header";
import Products from "./components/products/Products";
import ViewProduct from "./components/products/ViewProduct";
import ShoppingCart from "./components/products/shoppingCart";
import { ProductsStore } from "./components/products/ProductsContext";
import axios from "axios";
import ProductUtils from "./components/products/productUtils";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getProducts();
    getCart();
    console.log("api");
  }, []);

  // useEffect(() => {
  //   postCart(cart);
  // }, [cart && count]);

  useEffect(() => {
    ProductUtils.cartCount(cart, setCount);
  }, [cart]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(
        response.data.map((elem) => {
          return { ...elem, cart: 1 };
        })
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  };



  const getCart = async () => {
    try {
      await axios
        .get("https://reacttodo-team-default-rtdb.firebaseio.com/cart.json")
        .then((response) => {
          console.log("getcart", response.data);
          setCart(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="App">
        <SearchAppBar count={count} />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos/" element={<InputField />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/products"
          element={
            <ProductsStore.Provider
              value={{
                products,
                setProducts,
                ProductUtils,
                loading,
                error,
                cart,
                setCart,
              }}
            >
              <Products />
            </ProductsStore.Provider>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductsStore.Provider
              value={{
                products,
                setProducts,
                cart,
                setCart,
                ProductUtils,
              }}
            >
              <ViewProduct />
            </ProductsStore.Provider>
          }
        />
        <Route
          path="/cart"
          element={
            <ProductsStore.Provider value={{ cart, ProductUtils, setCart }}>
              <ShoppingCart />
            </ProductsStore.Provider>
          }
        />
        <Route path="*" element={<h2>404 Not Found</h2>}></Route>
      </Routes>
    </>
  );
}

export default App;
