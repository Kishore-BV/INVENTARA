import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Book, MessageCircle, Video, FileText, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Help & Support - Inventara",
  description: "Get help and support for using Inventara",
}

const helpCategories = [
  {
    id: 1,
    title: "Getting Started",
    description: "Learn the basics of using Inventara",
    icon: Book,
    articles: 12,
    color: "bg-[#6B8A7A]",
  },
  {
    id: 2,
    title: "Inventory Management",
    description: "Managing products, stock, and categories",
    icon: FileText,
    articles: 18,
    color: "bg-[#F4A261]",
  },
  {
    id: 3,
    title: "Purchase Orders",
    description: "Creating and managing purchase orders",
    icon: FileText,
    articles: 15,
    color: "bg-[#E7B10A]",
  },
  {
    id: 4,
    title: "User Management",
    description: "Managing users, roles, and permissions",
    icon: FileText,
    articles: 8,
    color: "bg-[#4B6587]",
  },
]

const popularArticles = [
  {
    id: 1,
    title: "How to add new products to inventory",
    category: "Inventory Management",
    views: 1247,
    helpful: 89,
  },
  {
    id: 2,
    title: "Setting up automated backups",
    category: "System Administration",
    views: 892,
    helpful: 76,
  },
  {
    id: 3,
    title: "Creating purchase orders",
    category: "Purchase Orders",
    views: 734,
    helpful: 82,
  },
  {
    id: 4,
    title: "Managing user roles and permissions",
    category: "User Management",
    views: 623,
    helpful: 91,
  },
  {
    id: 5,
    title: "Generating inventory reports",
    category: "Reports",
    views: 567,
    helpful: 78,
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Help & Support</h1>
          <p className="text-[#666666]">Find answers to your questions and get help using Inventara</p>
        </div>
        <Button className="bg-[#4B6587] hover:bg-[#3a5068] text-white">
          <MessageCircle className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-5 w-5" />
            <Input
              placeholder="Search help articles, guides, and tutorials..."
              className="pl-12 h-12 text-lg border-[#D9D9D9] focus:border-[#4B6587]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {helpCategories.map((category) => (
          <Card key={category.id} className="border-[#D9D9D9] hover:border-[#4B6587] transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white`}>
                  <category.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-[#333333] text-lg">{category.title}</CardTitle>
                  <Badge variant="secondary" className="bg-[#D9D9D9] text-[#333333] mt-1">
                    {category.articles} articles
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#666666] text-sm">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Popular Articles</CardTitle>
            <CardDescription className="text-[#666666]">Most viewed help articles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-3 border border-[#D9D9D9] rounded-lg hover:bg-[#F8F9FA] cursor-pointer"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-[#333333] mb-1">{article.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-[#666666]">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.views} views</span>
                    <span>•</span>
                    <span>{article.helpful}% helpful</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-[#666666]" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#D9D9D9]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Quick Actions</CardTitle>
            <CardDescription className="text-[#666666]">Get help and support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
            >
              <Video className="mr-2 h-4 w-4" />
              Watch Video Tutorials
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Live Chat Support
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download User Manual
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-[#D9D9D9] hover:bg-[#F8F9FA] bg-transparent"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Community Forum
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#D9D9D9]">
        <CardHeader>
          <CardTitle className="text-[#333333]">Contact Information</CardTitle>
          <CardDescription className="text-[#666666]">Get in touch with our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border border-[#D9D9D9] rounded-lg">
              <MessageCircle className="h-8 w-8 text-[#6B8A7A] mx-auto mb-2" />
              <h4 className="font-medium text-[#333333] mb-1">Live Chat</h4>
              <p className="text-sm text-[#666666] mb-3">Available 24/7 for immediate assistance</p>
              <Button size="sm" className="bg-[#6B8A7A] hover:bg-[#5a7a6a] text-white">
                Start Chat
              </Button>
            </div>
            <div className="text-center p-4 border border-[#D9D9D9] rounded-lg">
              <FileText className="h-8 w-8 text-[#F4A261] mx-auto mb-2" />
              <h4 className="font-medium text-[#333333] mb-1">Email Support</h4>
              <p className="text-sm text-[#666666] mb-3">Response within 24 hours</p>
              <Button size="sm" className="bg-[#F4A261] hover:bg-[#e6935a] text-white">
                Send Email
              </Button>
            </div>
            <div className="text-center p-4 border border-[#D9D9D9] rounded-lg">
              <Video className="h-8 w-8 text-[#E7B10A] mx-auto mb-2" />
              <h4 className="font-medium text-[#333333] mb-1">Video Call</h4>
              <p className="text-sm text-[#666666] mb-3">Schedule a personalized demo</p>
              <Button size="sm" className="bg-[#E7B10A] hover:bg-[#d19f09] text-white">
                Schedule Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
