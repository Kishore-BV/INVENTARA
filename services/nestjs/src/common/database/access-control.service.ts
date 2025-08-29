import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Role, PermissionContext } from '../auth/permissions';
import { Prisma } from '@prisma/client';

/**
 * User context for access control
 */
export interface AccessControlContext {
  userId: string;
  tenantId: string;
  role: Role;
  departmentId?: string | null;
}

/**
 * Access Control Service
 * 
 * Provides Prisma helper methods that automatically apply role-based access control
 * filtering to database queries. Acts as a "belt-and-suspenders" approach alongside RLS.
 */
@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Set database session variables for RLS
   */
  async setSessionContext(context: AccessControlContext): Promise<void> {
    await this.prisma.$executeRaw`
      SELECT set_config('app.tenant_id', ${context.tenantId}, true),
             set_config('app.user_id', ${context.userId}, true),
             set_config('app.role', ${context.role}, true),
             set_config('app.department_id', ${context.departmentId || ''}, true)
    `;
  }

  /**
   * Generate scoped WHERE clause based on user context
   */
  generateScopeWhere(
    context: AccessControlContext,
    resourceType: 'REQUISITION' | 'PURCHASE_ORDER' | 'INVOICE' | 'GOODS_RECEIPT' | 'SUPPLIER' | 'CUSTOMER' | 'ITEM'
  ): any {
    const baseWhere = { tenantId: context.tenantId };

    // Admin has full tenant access
    if (context.role === 'ADMIN') {
      return baseWhere;
    }

    // HOD has department scope
    if (context.role === 'HOD') {
      switch (resourceType) {
        case 'REQUISITION':
        case 'PURCHASE_ORDER':
        case 'GOODS_RECEIPT':
          return {
            ...baseWhere,
            departmentId: context.departmentId,
          };
        case 'INVOICE':
          return {
            ...baseWhere,
            departmentId: context.departmentId,
          };
        case 'SUPPLIER':
        case 'CUSTOMER':
        case 'ITEM':
          // HODs can read all master data but create in their department
          return baseWhere;
        default:
          return baseWhere;
      }
    }

    // Employee has own records scope
    if (context.role === 'EMPLOYEE') {
      switch (resourceType) {
        case 'REQUISITION':
          return {
            ...baseWhere,
            createdBy: context.userId,
          };
        case 'PURCHASE_ORDER':
          return {
            ...baseWhere,
            createdBy: context.userId,
          };
        case 'INVOICE':
          return {
            ...baseWhere,
            createdBy: context.userId,
          };
        case 'GOODS_RECEIPT':
          return {
            ...baseWhere,
            receivedBy: context.userId,
          };
        case 'SUPPLIER':
        case 'CUSTOMER':
        case 'ITEM':
          // Employees can read all active master data
          return {
            ...baseWhere,
            status: 'active',
          };
        default:
          return baseWhere;
      }
    }

    return baseWhere;
  }

  /**
   * Generate CREATE data with proper context
   */
  generateCreateData(context: AccessControlContext, data: any): any {
    const enrichedData = {
      ...data,
      tenantId: context.tenantId,
    };

    // Add department and creator context for non-admin users
    if (context.role !== 'ADMIN') {
      if (context.departmentId) {
        enrichedData.departmentId = context.departmentId;
      }
      enrichedData.createdBy = context.userId;
    }

    return enrichedData;
  }

  // ===========================================
  // SCOPED QUERY METHODS
  // ===========================================

  /**
   * Requisition queries with access control
   */
  async findRequisitions(context: AccessControlContext, options: {
    where?: Prisma.RequisitionWhereInput;
    include?: Prisma.RequisitionInclude;
    orderBy?: Prisma.RequisitionOrderByWithRelationInput;
    take?: number;
    skip?: number;
  } = {}) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'REQUISITION');
    
    return this.prisma.requisition.findMany({
      ...options,
      where: {
        ...scopedWhere,
        ...options.where,
      },
    });
  }

  async findRequisitionById(context: AccessControlContext, id: string, include?: Prisma.RequisitionInclude) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'REQUISITION');
    
    return this.prisma.requisition.findFirst({
      where: {
        ...scopedWhere,
        id,
      },
      include,
    });
  }

  async createRequisition(context: AccessControlContext, data: Prisma.RequisitionCreateInput) {
    await this.setSessionContext(context);
    
    const enrichedData = this.generateCreateData(context, data);
    
    return this.prisma.requisition.create({
      data: enrichedData,
    });
  }

  async updateRequisition(context: AccessControlContext, id: string, data: Prisma.RequisitionUpdateInput) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'REQUISITION');
    
    return this.prisma.requisition.updateMany({
      where: {
        ...scopedWhere,
        id,
      },
      data,
    });
  }

  /**
   * Purchase Order queries with access control
   */
  async findPurchaseOrders(context: AccessControlContext, options: {
    where?: Prisma.PurchaseOrderWhereInput;
    include?: Prisma.PurchaseOrderInclude;
    orderBy?: Prisma.PurchaseOrderOrderByWithRelationInput;
    take?: number;
    skip?: number;
  } = {}) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'PURCHASE_ORDER');
    
    return this.prisma.purchaseOrder.findMany({
      ...options,
      where: {
        ...scopedWhere,
        ...options.where,
      },
    });
  }

  async findPurchaseOrderById(context: AccessControlContext, id: string, include?: Prisma.PurchaseOrderInclude) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'PURCHASE_ORDER');
    
    return this.prisma.purchaseOrder.findFirst({
      where: {
        ...scopedWhere,
        id,
      },
      include,
    });
  }

  async createPurchaseOrder(context: AccessControlContext, data: Prisma.PurchaseOrderCreateInput) {
    await this.setSessionContext(context);
    
    const enrichedData = this.generateCreateData(context, data);
    
    return this.prisma.purchaseOrder.create({
      data: enrichedData,
    });
  }

  async updatePurchaseOrder(context: AccessControlContext, id: string, data: Prisma.PurchaseOrderUpdateInput) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'PURCHASE_ORDER');
    
    return this.prisma.purchaseOrder.updateMany({
      where: {
        ...scopedWhere,
        id,
      },
      data,
    });
  }

  /**
   * Invoice queries with access control
   */
  async findInvoices(context: AccessControlContext, options: {
    where?: Prisma.InvoiceWhereInput;
    include?: Prisma.InvoiceInclude;
    orderBy?: Prisma.InvoiceOrderByWithRelationInput;
    take?: number;
    skip?: number;
  } = {}) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'INVOICE');
    
    return this.prisma.invoice.findMany({
      ...options,
      where: {
        ...scopedWhere,
        ...options.where,
      },
    });
  }

  async findInvoiceById(context: AccessControlContext, id: string, include?: Prisma.InvoiceInclude) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'INVOICE');
    
    return this.prisma.invoice.findFirst({
      where: {
        ...scopedWhere,
        id,
      },
      include,
    });
  }

  async createInvoice(context: AccessControlContext, data: Prisma.InvoiceCreateInput) {
    await this.setSessionContext(context);
    
    const enrichedData = this.generateCreateData(context, data);
    
    return this.prisma.invoice.create({
      data: enrichedData,
    });
  }

  async updateInvoice(context: AccessControlContext, id: string, data: Prisma.InvoiceUpdateInput) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'INVOICE');
    
    return this.prisma.invoice.updateMany({
      where: {
        ...scopedWhere,
        id,
      },
      data,
    });
  }

  /**
   * Goods Receipt queries with access control
   */
  async findGoodsReceipts(context: AccessControlContext, options: {
    where?: Prisma.GoodsReceiptWhereInput;
    include?: Prisma.GoodsReceiptInclude;
    orderBy?: Prisma.GoodsReceiptOrderByWithRelationInput;
    take?: number;
    skip?: number;
  } = {}) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'GOODS_RECEIPT');
    
    return this.prisma.goodsReceipt.findMany({
      ...options,
      where: {
        ...scopedWhere,
        ...options.where,
      },
    });
  }

  async findGoodsReceiptById(context: AccessControlContext, id: string, include?: Prisma.GoodsReceiptInclude) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'GOODS_RECEIPT');
    
    return this.prisma.goodsReceipt.findFirst({
      where: {
        ...scopedWhere,
        id,
      },
      include,
    });
  }

  async createGoodsReceipt(context: AccessControlContext, data: Prisma.GoodsReceiptCreateInput) {
    await this.setSessionContext(context);
    
    const enrichedData = this.generateCreateData(context, data);
    
    return this.prisma.goodsReceipt.create({
      data: enrichedData,
    });
  }

  /**
   * Supplier queries with access control
   */
  async findSuppliers(context: AccessControlContext, options: {
    where?: Prisma.SupplierWhereInput;
    include?: Prisma.SupplierInclude;
    orderBy?: Prisma.SupplierOrderByWithRelationInput;
    take?: number;
    skip?: number;
  } = {}) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'SUPPLIER');
    
    return this.prisma.supplier.findMany({
      ...options,
      where: {
        ...scopedWhere,
        ...options.where,
      },
    });
  }

  async findSupplierById(context: AccessControlContext, id: string, include?: Prisma.SupplierInclude) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'SUPPLIER');
    
    return this.prisma.supplier.findFirst({
      where: {
        ...scopedWhere,
        id,
      },
      include,
    });
  }

  async createSupplier(context: AccessControlContext, data: Prisma.SupplierCreateInput) {
    await this.setSessionContext(context);
    
    const enrichedData = this.generateCreateData(context, data);
    
    return this.prisma.supplier.create({
      data: enrichedData,
    });
  }

  /**
   * Customer queries with access control
   */
  async findCustomers(context: AccessControlContext, options: {
    where?: Prisma.CustomerWhereInput;
    include?: Prisma.CustomerInclude;
    orderBy?: Prisma.CustomerOrderByWithRelationInput;
    take?: number;
    skip?: number;
  } = {}) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'CUSTOMER');
    
    return this.prisma.customer.findMany({
      ...options,
      where: {
        ...scopedWhere,
        ...options.where,
      },
    });
  }

  async findCustomerById(context: AccessControlContext, id: string, include?: Prisma.CustomerInclude) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'CUSTOMER');
    
    return this.prisma.customer.findFirst({
      where: {
        ...scopedWhere,
        id,
      },
      include,
    });
  }

  async createCustomer(context: AccessControlContext, data: Prisma.CustomerCreateInput) {
    await this.setSessionContext(context);
    
    const enrichedData = this.generateCreateData(context, data);
    
    return this.prisma.customer.create({
      data: enrichedData,
    });
  }

  /**
   * Item queries with access control
   */
  async findItems(context: AccessControlContext, options: {
    where?: Prisma.ItemWhereInput;
    include?: Prisma.ItemInclude;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
    take?: number;
    skip?: number;
  } = {}) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'ITEM');
    
    return this.prisma.item.findMany({
      ...options,
      where: {
        ...scopedWhere,
        ...options.where,
      },
    });
  }

  async findItemById(context: AccessControlContext, id: string, include?: Prisma.ItemInclude) {
    await this.setSessionContext(context);
    
    const scopedWhere = this.generateScopeWhere(context, 'ITEM');
    
    return this.prisma.item.findFirst({
      where: {
        ...scopedWhere,
        id,
      },
      include,
    });
  }

  async createItem(context: AccessControlContext, data: Prisma.ItemCreateInput) {
    await this.setSessionContext(context);
    
    const enrichedData = this.generateCreateData(context, data);
    
    return this.prisma.item.create({
      data: enrichedData,
    });
  }

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Check if user can access resource
   */
  async canAccessResource(
    context: AccessControlContext,
    resourceType: string,
    resourceId: string
  ): Promise<boolean> {
    const scopedWhere = this.generateScopeWhere(context, resourceType as any);
    
    let count = 0;
    
    switch (resourceType) {
      case 'REQUISITION':
        count = await this.prisma.requisition.count({
          where: { ...scopedWhere, id: resourceId },
        });
        break;
      case 'PURCHASE_ORDER':
        count = await this.prisma.purchaseOrder.count({
          where: { ...scopedWhere, id: resourceId },
        });
        break;
      case 'INVOICE':
        count = await this.prisma.invoice.count({
          where: { ...scopedWhere, id: resourceId },
        });
        break;
      case 'GOODS_RECEIPT':
        count = await this.prisma.goodsReceipt.count({
          where: { ...scopedWhere, id: resourceId },
        });
        break;
      default:
        return false;
    }
    
    return count > 0;
  }

  /**
   * Get user's accessible department IDs
   */
  async getAccessibleDepartmentIds(context: AccessControlContext): Promise<string[]> {
    if (context.role === 'ADMIN') {
      const departments = await this.prisma.department.findMany({
        where: { tenantId: context.tenantId },
        select: { id: true },
      });
      return departments.map(d => d.id);
    }
    
    if (context.role === 'HOD' && context.departmentId) {
      return [context.departmentId];
    }
    
    return [];
  }

  /**
   * Get summary statistics based on user access
   */
  async getDashboardStats(context: AccessControlContext) {
    await this.setSessionContext(context);
    
    const requisitionWhere = this.generateScopeWhere(context, 'REQUISITION');
    const purchaseOrderWhere = this.generateScopeWhere(context, 'PURCHASE_ORDER');
    const invoiceWhere = this.generateScopeWhere(context, 'INVOICE');
    
    const [
      totalRequisitions,
      pendingRequisitions,
      totalPurchaseOrders,
      pendingPurchaseOrders,
      totalInvoices,
      pendingInvoices,
    ] = await Promise.all([
      this.prisma.requisition.count({ where: requisitionWhere }),
      this.prisma.requisition.count({ 
        where: { ...requisitionWhere, status: 'SUBMITTED' } 
      }),
      this.prisma.purchaseOrder.count({ where: purchaseOrderWhere }),
      this.prisma.purchaseOrder.count({ 
        where: { ...purchaseOrderWhere, status: 'DRAFT' } 
      }),
      this.prisma.invoice.count({ where: invoiceWhere }),
      this.prisma.invoice.count({ 
        where: { ...invoiceWhere, status: 'DRAFT' } 
      }),
    ]);
    
    return {
      requisitions: {
        total: totalRequisitions,
        pending: pendingRequisitions,
      },
      purchaseOrders: {
        total: totalPurchaseOrders,
        pending: pendingPurchaseOrders,
      },
      invoices: {
        total: totalInvoices,
        pending: pendingInvoices,
      },
    };
  }
}