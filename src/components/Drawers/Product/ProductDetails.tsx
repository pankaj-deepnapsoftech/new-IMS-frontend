import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../../ui/Loading";

interface ProductDetailsProps {
  closeDrawerHandler: () => void;
  productId: string | undefined;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  closeDrawerHandler,
  productId,
}) => {
  const [name, setName] = useState<string | undefined>();
  const [id, setId] = useState<string | undefined>();
  const [uom, setUom] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [subCategory, setSubCategory] = useState<string | undefined>();
  const [currentStock, setCurrentStock] = useState<string | undefined>();
  const [price, setPrice] = useState<string | undefined>();
  const [minStock, setMinStock] = useState<string | undefined>();
  const [maxStock, setMaxStock] = useState<string | undefined>();
  const [hsn, setHsn] = useState<string | undefined>();
  const [regularBuyingPrice, setRegularBuyingPrice] = useState<
    number | undefined
  >();
  const [wholesaleBuyingPrice, setWholeSaleBuyingPrice] = useState<
    number | undefined
  >();
  const [mrp, setMrp] = useState<number | undefined>();
  const [dealerPrice, setDealerPrice] = useState<number | undefined>();
  const [distributorPrice, setDistributorPrice] = useState<
    number | undefined
  >();
  const [store, setStore] = useState<string | undefined>();
  const [inventoryCategory, setInventoryCategory] = useState<string | undefined>();

  const [cookies] = useCookies();

  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);

  const fetchProductDetails = async () => {
    try {
      setIsLoadingProduct(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `product/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setName(data.product.name);
      setId(data.product.product_id);
      setCategory(data.product.category);
      setUom(data.product.uom);
      setPrice(data.product.price);
      setCurrentStock(data.product.current_stock);
      setMinStock(data.product?.min_stock);
      setMaxStock(data.product?.max_stock);
      setHsn(data.product?.hsn);
      setSubCategory(data.product?.sub_category);
      setRegularBuyingPrice(data.product?.regular_buying_price);
      setWholeSaleBuyingPrice(data.product?.wholesale_buying_price);
      setMrp(data.product?.mrp);
      setDealerPrice(data.product?.dealer_price);
      setDistributorPrice(data.product?.distributor_price);
      setStore(data.product?.store?.name);
      setInventoryCategory(data.product?.inventory_category);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsLoadingProduct(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-[#57657f]  right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 ">
          <BiX onClick={closeDrawerHandler} size="26px" color="white" />
        
        </h1>

        <div className="mt-8 px-5">
        <h2 className="text-xl text-center  font-semi600 py-3 px-4 bg-[#ffffff4f]  rounded-md text-white  mb-6  ">     
      
            Product Details
          </h2>

          {isLoadingProduct && <Loading />}
          {!isLoadingProduct && (
            <div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Inventory Category</p>
                <p className="text-gray-300">{inventoryCategory || 'N/A'}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Product ID</p>
                <p className="text-gray-300">{id}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Product Name</p>
                <p className="text-gray-300">{name}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Product Price (Default)</p>
                <p className="text-gray-300">₹ {price}/-</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Regular Buying Price</p>
                <p className="text-gray-300">
                  {regularBuyingPrice
                    ? `₹ ${regularBuyingPrice}/-`
                    : "Not Available"}
                </p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Wholesale Buying Price</p>
                <p className="text-gray-300">
                  {wholesaleBuyingPrice
                    ? `₹ ${wholesaleBuyingPrice}/-`
                    : "Not Available"}
                </p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >MRP</p>
                <p className="text-gray-300">{mrp || "Not Available"}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Dealer Price</p>
                <p className="text-gray-300">{dealerPrice
                    ? `₹ ${dealerPrice}/-`
                    : "Not Available"}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Distributor Price</p>
                <p className="text-gray-300">{distributorPrice
                    ? `₹ ${distributorPrice}/-`
                    : "Not Available"}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Product Category</p>
                <p className="text-gray-300">{category}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Product Sub Category</p>
                <p className="text-gray-300">{subCategory || "Not Available"}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >UOM (Unit of Measurement)</p>
                <p className="text-gray-300">{uom}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Current Stock</p>
                <p className="text-gray-300">{currentStock}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Min Stock</p>
                <p className="text-gray-300">{minStock || "Not Available"}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Max Stock</p>
                <p className="text-gray-300">{maxStock || "Not Available"}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >HSN</p>
                <p className="text-gray-300">{hsn || "Not Available"}</p>
              </div>
              <div className="mt-3 mb-5 text-white">
                <p className="font-semibold" >Store</p>
                <p className="text-gray-300">{store || "N/A"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ProductDetails;
