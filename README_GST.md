# Inventara GST Compliance System

A comprehensive GST (Goods and Services Tax) compliance system for India, designed for multi-tenant SaaS applications. This system provides e-invoice generation, e-waybill management, and complete GST compliance features.

## 🚀 Features

### Core Features
- **E-Invoice (IRN) Generation**: Generate Invoice Reference Numbers (IRN) as per Government of India guidelines
- **E-Waybill Management**: Create, update, cancel, and extend e-waybills for goods movement
- **Multi-tenant Architecture**: Complete tenant isolation using Row-Level Security (RLS)
- **PDF Invoice Generation**: GST-compliant invoice templates with QR code support
- **Async Processing**: Queue-based processing for reliable GSP communication
- **Retry Logic**: Intelligent retry mechanisms with exponential backoff
- **Audit Trail**: Complete audit logging for compliance requirements

### Technical Features
- **Database**: PostgreSQL with multi-tenant RLS
- **ORM**: Prisma for type-safe database operations
- **Backend**: NestJS with comprehensive validation
- **Templates**: Handlebars-based PDF generation
- **Queue System**: BullMQ for background job processing
- **Caching**: Redis for performance optimization
- **API Documentation**: Swagger/OpenAPI integration

## 📁 Project Structure

```
dashboard/
├── db/
│   └── schema.sql                    # PostgreSQL schema with RLS
├── prisma/
│   └── schema.prisma                 # Prisma schema definition
├── templates/
│   ├── invoice_a4.hbs               # Invoice HTML template
│   ├── invoice_a4.css               # Invoice CSS styles
│   ├── sample_data.json             # Sample data for testing
│   └── invoice_test.html            # Static test file
└── services/nestjs/src/
    ├── modules/gst/
    │   ├── dto/                     # Data Transfer Objects
    │   ├── services/                # Business logic services
    │   ├── gst.controller.ts        # REST API endpoints
    │   └── gst.module.ts            # NestJS module definition
    ├── common/http/
    │   └── gsp-client.service.ts    # GSP HTTP client with retry logic
    └── config/
        └── configuration.service.ts  # Environment configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis 6+
- GSP (GST Suvidha Provider) credentials

### 1. Database Setup

```bash
# Create database
createdb inventara_gst

# Run schema
psql inventara_gst -f db/schema.sql

# Generate Prisma client
cd prisma
npx prisma generate
```

### 2. Environment Configuration

```bash
# Copy environment template
cp services/nestjs/.env.example services/nestjs/.env

# Edit configuration
nano services/nestjs/.env
```

### 3. Install Dependencies

```bash
cd services/nestjs
npm install

# Install additional dependencies for PDF generation
npm install puppeteer handlebars
```

### 4. Start Services

```bash
# Start Redis (if not running)
redis-server

# Start NestJS application
npm run start:dev
```

## 🔧 Configuration

### Environment Variables

Key configuration options:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/inventara_gst"

# GSP Configuration
GSP_BASE_URL="https://api.gsp-sandbox.com"
GSP_APP_KEY="your_gsp_app_key"
GSP_APP_SECRET="your_gsp_app_secret"

# Security
JWT_SECRET="your_jwt_secret_key"
ENCRYPTION_KEY="your_encryption_key"

# Features
EINVOICE_ENABLED=true
EWAYBILL_ENABLED=true
MULTI_TENANT_ENABLED=true
```

### Multi-tenant Setup

For each request, set the tenant context:

```sql
-- Set tenant context before any operations
SET app.tenant_id = 'tenant-uuid-here';
```

## 📖 API Documentation

### E-Invoice Endpoints

#### Generate IRN
```http
POST /gst/einvoice/irn/generate
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "invoiceId": "inv_123456789",
  "supplyType": "B2B",
  "documentType": "INV",
  "documentNumber": "INV-2024-000123",
  "documentDate": "2024-01-25",
  "gstin": "29AAAPL1234C1Z5",
  "seller": { ... },
  "buyer": { ... },
  "items": [ ... ],
  "totalInvoiceValue": 118000.00
}
```

#### Check IRN Status
```http
GET /gst/einvoice/status/{submissionId}
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

#### Cancel IRN
```http
POST /gst/einvoice/irn/cancel
Content-Type: application/json

{
  "irn": "01AAAPL1234C1Z5000...",
  "gstin": "29AAAPL1234C1Z5",
  "cancelReason": "2",
  "cancelRemarks": "Data entry mistake"
}
```

### E-Waybill Endpoints

#### Generate E-Waybill
```http
POST /gst/ewaybill/generate
Content-Type: application/json

{
  "supplyType": "O",
  "subSupplyType": "1",
  "documentType": "INV",
  "documentNumber": "INV-2024-000123",
  "fromGstin": "29AAAPL1234C1Z5",
  "toGstin": "27BBBFG5678D1Z5",
  "transportMode": "1",
  "transportDistance": 850,
  "items": [ ... ]
}
```

#### Check E-Waybill Status
```http
GET /gst/ewaybill/status/{submissionId}
```

## 🔄 Async Processing

The system uses queue-based processing for reliable GSP communication:

### Job Types
- **IRN Generation**: `einvoice.generate`
- **IRN Cancellation**: `einvoice.cancel`
- **E-Waybill Generation**: `ewaybill.generate`
- **E-Waybill Cancellation**: `ewaybill.cancel`

### Queue Configuration
```typescript
{
  concurrency: 5,
  maxRetryAttempts: 3,
  retryDelay: 60000, // 1 minute
  backoffType: 'exponential'
}
```

## 📄 PDF Generation

### Invoice Template

The system uses Handlebars templates for PDF generation:

```javascript
// Render invoice
const html = Handlebars.compile(template)(invoiceData);
const pdf = await puppeteer.createPDF(html);
```

### Template Data Structure
```javascript
{
  invoice: {
    number: "INV-2024-000123",
    date: "2024-01-25",
    irn: "01AAAPL1234C1Z5...",
    qrSvg: "<svg>...</svg>"
  },
  seller: { ... },
  buyer: { ... },
  lineItems: [ ... ],
  taxSummary: { ... }
}
```

## 🔒 Security

### Multi-tenant Isolation
- Row-Level Security (RLS) enforced at database level
- Tenant context validation on every request
- Encrypted sensitive data storage

### API Security
- JWT-based authentication
- Request validation using class-validator
- Rate limiting and CORS protection

### Audit Logging
- All GST operations logged for 7 years (compliance requirement)
- Immutable audit trail
- User action tracking

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:e2e
```

### Template Testing
Open `templates/invoice_test.html` in a browser to preview invoice layouts.

## 📊 Monitoring

### Health Checks
```http
GET /gst/health
```

### Metrics
- E-Invoice generation success rate
- E-Waybill processing time
- Queue job statistics
- GSP API response times

## 🚀 Deployment

### Docker Setup
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment-specific Configuration
- **Development**: Sandbox GSP endpoints
- **Staging**: Staging GSP endpoints with test data
- **Production**: Live GSP endpoints with real transactions

## 🔧 Troubleshooting

### Common Issues

#### GSP Connection Errors
- Verify GSP credentials
- Check network connectivity
- Validate SSL certificates

#### Database Connection Issues
- Verify PostgreSQL connection string
- Check database permissions
- Ensure RLS policies are active

#### Template Rendering Errors
- Validate Handlebars syntax
- Check data structure
- Verify CSS compatibility

### Debug Mode
Enable detailed logging:
```env
DEBUG_MODE=true
LOG_LEVEL=debug
```

## 📚 GST Compliance References

- [E-Invoice Portal](https://www.einvoice.gov.in/)
- [E-Waybill Portal](https://www.ewaybill.gov.in/)
- [GST Council Guidelines](https://www.gstcouncil.gov.in/)
- [IRP API Documentation](https://docs.einvoice.gov.in/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Email: support@inventara.com
- Documentation: [docs.inventara.com](https://docs.inventara.com)

---

**Note**: This system is designed to comply with Indian GST regulations as of 2024. Always verify compliance with the latest government guidelines and consult with tax professionals for implementation in production environments.