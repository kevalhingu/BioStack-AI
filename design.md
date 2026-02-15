# BioStack - Design Document

## System Architecture Overview

BioStack is designed as a cloud-native, microservices-based application that processes synthetic medical records through a pipeline of AI-powered components. The system follows a three-tier architecture with clear separation between presentation, business logic, and data layers. All components are containerized for portability and deployed on AWS infrastructure.

The architecture prioritizes modularity, allowing individual components to be developed, tested, and scaled independently. This design supports the hackathon development timeline while providing a foundation for future enhancements.

## High-Level Architecture Diagram Explanation

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                     │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │  Doctor Portal   │              │  Patient Portal  │         │
│  │   (React SPA)    │              │   (React SPA)    │         │
│  └────────┬─────────┘              └────────┬─────────┘         │
└───────────┼──────────────────────────────────┼──────────────────┘
            │                                  │
            └──────────────┬───────────────────┘
                           │ HTTPS/REST
┌───────────────────────────┼──────────────────────────────────────┐
│                    API Gateway Layer                              │
│                  ┌────────▼─────────┐                            │
│                  │   API Gateway    │                            │
│                  │  (AWS API GW)    │                            │
│                  └────────┬─────────┘                            │
└───────────────────────────┼──────────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────────┐
│                   Backend Services Layer                          │
│   ┌────────────────┐     │      ┌─────────────────┐             │
│   │  Ingestion     │◄────┘      │  Summary        │             │
│   │  Service       │             │  Service        │             │
│   └───────┬────────┘             └────────▲────────┘             │
│           │                               │                      │
│           ▼                               │                      │
│   ┌────────────────────────────────────────┴──────┐             │
│   │         AI Processing Service                 │             │
│   │  ┌──────────────┐  ┌────────────────────┐    │             │
│   │  │   NLP/NER    │  │  Risk Assessment   │    │             │
│   │  │   Engine     │  │     Engine         │    │             │
│   │  └──────────────┘  └────────────────────┘    │             │
│   │  ┌──────────────┐  ┌────────────────────┐    │             │
│   │  │  LLM Summary │  │  Patient Explain   │    │             │
│   │  │  Generator   │  │     Generator      │    │             │
│   │  └──────────────┘  └────────────────────┘    │             │
│   └───────────────────┬────────────────────────┬─┘             │
└───────────────────────┼────────────────────────┼───────────────┘
                        │                        │
┌───────────────────────┼────────────────────────┼───────────────┐
│                  Data Layer                    │                │
│   ┌───────────────────▼──────┐   ┌────────────▼──────────┐    │
│   │   PostgreSQL Database    │   │   S3 Storage          │    │
│   │  (Patient Records,       │   │  (Raw Records,        │    │
│   │   Processed Summaries)   │   │   Logs, Exports)      │    │
│   └──────────────────────────┘   └───────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

**Key Architectural Principles:**
- Stateless services for horizontal scalability
- Asynchronous processing for long-running AI tasks
- Event-driven communication between services
- Centralized logging and monitoring
- Infrastructure as Code (IaC) for reproducible deployments

## Component Design

### Frontend

**Technology Stack:**
- React 18 with TypeScript
- Material-UI (MUI) for component library
- React Router for navigation
- Axios for API communication
- Recharts for data visualization

**Key Components:**

1. **Doctor Portal**
   - Upload interface for patient records (drag-and-drop, file selection)
   - Patient list view with risk indicators
   - Detailed clinical summary view with expandable sections
   - Risk timeline visualization
   - Export functionality (PDF generation)

2. **Patient Portal**
   - Simplified dashboard showing health status
   - Plain-language explanation of conditions
   - Visual indicators for key metrics (traffic light system)
   - Recommended actions and lifestyle tips
   - Glossary for medical terms

3. **Shared Components**
   - Authentication wrapper (basic auth for demo)
   - Error boundary and fallback UI
   - Loading states and progress indicators
   - Disclaimer banner (always visible)

**Design Patterns:**
- Container/Presenter pattern for separation of concerns
- Custom hooks for API calls and state management
- Context API for global state (user session, theme)
- Lazy loading for route-based code splitting

### Backend

**Technology Stack:**
- Python 3.11 with FastAPI framework
- Pydantic for data validation
- SQLAlchemy for ORM
- Celery for asynchronous task processing
- Redis for task queue and caching

**Service Architecture:**

1. **Ingestion Service**
   - **Responsibilities**: Receive, validate, and store raw patient records
   - **Endpoints**:
     - `POST /api/v1/records/upload` - Upload single or batch records
     - `GET /api/v1/records/{record_id}/status` - Check processing status
   - **Validation**: Schema validation, data type checking, required field verification
   - **Storage**: Raw records stored in S3, metadata in PostgreSQL

2. **AI Processing Service**
   - **Responsibilities**: Orchestrate NLP, entity extraction, and risk analysis
   - **Components**:
     - NLP/NER Engine: Extract clinical entities using spaCy medical models
     - Risk Assessment Engine: Calculate risk scores based on rule-based logic
     - LLM Summary Generator: Generate clinical summaries using OpenAI API or open-source LLM
     - Patient Explanation Generator: Simplify medical content for patient understanding
   - **Processing Flow**: Asynchronous task queue, status updates via webhooks or polling

3. **Summary Service**
   - **Responsibilities**: Retrieve and format processed summaries
   - **Endpoints**:
     - `GET /api/v1/summaries/{record_id}/clinical` - Get doctor summary
     - `GET /api/v1/summaries/{record_id}/patient` - Get patient explanation
     - `GET /api/v1/summaries/{record_id}/export` - Export as PDF
   - **Caching**: Redis cache for frequently accessed summaries

**API Design Principles:**
- RESTful conventions with versioned endpoints
- Consistent error response format (RFC 7807 Problem Details)
- Pagination for list endpoints
- Rate limiting to prevent abuse
- OpenAPI/Swagger documentation

### AI Processing Layer

**NLP/NER Engine:**
- **Library**: spaCy with `en_core_sci_md` or `en_ner_bc5cdr_md` models
- **Entities Extracted**: Diseases, symptoms, medications, procedures, lab tests, anatomical sites
- **Post-processing**: Entity linking to standard terminologies (SNOMED CT, RxNorm)
- **Output**: Structured JSON with entity text, type, position, and confidence score

**Risk Assessment Engine:**
- **Approach**: Rule-based scoring system with weighted factors
- **Risk Factors**:
  - Chronic condition count and severity
  - Abnormal lab values (flagged by reference ranges)
  - Medication count and interaction potential
  - Recent hospitalizations or emergency visits
  - Trend analysis (improving vs. deteriorating)
- **Scoring**: 0-100 scale with thresholds (Low: 0-33, Moderate: 34-66, High: 67-100)
- **Output**: Overall risk score, category-specific scores, flagged items

**LLM Summary Generator:**
- **Model Options**: 
  - OpenAI GPT-4 API (primary for hackathon)
  - Llama 2 or Mistral (open-source fallback)
- **Prompt Engineering**:
  - System prompt defines role as medical summarization assistant
  - Few-shot examples for consistent formatting
  - Explicit instructions to prioritize by clinical urgency
  - Temperature: 0.3 for consistency
- **Output Format**: Structured sections (Chief Concerns, Active Problems, Medications, Recent Results, Recommendations)

**Patient Explanation Generator:**
- **Approach**: LLM-based simplification with readability constraints
- **Prompt Strategy**:
  - Target 8th-grade reading level (Flesch-Kincaid)
  - Use analogies and everyday language
  - Avoid medical jargon or provide definitions
  - Emphasize actionable information
- **Validation**: Readability scoring to ensure accessibility
- **Output Format**: Narrative style with clear sections (Your Health Today, What This Means, What You Can Do)

### Database

**Technology**: PostgreSQL 15

**Schema Design:**

```sql
-- Core tables
patients (
  id UUID PRIMARY KEY,
  external_id VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

records (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  raw_data JSONB,
  s3_key VARCHAR(500),
  status VARCHAR(50), -- pending, processing, completed, failed
  uploaded_at TIMESTAMP,
  processed_at TIMESTAMP
)

entities (
  id UUID PRIMARY KEY,
  record_id UUID REFERENCES records(id),
  entity_type VARCHAR(100), -- condition, medication, procedure, etc.
  entity_text TEXT,
  entity_code VARCHAR(50), -- SNOMED, RxNorm, etc.
  confidence FLOAT,
  start_pos INT,
  end_pos INT
)

risk_assessments (
  id UUID PRIMARY KEY,
  record_id UUID REFERENCES records(id),
  overall_score INT,
  risk_category VARCHAR(20),
  factors JSONB, -- detailed breakdown
  calculated_at TIMESTAMP
)

summaries (
  id UUID PRIMARY KEY,
  record_id UUID REFERENCES records(id),
  clinical_summary TEXT,
  patient_explanation TEXT,
  generated_at TIMESTAMP
)

-- Audit table
audit_logs (
  id UUID PRIMARY KEY,
  user_id VARCHAR(100),
  action VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id UUID,
  timestamp TIMESTAMP,
  details JSONB
)
```

**Indexing Strategy:**
- B-tree indexes on foreign keys and status fields
- GIN index on JSONB columns for entity search
- Composite index on (patient_id, created_at) for timeline queries

**Data Retention:**
- Raw records retained for 90 days (demo environment)
- Processed summaries retained indefinitely
- Audit logs retained for 1 year

## Data Flow Description

### End-to-End Processing Flow

1. **Upload Phase**
   - User uploads patient record via web interface
   - Frontend sends multipart/form-data POST to API Gateway
   - Ingestion Service validates format and structure
   - Raw data stored in S3, metadata record created in PostgreSQL
   - Async processing task queued in Celery/Redis
   - Upload confirmation returned to user with tracking ID

2. **Processing Phase**
   - Celery worker picks up task from queue
   - AI Processing Service retrieves raw data from S3
   - NLP/NER Engine extracts clinical entities
   - Entities stored in database with confidence scores
   - Risk Assessment Engine calculates scores based on entities and rules
   - Risk assessment stored in database
   - LLM Summary Generator creates clinical summary
   - Patient Explanation Generator creates simplified version
   - Both summaries stored in database
   - Record status updated to "completed"
   - Processing time logged for monitoring

3. **Retrieval Phase**
   - User requests summary via frontend
   - Summary Service checks Redis cache
   - If cache miss, queries PostgreSQL for summaries and risk data
   - Response formatted with clinical summary, patient explanation, and risk indicators
   - Result cached in Redis (TTL: 1 hour)
   - Frontend renders dual-view interface

4. **Export Phase**
   - User requests PDF export
   - Summary Service generates PDF using ReportLab or WeasyPrint
   - PDF stored temporarily in S3
   - Pre-signed URL returned to user (expires in 15 minutes)
   - Frontend triggers download

## Risk Analysis Logic Overview

**Multi-Factor Scoring System:**

1. **Chronic Condition Burden** (Weight: 30%)
   - Count of active chronic conditions
   - Severity multipliers (e.g., heart failure = 3x, diabetes = 2x)
   - Comorbidity interactions (diabetes + CKD = additional points)

2. **Vital Signs and Lab Abnormalities** (Weight: 25%)
   - Deviation from normal ranges (mild, moderate, severe)
   - Critical values flagged immediately (e.g., glucose >400 mg/dL)
   - Trend analysis: worsening trends increase score

3. **Medication Complexity** (Weight: 20%)
   - Total medication count (polypharmacy risk)
   - High-risk medications (anticoagulants, insulin, opioids)
   - Potential drug-drug interactions

4. **Healthcare Utilization** (Weight: 15%)
   - Recent hospitalizations (within 30 days)
   - Emergency department visits
   - Frequency of acute care encounters

5. **Temporal Trends** (Weight: 10%)
   - Improving vs. deteriorating trajectory
   - Medication adherence indicators
   - Follow-up appointment compliance

**Risk Categorization:**
- Low Risk (0-33): Stable conditions, routine monitoring
- Moderate Risk (34-66): Active management needed, closer follow-up
- High Risk (67-100): Urgent attention, potential intervention required

**Limitations:**
- Simplified scoring not validated against clinical outcomes
- Does not account for social determinants of health
- Limited to data available in synthetic records
- No machine learning-based prediction (rule-based only)

## Security and Compliance Considerations

**Data Protection:**
- All data transmission over TLS 1.3
- API authentication using JWT tokens
- Input sanitization to prevent SQL injection and XSS
- Rate limiting on API endpoints (100 requests/minute per user)
- No storage of real patient data (synthetic only)

**Access Control:**
- Role-based access control (RBAC) for doctor vs. patient views
- Session management with secure cookies
- Password hashing using bcrypt (for demo accounts)
- API key rotation for external service access

**Compliance Notes:**
- **Not HIPAA-compliant**: System uses synthetic data only
- **Not a medical device**: Explicitly labeled as decision support tool
- **No FDA regulation**: Educational/demonstration purpose
- **Open source considerations**: Careful selection of permissive licenses

**Audit and Monitoring:**
- All API calls logged with user ID, timestamp, and action
- Failed authentication attempts tracked
- Data access patterns monitored for anomalies
- CloudWatch logs aggregated for security analysis

**Limitations:**
- Basic authentication suitable for hackathon demo only
- Production deployment would require OAuth 2.0/OIDC
- No encryption at rest for demo environment
- Limited penetration testing within hackathon timeframe

## Scalability Considerations

**Horizontal Scaling:**
- Stateless API services deployed in auto-scaling groups
- Load balancer distributes traffic across multiple instances
- Celery workers scale based on queue depth
- Database read replicas for query distribution

**Performance Optimization:**
- Redis caching reduces database load
- CDN for static frontend assets
- Lazy loading and code splitting in React app
- Database query optimization with proper indexing
- Batch processing for multiple records

**Resource Management:**
- Container resource limits (CPU, memory) defined
- Connection pooling for database and Redis
- Async I/O for non-blocking operations
- LLM API rate limiting and retry logic

**Bottleneck Mitigation:**
- LLM API calls are primary bottleneck (3-5 seconds per summary)
- Mitigation: Async processing, user notified when complete
- Database writes batched where possible
- S3 multipart upload for large files

**Scalability Targets:**
- Support 1,000 concurrent users
- Process 10,000 records per day
- API response time <2 seconds (excluding async processing)
- Database handles 100 million entity records

## Deployment Strategy on AWS

**Infrastructure Components:**

1. **Compute:**
   - ECS Fargate for containerized services (serverless containers)
   - Lambda functions for lightweight tasks (PDF generation, notifications)
   - EC2 instances for Celery workers (t3.medium, auto-scaling)

2. **Storage:**
   - RDS PostgreSQL (db.t3.medium, Multi-AZ for demo)
   - S3 buckets (raw records, exports, static assets)
   - ElastiCache Redis (cache.t3.micro)

3. **Networking:**
   - VPC with public and private subnets
   - Application Load Balancer for API traffic
   - CloudFront CDN for frontend distribution
   - API Gateway for REST endpoints

4. **Security:**
   - IAM roles for service-to-service authentication
   - Security groups restricting inbound traffic
   - Secrets Manager for API keys and credentials
   - WAF for basic DDoS protection

5. **Monitoring:**
   - CloudWatch for logs and metrics
   - X-Ray for distributed tracing
   - SNS for alerting on errors
   - CloudWatch dashboards for system health

**Deployment Pipeline:**

1. **CI/CD with GitHub Actions:**
   - Automated testing on pull requests
   - Docker image builds on merge to main
   - Push images to ECR (Elastic Container Registry)
   - Terraform apply for infrastructure updates
   - ECS service updates with rolling deployment

2. **Environment Strategy:**
   - Development: Local Docker Compose
   - Staging: AWS environment with reduced capacity
   - Production: Full AWS deployment (hackathon demo)

3. **Infrastructure as Code:**
   - Terraform for AWS resource provisioning
   - Modular structure (networking, compute, data, security)
   - State stored in S3 with DynamoDB locking
   - Separate workspaces for staging/production

**Cost Optimization:**
- Use of free tier and hackathon credits where available
- Auto-scaling policies to reduce idle resources
- S3 lifecycle policies for data archival
- Reserved instances for predictable workloads (if extended beyond hackathon)

**Estimated Monthly Cost (Demo Environment):**
- ECS Fargate: $50-100
- RDS PostgreSQL: $30-50
- ElastiCache Redis: $15-20
- S3 Storage: $5-10
- Data Transfer: $10-20
- OpenAI API: $50-100 (usage-based)
- Total: ~$160-300/month

## Limitations

**Technical Limitations:**
1. Synthetic data may not represent real-world complexity and edge cases
2. NLP entity extraction accuracy limited by model training data
3. Risk scoring is rule-based, not validated against clinical outcomes
4. LLM summaries may occasionally generate inconsistent or incomplete information
5. No support for medical imaging, genetic data, or complex diagnostic reports
6. English language only; no multi-language support
7. Limited scalability testing within hackathon timeframe

**Clinical Limitations:**
1. Not validated by medical professionals or regulatory bodies
2. Cannot replace clinical judgment or comprehensive patient assessment
3. Risk scores are illustrative, not clinically actionable
4. Does not account for patient preferences, social factors, or contextual information
5. No integration with real EHR systems or clinical workflows
6. Simplified medical logic may miss nuanced clinical scenarios

**Operational Limitations:**
1. Basic authentication not suitable for production use
2. Limited error recovery and fault tolerance
3. No disaster recovery or backup strategy implemented
4. Monitoring and alerting are basic
5. No user training or support documentation
6. Limited accessibility testing and compliance

**Scope Limitations:**
1. Demonstration system only; not intended for clinical deployment
2. No patient consent or data governance framework
3. No clinical validation studies or user testing with healthcare providers
4. Limited to batch processing; no real-time monitoring
5. No integration with pharmacy, lab, or imaging systems

**Ethical Considerations:**
1. AI-generated summaries may perpetuate biases present in training data
2. Oversimplification for patients may omit important nuances
3. Risk of over-reliance on automated summaries
4. No mechanism for patient feedback or correction of errors
5. Transparency about AI involvement must be maintained

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Status**: Draft for Hackathon Submission  
**Architecture Review**: Pending team review
