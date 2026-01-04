import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { RecommendationsCarousel } from "@/components/MarketplaceComponent/cart/recommendationsCarousel";
import {
  // getCart,
  updateCartItemQuantity,
  removeCartItem,
  getRecommendedProducts,
  checkout,
  checkoutOnCredit,
} from "@/services/cartService";
import { MarketplaceHeader } from "@/components/MarketplaceComponent/marketplaceHeader";
import type { CartItem, RecommendationProduct } from "@/types/cartTypes";
import { CartItems } from "@/components/MarketplaceComponent/cart/cartItems";
import { OrderSummary } from "@/components/MarketplaceComponent/cart/orderSummary";
import { ceilTo2DP, getDisplayDate } from "@/common/utils";
import { useAuthStore } from "@/store/authStore";
import PageLoader from "@/components/PageLoader";
import { useUserWallet } from "@/hooks/useAuth";

export default function CartPage() {
  const { user } = useAuthStore();
  console.log("User in CartPage:", user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cartCount, setCartCount] = useState(0);
  const [isBuyingOnCredit, setIsBuyingOnCredit] = useState(false);

  const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");

  // calculate cart subtotal, deliveryFee, total
  const calculateCartTotals = (items: typeof cart) => {
    const subtotal = items.reduce((sum: number, item: CartItem) => {
      const itemTotal =
        Number(item.totalPrice) ||
        Number(item.price) * (Number(item.quantity) || 1);
      return sum + itemTotal;
    }, 0);

    // Calculate total delivery fee from all products
    // If a product has delivery_fee, use it; otherwise default to 0
    const deliveryFee = items.reduce((sum: number, item: CartItem) => {
      const itemDeliveryFee = Number(item.delivery_fee) || 0;
      return sum + itemDeliveryFee;
    }, 0);

    const vat = ceilTo2DP(subtotal * 0.075);
    const total = ceilTo2DP(subtotal + deliveryFee + vat);

    return {
      items,
      subtotal,
      deliveryFee,
      total,
      vat,
    };
  };

  // Fetch recommendations based on cart categories
  // const cartCategories = cart?.items.map((item) => item.product.category) || []
  // const { data: recommendations = [] } = useQuery({
  //   queryKey: ["recommendations", cartCategories],
  //   queryFn: () => getRecommendedProducts(cartCategories),
  //   refetchInterval: 30000,
  // })

  const { data } = useUserWallet();
  const walletBalance = data?.balance;

  console.log("Wallet Balance:", walletBalance);

  const cartCategories =
    cart?.map((item: CartItem) => item.product_category) || [];
  const { data: recommendations = [], isPending: recommendationsLoading } =
    useQuery({
      queryKey: ["recommendations", cartCategories],
      queryFn: () => getRecommendedProducts(cartCategories),
      refetchInterval: 30000,
    });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => updateCartItemQuantity(cartItemId, quantity),
    onSuccess: () => {
      // Refresh cart from localStorage
      const updatedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartCount(updatedCart.length);
      // Force page refresh to update cart display
      window.location.reload();
      toast("Quantity updated", {
        description: `Cart item quantity has been updated.`,
      });
    },
    onError: () => {
      toast("Error", {
        description: "Failed to update quantity. Please try again.",
      });
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      // Refresh cart from localStorage
      const updatedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartCount(updatedCart.length);
      // Force page refresh to update cart display
      window.location.reload();
      toast("Item removed", {
        description: "Product has been removed from your cart.",
      });
    },
    onError: () => {
      toast("Error", {
        description: "Failed to remove item. Please try again.",
      });
    },
  });

  // Checkout mutation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkoutMutation = useMutation<{ orderId: string }, unknown, any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (cartData: any) => checkout(cartData),
    onSuccess: (data) => {
      toast("Checkout successful", {
        description: "Your order has been placed successfully.",
      });
      // Navigate to payment page with order data
      // navigate(`/payment?orderId=${data.orderId}`)
      
      // navigate to marketplace after checkout and clear cart
      console.log("Checkout successful, order ID:", data.orderId);
      localStorage.removeItem("cartItems");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      navigate("/user/market-place");
    },
    onError: () => {
      toast("Checkout failed", {
        description: "Failed to process checkout. Please try again.",
      });
    },
  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkoutOnCreditMutation = useMutation<{ orderId: string }, unknown, any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (cartData: any) => checkoutOnCredit(cartData),
    onSuccess: (data) => {
      toast("Checkout successful", {
        description: "Your order has been placed successfully.",
      });
      // Navigate to payment page with order data
      // navigate(`/payment?orderId=${data.orderId}`)

      // navigate to marketplace after checkout and clear cart
      console.log("Checkout successful, order ID:", data.orderId);
      localStorage.removeItem("cartItems");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // navigate("/user/market-place");
    },
    onError: () => {
      toast("Checkout failed", {
        description: "Failed to process checkout. Please try again.",
      });
    },
  });

  // Update cart count on mount and when cart changes
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartCount(cartItems.length);
  }, [cart]);

  const handleQuantityChange = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ cartItemId, quantity });
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeItemMutation.mutate(cartItemId);
  };
  const handleCheckout = () => {
    const totalCartPrice = cart.reduce((sum: number, item: CartItem) => {
      const itemTotal = Number(item.price) * (Number(item.quantity) || 1);
      return sum + itemTotal;
    }, 0);

    // Calculate total delivery fee from all products
    const deliveryFee = cart.reduce((sum: number, item: CartItem) => {
      const itemDeliveryFee = Number(item.delivery_fee) || 0;
      return sum + itemDeliveryFee;
    }, 0);

    const vat = totalCartPrice * 0.075;
    const totalPrice = totalCartPrice + deliveryFee + vat;

    console.log("Total Price:", totalPrice);
    console.log("walletBalance:", walletBalance);

    if (walletBalance !== undefined && walletBalance < totalPrice) {
      toast("Insufficient Balance", {
        description:
          "You do not have enough balance in your wallet to complete this purchase. Kindly top up and try again.",
      });
      console.log("Insufficient wallet balance for checkout");
      return;
    }

    if (cart && user) {
      const payload = {
        user_id: user.uuid,
        delivery_fee: deliveryFee,
        items: cart.map((item: CartItem) => ({
          product_id: item.product_id, // or item.id, depending on your API response
          quantity: item.quantity,
        })),
      };

      console.log("Checkout Payload:", payload);
      checkoutMutation.mutate(payload);
    }
  };

  const handleCheckoutOnCredit = (data: {
    duration: number;
    interest: number;
    total: number;
  }) => {
    if (!user) return;

    const payload = {
      cart_items: 
        cart.map((item: CartItem) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
      repayment_months: data.duration,
      // user_id: user.uuid,
      // payment_type: "credit",
      // duration: data.duration,
      // interest: data.interest,
      // total_amount: data.total,
      // items: cart.map((item: CartItem) => ({
      //   product_id: item.product_id,
      //   quantity: item.quantity,
      // })),
    };

    console.log("Credit checkout payload:", payload);
    checkoutOnCreditMutation.mutate(payload);
  };

  const handleAddRecommendationToCart = (product: RecommendationProduct) => {
    //add product to localStorage cart
    const storedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItem = storedCart.find(
      (item: CartItem) => item.product_id === product.product_id
    );

    if (existingItem) {
      toast.info(`${product.product_name} is already in your cart.`);
      return;
    }
    const updatedCart = [
      ...storedCart,
      { ...product, quantity: 1, totalPrice: product.price },
    ];
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    toast("Added to cart", {
      description: `${product.product_name} has been added to your cart.`,
    });
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  // if (!cart || cart.items.length === 0) {
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen">
        <MarketplaceHeader cartCount={0} onSearch={() => {}} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => navigate("/user/market-place")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <MarketplaceHeader cartCount={cartCount} onSearch={() => {}} />

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto  py-6">
        {/* Top Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold ">Local Market</h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Calendar className="w-5 h-5" />
              {getDisplayDate()}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <CartItems
              items={cart}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary
              cart={calculateCartTotals(cart)}
              walletBalance={walletBalance ?? 0}
              onCheckout={handleCheckout}
              onCheckoutOnCredit={handleCheckoutOnCredit}
              isBuyingOnCredit={isBuyingOnCredit}
              onStartBuyOnCredit={() => setIsBuyingOnCredit(true)}
              onCancelBuyOnCredit={() => setIsBuyingOnCredit(false)}
              isLoading={checkoutMutation.isPending}
            />
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-12">
          {recommendationsLoading ? (
            <PageLoader />
          ) : (
            <RecommendationsCarousel
              products={recommendations}
              onAddToCart={handleAddRecommendationToCart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
// import { useState, useEffect } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { useNavigate } from "react-router-dom"
// import { Calendar } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { toast } from "sonner"

// import { RecommendationsCarousel } from "@/components/MarketplaceComponent/cart/recommendationsCarousel"
// import {
//   // getCart,
//   updateCartItemQuantity,
//   removeCartItem,
//   getRecommendedProducts,
//   checkout,
//   getWalletBalance
// } from "@/services/cartService"
// import { MarketplaceHeader } from "@/components/MarketplaceComponent/marketplaceHeader"
// import type { CartItem, RecommendationProduct } from "@/types/cartTypes"
// import { CartItems } from "@/components/MarketplaceComponent/cart/cartItems"
// import { OrderSummary} from "@/components/MarketplaceComponent/cart/orderSummary"
// import { getDisplayDate } from "@/common/utils"
// import { useAuthStore } from "@/store/authStore"
// import PageLoader from "@/components/PageLoader"

// export default function CartPage() {
//   const { user } = useAuthStore()
//   console.log("User in CartPage:", user)
//   const navigate = useNavigate()
//   const queryClient = useQueryClient()
//   const [cartCount, setCartCount] = useState(0);
//   const [isBuyingOnCredit, setIsBuyingOnCredit] = useState(false);

//   // Fetch cart data
//   // const { data: cart, isLoading: cartLoading } = useQuery({
//   //   queryKey: ["cart"],
//   //   queryFn: getCart,
//   //   refetchInterval: 30000,
//   // })

//   const cart = JSON.parse(localStorage.getItem("cartItems") || "[]")

//   // calculate cart subtotal, deliveryFee, total
//   const calculateCartTotals = (items: typeof cart) => {
//   const subtotal = items.reduce((sum: number, item: CartItem) => {
//     const itemTotal = Number(item.totalPrice) || (Number(item.price) * (Number(item.quantity) || 1))
//     return sum + itemTotal
//   }, 0)

//   // Calculate total delivery fee from all products
//   // If a product has delivery_fee, use it; otherwise default to 0
//   const deliveryFee = items.reduce((sum: number, item: CartItem) => {
//     const itemDeliveryFee = Number(item.delivery_fee) || 0
//     return sum + itemDeliveryFee
//   }, 0)

//   const vat = subtotal * 0.075
//   const total = subtotal + deliveryFee + vat

//   return {
//     items,
//     subtotal,
//     deliveryFee,
//     total,
//     vat,
//   }
// }

//   // Fetch recommendations based on cart categories
//   // const cartCategories = cart?.items.map((item) => item.product.category) || []
//   // const { data: recommendations = [] } = useQuery({
//   //   queryKey: ["recommendations", cartCategories],
//   //   queryFn: () => getRecommendedProducts(cartCategories),
//   //   refetchInterval: 30000,
//   // })

//   const { data: walletBalance } = useQuery({
//     queryKey: ["walletBalance"],
//     queryFn: getWalletBalance,
//   })

//   console.log("Wallet Balance:", walletBalance)

//   const cartCategories = cart?.map((item: CartItem) => item.product_category) || []
//   const { data: recommendations = [], isPending: recommendationsLoading } = useQuery({
//     queryKey: ["recommendations", cartCategories],
//     queryFn: () => getRecommendedProducts(cartCategories),
//     refetchInterval: 30000,
//   })

//   // Update quantity mutation
//   const updateQuantityMutation = useMutation({
//     mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
//       updateCartItemQuantity(cartItemId, quantity),
//     onSuccess: () => {
//       // Refresh cart from localStorage
//       const updatedCart = JSON.parse(localStorage.getItem("cartItems") || "[]")
//       setCartCount(updatedCart.length)
//       // Force page refresh to update cart display
//       window.location.reload()
//       toast("Quantity updated", {
//         description: `Cart item quantity has been updated.`,
//       })
//     },
//     onError: () => {
//       toast("Error", {
//         description: "Failed to update quantity. Please try again.",
//       })
//     },
//   })

//   // Remove item mutation
//   const removeItemMutation = useMutation({
//     mutationFn: removeCartItem,
//     onSuccess: () => {
//       // Refresh cart from localStorage
//       const updatedCart = JSON.parse(localStorage.getItem("cartItems") || "[]")
//       setCartCount(updatedCart.length)
//       // Force page refresh to update cart display
//       window.location.reload()
//       toast("Item removed", {
//         description: "Product has been removed from your cart.",
//       })
//     },
//     onError: () => {
//       toast("Error", {
//         description: "Failed to remove item. Please try again.",
//       })
//     },
//   })

//     // Checkout mutation
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const checkoutMutation = useMutation<{ orderId: string }, unknown, any>({
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       mutationFn: (cartData: any) => checkout(cartData),
//       onSuccess: (data) => {
//         toast("Checkout successful", {
//           description: "Your order has been placed successfully.",
//         })
//         // Navigate to payment page with order data
//         // navigate(`/payment?orderId=${data.orderId}`)

//         // navigate to marketplace after checkout and clear cart
//         console.log("Checkout successful, order ID:", data.orderId)
//         localStorage.removeItem("cartItems")
//         queryClient.invalidateQueries({ queryKey: ["cart"] })
//         navigate("/user/market-place")
//       },
//       onError: () => {
//         toast("Checkout failed", {
//           description: "Failed to process checkout. Please try again.",
//         })
//       },
//     })

//   // Update cart count on mount and when cart changes
//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
//     setCartCount(cartItems.length)
//   }, [cart])

//   const handleQuantityChange = (cartItemId: string, quantity: number) => {
//     if (quantity < 1) return
//     updateQuantityMutation.mutate({ cartItemId, quantity })
//   }

//   const handleRemoveItem = (cartItemId: string) => {
//     removeItemMutation.mutate(cartItemId)
//   }

//   // const handleCheckout = () => {
//   //   // check the total price of all the items in the cart together
//   //   const totalCartPrice = cart.reduce((sum: number, item: { totalPrice: number }) => sum + item.totalPrice, 0)
//   //   // calculate vat which is 7.5% of totalCartPrice
//   //   const vat = totalCartPrice * 0.075
//   //   const totalPrice = totalCartPrice + (totalCartPrice > 50000 ? 0 : 1500) + vat // include delivery fee + vat
//   //   console.log("Total Price:", totalPrice)
//   //   console.log("walletBalance:", walletBalance)
//   //   // check if user has enough balance in wallet
//   //   if (walletBalance !== undefined && walletBalance < totalPrice) {
//   //     toast("Insufficient Balance", {
//   //       description: "You do not have enough balance in your wallet to complete this purchase. kindly top up and try again.",
//   //     })
//   //     console.log("Insufficient wallet balance for checkout")
//   //     return
//   //   }
//   //   if (cart) {
//   //     checkoutMutation.mutate(cart)
//   //   }
//   // }

//   const handleCheckout = () => {
//   const totalCartPrice = cart.reduce((sum: number, item: CartItem) => {
//     const itemTotal = Number(item.price) * (Number(item.quantity) || 1)
//     return sum + itemTotal
//   }, 0)

//   // Calculate total delivery fee from all products
//   const deliveryFee = cart.reduce((sum: number, item: CartItem) => {
//     const itemDeliveryFee = Number(item.delivery_fee) || 0
//     return sum + itemDeliveryFee
//   }, 0)

//   const vat = totalCartPrice * 0.075
//   const totalPrice = totalCartPrice + deliveryFee + vat

//   console.log("Total Price:", totalPrice)
//   console.log("walletBalance:", walletBalance)

//   if (walletBalance !== undefined && walletBalance < totalPrice) {
//     toast("Insufficient Balance", {
//       description: "You do not have enough balance in your wallet to complete this purchase. Kindly top up and try again.",
//     })
//     console.log("Insufficient wallet balance for checkout")
//     return
//   }

//     if (cart && user) {
//     const payload = {
//       user_id: user.uuid,
//       delivery_fee: deliveryFee,
//       items: cart.map((item: CartItem) => ({
//         product_id: item.product_id, // or item.id, depending on your API response
//         quantity: item.quantity,
//       })),
//     }

//     console.log("Checkout Payload:", payload)
//     checkoutMutation.mutate(payload)
//   }
// }

//   const handleAddRecommendationToCart = (product: RecommendationProduct) => {

//     //add product to localStorage cart
//     const storedCart = JSON.parse(localStorage.getItem("cartItems") || "[]")
//     const existingItem = storedCart.find((item: CartItem) => item.product_id === product.product_id)

//         if (existingItem) {
//           toast.info(`${product.product_name} is already in your cart.`)
//           return
//         }
//     const updatedCart = [...storedCart, { ...product, quantity: 1, totalPrice: product.price }]
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart))
//     setCartCount(updatedCart.length)
//      toast("Added to cart", {
//       description: `${product.product_name} has been added to your cart.`,
//     })
//     queryClient.invalidateQueries({ queryKey: ["cart"] })
//   }

//   // if (cartLoading) {
//   //   return (
//   //     <div className="min-h-screen bg-gray-50">
//   //       <MarketplaceHeader cartCount={cartCount} onSearch={() => {}} />
//   //       <div className="flex items-center justify-center h-96">
//   //         <p className="text-gray-600">Loading cart...</p>
//   //       </div>
//   //     </div>
//   //   )
//   // }

//   // if (!cart || cart.items.length === 0) {
//   if (!cart || cart.length === 0) {
//     return (
//       <div className="min-h-screen">
//         <MarketplaceHeader cartCount={0} onSearch={() => {}} />
//         <div className="max-w-7xl mx-auto px-4 py-12 text-center">
//           <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
//           <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate("/user/market-place")}>
//             Continue Shopping
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <MarketplaceHeader cartCount={cartCount} onSearch={() => {}} />

//       {/* Cart Content */}
//       <div className="max-w-7xl mx-auto  py-6">
//         {/* Top Info */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//           <div className="flex items-center gap-4">
//             <div>
//               <h2 className="text-2xl font-bold ">Local Market</h2>
//               {/* <p className="text-green-600 text-sm">🟢 Shopping in 07114</p> */}
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row gap-4">
//             <Button variant="outline" className="flex items-center gap-2 bg-transparent">
//               <Calendar className="w-5 h-5" />
//               {getDisplayDate()}
//             </Button>
//             {/* <div className="text-right">
//               <p className="text-sm font-semibold">Free delivery + saving $3.00 on this order</p>
//               <p className="text-xs text-gray-600">Go to</p>
//             </div> */}
//           </div>
//         </div>

//         {/* Main Content */}
//         <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-12">
//           {/* Cart Items */}
//           <div className="lg:col-span-2">
//             {/* <CartItems items={cart.items} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} /> */}
//             <CartItems items={cart} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />
//           </div>

//           {/* Order Summary */}
//           <div>
//             {/* <OrderSummary cart={cart} onCheckout={handleCheckout} isLoading={checkoutMutation.isPending} /> */}
//             <OrderSummary
//               cart={calculateCartTotals(cart)}
//               onCheckout={handleCheckout}
//               isBuyingOnCredit={isBuyingOnCredit}
//               onStartBuyOnCredit={() => setIsBuyingOnCredit(true)}
//               onCancelBuyOnCredit={() => setIsBuyingOnCredit(false)}
//               // onCheckoutOnCredit={(duration) => {
//               //   const payload = {
//               //     product_id: product.,
//               //     duration,
//               //     items: cart.map((item: CartItem) => ({
//               //       product_id: item.product_id,
//               //       quantity: item.quantity,
//               //     })),
//               //   }
//               //   checkoutMutation.mutate(payload)
//               // }}
//               isLoading={checkoutMutation.isPending} />
//           </div>
//         </div>

//         {/* Recommendations */}
//         <div className="mb-12">
//           {/* <RecommendationsCarousel products={recommendations} onAddToCart={handleAddRecommendationToCart}  /> */}
//           { recommendationsLoading ? (
//             // <p className="text-gray-600">Loading recommendations...</p>
//           <PageLoader />
//           ) : (
//             <RecommendationsCarousel products={recommendations} onAddToCart={handleAddRecommendationToCart}  />
//           ) }
//         </div>
//       </div>
//     </div>
//   )
// }
