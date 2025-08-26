// Inventory Management Types - Based on Odoo Inventory Features

export interface Product {
  id: string
  name: string
  internalReference: string
  barcode?: string
  productType: 'consumable' | 'service' | 'storable'
  category: ProductCategory
  salesPrice: number
  cost: number
  currency: string
  unitOfMeasure: UnitOfMeasure
  purchaseUnitOfMeasure?: UnitOfMeasure
  weight?: number
  volume?: number
  image?: string
  description?: string
  notes?: string
  isActive: boolean
  canBeSold: boolean
  canBePurchased: boolean
  trackingMethod: 'none' | 'lot' | 'serial'
  expirationTracking: boolean
  supplier?: Supplier
  routes: StockRoute[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductCategory {
  id: string
  name: string
  parentCategory?: string
  accountingProperties?: {
    incomeAccount?: string
    expenseAccount?: string
    stockInputAccount?: string
    stockOutputAccount?: string
    stockValuationAccount?: string
  }
  routes: StockRoute[]
  removalStrategy: 'fifo' | 'lifo' | 'fefo'
}

export interface UnitOfMeasure {
  id: string
  name: string
  category: string
  type: 'reference' | 'bigger' | 'smaller'
  ratio: number
  rounding: number
  isActive: boolean
}

export interface Warehouse {
  id: string
  name: string
  code: string
  address: Address
  isActive: boolean
  company: string
  locations: Location[]
  routes: StockRoute[]
  resupplyRoutes: StockRoute[]
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  id: string
  name: string
  completeName: string
  warehouse: string
  parentLocation?: string
  locationType: 'vendor' | 'view' | 'internal' | 'customer' | 'inventory' | 'procurement' | 'production' | 'transit'
  isScrapLocation: boolean
  isReturnLocation: boolean
  barcode?: string
  additionalInfo?: string
  stockQuants: StockQuant[]
}

export interface StockQuant {
  id: string
  product: Product
  location: Location
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  lotId?: string
  packageId?: string
  ownerId?: string
  lastUpdateDate: Date
}

export interface StockMove {
  id: string
  name: string
  product: Product
  productQty: number
  productUom: UnitOfMeasure
  locationId: Location
  locationDestId: Location
  partnerId?: string
  pickingId?: string
  originReturned?: string
  moveDestIds: string[]
  moveOrigIds: string[]
  state: 'draft' | 'waiting' | 'confirmed' | 'partially_available' | 'assigned' | 'done' | 'cancel'
  dateExpected: Date
  date: Date
  reference: string
  origin?: string
  note?: string
  scrapped: boolean
  sequence: number
  priority: '0' | '1' | '2' | '3'
  createdAt: Date
  updatedAt: Date
}

export interface StockPicking {
  id: string
  name: string
  origin?: string
  backorderId?: string
  moves: StockMove[]
  partnerId?: string
  locationId: Location
  locationDestId: Location
  pickingTypeId: PickingType
  state: 'draft' | 'waiting' | 'confirmed' | 'assigned' | 'done' | 'cancel'
  scheduledDate: Date
  dateDeadline?: Date
  dateDone?: Date
  priority: '0' | '1' | '2' | '3'
  isLocked: boolean
  note?: string
  createdAt: Date
  updatedAt: Date
}

export interface PickingType {
  id: string
  name: string
  code: 'incoming' | 'outgoing' | 'internal'
  sequence: number
  warehouseId: Warehouse
  defaultLocationSrcId: Location
  defaultLocationDestId: Location
  isActive: boolean
  showReserved: boolean

  useCreateLots: boolean
  useExistingLots: boolean
  barcode?: string
}

export interface StockRoute {
  id: string
  name: string
  isActive: boolean
  sequence: number
  productSelectable: boolean
  productCategorySelectable: boolean
  warehouseSelectable: boolean
  packagingSelectable: boolean
  suppliedWh?: Warehouse
  supplierWh?: Warehouse
  rules: StockRule[]
}

export interface StockRule {
  id: string
  name: string
  route: StockRoute
  action: 'pull' | 'push' | 'pull_push'
  pickingTypeId: PickingType
  locationSrcId: Location
  locationId: Location
  procureMethod: 'make_to_stock' | 'make_to_order'
  delay: number
  isActive: boolean
  sequence: number
}

export interface Supplier {
  id: string
  name: string
  displayName: string
  email?: string
  phone?: string
  website?: string
  isCompany: boolean
  isVendor: boolean
  isCustomer: boolean
  address: Address
  currency: string
  paymentTerms?: string
  creditLimit?: number
  isActive: boolean
  supplierRank: number
  customerRank: number
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street?: string
  street2?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

export interface PurchaseOrder {
  id: string
  name: string
  supplier: Supplier
  orderDate: Date
  expectedDate: Date
  currency: string
  state: 'draft' | 'sent' | 'to_approve' | 'purchase' | 'done' | 'cancel'
  totalAmount: number
  notes?: string
  orderLines: PurchaseOrderLine[]
  pickings: StockPicking[]
  invoices: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrderLine {
  id: string
  product: Product
  description: string
  quantity: number
  unitPrice: number
  taxes: number[]
  subtotal: number
  receivedQuantity: number
  billedQuantity: number
  expectedDate: Date
}

export interface SaleOrder {
  id: string
  name: string
  customer: Supplier
  orderDate: Date
  expectedDate: Date
  currency: string
  state: 'draft' | 'sent' | 'sale' | 'done' | 'cancel'
  totalAmount: number
  notes?: string
  orderLines: SaleOrderLine[]
  pickings: StockPicking[]
  invoices: string[]
  createdAt: Date
  updatedAt: Date
}

export interface SaleOrderLine {
  id: string
  product: Product
  description: string
  quantity: number
  unitPrice: number
  taxes: number[]
  subtotal: number
  deliveredQuantity: number
  billedQuantity: number
  expectedDate: Date
}

export interface InventoryAdjustment {
  id: string
  name: string
  location: Location
  product?: Product
  productCategory?: ProductCategory
  state: 'draft' | 'confirm' | 'done' | 'cancel'
  adjustmentLines: InventoryAdjustmentLine[]
  accountingDate: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryAdjustmentLine {
  id: string
  product: Product
  location: Location
  theoreticalQuantity: number
  countedQuantity: number
  difference: number
  unitCost: number
  inventoryValue: number
  lotId?: string
  packageId?: string
}

export interface StockValuation {
  id: string
  product: Product
  location: Location
  quantity: number
  value: number
  unitCost: number
  date: Date
  reference: string
  moveId?: string
}

export interface ReorderingRule {
  id: string
  product: Product
  location: Location
  minQuantity: number
  maxQuantity: number
  quantityMultiple: number
  leadTimeDays: number
  isActive: boolean
  route: StockRoute
}

export interface LotSerial {
  id: string
  name: string
  product: Product
  expirationDate?: Date
  removalDate?: Date
  alertDate?: Date
  useDate?: Date
  notes?: string
  isActive: boolean
  quants: StockQuant[]
}

export interface StockPackage {
  id: string
  name: string
  packageType?: PackageType
  location: Location
  owner?: string
  quants: StockQuant[]
  children: StockPackage[]
  parent?: StockPackage
}

export interface PackageType {
  id: string
  name: string
  sequence: number
  height?: number
  width?: number
  length?: number
  maxWeight?: number
  barcode?: string
}

// Enhanced User Management Types
export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'manager' | 'user' | 'warehouse_worker' | 'quality_controller'
  department?: string
  employeeId?: string
  phone?: string
  isActive: boolean
  lastLogin?: Date
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

export interface Permission {
  id: string
  name: string
  description: string
  module: 'inventory' | 'users' | 'attendance' | 'inward' | 'outward' | 'reports'
}

export interface UserSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  isActive: boolean
  createdAt: Date
}

// Attendance Management Types
export interface Employee extends User {
  badgeNumber?: string
  shiftType: 'day' | 'night' | 'rotating'
  workSchedule: WorkSchedule
  supervisor?: string
  joinDate: Date
  salary?: number
}

export interface WorkSchedule {
  id: string
  name: string
  workDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  breakDuration: number // minutes
  isActive: boolean
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employee: Employee
  date: Date
  clockIn?: Date
  clockOut?: Date
  breakStart?: Date
  breakEnd?: Date
  totalHours?: number
  overtimeHours?: number
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
  notes?: string
  approvedBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employee: Employee
  leaveType: 'sick' | 'vacation' | 'personal' | 'maternity' | 'emergency'
  startDate: Date
  endDate: Date
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvalDate?: Date
  comments?: string
  createdAt: Date
  updatedAt: Date
}

// Inward Management Types
export interface InwardReceipt {
  id: string
  receiptNumber: string
  purchaseOrderId?: string
  supplierId: string
  supplier: Supplier
  receiptDate: Date
  expectedDate?: Date
  warehouseId: string
  warehouse: Warehouse
  receivedBy: string
  status: 'draft' | 'received' | 'inspected' | 'accepted' | 'rejected' | 'partial'
  items: InwardItem[]
  totalValue: number
  currency: string
  documents: Document[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InwardItem {
  id: string
  productId: string
  product: Product
  expectedQuantity: number
  receivedQuantity: number
  acceptedQuantity: number
  rejectedQuantity: number
  unitPrice: number
  totalValue: number
  batchNumber?: string
  expiryDate?: Date
  qualityStatus: 'pending' | 'passed' | 'failed' | 'on_hold'
  qualityNotes?: string
  inspectedBy?: string
  inspectionDate?: Date
  storageLocation?: string
}

export interface QualityInspection {
  id: string
  inwardReceiptId: string
  productId: string
  inspectorId: string
  inspector: Employee
  inspectionDate: Date
  testResults: QualityTest[]
  overallStatus: 'passed' | 'failed' | 'conditional'
  notes?: string
  recommendations?: string
  attachments: Document[]
  createdAt: Date
}

export interface QualityTest {
  id: string
  testName: string
  testType: 'visual' | 'measurement' | 'functional' | 'chemical' | 'other'
  expectedValue?: string
  actualValue?: string
  result: 'pass' | 'fail' | 'na'
  notes?: string
}

// Outward Management Types
export interface OutwardShipment {
  id: string
  shipmentNumber: string
  salesOrderId?: string
  customerId: string
  customer: Supplier // Reusing supplier interface for customers
  shipmentDate: Date
  expectedDeliveryDate?: Date
  warehouseId: string
  warehouse: Warehouse
  packedBy: string
  shippedBy?: string
  status: 'draft' | 'picking' | 'picked' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  items: OutwardItem[]
  totalValue: number
  currency: string
  shippingMethod: 'pickup' | 'standard' | 'express' | 'overnight'
  trackingNumber?: string
  carrier?: string
  shippingCost?: number
  documents: Document[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OutwardItem {
  id: string
  productId: string
  product: Product
  requestedQuantity: number
  pickedQuantity: number
  shippedQuantity: number
  unitPrice: number
  totalValue: number
  batchNumber?: string
  serialNumbers: string[]
  pickingLocation?: string
  pickedBy?: string
  packingNotes?: string
}

export interface PickingList {
  id: string
  pickingNumber: string
  outwardShipmentId: string
  warehouseId: string
  assignedTo: string
  picker: Employee
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'assigned' | 'in_progress' | 'completed' | 'on_hold'
  items: PickingItem[]
  startTime?: Date
  endTime?: Date
  totalItems: number
  pickedItems: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface PickingItem {
  id: string
  productId: string
  product: Product
  locationId: string
  location: Location
  requestedQuantity: number
  pickedQuantity: number
  status: 'pending' | 'picked' | 'short' | 'damaged'
  batchNumber?: string
  serialNumbers: string[]
  notes?: string
}

// Common Document Type
export interface Document {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: string
  uploadedAt: Date
  description?: string
}

// Enhanced Dashboard Types
export interface EnhancedInventoryDashboard extends InventoryDashboard {
  userStats: UserStats
  attendanceStats: AttendanceStats
  inwardStats: InwardStats
  outwardStats: OutwardStats
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  recentLogins: number
}

export interface AttendanceStats {
  totalEmployees: number
  presentToday: number
  absentToday: number
  lateToday: number
  overtimeHours: number
}

export interface InwardStats {
  pendingReceipts: number
  todayReceipts: number
  pendingInspections: number
  rejectedItems: number
  totalInwardValue: number
}

export interface OutwardStats {
  pendingShipments: number
  todayShipments: number
  inTransitShipments: number
  deliveredToday: number
  totalOutwardValue: number
}

// Dashboard and Analytics Types
export interface InventoryDashboard {
  totalProducts: number
  totalLocations: number
  totalValue: number
  lowStockAlerts: number
  pendingMoves: number
  recentMovements: StockMove[]
  topProducts: ProductStockInfo[]
  warehouseUtilization: WarehouseUtilization[]
}

export interface ProductStockInfo {
  product: Product
  onHandQuantity: number
  forecastedQuantity: number
  reservedQuantity: number
  value: number
  locations: LocationStock[]
}

export interface LocationStock {
  location: Location
  quantity: number
  reservedQuantity: number
  availableQuantity: number
}

export interface WarehouseUtilization {
  warehouse: Warehouse
  totalLocations: number
  usedLocations: number
  utilizationPercent: number
  totalValue: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filter and Search Types
export interface ProductFilter {
  category?: string
  supplier?: string
  location?: string
  trackingMethod?: string
  isActive?: boolean
  hasStock?: boolean
  lowStock?: boolean
  search?: string
}

export interface StockMoveFilter {
  product?: string
  location?: string
  locationDest?: string
  state?: string
  dateFrom?: Date
  dateTo?: Date
  reference?: string
}
