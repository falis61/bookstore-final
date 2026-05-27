import React, { useEffect, useMemo, useState } from "react";
import Loader from "../components/Loader/Loader";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../Store/auth";
import toast from "react-hot-toast";

const getStoredItem = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key);

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Cart, setCart] = useState(null);
  const [Total, setTotal] = useState(0);

  const headers = {
    id: getStoredItem("id"),
    authorization: `Bearer ${getStoredItem("token")}`,
  };

  const toastStyle = {
    style: {
      background: "#6A4A3A",
      color: "#FFF8F0",
      border: "1px solid #D2B07A",
    },
  };

  const errorToastStyle = {
    style: {
      background: "#6A4A3A",
      color: "#FFF8F0",
      border: "1px solid #C95A5A",
    },
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://bookstore-backend-x6dx.onrender.com/api/v1/get-user-cart",
        { headers }
      );

      setCart(response.data.data);
      dispatch(authActions.setCartCount(response.data.data.length));
    };

    fetch();
  }, [dispatch]);

  // ---------- REMOVE ----------
  const deleteItem = async (item) => {
    try {
      if (item.itemType === "bundle") {
        const response = await axios.put(
          `https://bookstore-backend-x6dx.onrender.com/api/v1/remove-bundle-from-cart/${item.bundle._id}`,
          {},
          { headers }
        );

        toast.success(response.data.message, toastStyle);

        setCart((prev) =>
          prev.filter((i) => i.bundle?._id !== item.bundle._id)
        );
      } else {
        const response = await axios.put(
          `https://bookstore-backend-x6dx.onrender.com/api/v1/remove-book-from-cart/${item.book._id}`,
          {},
          { headers }
        );

        toast.success(response.data.message, toastStyle);

        setCart((prev) =>
          prev.filter((i) => i.book?._id !== item.book._id)
        );
      }

      dispatch(authActions.decrementCartCount());
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove item",
        errorToastStyle
      );
    }
  };

  // ---------- INCREASE ----------
  const increaseQty = async (item) => {
    try {
      if (item.itemType === "bundle") {
        await axios.put(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/add-bundle-to-cart",
          {},
          {
            headers: {
              ...headers,
              bundleid: item.bundle._id,
            },
          }
        );

        setCart((prev)=>
          prev.map((i)=>
            i.bundle?._id===item.bundle._id
              ? {...i, quantity:i.quantity+1}
              : i
          )
        );
      } else {
        await axios.put(
          "https://bookstore-backend-x6dx.onrender.com/api/v1/add-book-to-cart",
          {},
          {
            headers:{
              ...headers,
              bookid:item.book._id,
            }
          }
        );

        setCart((prev)=>
          prev.map((i)=>
            i.book?._id===item.book._id
              ? {...i, quantity:i.quantity+1}
              : i
          )
        );
      }

    } catch(error){
      toast.error(
        error.response?.data?.message || "Failed to increase quantity",
        errorToastStyle
      );
    }
  };

  // ---------- DECREASE ----------
  const decreaseQty = async(item)=>{

    try{

      if(item.itemType==="bundle"){

        await axios.put(
          `https://bookstore-backend-x6dx.onrender.com/api/v1/decrease-bundle-from-cart/${item.bundle._id}`,
          {},
          {headers}
        );

        if(item.quantity===1){
          setCart((prev)=>
            prev.filter((i)=>i.bundle?._id!==item.bundle._id)
          );
          dispatch(authActions.decrementCartCount());
        }else{
          setCart((prev)=>
            prev.map((i)=>
              i.bundle?._id===item.bundle._id
                ? {...i,quantity:i.quantity-1}
                : i
            )
          );
        }

      }else{

        await axios.put(
          `https://bookstore-backend-x6dx.onrender.com/api/v1/decrease-book-from-cart/${item.book._id}`,
          {},
          {headers}
        );

        if(item.quantity===1){
          setCart((prev)=>
            prev.filter((i)=>i.book?._id!==item.book._id)
          );
          dispatch(authActions.decrementCartCount());
        }else{
          setCart((prev)=>
            prev.map((i)=>
              i.book?._id===item.book._id
                ? {...i,quantity:i.quantity-1}
                : i
            )
          );
        }
      }

    }catch(error){
      toast.error(
        error.response?.data?.message || "Failed to decrease quantity",
        errorToastStyle
      );
    }
  };


  // ---------- TOTAL ----------
  useEffect(()=>{

    if(Cart && Cart.length>0){

      let total=0;

      Cart.forEach((item)=>{

        if(item.itemType==="bundle"){
          total += Number(item.bundlePrice||0) * item.quantity;
        }else{
          total += item.book.price * item.quantity;
        }

      });

      setTotal(total);

    }else{
      setTotal(0);
    }

  },[Cart]);



  // only normal books can be out of stock
  const hasOutOfStockItems = useMemo(() => {
    if(!Cart || Cart.length===0) return false;

    return Cart.some(
      (item)=>
        item.itemType==="book" &&
        item.book &&
        item.book.stock<=0
    );

  },[Cart]);


  const totalBooks = useMemo(()=>{
    if(!Cart || Cart.length===0) return 0;

    return Cart.reduce(
      (sum,item)=>sum+item.quantity,
      0
    );

  },[Cart]);


  const shippingCost=Total>100?0:5;
  const finalTotal=Total+shippingCost;


  const getStockBadge=(stock)=>{
    if(stock===0){
      return(
        <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
          Out of Stock
        </span>
      );
    }

    if(stock<=5){
      return(
        <span className="inline-block px-3 py-1 rounded-full bg-[#F6EEDF] text-[#6A4A3A] text-xs font-semibold border border-[#E7DCCD]">
          Low Stock
        </span>
      );
    }

    return(
      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        In Stock
      </span>
    );
  };


  const handleProceedToCheckout=()=>{
    if(hasOutOfStockItems){
      toast(
        "Please remove out-of-stock books before proceeding to checkout",
        toastStyle
      );
      return;
    }

    navigate("/checkout");
  };


return(
<div className="bg-[#F8F4EC] min-h-screen px-4 md:px-8 lg:px-10 py-8">

{!Cart &&(
<div className="w-full h-full flex items-center justify-center">
<Loader/>
</div>
)}

{Cart && Cart.length===0 &&(
<div className="min-h-[80vh] flex items-center justify-center flex-col text-center">
<h1 className="text-4xl md:text-6xl font-semibold text-[#6A4A3A] opacity-40">
Empty Cart
</h1>

<img
src="/empty-cart.png"
alt="empty cart"
className="mt-6 lg:h-[42vh]"
/>
</div>
)}


{Cart && Cart.length>0 &&(
<>
<div className="mb-8">
<h1 className="text-4xl md:text-5xl font-semibold text-[#3B2218] mb-8">
Your Cart
</h1>
</div>


<div className="grid grid-cols-1 xl:grid-cols-[1.55fr_0.75fr] gap-6 items-start">

<div>

{Cart.map((item,i)=>{

const isBundle=item.itemType==="bundle";

return(

<div
key={i}
className="w-full mb-5 rounded-[18px] bg-[#FCF9F4] border border-[#E7DCCD] shadow-sm p-4 md:p-5"
>

<div className="flex flex-col md:flex-row gap-5">

<div className="w-full md:w-[170px] flex-shrink-0">
<div className="h-[220px] md:h-[200px] bg-[#F8F4EC] border border-[#E7DCCD] rounded-[14px] p-3 flex items-center justify-center overflow-hidden">

<img
src={isBundle ? item.bundle.image : item.book.url}
alt={isBundle ? item.bundle.title : item.book.title}
className="h-full w-full object-contain rounded-[10px]"
/>

</div>
</div>


<div className="flex-1 flex flex-col justify-between">
<div>

<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

<div>

<h2 className="text-xl md:text-2xl font-semibold text-[#5A4032]">
{isBundle ? item.bundle.title : item.book.title}
</h2>

<p className="text-[#7B6253] mt-2 leading-7">
{isBundle
? `${item.bundle.books?.length || 0} books bundle`
: `${item.book.desc.slice(0,120)}...`}
</p>

</div>


<div className="text-left lg:text-right">

<p className="text-[#6A4A3A] text-2xl md:text-3xl font-semibold">
$
{isBundle
? (item.bundlePrice*item.quantity).toFixed(2)
: (item.book.price*item.quantity).toFixed(2)}
</p>

<p className="text-[#8B6D5A] text-sm mt-1">
{isBundle
? `$${item.bundlePrice.toFixed(2)} each`
: `$${item.book.price} each`}
</p>
{isBundle && (
  <p className="text-green-700 text-sm font-semibold mt-1">
    You saved $
    {(
      (Number(item.bundleOriginalPrice || 0) -
        Number(item.bundlePrice || 0)) *
      item.quantity
    ).toFixed(2)}
  </p>
)}

</div>

</div>


<div className="mt-4 flex items-center gap-3 flex-wrap">

{isBundle ? (
<span className="inline-block px-3 py-1 rounded-full bg-[#F6EEDF] text-[#6A4A3A] text-xs font-semibold border border-[#E7DCCD]">
Bundle Save {item.bundleDiscountPercent}%
</span>
) : (
<>
{getStockBadge(item.book.stock)}

<p className="text-sm text-[#7B6253]">
Available stock: {item.book.stock}
</p>
</>
)}

</div>

</div>


<div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

<div className="flex items-center gap-3">

<button
className="bg-[#3B2218] text-[#FFF8F0] w-10 h-10 rounded-[10px]"
onClick={()=>decreaseQty(item)}
>
-
</button>

<span className="text-[#5A4032] font-semibold text-lg min-w-[28px] text-center">
{item.quantity}
</span>

<button
className="bg-[#3B2218] text-[#FFF8F0] w-10 h-10 rounded-[10px]"
onClick={()=>increaseQty(item)}
>
+
</button>

</div>

<button
className="bg-[#F8F4EC] text-red-600 border border-red-300 rounded-[10px] p-2"
onClick={()=>deleteItem(item)}
>
<AiFillDelete size={18}/>
</button>

</div>

</div>

</div>

</div>

);

})}

</div>


<div className="xl:sticky xl:top-6">
<div className="bg-[#FCF9F4] border border-[#E7DCCD] rounded-[18px] shadow-sm p-5 md:p-6">

<h2 className="text-2xl font-semibold text-[#5A4032]">
Order Summary
</h2>

<div className="h-[2px] bg-[#E7DCCD] my-4"></div>

<div className="space-y-3 text-[#5A4032]">

<div className="flex items-center justify-between">
<span className="text-[#7B6253]">Items</span>
<span className="font-medium">{totalBooks}</span>
</div>

<div className="flex items-center justify-between">
<span className="text-[#7B6253]">Subtotal</span>
<span className="font-medium">${Total.toFixed(2)}</span>
</div>

<div className="flex items-center justify-between">
<span className="text-[#7B6253]">Shipping</span>
<span className="font-medium">
{shippingCost===0?"Free":`$${shippingCost.toFixed(2)}`}
</span>
</div>

</div>

<div className="h-[2px] bg-[#E7DCCD] my-4"></div>

<div className="flex items-center justify-between text-xl font-semibold text-[#5A4032]">
<span>Total</span>
<span>${finalTotal.toFixed(2)}</span>
</div>


<div className="w-full mt-5">

<button
className={`rounded-[12px] px-4 py-3 flex justify-center w-full font-semibold transition ${
hasOutOfStockItems
? "bg-gray-300 text-gray-500 cursor-not-allowed"
: "bg-[#3B2218] text-[#FFF8F0]"
}`}
onClick={handleProceedToCheckout}
disabled={hasOutOfStockItems}
>
Proceed to Checkout
</button>

</div>

</div>
</div>

</div>
</>
)}

</div>
);
};

export default Cart;