"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  FolderOpen,
  Folder,
  ChevronRight,
  Tag,
  Package,
  TrendingUp,
  Settings,
} from "lucide-react"
import { ProductCategory } from "@/lib/inventory-types"

interface ProductCategoriesProps {
  categories: ProductCategory[]
  onCategoryAdd?: (category: Partial<ProductCategory>) => void
  onCategoryEdit?: (category: ProductCategory) => void
  onCategoryDelete?: (categoryId: string) => void
  isLoading?: boolean
}

interface CategoryFormData {
  name: string
  parentCategory?: string
  description?: string
  removalStrategy: 'fifo' | 'lifo' | 'fefo'
}

export function ProductCategories({
  categories,
  onCategoryAdd,
  onCategoryEdit,
  onCategoryDelete,
  isLoading = false
}: ProductCategoriesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    parentCategory: "",
    description: "",
    removalStrategy: "fifo"
  })

  // Create category hierarchy
  const categoryHierarchy = useMemo(() => {
    const rootCategories = categories.filter(cat => !cat.parentCategory)
    
    const buildHierarchy = (parentId?: string, level = 0): any[] => {
      const children = categories.filter(cat => cat.parentCategory === parentId)
      return children.map(cat => ({
        ...cat,
        level,
        children: buildHierarchy(cat.id, level + 1)
      }))
    }

    return rootCategories.map(cat => ({
      ...cat,
      level: 0,
      children: buildHierarchy(cat.id, 1)
    }))
  }, [categories])

  // Flatten hierarchy for table view
  const flattenCategories = (cats: any[], result: any[] = []): any[] => {
    cats.forEach(cat => {
      result.push(cat)
      if (cat.children && cat.children.length > 0) {
        flattenCategories(cat.children, result)
      }
    })
    return result
  }

  const flatCategories = flattenCategories(categoryHierarchy)

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return flatCategories
    return flatCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [flatCategories, searchTerm])

  // Get category stats
  const getCategoryStats = (categoryId: string) => {
    // Mock stats - in real app this would come from API
    const productCount = Math.floor(Math.random() * 100)
    const totalValue = Math.floor(Math.random() * 50000)
    return { productCount, totalValue }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      onCategoryEdit?.({ ...editingCategory, ...formData })
    } else {
      onCategoryAdd?.(formData)
    }
    handleCloseForm()
  }

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      parentCategory: category.parentCategory || "",
      description: "",
      removalStrategy: category.removalStrategy
    })
    setShowCategoryForm(true)
  }

  const handleCloseForm = () => {
    setShowCategoryForm(false)
    setEditingCategory(null)
    setFormData({
      name: "",
      parentCategory: "",
      description: "",
      removalStrategy: "fifo"
    })
  }

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const renderCategoryRow = (category: any) => {
    const stats = getCategoryStats(category.id)
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.includes(category.id)

    return (
      <TableRow key={category.id}>
        <TableCell>
          <div className="flex items-center" style={{ paddingLeft: `${category.level * 20}px` }}>
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 p-0 w-5 h-5"
                onClick={() => toggleExpanded(category.id)}
              >
                <ChevronRight 
                  className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                />
              </Button>
            )}
            {hasChildren ? (
              <FolderOpen className={`mr-2 h-4 w-4 ${isExpanded ? 'text-blue-500' : 'text-gray-500'}`} />
            ) : (
              <Folder className="mr-2 h-4 w-4 text-gray-400" />
            )}
            <span className="font-medium">{category.name}</span>
          </div>
        </TableCell>
        <TableCell>
          {category.parentCategory && (
            <Badge variant="outline" className="text-xs">
              {categories.find(c => c.id === category.parentCategory)?.name}
            </Badge>
          )}
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className="capitalize">
            {category.removalStrategy.toUpperCase()}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="text-sm">
            <div>{stats.productCount} products</div>
            <div className="text-gray-500">${stats.totalValue.toLocaleString()}</div>
          </div>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onCategoryDelete?.(category.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    )
  }

  const TreeView = () => (
    <div className="space-y-1">
      {categoryHierarchy.map(category => (
        <div key={category.id}>
          {renderCategoryTreeItem(category)}
        </div>
      ))}
    </div>
  )

  const renderCategoryTreeItem = (category: any) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.includes(category.id)
    const stats = getCategoryStats(category.id)

    return (
      <div>
        <div 
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
          style={{ paddingLeft: `${category.level * 20 + 12}px` }}
        >
          <div className="flex items-center flex-1">
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 p-0 w-5 h-5"
                onClick={() => toggleExpanded(category.id)}
              >
                <ChevronRight 
                  className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                />
              </Button>
            )}
            {hasChildren ? (
              <FolderOpen className={`mr-2 h-4 w-4 ${isExpanded ? 'text-blue-500' : 'text-gray-500'}`} />
            ) : (
              <Folder className="mr-2 h-4 w-4 text-gray-400" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.name}</span>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{stats.productCount} products</span>
                  <span>${stats.totalValue.toLocaleString()}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subcategory
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onCategoryDelete?.(category.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {category.children.map((child: any) => renderCategoryTreeItem(child))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Categories</h1>
          <p className="text-gray-600">
            Organize your products with hierarchical categories
          </p>
        </div>
        <Button onClick={() => setShowCategoryForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="tree">Tree View</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Folder className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? "Try adjusting your search term"
                      : "Get started by creating your first category"
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setShowCategoryForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Removal Strategy</TableHead>
                      <TableHead className="text-right">Products</TableHead>
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories
                      .filter(cat => expandedCategories.includes(cat.parentCategory || '') || !cat.parentCategory || cat.level === 0)
                      .map(category => renderCategoryRow(category))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tree">
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Folder className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
                  <p className="text-gray-500 mb-4">
                    Get started by creating your first category
                  </p>
                  <Button onClick={() => setShowCategoryForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              ) : (
                <TreeView />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Form Dialog */}
      <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? "Update the category information below."
                : "Create a new category to organize your products."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentCategory">Parent Category</Label>
                <select
                  id="parentCategory"
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Root Category)</option>
                  {categories
                    .filter(cat => cat.id !== editingCategory?.id) // Don't show self as parent
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="removalStrategy">Removal Strategy</Label>
                <select
                  id="removalStrategy"
                  value={formData.removalStrategy}
                  onChange={(e) => setFormData({ ...formData, removalStrategy: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fifo">FIFO (First In, First Out)</option>
                  <option value="lifo">LIFO (Last In, First Out)</option>
                  <option value="fefo">FEFO (First Expired, First Out)</option>
                </select>
                <p className="text-sm text-gray-500">
                  How products should be removed from inventory
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional category description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {editingCategory ? "Update" : "Create"} Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
