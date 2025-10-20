import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Star, Heart, Share2, ShoppingCart, Truck, RotateCcw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MainLayout from "@/components/main-layout"


// Mock product data - in a real app, this would come from a database
const products = [
  {
    id: "1",
    name: "Premium Cotton Shirt",
    description:
      "A high-quality cotton shirt that offers both comfort and style. Perfect for casual and semi-formal occasions.",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    rating: 4.5,
    reviews: 128,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    colors: ["#000000", "#FFFFFF", "#0000FF"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Western Wear",
    inStock: true,
    deliveryTime: "2-3 days",
    features: ["100% Premium Cotton", "Breathable fabric", "Machine washable", "Slim fit design"],
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="mb-4 flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href={`/category/${product.category.toLowerCase().replace(" ", "-")}`} className="hover:text-foreground">
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden border">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                <span className="text-sm font-medium text-green-600">{product.discount}% off</span>
              </>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="space-y-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className="h-8 w-8 rounded-full border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none"
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="h-10 min-w-[40px] px-3 rounded-md border hover:border-primary focus:border-primary focus:outline-none"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button size="icon" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-3 border-t pt-6">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-sm text-muted-foreground">Estimated delivery: {product.deliveryTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-sm text-muted-foreground">30 days return policy</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Secure Checkout</p>
                <p className="text-sm text-muted-foreground">Multiple payment options available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="fitting">Virtual Fitting</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Features</h3>
              <ul className="list-disc pl-5 space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2 bg-muted font-medium">Material</td>
                        <td className="px-4 py-2">100% Cotton</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 bg-muted font-medium">Fit</td>
                        <td className="px-4 py-2">Slim Fit</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 bg-muted font-medium">Care</td>
                        <td className="px-4 py-2">Machine Wash</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 bg-muted font-medium">Country of Origin</td>
                        <td className="px-4 py-2">India</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-5xl font-bold">{product.rating}</div>
                <div className="flex items-center justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{product.reviews} reviews</div>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-2">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>

              <div className="space-y-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">Great product!</span>
                    </div>

                    <p className="text-sm mb-2">
                      The quality of this shirt is amazing. The fabric feels premium and the fit is perfect. I've
                      received many compliments wearing it. Highly recommended!
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>John D.</span>
                      <span>•</span>
                      <span>Verified Purchase</span>
                      <span>•</span>
                      <span>2 weeks ago</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="mt-4">
                Load More Reviews
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fitting" className="mt-6">
         
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}

