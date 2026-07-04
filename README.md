# 🌱 EcoTrack - AI-Powered Waste Management Platform

![EcoTrack](https://img.shields.io/badge/EcoTrack-v1.0-2D5A27?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Production--Ready-success?style=for-the-badge)

**EcoTrack** is a comprehensive AI-driven waste management platform designed to revolutionize how households and businesses handle waste. Built with modern web technologies, it provides intelligent waste classification, gamified rewards, and enterprise-grade analytics.

**LIVE**: https://ecotrack-two.vercel.app/#

---

## 🎯 Project Overview

EcoTrack addresses the global waste crisis by making waste segregation simple, rewarding, and data-driven. The platform uses AI to classify waste in real-time, awards eco-points for responsible disposal, and connects users with verified recycling centers.

### **Mission**
*"Turning waste into worth through AI-powered classification and community engagement"*

### **Vision**
To achieve 90%+ waste segregation accuracy globally and support UN SDG 12 (Responsible Consumption & Production)

---

## ✨ Currently Completed Features

### 🔐 **1. Dual-Role Authentication System**
- **Household Users**: Personal waste tracking with gamification
- **Business Users**: Enterprise dashboard with compliance reporting
- Secure login/signup with localStorage persistence
- Role-based access control

### 🤖 **2. AI "Robot" Detector (Scanner Interface)**
- **Image Upload**: Drag-and-drop or click to upload waste images
- **Camera Feed**: Support for direct camera capture
- **Mock AI Classification**: Simulates TensorFlow.js waste categorization
  - **Biodegradable**: Wet waste, food scraps, organic matter
  - **Non-Biodegradable**: Dry waste, plastic, metal, e-waste
- **Confidence Score**: Real-time accuracy percentage (85-100%)
- **Bin Recommendation**: Color-coded guidance (🟢 Green Bin / 🔴 Red Bin)
- **Instant Feedback**: Points awarded immediately after scan

### 📊 **3. Eco Dashboard**
- **Visual Analytics**:
  - Chart.js pie chart showing waste segregation history
  - Real-time data visualization
- **Impact Metrics**:
  - **Total Waste Recycled**: Tracked in kilograms
  - **CO₂ Saved**: Environmental impact calculation
  - **Virtual Trees Earned**: Gamified milestone (1 tree per 10kg)
  - **Eco-Points**: Cumulative rewards balance
- **Activity Feed**: Scrollable timeline of recent scans with:
  - Waste type classification
  - Confidence scores
  - Points earned
  - Timestamps (relative time format)

### 🎮 **4. Gamified Rewards System**
- **Eco-Points Economy**:
  - Earn 15 points per biodegradable scan
  - Earn 10 points per non-biodegradable scan
- **Redemption Marketplace**:
  - **Mamaearth**: 20% off (500 points)
  - **The Body Shop**: ₹500 voucher (800 points)
  - **Paper Boat**: Free bundle (600 points)
  - **Tata Green**: Plant a real tree (1000 points)
  - **ITC**: Eco-stationery kit (400 points)
  - **Local Artisans**: Handmade jute bag (300 points)
- **Brand Partnerships**: Integration with 6+ eco-conscious brands
- **Real-time Balance**: Live point tracking across all pages

### 🏢 **5. Business Admin Panel**
Enterprise interface for Business Pro subscribers:
- **Overview Dashboard**: Team statistics and compliance metrics
- **Team Management**: Multi-account administration
- **Regional Analytics**: Bar chart showing compliance by region
- **Compliance Reporting**: Automated reports for government regulations
- **Data Export**: Generate sustainability reports

### 💳 **6. Membership & Pricing**
Three-tier pricing model:

| Plan | Price | Features |
|------|-------|----------|
| **Freemium** | ₹0/month | Basic tracking, AI classification, eco-points, community support |
| **Premium** | ₹99/month | + Scheduled pickups, advanced AI insights, 2x points, priority access |
| **Business Pro** | ₹5,000/month | + Unlimited teams, compliance reports, API access, dedicated support |

### 📍 **7. Recycler Map & Directory**
- **Interactive Map**: Leaflet.js integration with OpenStreetMap
- **6 Sample Recyclers**: Pre-populated Delhi/NCR locations
- **Recycler Profiles**:
  - Name, address, phone number
  - Accepted waste types (badges)
  - GPS coordinates with markers
- **Pickup Scheduling**: Button to request collection (Premium feature)
- **Search & Filter**: Find nearby authorized centers

---

## 🛠️ Technical Architecture

### **Stack**
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Vanilla JS with custom component architecture
- **Charts**: Chart.js 4.x for data visualization
- **Maps**: Leaflet.js 1.9.4 for interactive mapping
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter family)
- **Storage**: LocalStorage for client-side persistence

### **Design System**
- **Color Palette**:
  - Forest Green: `#2D5A27` (Primary brand color)
  - Dark Green: `#1a3d17` (Hover states)
  - Light Green: `#4a8542` (Accents)
  - Earthy Sand: `#E8DCC4` (Secondary backgrounds)
  - White: `#FFFFFF` (Base)
- **Typography**: Inter font family (300-800 weights)
- **Responsive Breakpoints**:
  - Desktop: 1024px+
  - Tablet: 768px - 1023px
  - Mobile: < 768px

### **State Management**
```javascript
// Global State
currentUser: {
  id, name, email, role, ecoPoints, 
  totalWaste, co2Saved, virtualTrees
}
wasteHistory: [{
  type, confidence, points, timestamp
}]
rewards: [{ brand, title, cost, description }]
```

### **Data Persistence**
- `ecotrackUser`: Current logged-in user object
- `ecotrackUsers`: Array of all registered users
- `wasteHistory`: Complete scan history with timestamps

---

## 🚀 Functional Entry Points (URIs)

### **Pages & Navigation**
All navigation is client-side (no server required):

| Page | Function | Access |
|------|----------|--------|
| `/` (Auth) | `showAuthPage()` | Public |
| `#dashboard` | `navigateTo('dashboard')` | Authenticated |
| `#scanner` | `navigateTo('scanner')` | Authenticated |
| `#rewards` | `navigateTo('rewards')` | Authenticated |
| `#business` | `navigateTo('business')` | Business Role Only |
| `#pricing` | `navigateTo('pricing')` | Authenticated |
| `#recyclers` | `navigateTo('recyclers')` | Authenticated |

### **Core Functions**

#### Authentication
```javascript
handleLogin(event)          // Process login form
handleSignup(event)         // Create new account
logout()                    // Clear session and reload
```

#### AI Scanner
```javascript
handleImageUpload(event)    // Load image file
classifyWaste()             // Mock AI classification
mockAIClassification()      // Generate random result (85-100% confidence)
displayClassificationResult(result)  // Render results + update stats
resetScanner()              // Clear and restart
```

#### Dashboard
```javascript
updateDashboard()           // Refresh all metrics
createWasteChart()          // Render Chart.js pie chart
renderActivityFeed()        // Display recent scans
```

#### Rewards
```javascript
renderRewards()             // Display all available rewards
redeemReward(rewardId)      // Process redemption transaction
```

#### Map
```javascript
initMap()                   // Initialize Leaflet map
renderRecyclers()           // Display recycler cards
schedulePickup(recyclerId)  // Request collection
```

---

## 📋 Features Not Yet Implemented

### **High Priority**
- [ ] **Real TensorFlow.js Model**: Replace mock with actual trained model
  - Image preprocessing pipeline
  - Custom waste classification dataset
  - Model loading and inference
- [ ] **Backend API Integration**: RESTful API for data persistence
  - User authentication (JWT tokens)
  - Waste scan history sync
  - Real-time leaderboard
- [ ] **Payment Gateway**: Stripe/Razorpay for Premium/Business subscriptions
- [ ] **Email Notifications**: Welcome emails, reward alerts, pickup confirmations
- [ ] **Real-time Chat**: Support system for users

### **Medium Priority**
- [ ] **Advanced Analytics**:
  - Weekly/monthly trend reports
  - Carbon footprint calculator
  - Peer comparison (anonymized)
- [ ] **Social Features**:
  - Community challenges
  - Leaderboards (city/region)
  - Social sharing (Twitter, Facebook)
- [ ] **IoT Integration**:
  - Smart bin connectivity
  - QR code tracking for physical waste
- [ ] **Mobile Apps**: React Native iOS/Android versions
- [ ] **Multi-language Support**: Hindi, regional Indian languages

### **Low Priority**
- [ ] **Dark Mode**: Theme switcher
- [ ] **Accessibility**: WCAG 2.1 AA compliance
  - Screen reader optimization
  - Keyboard navigation
  - High-contrast mode
- [ ] **PWA Features**: Offline mode, push notifications
- [ ] **Export Data**: CSV/PDF download of personal history

---

## 🔧 Recommended Next Steps

### **Phase 1: AI Model Integration (Week 1-2)**
1. **Train TensorFlow.js Model**:
   - Collect/label waste dataset (Kaggle, custom photography)
   - Use transfer learning (MobileNet/Inception)
   - Export to TensorFlow.js format
   - Integrate model loading in scanner
2. **Optimize Performance**:
   - Image preprocessing (resize, normalize)
   - Web Workers for inference
   - Caching for repeat predictions

### **Phase 2: Backend Development (Week 3-4)**
1. **API Development**:
   - Node.js + Express.js REST API
   - MongoDB/PostgreSQL database
   - Authentication (Passport.js, JWT)
   - CRUD operations for users, scans, rewards
2. **Cloud Deployment**:
   - Host API on AWS/GCP/Azure
   - Set up MongoDB Atlas or RDS
   - Configure CORS for frontend

### **Phase 3: Payment & Subscriptions (Week 5)**
1. **Integrate Razorpay/Stripe**:
   - Subscription management
   - Webhook handlers for payment events
   - Invoice generation
2. **Upgrade Flow**:
   - Premium/Business checkout pages
   - Trial period (7 days free)

### **Phase 4: Enterprise Features (Week 6-8)**
1. **Business Dashboard Enhancements**:
   - Real-time team activity tracking
   - Custom report builder
   - API access for third-party integrations
2. **Compliance Tools**:
   - Automated report generation (PDF)
   - Government regulation templates
   - Audit trail logging

### **Phase 5: Mobile & Scale (Week 9-12)**
1. **Mobile Apps**:
   - React Native development
   - Camera integration
   - Push notifications
2. **Performance Optimization**:
   - CDN for static assets
   - Database indexing
   - Caching strategies (Redis)
3. **Marketing Launch**:
   - Landing page redesign
   - SEO optimization
   - Social media campaign

---

## 🎨 Design Philosophy

### **Eco-Conscious Aesthetic**
- **Color Psychology**: Green evokes nature, growth, sustainability
- **Minimalism**: Clean, uncluttered interfaces reduce cognitive load
- **White Space**: Breathing room enhances readability and focus
- **Rounded Corners**: Friendly, approachable feel vs. sharp corporate edges

### **Mobile-First Approach**
- All layouts designed for small screens first
- Touch-friendly button sizes (48px minimum)
- Responsive grid systems
- Hamburger menu for mobile navigation

### **Accessibility Considerations**
- High color contrast (WCAG AA compliant)
- Semantic HTML structure
- Alt text for all images (to be added)
- Keyboard navigation (to be enhanced)

---

## 📦 Installation & Setup

### **Quick Start**
```bash
# Clone repository
git clone https://github.com/yourusername/ecotrack.git

# Open in browser
open index.html

# Or use a local server
python -m http.server 8000
# Visit http://localhost:8000
```

### **Demo Accounts**
**Household User**:
- Email: `demo@eco.com`
- Password: `demo123`

**Business User**:
- Email: `business@eco.com`
- Password: `business123`

### **Browser Support**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📊 Data Models & Storage

### **User Schema**
```javascript
{
  id: Number,              // Unique identifier (timestamp)
  name: String,            // Full name
  email: String,           // Unique email
  password: String,        // Plain text (DEMO ONLY - hash in production)
  role: String,            // 'household' | 'business'
  company: String,         // Business name (optional)
  ecoPoints: Number,       // Current points balance
  totalWaste: Number,      // Kilograms recycled
  co2Saved: Number,        // Kilograms CO₂ offset
  virtualTrees: Number,    // Trees earned (1 per 10kg)
  createdAt: String        // ISO timestamp
}
```

### **Waste History Schema**
```javascript
{
  type: String,            // 'Biodegradable' | 'Non-Biodegradable'
  confidence: Number,      // Percentage (0-100)
  points: Number,          // Points awarded (10 or 15)
  timestamp: Number        // Unix timestamp
}
```

### **Reward Schema**
```javascript
{
  id: Number,              // Unique identifier
  brand: String,           // Partner brand name
  title: String,           // Reward description
  cost: Number,            // Points required
  description: String,     // Detailed info
  image: String            // Placeholder URL
}
```

---

## 🌍 Real-World Use Cases

### **Household User Journey**
1. **Signup**: Create account as "Household"
2. **Scan Waste**: Upload banana peel photo
3. **Get Classification**: "Biodegradable - 94% confidence"
4. **Earn Points**: +15 eco-points
5. **Track Impact**: See dashboard update (CO₂ saved, trees)
6. **Redeem Rewards**: Exchange 500 points for Mamaearth discount
7. **Schedule Pickup**: Contact recycler for bulk collection

### **Business User Journey**
1. **Signup**: Create account as "Business" (TechCorp Ltd.)
2. **Add Team Members**: Invite 25 employees
3. **Monitor Activity**: View real-time compliance dashboard
4. **Generate Reports**: Download monthly sustainability report
5. **Meet Compliance**: Submit to government for SWM Rules 2016
6. **Scale Operations**: Upgrade to Business Pro for API access

---

## 🤝 Contributing

We welcome contributions! Here's how:

### **Development Workflow**
```bash
# Fork the repository
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git commit -m "Add: Brief description"

# Push to your fork
git push origin feature/your-feature-name

# Open Pull Request
```

### **Code Standards**
- **HTML**: Semantic tags, proper indentation (2 spaces)
- **CSS**: BEM methodology, mobile-first
- **JavaScript**: ES6+, camelCase naming, JSDoc comments

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 📞 Contact & Support

- **Website**: https://ecotrack-two.vercel.app/#
- **CS**: In Web Section

---

## 🏆 Credits

**Developed by Team IGNITERS**

### **Technologies Used**
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Leaflet.js](https://leafletjs.com/) - Interactive maps
- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Typography
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles

### **Inspiration**
- UN Sustainable Development Goal 12
- India's Solid Waste Management Rules (2016)
- Global waste crisis statistics from Our World in Data

---

## 🌟 Star History

If you find EcoTrack useful, please ⭐ star this repository!

---

**Made with 💚 for a sustainable future**

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x450/2D5A27/ffffff?text=Dashboard+Screenshot)

### AI Scanner
![Scanner](https://via.placeholder.com/800x450/4a8542/ffffff?text=Scanner+Screenshot)

### Rewards Marketplace
![Rewards](https://via.placeholder.com/800x450/2D5A27/ffffff?text=Rewards+Screenshot)

