import { SetMetadata } from '@nestjs/common';
import { Permission } from './permissions';

export const REQUIRE_PERMISSIONS_KEY = 'require_permissions';

/**
 * Decorator to specify required permissions for a route or controller
 * 
 * @param permissions - Array of permissions required to access the endpoint
 * 
 * @example
 * @RequirePermissions(Permission.REQ_CREATE)
 * @Post('/requisitions')
 * createRequisition() { ... }
 * 
 * @example
 * @RequirePermissions(Permission.PO_APPROVE, Permission.PO_UPDATE_DEPT)
 * @Post('/purchase-orders/:id/approve')
 * approvePurchaseOrder() { ... }
 */
export const RequirePermissions = (...permissions: Permission[]) => 
  SetMetadata(REQUIRE_PERMISSIONS_KEY, permissions);

/**
 * Convenience decorators for common permission patterns
 */

// Admin-only operations
export const AdminOnly = () => RequirePermissions(); // Will be handled by guard with admin check

// Master data operations
export const CanCreateItems = () => RequirePermissions(Permission.ITEMS_CREATE);
export const CanReadItems = () => RequirePermissions(Permission.ITEMS_READ);
export const CanUpdateItems = () => RequirePermissions(Permission.ITEMS_UPDATE);
export const CanDeleteItems = () => RequirePermissions(Permission.ITEMS_DELETE);

export const CanCreateSuppliers = () => RequirePermissions(Permission.SUPPLIERS_CREATE);
export const CanReadSuppliers = () => RequirePermissions(Permission.SUPPLIERS_READ);
export const CanUpdateSuppliers = () => RequirePermissions(Permission.SUPPLIERS_UPDATE);
export const CanDeleteSuppliers = () => RequirePermissions(Permission.SUPPLIERS_DELETE);

export const CanCreateCustomers = () => RequirePermissions(Permission.CUSTOMERS_CREATE);
export const CanReadCustomers = () => RequirePermissions(Permission.CUSTOMERS_READ);
export const CanUpdateCustomers = () => RequirePermissions(Permission.CUSTOMERS_UPDATE);
export const CanDeleteCustomers = () => RequirePermissions(Permission.CUSTOMERS_DELETE);

// Requisition operations
export const CanCreateRequisitions = () => RequirePermissions(Permission.REQ_CREATE);
export const CanReadRequisitions = () => RequirePermissions(
  Permission.REQ_READ_ALL, 
  Permission.REQ_READ_DEPT, 
  Permission.REQ_READ_OWN
);
export const CanUpdateRequisitions = () => RequirePermissions(
  Permission.REQ_UPDATE_ALL,
  Permission.REQ_UPDATE_DEPT,
  Permission.REQ_UPDATE_OWN
);
export const CanApproveRequisitions = () => RequirePermissions(Permission.REQ_APPROVE);
export const CanDeleteRequisitions = () => RequirePermissions(Permission.REQ_DELETE);

// Purchase Order operations  
export const CanCreatePurchaseOrders = () => RequirePermissions(Permission.PO_CREATE);
export const CanReadPurchaseOrders = () => RequirePermissions(
  Permission.PO_READ_ALL,
  Permission.PO_READ_DEPT,
  Permission.PO_READ_OWN
);
export const CanUpdatePurchaseOrders = () => RequirePermissions(
  Permission.PO_UPDATE_ALL,
  Permission.PO_UPDATE_DEPT
);
export const CanApprovePurchaseOrders = () => RequirePermissions(Permission.PO_APPROVE);
export const CanDeletePurchaseOrders = () => RequirePermissions(Permission.PO_DELETE);

// Goods Receipt operations
export const CanCreateGoodsReceipts = () => RequirePermissions(
  Permission.GRN_CREATE_ALL,
  Permission.GRN_CREATE_DEPT,
  Permission.GRN_CREATE_ASSIGNED
);
export const CanReadGoodsReceipts = () => RequirePermissions(
  Permission.GRN_READ_ALL,
  Permission.GRN_READ_DEPT,
  Permission.GRN_READ_ASSIGNED
);
export const CanUpdateGoodsReceipts = () => RequirePermissions(
  Permission.GRN_UPDATE_ALL,
  Permission.GRN_UPDATE_DEPT,
  Permission.GRN_UPDATE_ASSIGNED
);
export const CanQualityApprove = () => RequirePermissions(Permission.GRN_QUALITY_APPROVE);

// Invoice operations
export const CanCreateInvoices = () => RequirePermissions(Permission.INVOICE_CREATE);
export const CanReadInvoices = () => RequirePermissions(
  Permission.INVOICE_READ_ALL,
  Permission.INVOICE_READ_DEPT,
  Permission.INVOICE_READ_OWN
);
export const CanUpdateInvoices = () => RequirePermissions(
  Permission.INVOICE_UPDATE_ALL,
  Permission.INVOICE_UPDATE_DEPT,
  Permission.INVOICE_UPDATE_OWN
);
export const CanApproveInvoices = () => RequirePermissions(Permission.INVOICE_APPROVE);
export const CanDeleteInvoices = () => RequirePermissions(Permission.INVOICE_DELETE);

// Payment operations
export const CanCreatePayments = () => RequirePermissions(Permission.PAYMENT_CREATE);
export const CanApprovePayments = () => RequirePermissions(Permission.PAYMENT_APPROVE);
export const CanExecutePayments = () => RequirePermissions(Permission.PAYMENT_EXECUTE);
export const CanReadPayments = () => RequirePermissions(
  Permission.PAYMENT_READ_ALL,
  Permission.PAYMENT_READ_DEPT,
  Permission.PAYMENT_READ_OWN
);

// GST operations
export const CanAccessGSTConsole = () => RequirePermissions(Permission.GST_CONSOLE_ACCESS);
export const CanGenerateIRN = () => RequirePermissions(Permission.GST_IRN_GENERATE);
export const CanCancelIRN = () => RequirePermissions(Permission.GST_IRN_CANCEL);
export const CanGenerateEWaybill = () => RequirePermissions(Permission.GST_EWAYBILL_GENERATE);
export const CanCancelEWaybill = () => RequirePermissions(Permission.GST_EWAYBILL_CANCEL);
export const CanFileGSTReturns = () => RequirePermissions(Permission.GST_RETURNS_FILE);
export const CanReadGSTData = () => RequirePermissions(
  Permission.GST_READ_ALL,
  Permission.GST_READ_DEPT,
  Permission.GST_READ_OWN
);

// User management operations
export const CanManageUsers = () => RequirePermissions(Permission.USER_MANAGE_ALL);
export const CanReadDeptUsers = () => RequirePermissions(Permission.USER_READ_DEPT);
export const CanReadSelfUser = () => RequirePermissions(Permission.USER_READ_SELF);

// Tenant management
export const CanManageTenant = () => RequirePermissions(Permission.TENANT_SETTINGS_MANAGE);
export const CanManageBranding = () => RequirePermissions(Permission.TENANT_BRANDING_MANAGE);
export const CanManagePlans = () => RequirePermissions(Permission.TENANT_PLANS_MANAGE);

// Department management
export const CanManageAllDepts = () => RequirePermissions(Permission.DEPT_MANAGE_ALL);
export const CanReadOwnDept = () => RequirePermissions(Permission.DEPT_READ_OWN);
export const CanReadAllDepts = () => RequirePermissions(Permission.DEPT_READ_ALL);

// Reporting & Analytics
export const CanViewAllReports = () => RequirePermissions(Permission.REPORTS_ALL);
export const CanViewDeptReports = () => RequirePermissions(Permission.REPORTS_DEPT);
export const CanViewPersonalReports = () => RequirePermissions(Permission.REPORTS_PERSONAL);

export const CanViewAllDashboards = () => RequirePermissions(Permission.DASHBOARDS_ALL);
export const CanViewDeptDashboards = () => RequirePermissions(Permission.DASHBOARDS_DEPT);
export const CanViewPersonalDashboards = () => RequirePermissions(Permission.DASHBOARDS_PERSONAL);

// Data export
export const CanExportAllData = () => RequirePermissions(Permission.EXPORT_ALL);
export const CanExportDeptData = () => RequirePermissions(Permission.EXPORT_DEPT);
export const CanExportOwnData = () => RequirePermissions(Permission.EXPORT_OWN);

// Audit access
export const CanReadAllAuditLogs = () => RequirePermissions(Permission.AUDIT_READ_ALL);
export const CanReadDeptAuditLogs = () => RequirePermissions(Permission.AUDIT_READ_DEPT);
export const CanReadOwnAuditLogs = () => RequirePermissions(Permission.AUDIT_READ_OWN);

// Approval workflow management
export const CanManageApprovals = () => RequirePermissions(Permission.APPROVAL_MANAGE);
export const CanViewAllApprovals = () => RequirePermissions(Permission.APPROVAL_VIEW_ALL);
export const CanViewDeptApprovals = () => RequirePermissions(Permission.APPROVAL_VIEW_DEPT);
export const CanViewOwnApprovals = () => RequirePermissions(Permission.APPROVAL_VIEW_OWN);

// System administration
export const CanManageSystemSettings = () => RequirePermissions(Permission.SYSTEM_SETTINGS);
export const CanManageSystemMaintenance = () => RequirePermissions(Permission.SYSTEM_MAINTENANCE);
export const CanManageSystemBackup = () => RequirePermissions(Permission.SYSTEM_BACKUP);