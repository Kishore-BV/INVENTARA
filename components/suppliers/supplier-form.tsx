"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Mail, Phone, Globe, MapPin, Save, X } from "lucide-react"
import { toast } from "sonner"
import type { Supplier } from "@/lib/inventory-types"

interface SupplierFormData {
  name: string
  displayName: string
  email: string
  phone: string
  website: string
  isVendor: boolean
  isCustomer: boolean
  address: {
    street: string
    city: string
    state: string
    country: string
  }
  currency: string
  paymentTerms: string
  isActive: boolean
}

interface SupplierFormProps {
  supplier?: Supplier | null
  onSubmit: (data: SupplierFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  mode: "create" | "edit"
}

const countries = ["India", "USA", "UK", "Canada", "Australia"]
const currencies = ["INR", "USD", "EUR", "GBP"]
const paymentTerms = ["Net 15", "Net 30", "Net 45", "Net 60"]

export function SupplierForm({ supplier, onSubmit, onCancel, loading = false, mode }: SupplierFormProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: supplier?.name || "",
    displayName: supplier?.displayName || "",
    email: supplier?.email || "",
    phone: supplier?.phone || "",
    website: supplier?.website || "",
    isVendor: supplier?.isVendor ?? true,
    isCustomer: supplier?.isCustomer ?? false,
    address: {
      street: supplier?.address?.street || "",
      city: supplier?.address?.city || "",
      state: supplier?.address?.state || "",
      country: supplier?.address?.country || "India"
    },
    currency: supplier?.currency || "INR",
    paymentTerms: supplier?.paymentTerms || "Net 30",
    isActive: supplier?.isActive ?? true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error("Company name is required")
      return
    }
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error(error)
    }
  }

  const updateField = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof SupplierFormData] as any),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => updateField('displayName', e.target.value)}
                placeholder="Display name"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVendor"
                checked={formData.isVendor}
                onCheckedChange={(checked) => updateField('isVendor', Boolean(checked))}
              />
              <Label htmlFor="isVendor">Vendor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCustomer"
                checked={formData.isCustomer}
                onCheckedChange={(checked) => updateField('isCustomer', Boolean(checked))}
              />
              <Label htmlFor="isCustomer">Customer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => updateField('isActive', Boolean(checked))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+91-98765-43210"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://company.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address & Business Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => updateField('address.street', e.target.value)}
                placeholder="123 Business Street"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => updateField('address.city', e.target.value)}
                placeholder="Mumbai"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => updateField('address.state', e.target.value)}
                placeholder="Maharashtra"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select 
                value={formData.address.country} 
                onValueChange={(value) => updateField('address.country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => updateField('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select 
                value={formData.paymentTerms} 
                onValueChange={(value) => updateField('paymentTerms', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTerms.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-[#4B6587] hover:bg-[#3A5068]"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : mode === "create" ? "Create Supplier" : "Update Supplier"}
        </Button>
      </div>
    </form>
  )
}