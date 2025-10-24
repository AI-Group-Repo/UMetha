"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wallet,
  Users,
  TrendingUp,
  ShoppingBag,
  Camera,
  Share2,
  LineChart,
  BarChart,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface Order {
  id: number;
  productId: number;
  customerName: string;
  quantity: number;
  total: number;
  status: "Pending" | "Paid" | "Shipped";
}

export default function InfluencerDashboard() {
  const [statistics] = useState({
    totalEarnings: "$12,538",
    followers: "128.4K",
    engagementRate: "4.7%",
    productsSold: 843,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: Date.now(),
    name: "",
    description: "",
    price: 0,
    images: [],
  });

  const [showProductForm, setShowProductForm] = useState(false);
  const [carouselIndexes, setCarouselIndexes] = useState<{ [key: number]: number }>({});
  const [paymentProduct, setPaymentProduct] = useState<Product | null>(null);

  // ✅ Profile Management
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({
    name: "Influencer Jane",
    email: "influencer@umetha.com",
    bio: "Passionate about lifestyle and fashion.",
    profilePic: "/default-profile.png",
  });

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, profilePic: url }));
  };

  const handleNextImage = (productId: number) => {
    setCarouselIndexes((prev) => {
      const index = prev[productId] || 0;
      const product = products.find((p) => p.id === productId);
      if (!product || product.images.length === 0) return prev;
      const nextIndex = (index + 1) % product.images.length;
      return { ...prev, [productId]: nextIndex };
    });
  };

  const handlePrevImage = (productId: number) => {
    setCarouselIndexes((prev) => {
      const index = prev[productId] || 0;
      const product = products.find((p) => p.id === productId);
      if (!product || product.images.length === 0) return prev;
      const prevIndex = (index - 1 + product.images.length) % product.images.length;
      return { ...prev, [productId]: prevIndex };
    });
  };

  const handleAddOrUpdateProduct = () => {
    if (!newProduct.name || newProduct.price <= 0) {
      alert("Please enter a valid product name and price.");
      return;
    }
    const exists = products.find((p) => p.id === newProduct.id);
    if (exists) {
      setProducts((prev) => prev.map((p) => (p.id === newProduct.id ? newProduct : p)));
    } else {
      setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
    }
    setNewProduct({ id: Date.now(), name: "", description: "", price: 0, images: [] });
    setShowProductForm(false);
  };

  const handleDeleteProduct = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setOrders((prev) => prev.filter((o) => o.productId !== id));
  };

  const handleEditProduct = (id: number) => {
    const productToEdit = products.find((p) => p.id === id);
    if (productToEdit) {
      setNewProduct(productToEdit);
      setShowProductForm(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setNewProduct((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...Array.from(files).map((file) => URL.createObjectURL(file)),
      ],
    }));
  };

  const handleAddToCart = (product: Product) => {
    alert(`Added "${product.name}" to cart!`);
  };

  const handlePayClick = (product: Product) => {
    setPaymentProduct(product);
  };



  const handleCancelPayment = () => {
    setPaymentProduct(null);
  }


const [paymentMethod, setPaymentMethod] = useState(""); // Selected payment method
const [cardDetails, setCardDetails] = useState({
  name: "",
  number: "",
  expiry: "",
  cvc: "",
});

const handleConfirmPayment = () => {
  if (!paymentProduct) return;

  if (!paymentMethod) {
    alert("Select a payment method!");
    return;
  }

  if (paymentMethod === "card") {
    const { name, number, expiry, cvc } = cardDetails;
    if (!name || !number || !expiry || !cvc) {
      alert("Fill all card details!");
      return;
    }
  }

  alert(`Payment successful with ${paymentMethod} for "${paymentProduct.name}"!`);
  setOrders((prev) => [
    ...prev,
    {
      id: Date.now(),
      productId: paymentProduct.id,
      customerName: "Jane Doe",
      quantity: 1,
      total: paymentProduct.price,
      status: "Paid",
    },
  ]);
  setPaymentProduct(null);
  setPaymentMethod("");
  setCardDetails({ name: "", number: "", expiry: "", cvc: "" });
};

  
  return (
    <div className="p-4 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 relative">
        <div>
          <h1 className="text-2xl font-bold">Influencer Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here's an overview of your performance, products, and orders.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0 relative">
          <Button>
            <Camera className="mr-2 h-4 w-4" />
            Create Content
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowProductForm((prev) => !prev)}
          >
            {showProductForm ? "Close Product Form" : "Add Product"}
          </Button>

      {/* ✅ Profile Menu */}
<div className="relative">
  <img
    src={profile.profilePic}
    alt="Profile"
    className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-200"
    onClick={() => setShowProfileMenu((prev) => !prev)}
  />
  {showProfileMenu && (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-3 border-b dark:border-gray-700">
        <p className="font-semibold">{profile.name}</p>
        <p className="text-sm text-gray-500">{profile.email}</p>
      </div>
      <button
        onClick={() => {
          setShowProfileModal(true);
          setShowProfileMenu(false);
        }}
        className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Settings className="h-4 w-4 mr-2" /> Manage Profile
      </button>

      {/* ✅ Updated Logout Button */}
      <button
        onClick={() => {
          // Perform logout logic here if needed
          // e.g. clear auth context, localStorage, etc.
          window.location.href = "/dashboard-signin";
        }}
        className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <LogOut className="h-4 w-4 mr-2" /> Logout
      </button>
    </div>
  )}
</div>
        </div>
      </div>

     {/* ✅ Profile Edit Modal */}
{showProfileModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={profile.profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full mb-2 object-cover border-2 border-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            title="Click to change profile picture"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click on the image to upload a new profile picture
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter full name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Enter email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

       


        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setShowProfileModal(false)}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              alert("Profile updated successfully!");
              setShowProfileModal(false);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Save
          </Button>
        </div>
      </form>

      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        onClick={() => setShowProfileModal(false)}
      >
        ✕
      </button>
    </div>
  </div>
)}

      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.totalEarnings}</p>
                <p className="text-xs text-green-500">+18% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.followers}</p>
                <p className="text-xs text-green-500">+2.3K this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Sales Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.productsSold}</p>
                <p className="text-xs text-green-500">+125 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{statistics.engagementRate}</p>
                <p className="text-xs text-green-500">+0.8% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>
              Monthly engagement and conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md">
              <LineChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Promotions</CardTitle>
            <CardDescription>Sales by promoted product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md">
              <BarChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>


{/* Product Form */}
{showProductForm && (
  <Card className="mb-8 p-6 shadow-md border border-gray-200 dark:border-gray-700">
    <CardHeader className="pb-4">
      <CardTitle className="text-xl font-semibold">
        {products.some((p) => p.id === newProduct.id) ? "Edit Product" : "Add New Product"}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Product Name & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <textarea
        placeholder="Description"
        value={newProduct.description}
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
        rows={4}
      />

      {/* Image Upload */}
      <div className="mt-2">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            className="w-10 h-10 mb-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16v-4m0 0V8m0 4h4m-4 0H3m13 4l4-4m0 0l-4-4m4 4H13"
            />
          </svg>
          <span className="text-gray-500 dark:text-gray-400">
            Click or drag files to upload
          </span>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Images Preview + Reorder/Delete */}
      {newProduct.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {newProduct.images.map((img, index) => (
            <div
              key={index}
              className="relative border rounded overflow-hidden cursor-move"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", index.toString())}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
                const droppedIndex = index;
                const updatedImages = [...newProduct.images];
                const [draggedImage] = updatedImages.splice(draggedIndex, 1);
                updatedImages.splice(droppedIndex, 0, draggedImage);
                setNewProduct({ ...newProduct, images: updatedImages });
              }}
            >
              <img src={img} alt={`product-${index}`} className="w-full h-32 object-cover" />
              <button
                onClick={() => {
                  const updatedImages = newProduct.images.filter((_, i) => i !== index);
                  setNewProduct({ ...newProduct, images: updatedImages });
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save / Update Product */}
      <Button
        onClick={handleAddOrUpdateProduct}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {products.some((p) => p.id === newProduct.id) ? "Update Product" : "Save Product"}
      </Button>
    </CardContent>
  </Card>
)}



{/* Products List Heading */}
<h2 className="text-2xl font-semibold mb-4">My Products</h2>

{/* Products List */}
{products.length === 0 ? (
  <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg mb-8">
    <p className="text-gray-400 text-lg">No products added yet. Click "Add Product" to create one!</p>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {products.map((product) => {
      const index = carouselIndexes[product.id] || 0;
      return (
        <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {product.images.length > 0 ? (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[index]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Navigation Buttons */}
              <button
                onClick={() => handlePrevImage(product.id)}
                className="absolute top-1/2 left-2 bg-black bg-opacity-60 text-white p-2 rounded-full -translate-y-1/2 hover:bg-opacity-80"
              >
                ◀
              </button>
              <button
                onClick={() => handleNextImage(product.id)}
                className="absolute top-1/2 right-2 bg-black bg-opacity-60 text-white p-2 rounded-full -translate-y-1/2 hover:bg-opacity-80"
              >
                ▶
              </button>
              {/* Image indicators */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {product.images.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === index ? "bg-indigo-600" : "bg-white opacity-50"}`}
                  ></span>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-lg">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          <CardContent className="p-4">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
            </CardHeader>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
            <p className="font-bold text-indigo-600 mb-4">${product.price.toFixed(2)}</p>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => handleEditProduct(product.id)} className="flex-1">
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteProduct(product.id)}
                className="flex-1"
              >
                Delete
              </Button>
              <Button size="sm" onClick={() => handleAddToCart(product)} className="flex-1">
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePayClick(product)}
                className="flex-1"
              >
                Pay
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
)}


      {/* Payment Modal */}
    {paymentProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg w-11/12 max-w-md p-6 relative">
      <h3 className="text-xl font-semibold mb-4">Confirm Payment</h3>
      <img
        src={paymentProduct.images[0] || ""}
        alt={paymentProduct.name}
        className="w-64 h-64 object-cover rounded-lg mb-4 mx-auto"
      />
      <h4 className="font-semibold text-lg">{paymentProduct.name}</h4>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-2">{paymentProduct.description}</p>
      <p className="font-bold text-indigo-600 mb-4">${paymentProduct.price.toFixed(2)}</p>

     {/* Payment Method Selector */}
<div className="mb-4 space-y-3">
  <p className="font-medium">Select Payment Method:</p>
  <div className="flex gap-3">
    <button
      onClick={() => setPaymentMethod("card")}
      className={`flex-1 p-3 border rounded-lg text-center transition-colors ${
        paymentMethod === "card"
          ? "border-indigo-600 bg-indigo-50 dark:bg-gray-700"
          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      Credit/Debit Card
    </button>
    <button
      onClick={() => setPaymentMethod("paypal")}
      className={`flex-1 p-3 border rounded-lg text-center transition-colors ${
        paymentMethod === "paypal"
          ? "border-indigo-600 bg-indigo-50 dark:bg-gray-700"
          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      PayPal
    </button>
    <button
      onClick={() => setPaymentMethod("wallet")}
      className={`flex-1 p-3 border rounded-lg text-center transition-colors ${
        paymentMethod === "wallet"
          ? "border-indigo-600 bg-indigo-50 dark:bg-gray-700"
          : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      Wallet
    </button>
  </div>
</div>

{/* Card Details Form */}
{paymentMethod === "card" && (
  <div className="space-y-2 mb-4">
    <input
      type="text"
      placeholder="Cardholder Name"
      value={cardDetails.name}
      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />
    <input
      type="text"
      placeholder="Card Number"
      value={cardDetails.number}
      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="MM/YY"
        value={cardDetails.expiry}
        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="CVC"
        value={cardDetails.cvc}
        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
        className="w-20 p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Enter valid card details. This is a demo form; no actual payment is processed.
    </p>
  </div>
)}

{/* PayPal Info */}
{paymentMethod === "paypal" && (
  <div className="mb-4 p-3 border rounded bg-yellow-50 dark:bg-gray-700">
    <p className="text-gray-700 dark:text-gray-300">
      You will be redirected to PayPal to complete your payment.
    </p>
  </div>
)}

{/* Wallet Info */}
{paymentMethod === "wallet" && (
  <div className="mb-4 p-3 border rounded bg-green-50 dark:bg-gray-700">
    <p className="text-gray-700 dark:text-gray-300">
      Payment will be deducted from your wallet balance.
    </p>
  </div>
)}

{/* Action Buttons */}
<div className="flex gap-4">
  <Button
    onClick={handleConfirmPayment}
    className="bg-indigo-600 hover:bg-indigo-700 flex-1"
  >
    Pay Now
  </Button>
  <Button variant="outline" onClick={handleCancelPayment} className="flex-1">
    Cancel
  </Button>
</div>

{/* Close Button */}
<button
  onClick={handleCancelPayment}
  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-bold text-lg"
>
  ✕
</button>
    </div>
  </div>
)}




  {/* Orders Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Track product orders and payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-200">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const product = products.find((p) => p.id === order.productId);
                  return (
                    <tr key={order.id} className="border-b">
                      <td className="p-2 border">{order.id}</td>
                      <td className="p-2 border">{product?.name || "Deleted Product"}</td>
                      <td className="p-2 border">{order.customerName}</td>
                      <td className="p-2 border">{order.quantity}</td>
                      <td className="p-2 border">${order.total.toFixed(2)}</td>
                      <td className="p-2 border">
                        <Badge variant={order.status === "Paid" ? "default" : "outline"} className={order.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" : ""}>{order.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


      {/* Active Campaigns */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Your ongoing brand collaborations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-medium">Campaign</th>
                  <th className="pb-3 font-medium">Brand</th>
                  <th className="pb-3 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Earnings</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">Summer Collection Launch</td>
                  <td className="py-4">Fashion Brand X</td>
                  <td className="py-4">Apr 10 - May 15</td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Active
                    </Badge>
                  </td>
                  <td className="py-4">$3,250</td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">Fitness Product Review</td>
                  <td className="py-4">GymTech</td>
                  <td className="py-4">Apr 5 - Apr 25</td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Active
                    </Badge>
                  </td>
                  <td className="py-4">$1,800</td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">Beauty Tutorial Series</td>
                  <td className="py-4">Glow Cosmetics</td>
                  <td className="py-4">Mar 20 - Apr 20</td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      Due Soon
                    </Badge>
                  </td>
                  <td className="py-4">$2,500</td>
                  <td className="py-4 text-right">
                    <Button variant="link" className="h-auto p-0">
                      View Details
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/influencer/campaigns">
                View All Campaigns
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>New Collaboration Opportunities</CardTitle>
          <CardDescription>
            Brand partnership requests waiting for your response
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">Luxury Watch Brand</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Looking for lifestyle content featuring our new collection
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Budget:</span> $2,000 - $3,500
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Duration:</span> 30 days
                  </p>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <Button size="sm">View Details</Button>
                  <Button size="sm" variant="outline">
                    Decline
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">Organic Food Delivery</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Seeking health and wellness content creators for a 3-month
                    campaign
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Budget:</span> $4,500 - $6,000
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Duration:</span> 90 days
                  </p>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <Button size="sm">View Details</Button>
                  <Button size="sm" variant="outline">
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              Browse More Opportunities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
