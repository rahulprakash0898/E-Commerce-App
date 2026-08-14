import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "@/store/shop/wishlist-slice";
import { toast } from "sonner";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);

  const isWishlisted = wishlistItems?.some(
    (item) => item.productId === product?._id
  );

  function handleToggleWishlist(e) {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to manage your wishlist!");
      return;
    }

    dispatch(
      addToWishlist({ userId: user?.id, productId: product?._id })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success(
          isWishlisted
            ? "Removed from wishlist"
            : "Added to wishlist"
        );
      }
    });
  }

  return (
    <Card className="w-full max-w-sm mx-auto group">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title || "Product image"}
            className="w-full h-[300px] object-cover rounded-t-lg cursor-pointer"
            onClick={() => handleGetProductDetails(product?._id)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm"
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>

          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent
          className="p-4 cursor-pointer"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          <h2 className="text-xl font-bold mb-2 line-clamp-1">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;