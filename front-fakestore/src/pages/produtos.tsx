import { useEffect, useMemo, useState } from "react";
import Layout from "fakestore/components/layout";
import getProducts from "fakestore/repositories/getProducts";
import useMyContext from "fakestore/context/useMyContext";
import Card from "fakestore/components/products/card";
import Loading from "fakestore/components/loading";
import DefaultProduct from "fakestore/components/defaultProduct";
import Filters from "fakestore/components/products/filters";
import getCategories from "fakestore/repositories/getCategories";
import { filterByCategorie, filterByName, filterByOrder } from "fakestore/services/products";
import { OrderTypes } from "fakestore/@types/components/filters";

export default function Product() {
  const { setProducts, products, setCategories } = useMyContext();
  const [productName, setProductName] = useState<string>("");
  const [productCategorie, setProductCategorie] = useState<string>();
  const [productOrder, setProductOrder] = useState<OrderTypes>();
  console.log(productName, 'PRODUCT NAME')

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const productsFiltered = useMemo(() => {
    if (products) {
      const filteredName = filterByName(products, productName);
      const filteredCategory = filterByCategorie(filteredName, productCategorie);
      const filteredOrder = filterByOrder(filteredCategory, productOrder);
      return filteredOrder;
    }
  }, [products, productName, productCategorie, productOrder]);

  const renderCards = useMemo(() => {
    if (productsFiltered) {
      return (
        <>
          <Filters
            valueProductName={productName}
            setValueProductName={setProductName}
            valueCategorie={productCategorie}
            setCategorie={setProductCategorie}
            valueOrder={productOrder}
            setOrder={setProductOrder}
          />
          {productsFiltered.length ? (
            productsFiltered.map((product) => {
              return (
                <Card
                  image={product.image}
                  key={product.id}
                  price={product.price}
                  title={product.title}
                />
              );
            })
          ) : (
            <DefaultProduct />
          )}
        </>
      );
    }
    return <Loading />;
  }, [productsFiltered, productName, productCategorie, productOrder]);

  return <Layout>{renderCards}</Layout>;
}
