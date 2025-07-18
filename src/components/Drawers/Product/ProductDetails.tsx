import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../../ui/Loading";
import { colors } from "../../../theme/colors";

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
  const [inventoryCategory, setInventoryCategory] = useState<
    string | undefined
  >();

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
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3 border-l border-gray-200"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.border.light }}
        >
          <h1
            className="text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            Product Details
          </h1>
          <button
            onClick={closeDrawerHandler}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.gray[100],
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[200];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[100];
            }}
          >
            <BiX size={20} />
          </button>
        </div>

        <div className="mt-8 px-5">
          {isLoadingProduct && <Loading />}
          {!isLoadingProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Inventory Category
                  </p>
                  <p className="text-gray-600">{inventoryCategory || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">Product ID</p>
                  <p className="text-gray-600">{id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Product Name
                  </p>
                  <p className="text-gray-600">{name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Product Price (Default)
                  </p>
                  <p className="text-gray-600">₹ {price}/-</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Regular Buying Price
                  </p>
                  <p className="text-gray-600">
                    {regularBuyingPrice
                      ? `₹ ${regularBuyingPrice}/-`
                      : "Not Available"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Wholesale Buying Price
                  </p>
                  <p className="text-gray-600">
                    {wholesaleBuyingPrice
                      ? `₹ ${wholesaleBuyingPrice}/-`
                      : "Not Available"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">MRP</p>
                  <p className="text-gray-600">{mrp || "Not Available"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Dealer Price
                  </p>
                  <p className="text-gray-600">
                    {dealerPrice ? `₹ ${dealerPrice}/-` : "Not Available"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Distributor Price
                  </p>
                  <p className="text-gray-600">
                    {distributorPrice
                      ? `₹ ${distributorPrice}/-`
                      : "Not Available"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Product Category
                  </p>
                  <p className="text-gray-600">{category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Product Sub Category
                  </p>
                  <p className="text-gray-600">
                    {subCategory || "Not Available"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    UOM (Unit of Measurement)
                  </p>
                  <p className="text-gray-600">{uom}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">
                    Current Stock
                  </p>
                  <p className="text-gray-600">{currentStock}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">Min Stock</p>
                  <p className="text-gray-600">{minStock || "Not Available"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">Max Stock</p>
                  <p className="text-gray-600">{maxStock || "Not Available"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">HSN</p>
                  <p className="text-gray-600">{hsn || "Not Available"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">Store</p>
                  <p className="text-gray-600">{store || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ProductDetails;
