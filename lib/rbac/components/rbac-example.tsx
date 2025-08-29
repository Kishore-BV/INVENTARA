'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Can, 
  Permission, 
  useUser, 
  usePermission, 
  useIsAdmin, 
  useIsHOD,
  RoleBadge,
  UserRoleBadge,
  useApprovalPermissions,
  useGSTPermissions
} from '@/lib/rbac';
import { Plus, Edit, Trash2, Eye, FileText, CheckCircle } from 'lucide-react';

/**
 * Example component demonstrating RBAC usage patterns
 */
export function RBACExampleComponent() {
  const user = useUser();
  const isAdmin = useIsAdmin();
  const isHOD = useIsHOD();
  const canCreateRequisition = usePermission(Permission.REQ_CREATE);
  const approvalPerms = useApprovalPermissions();
  const gstPerms = useGSTPermissions();

  if (!user) {
    return <div>Please log in to view this content.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current User Information
            <UserRoleBadge user={user} showDepartment={true} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Department:</strong> {user.departmentName || 'N/A'}</p>
            </div>
            <div>
              <p><strong>Role:</strong> <RoleBadge role={user.role} showIcon /></p>
              <p><strong>Permissions:</strong> {user.permissions?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-based Content Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Admin Console */}
        <Can.Admin>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Admin Console</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600 mb-4">
                Administrative functions only visible to admins
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Tenant Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </Can.Admin>

        {/* HOD Features */}
        <Can.HOD>
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">HOD Functions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 mb-4">
                Department management and approval functions
              </p>
              <div className="space-y-2">
                {approvalPerms.canApproveRequisitions && (
                  <Button variant="outline" size="sm" className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Requisitions
                  </Button>
                )}
                {approvalPerms.canApprovePurchaseOrders && (
                  <Button variant="outline" size="sm" className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Purchase Orders
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </Can.HOD>

        {/* Requisition Management */}
        <Can.View permission={Permission.REQ_READ_OWN}>
          <Card>
            <CardHeader>
              <CardTitle>Requisitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Can.View permission={Permission.REQ_CREATE}>
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Requisition
                  </Button>
                </Can.View>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View My Requisitions
                </Button>

                <Can.View permission={Permission.REQ_READ_DEPT}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Department Requisitions
                  </Button>
                </Can.View>

                <Can.View permission={Permission.REQ_READ_ALL}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Requisitions
                  </Button>
                </Can.View>
              </div>
            </CardContent>
          </Card>
        </Can.View>

        {/* GST Console */}
        <Can.View permission={Permission.GST_CONSOLE_ACCESS}>
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">GST Console</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600 mb-4">
                GST compliance and e-invoice operations
              </p>
              <div className="space-y-2">
                {gstPerms.canGenerateIRN && (
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate IRN
                  </Button>
                )}
                {gstPerms.canGenerateEWaybill && (
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate E-Waybill
                  </Button>
                )}
                {gstPerms.canFileReturns && (
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    File GST Returns
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </Can.View>

        {/* Master Data Management */}
        <Can.ViewAny permissions={[Permission.ITEMS_CREATE, Permission.SUPPLIERS_CREATE]}>
          <Card>
            <CardHeader>
              <CardTitle>Master Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Can.View permission={Permission.ITEMS_CREATE}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Items
                  </Button>
                </Can.View>

                <Can.View permission={Permission.SUPPLIERS_CREATE}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Suppliers
                  </Button>
                </Can.View>

                <Can.View permission={Permission.ITEMS_PROPOSE_CHANGES}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Propose Item Changes
                  </Button>
                </Can.View>
              </div>
            </CardContent>
          </Card>
        </Can.ViewAny>

        {/* Reports Access */}
        <Can.ViewAny permissions={[Permission.REPORTS_PERSONAL, Permission.REPORTS_DEPT, Permission.REPORTS_ALL]}>
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Can.View permission={Permission.REPORTS_PERSONAL}>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Personal Reports
                  </Button>
                </Can.View>

                <Can.View permission={Permission.REPORTS_DEPT}>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Department Reports
                  </Button>
                </Can.View>

                <Can.View permission={Permission.REPORTS_ALL}>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    All Reports
                  </Button>
                </Can.View>
              </div>
            </CardContent>
          </Card>
        </Can.ViewAny>
      </div>

      {/* Conditional Messages */}
      <div className="space-y-4">
        {isAdmin && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">
              🔐 Administrator Access: You have full system access with tenant-wide permissions.
            </p>
          </div>
        )}

        {isHOD && !isAdmin && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">
              👥 Head of Department: You have department-scoped access with approval capabilities.
            </p>
          </div>
        )}

        {!canCreateRequisition && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ℹ️ You don't have permission to create requisitions. Please contact your HOD or Admin.
            </p>
          </div>
        )}
      </div>

      {/* Permission Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Permissions Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {user.permissions?.slice(0, 12).map((permission) => (
              <div 
                key={permission} 
                className="px-2 py-1 bg-gray-100 rounded text-xs font-mono"
              >
                {permission}
              </div>
            ))}
            {user.permissions && user.permissions.length > 12 && (
              <div className="px-2 py-1 bg-gray-200 rounded text-xs text-center">
                +{user.permissions.length - 12} more
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RBACExampleComponent;