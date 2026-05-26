# Staff Portal Approval Gate Optimization

This documentation details the structural updates and core implementation files used to secure the platform using an isolated authentication gate [1, 2].

## The problem in consideration

Standard Google Authentication auto-approved any user with a valid Google account on login within the specified organization. This caused significant security concerns:
- users within the organisation but not authorized could instantly access the dashboard and create a user account.
-No administrative mechanism existed to review, approve, or reject access requests.

## A proposed & implemented solution on this branch

A strict server-side Approval Gate was introduced. It intercepts the authentication flow using NextAuth lifecycle hooks before a browser session is created:
- **Database Tracking:** Added a permanent state field (isApproved) to the relational database layout.
-**Sever-Side Check:** Inserted a blocking condition into the authentication logic to verify this state flag.
-**(Isolation) Page:** Implemented a private, zero-navigation landing interface (/auth/pending) for non-cleared users.
-**Administrative Controls:** Re-routed administrative profile panels to pull baseline system users, allowing instant authorization directly from the browser UI
-**Real-time Alerting:** Connected an independent email delivery module to instantly notify system controllers when actions are pending.


## ⚙️ App Base
├── 📂 prisma
│   └── 📄 schema.prisma                # Updated: Added core tracking field
├── 📂 lib
│   └── 📄 auth.ts                      # Updated: Guard hooks & email setup
├── 📂 types
│   └── 📄 next-auth.d.ts               # Created: Strong compilation definitions
└── 📂 app
    ├── 📄 page.tsx                     # Updated: Dynamic layout controls
    ├── 📂 auth
    │   └── 📂 pending
    │       └── 📄 page.tsx             # Created: Ejection interface
    └── 📂 api
        └── 📂 admin
            ├── 📂 approve
            │   └── 📄 route.ts         # Created: Database updating pipeline
            └── 📂 profiles
                └── 📄 route.ts         # Updated: Cross-table data aggregation

## File Modifications & Implementations1. 
### Database Blueprint (prisma/schema.prisma)Modification:
 Added a boolean field to track authorization states with a default restriction.prismamodel User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("STAFF")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  isApproved    Boolean   @default(false) // 👈 Track access control states
  profile       Profile?
  sessions      Session[]
}

### Guard Brain Logic (lib/auth.ts)Modification: 
Rewrote the signIn hook to run verification parameters, handle exception rules for developers, and initiate alert pipelines.

### Compilation Mappings (types/next-auth.d.ts)
 Implementation: Extended framework module scopes to register custom fields globally within compilation environments.

### Cross-Table Access Pipe (app/api/admin/profiles/route.ts)Modification:
 Changed data layer queries to pool primary system accounts (prisma.user) rather than existing descriptive entries, making unapproved users visible to system managers.

### Remote Execution Controller (app/api/admin/approve/route.ts)Implementation: 
 Exposed a mutation endpoint to commit access state updates down to relational instances.

### Isolation Interface UI (app/auth/pending/page.tsx)Implementation:
 Formed a routing block layout to safely handle restricted navigation states gracefully.

### Production Environment Variables
 RequiredTo prevent validation errors, ensure your project root contains a valid environment layout [3]:


 // Digital Messaging Core
RESEND_API_KEY=re_your_verified_live_key_here
