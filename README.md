![CI](https://github.com/VA-run23/CSE_D_05/actions/workflows/ci.yml/badge.svg)


An academic minor project aimed at solving real-world challenges in digital democracy using full-stack development and machine learning. This repo showcases a prototype system designed to enhance civic engagement, transparency, and decision-making through intelligent digital tools.

---
---
---
## **DEVELOPMENT METHODOLOGY & SDLC ANALYSIS**

### **1. DEVELOPMENT METHODOLOGY USED**

#### **Primary Approach: Agile Development**
Our project follows **Agile/Iterative Development** with elements of modern full-stack development:

| Aspect | Implementation |
|--------|-----------------|
| **Development Cycle** | Sprint-based iterations with incremental feature additions |
| **Version Control** | Git-based (GitHub, branch: main) |
| **CI/CD** | GitHub Actions (CI badge in README) |
| **Team Structure** | Small team (VA-run23 as owner) |
| **Code Organization** | Component-based (React) + Modular backend (MVC pattern) |

---

### **2. ARCHITECTURE & DESIGN PATTERNS**

#### **A. MVC Architecture (Backend)**
```
Model (Database Layer)
├── userModel.js       → User schema & validation
├── postsModel.js      → Post schema with methods
├── voteModel.js       → Vote tracking
└── uservotes.js       → User-vote relationships

View (API Responses)
├── JSON REST responses
└── Structured error handling

Controller (Business Logic)
├── postController.js  → Post CRUD operations
├── postRoutes.js      → Route definitions
└── Middleware validation
```

**Benefits:**
- Separation of concerns
- Reusable controllers
- Easy testing and maintenance

#### **B. Component-Based Architecture (Frontend)**
```
React Components (Reusable UI)
├── Home.jsx           → Main routing hub
├── PostCard.jsx       → Reusable post display
├── TrendingPosts.jsx  → Trending display logic
├── Vote.jsx           → Voting interface
├── ProfileView.jsx    → User profile
└── chatbot.jsx        → AI chatbot UI
```

**Benefits:**
- Code reusability
- Easier testing (component isolation)
- Scalable UI architecture

#### **C. Service-Oriented Architecture (SOA)**
- **Frontend Service**: Vite + React (port 3000)
- **Backend Service**: Express API (port 5000)
- **AI Service**: Gemini API (external)
- **Database Service**: MongoDB (external)

---

### **3. SDLC PHASES IMPLEMENTED**

#### **Phase 1: Planning & Requirements (✅ Implemented)**
- **Requirement**: Digital Constitution Platform for civic engagement
- **User Stories**:
  - Users can discuss constitution articles
  - Users can vote on opinions (Agree/Disagree)
  - View trending discussions
  - AI chatbot for constitution queries

#### **Phase 2: Analysis**
**Functional Requirements:**
- User authentication
- Create/Read posts
- Vote system (agree/disagree)
- Threading support (reply to posts)
- Trending algorithm
- AI chatbot with context

**Non-Functional Requirements:**
- Real-time data sync
- Scalable database
- Fast response time
- Cross-browser compatibility

#### **Phase 3: Design (✅ Implemented)**
**Database Schema Design:**
```javascript
User Schema:
- userId (8-char unique ID)
- email, name, password
- role: 'Citizen', 'Expert', 'Law Maker'
- OAuth support (googleId)

Post Schema:
- postId, userId, articleNumber
- content, replyToPostId (threading)
- agreeList[], disagreeList[]
- posts[] (comments/responses)
- timestamps

Vote Model:
- userId, postId
- voteType: 'agree'/'disagree'
```

**API Design (RESTful):**
```
GET    /api/posts              → Get all posts
POST   /api/posts              → Create post
GET    /api/posts/:postId      → Get single post
POST   /api/posts/:postId/agree → Vote agree
GET    /api/posts/trending     → Trending posts
GET    /api/chat               → Chatbot query
```

#### **Phase 4: Development (✅ Implemented)**

**Backend Development:**
```javascript
// Modular code structure
app.js              → Main server setup
routes/             → API endpoints
models/             → Schema definitions
controllers/        → Business logic
middleware/         → Authentication, validation
```

**Frontend Development:**
```jsx
// Component hierarchy
App.jsx             → Root component
├── LoginPage       → Authentication
└── Home            → Main dashboard
    ├── TrendingPosts
    ├── PostsList
    ├── Vote
    ├── ProfileView
    └── Chatbot
```

**Key Implementation Patterns:**

1. **Pre-save Hooks** (Database)
```javascript
// Auto-generate unique IDs
userSchema.pre('save', async function(next) {
  if (this.userId) return next();
  // Generate unique 8-char ID
  this.userId = generateShortUserId();
  next();
});
```

2. **Instance Methods** (Post Model)
```javascript
postSchema.methods.addAgree = async function(userId) {
  this.agreeList.push({ userId });
  this.agreeCount = this.agreeList.length;
  await this.save();
};
```

3. **Static Methods** (Post Statistics)
```javascript
postSchema.statics.getPostStats = async function(postId) {
  // Calculate interactions and trends
};
```

4. **Middleware Pattern** (Authentication)
```javascript
// authenticate.js - Custom middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = await User.findOne({ userId: token });
  req.user = user;
  next();
};
```

#### **Phase 5: Testing (✅ Partial Implementation)**
```javascript
// Backend: Jest + Supertest
app.test.js         → Health check API test

// Frontend: Vitest + React Testing Library
App.test.jsx        → Component testing
```

**Testing Coverage:**
- API health check
- Component rendering
- User interactions (vote, post creation)

#### **Phase 6: Deployment (⚠️ Containerized Ready)**
**Docker Setup:**
- Backend service (port 5000)
- Frontend service (port 3000)
- Docker Compose orchestration
- Environment-based configuration

---

### **4. SOFTWARE DEVELOPMENT PRACTICES IMPLEMENTED**

| Practice | Implementation | Evidence |
|----------|-----------------|----------|
| **Code Organization** | MVC pattern, modular structure | `controllers/`, `models/`, `routes/` folders |
| **Error Handling** | Try-catch blocks, meaningful error messages | postController.js error handling |
| **Input Validation** | Schema validation, required fields check | postsModel.js schema validation |
| **Environment Management** | `.env` file for configuration | `dotenv` usage |
| **Middleware Usage** | Authentication middleware | authenticate.js |
| **API Documentation** | Routes organized by feature | `routes/` folder structure |
| **Code Reusability** | Components, controllers, models | Component hierarchy |
| **Version Control** | Git with main branch | GitHub repository |
| **Continuous Integration** | GitHub Actions CI badge | CI pipeline setup |
| **Logging** | Console logs for debugging | `console.error()`, `console.log()` |

---

### **5. DESIGN PATTERNS USED**

| Pattern | Where Used | Purpose |
|---------|-----------|---------|
| **MVC** | Backend structure | Separation of concerns |
| **Component Pattern** | React components | UI reusability |
| **Middleware Pattern** | Express middleware | Cross-cutting concerns |
| **Singleton** | Database connection | Single MongoDB instance |
| **Observer Pattern** | React state hooks | Data binding |
| **Factory Pattern** | generateShortId(), generateShortUserId() | Object creation |
| **Strategy Pattern** | Vote (agree/disagree) system | Different voting strategies |
| **Repository Pattern** | Models with static methods | Data access abstraction |
