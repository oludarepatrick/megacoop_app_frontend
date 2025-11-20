import { Avatar, AvatarImage } from "@/components/ui/avatar"
import type { RecentlyViewed } from "@/types/marketplaceTypes"

interface RecentlyViewedProps {
  items: RecentlyViewed[]
}

export function RecentlyViewedSection({ items }: RecentlyViewedProps) {
  return (
    <div className="px-4 py-6">
      <h3 className="text-xl font-bold mb-4">Recently viewed</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0">
            <Avatar className="w-20 h-20 md:w-24 md:h-24">
              <AvatarImage src={item.image || "/placeholder.svg"} alt={item.name} />
            </Avatar>
          </div>
        ))}
      </div>
    </div>
  )
}
