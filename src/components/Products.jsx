import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Recommendations from "./Recommendations";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("");

  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    setSelectedProduct(product); // for recommendation
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        setData(await response.clone().json());
        setFilter(await response.json());
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
          <div className="text-center py-3">
  <select
    className="form-select d-inline w-auto mx-2"
    value={selectedRating}
    onChange={(e) => setSelectedRating(Number(e.target.value))}
  >
    <option value={0}>Filter by Rating</option>
    <option value={1}>1+ ★</option>
    <option value={2}>2+ ★</option>
    <option value={3}>3+ ★</option>
    <option value={4}>4+ ★</option>
    <option value={5}>5★ only</option>
  </select>

  <select
    className="form-select d-inline w-auto mx-2"
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="">Price</option>
    <option value="low">Price: Low to High</option>
    <option value="high">Price: High to Low</option>
  </select>
</div>

        </div>
        

        {filter
          .filter((product) => product.rating.rate >= selectedRating)
          .sort((a, b) => {
            if (sortOrder === "low") return a.price - b.price;
            if (sortOrder === "high") return b.price - a.price;
            return 0;
          })
          .map((product) => {

          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {product.title.substring(0, 12)}...
                  </h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                  <p className="card-text">Rating: {product.rating.rate} ⭐</p>

                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">$ {product.price}</li>
                  {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Vestibulum at eros</li> */}
                </ul>
                <div className="card-body">
                  <Link
                    to={"/product/" + product.id}
                    className="btn btn-dark m-1"
                  >
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1"
                    onClick={() => {
                      toast.success("Added to cart");
                      addProduct(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        {selectedProduct ? (
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Grid - 80% */}
            <div style={{ flex: 4 }}>
              <div className="row justify-content-center">
                {loading ? <Loading /> : <ShowProducts />}
              </div>
            </div>

            {/* Sidebar - 20% */}
            <div style={{ flex: 1 }}>
              <Recommendations currentProduct={selectedProduct} allProducts={data} />
            </div>
          </div>
        ) : (
          <div className="row justify-content-center">
            {loading ? <Loading /> : <ShowProducts />}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
