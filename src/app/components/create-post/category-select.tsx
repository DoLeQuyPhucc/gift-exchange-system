import { useState } from 'react'
import { Check, ChevronDown, Search } from "lucide-react"
import * as Popover from '@radix-ui/react-popover'
import { Category } from '@/app/types/types'

interface CategorySelectProps {
  onValueChange: (value: string) => void
  categories: Category[]
}

const CategorySelect = ({ onValueChange, categories }: CategorySelectProps) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (currentValue: string) => {
    setValue(currentValue)
    onValueChange(currentValue)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          role="combobox"
          aria-expanded={open}
        >
          {value || "Chọn danh mục..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 min-w-[200px] w-[--radix-popover-trigger-width] overflow-hidden rounded-md border bg-white shadow-md animate-in"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-70" />
            <input
              placeholder="Tìm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="max-h-[300px] overflow-auto">
            {filteredCategories.length === 0 ? (
              <div className="py-6 text-center text-sm">Không tìm thấy danh mục</div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleSelect(category.name)}
                >
                  <span className="w-6">
                    {value === category.name && (
                      <Check className="h-4 w-4" />
                    )}
                  </span>
                  {category.name}
                </div>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default CategorySelect