import React from "react"
import { ShoppingCart, Search, Menu, 
  // MapPin, TruckElectric, BadgeIndianRupee 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

interface MarketplaceHeaderProps {
  cartCount: number
  onSearch: (query: string) => void
  onMenuClick?: () => void
}

export function MarketplaceHeader({
  cartCount,
  onSearch,
  // onMenuClick
}: MarketplaceHeaderProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")


// Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 1000) 

    return () => clearTimeout(handler)
  }, [searchQuery])

// Trigger search when debounced query changes and has +3 characters
   useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (trimmed.length >= 3 || trimmed.length === 0) {
      // Only call API when input has 3+ chars or is cleared
      onSearch(trimmed)
    }
  }, [debouncedQuery, onSearch])



  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const query = e.target.value
    // setSearchQuery(query)
    // onSearch(query)
    setSearchQuery(e.target.value)
  }

  const handleCartClick = () => {
    // navigate("cart")
    navigate("/user/cart")
  }

  return (
    <div className="bg-inherit backdrop-blur-xl border-b border-gray-200 sticky top-[-25px] z-40">
      {/* Top Info Bar */}
      <div className=" px-4 py-2 text-sm flex flex-col md:flex-row justify-between md:items-center gap-2">
        <span>Welcome to worldwide Megamart!</span>
        {/* <div className="flex flex-col md:flex-row gap-6 text-xs">
          <span><MapPin className="inline w-4 h-4 text-green-500" /> Deliver to 423651</span>
          <span><TruckElectric className="inline w-4 h-4 text-green-500" /> Track your order</span>
          <span><BadgeIndianRupee className="inline w-4 h-4 text-green-500" /> Vouchers</span>
        </div> */}
      </div>

      {/* Main Header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1> */}

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center bg-green-100 rounded-lg px-4 py-2 gap-2">
            <Search className="w-5 h-5 text-green-600" />
            <Input
              type="text"
              placeholder="Search essentials, groceries and more..."
              className="border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-500 shadow-none "
              value={searchQuery}
              onChange={handleSearch}
            />
            <Menu className="w-5 h-5 text-gray-400" />
          </div>

          {/* Cart Icon */}
          <Button variant="ghost" size="icon" className="relative" onClick={handleCartClick}>
            <ShoppingCart className="w-6 h-6 text-green-500" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -left-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center p-0 text-xs">
                {cartCount}
              </Badge>
            )}
            Cart
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden flex items-center bg-green-100 rounded-lg px-4 py-2 gap-2">
          <Search className="w-5 h-5 text-green-600" />
          <Input
            type="text"
            placeholder="Search essentials, groceries and more..."
            className="border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-500 text-xs"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
    </div>
  )
}
