-- GST Compliance Schema for Inventara ERP
-- Multi-tenant architecture with Row-Level Security (RLS)
-- Extended with Role-Based Access Control (RBAC) and Department Scoping

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- TENANCY FRAMEWORK
-- ===========================================

-- Tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15) UNIQUE NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    plan VARCHAR(50) DEFAULT 'basic',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- RBAC FRAMEWORK
-- ===========================================

-- User Roles Enum
CREATE TYPE user_role AS ENUM (
    'ADMIN',     -- Tenant-wide access
    'HOD',       -- Head of Department - department scoped
    'EMPLOYEE'   -- Limited to own records
);

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_department_id UUID REFERENCES departments(id),
    head_user_id UUID, -- Will reference users.id after users table creation
    budget_limit DECIMAL(15,2),
    cost_center_code VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, code)
);

-- Users (extended with RBAC)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'EMPLOYEE',
    department_id UUID REFERENCES departments(id),
    manager_id UUID REFERENCES users(id),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    password_hash VARCHAR(255), -- For local auth, nullable if using external auth
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, employee_id),
    UNIQUE(tenant_id, email)
);

-- Add foreign key constraint for department head after users table exists
ALTER TABLE departments ADD CONSTRAINT fk_departments_head_user 
    FOREIGN KEY (head_user_id) REFERENCES users(id);

-- Approval Policies
CREATE TABLE approval_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id), -- NULL means tenant-wide
    feature VARCHAR(50) NOT NULL, -- 'REQUISITION', 'PURCHASE_ORDER', 'PAYMENT', 'INVOICE'
    category VARCHAR(50), -- Optional category filter
    limit_amount DECIMAL(15,2) NOT NULL,
    requires_roles user_role[] NOT NULL, -- Array of roles that can approve
    approval_sequence INTEGER DEFAULT 1, -- For multi-level approvals
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_approval_policies_tenant_feature ON approval_policies(tenant_id, feature, is_active);
CREATE INDEX idx_approval_policies_department ON approval_policies(department_id, feature, is_active);

-- User Sessions (for JWT token management)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token_hash);

-- Function to get current tenant ID from session
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(current_setting('app.tenant_id', true)::UUID, NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user ID from session
CREATE OR REPLACE FUNCTION current_user_id() RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(current_setting('app.user_id', true)::UUID, NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user role from session
CREATE OR REPLACE FUNCTION current_user_role() RETURNS user_role AS $$
BEGIN
    RETURN COALESCE(current_setting('app.role', true)::user_role, 'EMPLOYEE');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current department ID from session
CREATE OR REPLACE FUNCTION current_department_id() RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(current_setting('app.department_id', true)::UUID, NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set default tenant_id for new rows
CREATE OR REPLACE FUNCTION tenant_id_default() RETURNS UUID AS $$
BEGIN
    RETURN current_tenant_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set default user_id for created_by columns
CREATE OR REPLACE FUNCTION user_id_default() RETURNS UUID AS $$
BEGIN
    RETURN current_user_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set default department_id for new rows
CREATE OR REPLACE FUNCTION department_id_default() RETURNS UUID AS $$
BEGIN
    RETURN current_department_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- MASTER DATA
-- ===========================================

-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    department_id UUID REFERENCES departments(id), -- Department that manages this supplier
    created_by UUID DEFAULT user_id_default() REFERENCES users(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15),
    state_code VARCHAR(2),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    pincode VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, code)
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    department_id UUID REFERENCES departments(id), -- Department that manages this customer
    created_by UUID DEFAULT user_id_default() REFERENCES users(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15),
    state_code VARCHAR(2),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    pincode VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, code)
);

-- Tax Codes (CGST/SGST/IGST/CESS components)
CREATE TABLE tax_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    code VARCHAR(20) NOT NULL,
    component VARCHAR(20) NOT NULL, -- CGST, SGST, IGST, CESS
    rate DECIMAL(5,2) NOT NULL,
    description VARCHAR(255),
    effective_from DATE NOT NULL,
    effective_to DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, code, component)
);

CREATE INDEX idx_tax_codes_code_component ON tax_codes(tenant_id, code, component);

-- Items/Products
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    hsn_code VARCHAR(8),
    sac_code VARCHAR(6),
    default_tax_code VARCHAR(20),
    unit_of_measure VARCHAR(10),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, sku)
);

-- ===========================================
-- INVOICE FRAMEWORK
-- ===========================================

-- Invoice Status Enum
CREATE TYPE invoice_status AS ENUM (
    'DRAFT',
    'FINALIZED', 
    'IRN_GENERATED',
    'CANCELLED',
    'IRN_CANCELLED'
);

-- Invoice Direction Enum
CREATE TYPE invoice_direction AS ENUM (
    'AR', -- Accounts Receivable (Sales)
    'AP'  -- Accounts Payable (Purchase)
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    department_id UUID DEFAULT department_id_default() REFERENCES departments(id),
    created_by UUID DEFAULT user_id_default() REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    invoice_number VARCHAR(50) NOT NULL,
    direction invoice_direction NOT NULL,
    status invoice_status DEFAULT 'DRAFT',
    
    -- Parties
    supplier_id UUID REFERENCES suppliers(id),
    customer_id UUID REFERENCES customers(id),
    
    -- GST Details
    place_of_supply VARCHAR(2) NOT NULL, -- State code
    reverse_charge_mechanism BOOLEAN DEFAULT FALSE,
    
    -- Financial
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_tax DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    
    -- E-Invoice Fields
    irn VARCHAR(64), -- Invoice Reference Number
    ack_no VARCHAR(20), -- Acknowledgment Number
    ack_date TIMESTAMP WITH TIME ZONE,
    signed_qr TEXT, -- Base64 encoded QR code
    qr_svg TEXT, -- SVG QR code for printing
    
    -- Dates
    invoice_date DATE NOT NULL,
    due_date DATE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, invoice_number)
);

-- Invoice Lines
CREATE TABLE invoice_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    
    -- Item Details
    item_id UUID REFERENCES items(id),
    item_sku VARCHAR(100),
    item_name VARCHAR(255) NOT NULL,
    hsn_code VARCHAR(8),
    sac_code VARCHAR(6),
    
    -- Quantities and Pricing
    quantity DECIMAL(15,3) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    line_amount DECIMAL(15,2) NOT NULL,
    
    -- Tax Breakdown (JSON for flexibility)
    tax_breakup JSONB NOT NULL DEFAULT '{}', -- {cgst: 100, sgst: 100, igst: 0, cess: 0}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, invoice_id, line_number)
);

-- ===========================================
-- ITC LEDGER
-- ===========================================

-- Input Tax Credit Ledger
CREATE TABLE itc_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    department_id UUID DEFAULT department_id_default() REFERENCES departments(id),
    created_by UUID DEFAULT user_id_default() REFERENCES users(id),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    invoice_line_id UUID REFERENCES invoice_lines(id),
    
    -- Tax Component
    tax_component VARCHAR(20) NOT NULL, -- CGST, SGST, IGST, CESS
    tax_amount DECIMAL(15,2) NOT NULL,
    
    -- ITC Status
    eligible_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    claimed_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    blocked_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    
    -- Tracking
    period_month INTEGER NOT NULL, -- 1-12
    period_year INTEGER NOT NULL,
    claim_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- SUBMISSION TRACKING (ASYNC JOBS)
-- ===========================================

-- Submission Status Enum
CREATE TYPE submission_status AS ENUM (
    'QUEUED',
    'SUBMITTED',
    'SUCCESS',
    'FAILED',
    'CANCELLED'
);

-- IRN Submissions
CREATE TABLE gst_irn_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    department_id UUID DEFAULT department_id_default() REFERENCES departments(id),
    created_by UUID DEFAULT user_id_default() REFERENCES users(id),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    idempotency_key VARCHAR(100) NOT NULL,
    
    status submission_status DEFAULT 'QUEUED',
    
    -- Request/Response Data
    request_payload JSONB,
    response_payload JSONB,
    last_error TEXT,
    
    -- Tracking
    submitted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, idempotency_key)
);

-- E-Waybill Submissions  
CREATE TABLE gst_ewaybill_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    department_id UUID DEFAULT department_id_default() REFERENCES departments(id),
    created_by UUID DEFAULT user_id_default() REFERENCES users(id),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    idempotency_key VARCHAR(100) NOT NULL,
    
    status submission_status DEFAULT 'QUEUED',
    
    -- E-Waybill Details
    ewb_number VARCHAR(12), -- E-Waybill Number
    ewb_date TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Request/Response Data
    request_payload JSONB,
    response_payload JSONB,
    last_error TEXT,
    
    -- Tracking
    submitted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, idempotency_key)
);

-- ===========================================
-- BUSINESS LOGIC TABLES (RBAC-enabled)
-- ===========================================

-- Requisition Status Enum
CREATE TYPE requisition_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REJECTED',
    'CONVERTED_TO_PO',
    'CANCELLED'
);

-- Purchase Order Status Enum
CREATE TYPE purchase_order_status AS ENUM (
    'DRAFT',
    'SENT',
    'ACKNOWLEDGED',
    'PARTIALLY_RECEIVED',
    'FULLY_RECEIVED',
    'CANCELLED'
);

-- Goods Receipt Status Enum
CREATE TYPE goods_receipt_status AS ENUM (
    'DRAFT',
    'POSTED',
    'REVERSED'
);

-- Requisitions
CREATE TABLE requisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    department_id UUID NOT NULL DEFAULT department_id_default() REFERENCES departments(id),
    created_by UUID NOT NULL DEFAULT user_id_default() REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    
    requisition_number VARCHAR(50) NOT NULL,
    status requisition_status DEFAULT 'DRAFT',
    priority VARCHAR(20) DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH, URGENT
    
    -- Request Details
    purpose TEXT,
    justification TEXT,
    requested_delivery_date DATE,
    
    -- Financial
    total_estimated_cost DECIMAL(15,2) DEFAULT 0,
    
    -- Approval Tracking
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, requisition_number)
);

-- Requisition Lines
CREATE TABLE requisition_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    requisition_id UUID NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    
    -- Item Details
    item_id UUID REFERENCES items(id),
    item_description VARCHAR(500) NOT NULL,
    specification TEXT,
    
    -- Quantities
    requested_quantity DECIMAL(15,3) NOT NULL,
    approved_quantity DECIMAL(15,3),
    unit_of_measure VARCHAR(10) NOT NULL,
    
    -- Pricing
    estimated_unit_price DECIMAL(15,2),
    estimated_total_price DECIMAL(15,2),
    
    -- Status
    line_status requisition_status,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, requisition_id, line_number)
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    department_id UUID NOT NULL DEFAULT department_id_default() REFERENCES departments(id),
    created_by UUID NOT NULL DEFAULT user_id_default() REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    
    po_number VARCHAR(50) NOT NULL,
    status purchase_order_status DEFAULT 'DRAFT',
    
    -- Supplier Details
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    
    -- Dates
    po_date DATE NOT NULL,
    expected_delivery_date DATE,
    
    -- Terms
    payment_terms VARCHAR(255),
    delivery_terms VARCHAR(255),
    notes TEXT,
    
    -- Financial
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Approval Tracking
    approved_at TIMESTAMP WITH TIME ZONE,
    sent_to_supplier_at TIMESTAMP WITH TIME ZONE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, po_number)
);

-- Purchase Order Lines
CREATE TABLE purchase_order_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    
    -- Item Details
    item_id UUID REFERENCES items(id),
    item_description VARCHAR(500) NOT NULL,
    specification TEXT,
    
    -- Quantities
    ordered_quantity DECIMAL(15,3) NOT NULL,
    received_quantity DECIMAL(15,3) DEFAULT 0,
    unit_of_measure VARCHAR(10) NOT NULL,
    
    -- Pricing
    unit_price DECIMAL(15,2) NOT NULL,
    line_total DECIMAL(15,2) NOT NULL,
    tax_code VARCHAR(20),
    tax_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Delivery
    promised_delivery_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, po_id, line_number)
);

-- Goods Receipts (GRN)
CREATE TABLE goods_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    department_id UUID REFERENCES departments(id),
    received_by UUID NOT NULL DEFAULT user_id_default() REFERENCES users(id),
    
    grn_number VARCHAR(50) NOT NULL,
    status goods_receipt_status DEFAULT 'DRAFT',
    
    -- Reference Documents
    po_id UUID REFERENCES purchase_orders(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    supplier_delivery_note VARCHAR(100),
    
    -- Dates
    receipt_date DATE NOT NULL,
    supplier_invoice_date DATE,
    supplier_invoice_number VARCHAR(100),
    
    -- Quality Control
    quality_check_required BOOLEAN DEFAULT FALSE,
    quality_approved_by UUID REFERENCES users(id),
    quality_approved_at TIMESTAMP WITH TIME ZONE,
    quality_remarks TEXT,
    
    -- Storage
    warehouse_location VARCHAR(100),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, grn_number)
);

-- Goods Receipt Lines
CREATE TABLE goods_receipt_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    grn_id UUID NOT NULL REFERENCES goods_receipts(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    
    -- Reference
    po_line_id UUID REFERENCES purchase_order_lines(id),
    
    -- Item Details
    item_id UUID REFERENCES items(id),
    item_description VARCHAR(500) NOT NULL,
    
    -- Quantities
    ordered_quantity DECIMAL(15,3),
    received_quantity DECIMAL(15,3) NOT NULL,
    accepted_quantity DECIMAL(15,3) NOT NULL,
    rejected_quantity DECIMAL(15,3) DEFAULT 0,
    unit_of_measure VARCHAR(10) NOT NULL,
    
    -- Quality
    rejection_reason TEXT,
    
    -- Storage
    bin_location VARCHAR(50),
    batch_number VARCHAR(50),
    serial_numbers TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, grn_id, line_number)
);

-- Approval Workflows (for tracking approval history)
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT tenant_id_default(),
    
    -- Reference Document
    document_type VARCHAR(50) NOT NULL, -- 'REQUISITION', 'PURCHASE_ORDER', 'INVOICE', 'PAYMENT'
    document_id UUID NOT NULL,
    document_number VARCHAR(50),
    
    -- Approval Details
    approver_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(20) NOT NULL, -- 'APPROVED', 'REJECTED', 'RETURNED'
    comments TEXT,
    approval_level INTEGER DEFAULT 1,
    
    -- Amounts
    requested_amount DECIMAL(15,2),
    approved_amount DECIMAL(15,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_approval_workflows_document ON approval_workflows(tenant_id, document_type, document_id);
CREATE INDEX idx_approval_workflows_approver ON approval_workflows(approver_id, created_at);

-- ===========================================
-- ROW-LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tenant-aware tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE itc_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_irn_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_ewaybill_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisition_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipt_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policies
CREATE POLICY tenant_isolation_suppliers ON suppliers 
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_customers ON customers 
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_tax_codes ON tax_codes 
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_items ON items 
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_invoices ON invoices 
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_invoice_lines ON invoice_lines 
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_itc_ledger ON itc_ledger 
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_irn_submissions ON gst_irn_submissions 
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_ewaybill_submissions ON gst_ewaybill_submissions 
    USING (tenant_id = current_tenant_id());

-- ===========================================
-- RBAC POLICIES FOR MASTER DATA
-- ===========================================

-- Suppliers: Admin CRUD tenant-wide, HOD read+propose (draft), Employee read catalog
CREATE POLICY suppliers_admin_full ON suppliers
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY suppliers_hod_read ON suppliers
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD');

CREATE POLICY suppliers_emp_read ON suppliers
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND status = 'active');

-- Customers: Admin CRUD tenant-wide, HOD read+propose, Employee read catalog
CREATE POLICY customers_admin_full ON customers
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY customers_hod_read ON customers
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD');

CREATE POLICY customers_emp_read ON customers
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND status = 'active');

-- Items: Admin CRUD tenant-wide, HOD read+propose, Employee read catalog
CREATE POLICY items_admin_full ON items
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY items_hod_read ON items
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD');

CREATE POLICY items_emp_read ON items
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND status = 'active');

-- Tax Codes: Admin CRUD, HOD read, Employee read
CREATE POLICY tax_codes_admin_full ON tax_codes
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY tax_codes_hod_read ON tax_codes
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD');

CREATE POLICY tax_codes_emp_read ON tax_codes
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE');

-- ===========================================
-- RBAC POLICIES FOR INVOICES & GST
-- ===========================================

-- Invoices: Admin full, HOD dept, Employee own
CREATE POLICY invoices_admin_full ON invoices
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY invoices_hod_dept ON invoices
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id())
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id());

CREATE POLICY invoices_emp_own ON invoices
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND created_by = current_user_id())
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND created_by = current_user_id());

-- Invoice Lines: Follow parent invoice policies
CREATE POLICY invoice_lines_admin_full ON invoice_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY invoice_lines_hod_dept ON invoice_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
           AND EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND i.department_id = current_department_id()))
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
                AND EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND i.department_id = current_department_id()));

CREATE POLICY invoice_lines_emp_own ON invoice_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' 
           AND EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND i.created_by = current_user_id()))
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' 
                AND EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND i.created_by = current_user_id()));

-- ITC Ledger: Admin full, HOD dept, Employee own
CREATE POLICY itc_ledger_admin_full ON itc_ledger
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY itc_ledger_hod_dept ON itc_ledger
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id())
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id());

CREATE POLICY itc_ledger_emp_own ON itc_ledger
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND created_by = current_user_id());

-- GST IRN Submissions: Admin full, HOD dept docs, Employee own docs
CREATE POLICY gst_irn_admin_full ON gst_irn_submissions
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY gst_irn_hod_dept ON gst_irn_submissions
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id())
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id());

CREATE POLICY gst_irn_emp_own ON gst_irn_submissions
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND created_by = current_user_id());

-- GST E-Waybill Submissions: Admin full, HOD dept docs, Employee own docs
CREATE POLICY gst_ewb_admin_full ON gst_ewaybill_submissions
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY gst_ewb_hod_dept ON gst_ewaybill_submissions
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id())
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id());

CREATE POLICY gst_ewb_emp_own ON gst_ewaybill_submissions
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND created_by = current_user_id());

-- ===========================================
-- RBAC POLICIES (Role-based access control)
-- ===========================================

-- Departments: Admin full access, HOD limited to own department, Employee read-only
CREATE POLICY dept_admin_full ON departments
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY dept_hod_own ON departments
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND id = current_department_id());

CREATE POLICY dept_emp_read ON departments
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE');

-- Users: Admin full access, HOD department users, Employee self-only
CREATE POLICY users_admin_full ON users
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY users_hod_dept ON users
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id());

CREATE POLICY users_emp_self ON users
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND id = current_user_id());

-- Requisitions: Admin all, HOD department, Employee own
CREATE POLICY req_admin_all ON requisitions
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY req_hod_dept ON requisitions
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id())
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id());

CREATE POLICY req_emp_own ON requisitions
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND created_by = current_user_id())
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND created_by = current_user_id());

-- Requisition Lines: Follow parent requisition policies
CREATE POLICY req_lines_admin_all ON requisition_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY req_lines_hod_dept ON requisition_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
           AND EXISTS (SELECT 1 FROM requisitions r WHERE r.id = requisition_id AND r.department_id = current_department_id()))
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
                AND EXISTS (SELECT 1 FROM requisitions r WHERE r.id = requisition_id AND r.department_id = current_department_id()));

CREATE POLICY req_lines_emp_own ON requisition_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' 
           AND EXISTS (SELECT 1 FROM requisitions r WHERE r.id = requisition_id AND r.created_by = current_user_id()))
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' 
                AND EXISTS (SELECT 1 FROM requisitions r WHERE r.id = requisition_id AND r.created_by = current_user_id()));

-- Purchase Orders: Admin all, HOD department, Employee read-only own
CREATE POLICY po_admin_all ON purchase_orders
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY po_hod_dept ON purchase_orders
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id())
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' AND department_id = current_department_id());

CREATE POLICY po_emp_read ON purchase_orders
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND created_by = current_user_id());

-- Purchase Order Lines: Follow parent PO policies
CREATE POLICY po_lines_admin_all ON purchase_order_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY po_lines_hod_dept ON purchase_order_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
           AND EXISTS (SELECT 1 FROM purchase_orders po WHERE po.id = po_id AND po.department_id = current_department_id()))
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
                AND EXISTS (SELECT 1 FROM purchase_orders po WHERE po.id = po_id AND po.department_id = current_department_id()));

CREATE POLICY po_lines_emp_read ON purchase_order_lines
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' 
           AND EXISTS (SELECT 1 FROM purchase_orders po WHERE po.id = po_id AND po.created_by = current_user_id()));

-- Goods Receipts: Admin all, HOD department, Employee assigned
CREATE POLICY grn_admin_all ON goods_receipts
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY grn_hod_dept ON goods_receipts
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
           AND (department_id = current_department_id() OR department_id IS NULL))
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
                AND (department_id = current_department_id() OR department_id IS NULL));

CREATE POLICY grn_emp_assigned ON goods_receipts
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND received_by = current_user_id())
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' AND received_by = current_user_id());

-- Goods Receipt Lines: Follow parent GRN policies
CREATE POLICY grn_lines_admin_all ON goods_receipt_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY grn_lines_hod_dept ON goods_receipt_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
           AND EXISTS (SELECT 1 FROM goods_receipts gr WHERE gr.id = grn_id 
                      AND (gr.department_id = current_department_id() OR gr.department_id IS NULL)))
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
                AND EXISTS (SELECT 1 FROM goods_receipts gr WHERE gr.id = grn_id 
                           AND (gr.department_id = current_department_id() OR gr.department_id IS NULL)));

CREATE POLICY grn_lines_emp_assigned ON goods_receipt_lines
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' 
           AND EXISTS (SELECT 1 FROM goods_receipts gr WHERE gr.id = grn_id AND gr.received_by = current_user_id()))
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' 
                AND EXISTS (SELECT 1 FROM goods_receipts gr WHERE gr.id = grn_id AND gr.received_by = current_user_id()));

-- Approval Workflows: Admin all, HOD department scope, Employee own documents
CREATE POLICY approval_admin_all ON approval_workflows
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY approval_hod_dept ON approval_workflows
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
           AND (approver_id = current_user_id() OR 
                EXISTS (SELECT 1 FROM requisitions r WHERE r.id = document_id AND r.department_id = current_department_id()) OR
                EXISTS (SELECT 1 FROM purchase_orders po WHERE po.id = document_id AND po.department_id = current_department_id())));

CREATE POLICY approval_emp_own ON approval_workflows
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE' 
           AND (EXISTS (SELECT 1 FROM requisitions r WHERE r.id = document_id AND r.created_by = current_user_id()) OR
                EXISTS (SELECT 1 FROM purchase_orders po WHERE po.id = document_id AND po.created_by = current_user_id()) OR
                EXISTS (SELECT 1 FROM invoices i WHERE i.id = document_id AND i.created_by = current_user_id())));

-- Approval Policies: Admin full, HOD read department, Employee read-only
CREATE POLICY app_policy_admin_full ON approval_policies
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN')
    WITH CHECK (tenant_id = current_tenant_id() AND current_user_role() = 'ADMIN');

CREATE POLICY app_policy_hod_read ON approval_policies
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'HOD' 
           AND (department_id = current_department_id() OR department_id IS NULL));

CREATE POLICY app_policy_emp_read ON approval_policies
    FOR SELECT
    USING (tenant_id = current_tenant_id() AND current_user_role() = 'EMPLOYEE');

-- User Sessions: Users can only see their own sessions
CREATE POLICY user_sessions_own ON user_sessions
    USING (user_id = current_user_id())
    WITH CHECK (user_id = current_user_id());

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Invoice indexes
CREATE INDEX idx_invoices_tenant_number ON invoices(tenant_id, invoice_number);
CREATE INDEX idx_invoices_tenant_date ON invoices(tenant_id, invoice_date);
CREATE INDEX idx_invoices_tenant_status ON invoices(tenant_id, status);
CREATE INDEX idx_invoices_irn ON invoices(irn) WHERE irn IS NOT NULL;

-- Invoice lines indexes
CREATE INDEX idx_invoice_lines_invoice_id ON invoice_lines(invoice_id);
CREATE INDEX idx_invoice_lines_tenant_item ON invoice_lines(tenant_id, item_id);

-- ITC ledger indexes
CREATE INDEX idx_itc_ledger_tenant_period ON itc_ledger(tenant_id, period_year, period_month);
CREATE INDEX idx_itc_ledger_invoice ON itc_ledger(invoice_id);

-- Submission tracking indexes
CREATE INDEX idx_irn_submissions_tenant_status ON gst_irn_submissions(tenant_id, status);
CREATE INDEX idx_irn_submissions_idempotency ON gst_irn_submissions(idempotency_key);
CREATE INDEX idx_ewaybill_submissions_tenant_status ON gst_ewaybill_submissions(tenant_id, status);
CREATE INDEX idx_ewaybill_submissions_idempotency ON gst_ewaybill_submissions(idempotency_key);

-- ===========================================
-- SAMPLE DATA (Optional)
-- ===========================================

-- Insert sample tenant
INSERT INTO tenants (id, name, gstin, state_code) VALUES 
('11111111-1111-1111-1111-111111111111', 'Inventara Technologies', '27AABCI1234D1Z5', '27');

-- To use this tenant in your session:
-- SET app.tenant_id = '11111111-1111-1111-1111-111111111111';

-- Sample tax codes (for Maharashtra - state code 27)
INSERT INTO tax_codes (tenant_id, code, component, rate, description, effective_from) VALUES
('11111111-1111-1111-1111-111111111111', 'GST18', 'CGST', 9.00, 'Central GST 9%', '2023-01-01'),
('11111111-1111-1111-1111-111111111111', 'GST18', 'SGST', 9.00, 'State GST 9%', '2023-01-01'),
('11111111-1111-1111-1111-111111111111', 'GST28', 'CGST', 14.00, 'Central GST 14%', '2023-01-01'),
('11111111-1111-1111-1111-111111111111', 'GST28', 'SGST', 14.00, 'State GST 14%', '2023-01-01');

-- Sample customer
INSERT INTO customers (tenant_id, code, name, gstin, state_code, address_line1, city, pincode) VALUES
('11111111-1111-1111-1111-111111111111', 'CUST001', 'ABC Industries Ltd', '27AABCA1234D1Z5', '27', 
 '123 Business Park', 'Mumbai', '400001');

-- Sample item
INSERT INTO items (tenant_id, sku, name, hsn_code, default_tax_code, unit_of_measure) VALUES
('11111111-1111-1111-1111-111111111111', 'PROD001', 'Steel Frame Assembly', '73089099', 'GST18', 'NOS');