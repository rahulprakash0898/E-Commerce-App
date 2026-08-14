import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlistItems, removeFromWishlist } from "@/store/shop/wishlist-slice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function WishlistTab() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, isLoading } = useSelector((state) => state.shopWishlist);

  useEffect(() => {
    if (user?.id) {
      dispatch(getWishlistItems(user?.id));
    }
  }, [dispatch, user]);

  function handleRemoveFromWishlist(productId) {
    dispatch(removeFromWishlist({ userId: user?.id, productId })).then((data) => {
      if (data?.payload?.success) {
        toast.success("Item removed from wishlist!");
      }
    });
  }

  function handleAddToCart(productId) {
    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Item added to cart!");
      }
    });
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading wishlist...</div>;
  }

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-xl font-bold">My Saved Wishlist</h2>
      {wishlistItems && wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <Card key={item.productId} className="overflow-hidden group">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[200px] object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-90 hover:opacity-100"
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">
                    ${item.salePrice > 0 ? item.salePrice : item.price}
                  </span>
                  <Button
                    size="sm"
                    className="flex gap-1 items-center"
                    onClick={() => handleAddToCart(item.productId)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Move to Cart</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground border rounded-lg">
          No items saved in your wishlist yet.
        </div>
      )}
    </div>
  );
}

export default WishlistTab;
