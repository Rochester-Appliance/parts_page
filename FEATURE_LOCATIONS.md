# Feature Location Guide

This guide shows you exactly where to find all the new features in the Rochester Appliance Parts Search application.

## How to Access Features

### 1. **Installation Pricing Checkbox** ✅
**Location:** Cart → Delivery Options section
**Steps to Access:**
1. Add any appliance to cart (search for "washing machine" or "dryer")
2. Click the cart icon (shopping cart button in top-right)
3. In the cart dialog, scroll down to "Delivery Options" section
4. You'll see a checkbox for "Professional Installation"
5. When checked, it shows installation fees and automatically switches to standard delivery

**Features:**
- Installation fee varies by appliance type ($125-$225)
- Shows breakdown of fees for different appliances
- Automatically unchecks free drop-off delivery
- Updates total price in real-time

---

### 2. **Hierarchical (Parent/Child) Accounts** ✅
**Location:** Account Management (visible for parent accounts)
**Steps to Access:**
1. Click "Account" in top navigation
2. **Login with a parent account** (use email containing "manager", "admin", or "parent")
   - Example: `manager@company.com` with any password
3. You'll see "Manage Accounts" button in the navigation
4. Click "Manage Accounts" to open the hierarchical account manager

**Features:**
- Create unlimited child accounts (properties/locations)
- Each child inherits payment terms, tax status, and pricing
- Separate carts, budgets, and shipping addresses per child
- Switch between parent and child accounts
- Track spending per location and in aggregate

---

### 3. **Schedule Service Call** ✅
**Location:** Main navigation (for logged-in users)
**Steps to Access:**
1. Login with any account
2. Click "Schedule Service" button in top navigation
3. Or from mobile menu: Menu icon → "Schedule Service"

**Features:**
- Select appliance type and describe symptoms
- Choose preferred date/time slots
- Enter service location details
- $75 diagnostic fee (waived if repair performed)
- Automatic technician contact within 24 hours

---

### 4. **Admin Console** ✅ (NEW COMPREHENSIVE FEATURE)
**Location:** Special admin navigation (for admin users only)
**Steps to Access:**
1. **Login with admin email** (must contain "admin" or "support")
   - Example: `admin@rochester.com` with any password
2. You'll see a highlighted "Admin Console" button in navigation
3. Click to open the full-screen admin dashboard

**Features:**
- **Dashboard Overview:** Metrics, recent activity, pending approvals
- **Company Management:** View all companies, domains, account types
- **Account Hierarchy:** Manage parent/child relationships with expandable cards
- **Pending Approvals:** Approve/deny new account requests
- **Customer Designations:** Assign account types and permissions
- **Real-time Statistics:** Account counts, budgets, spending tracking

---

### 5. **Notify When Available** ✅
**Location:** Diagram Viewer & Cart
**Steps to Access:**
1. Search for any appliance model
2. Click "View Diagram" 
3. For out-of-stock parts, you'll see "Notify Me" buttons
4. Or access from Cart → "Notifications" button

**Features:**
- Email collection with validation
- Prevent duplicate notification requests
- Manage all notification requests from one place
- Privacy opt-in checkbox

---

### 6. **Enhanced Registration System** ✅
**Location:** Account → Create Account tab
**Steps to Access:**
1. Click "Account" in navigation
2. Switch to "Create Account" tab
3. Fill out comprehensive business registration form

**Features:**
- Google OAuth integration (simulated)
- Required business information validation
- Auto-approval for allowlisted domains
- Manual approval workflow for other domains
- Account type determination (parent vs. standard)
- Additional team member management

---

## Demo Account Types

### Standard User Account
- Login: `user@company.com` (any password)
- Features: Basic cart, notifications, service calls

### Parent Account (Multi-Property)
- Login: `manager@company.com` (any password)
- Features: All standard + hierarchical account management

### Admin Account (Full Access)
- Login: `admin@rochester.com` (any password)
- Features: Everything + comprehensive admin console

---

## Quick Test Scenarios

### Test Installation Pricing:
1. Search "washing machine" → Add to cart
2. Open cart → Check "Professional Installation"
3. See $150 installation fee added to total

### Test Parent Account:
1. Login as `manager@company.com`
2. Click "Manage Accounts" → "Add Child Account"
3. Create property-level sub-account

### Test Admin Console:
1. Login as `admin@rochester.com`
2. Click "Admin Console" → Explore all tabs
3. View company hierarchy and approve/deny accounts

### Test Service Call:
1. Login with any account
2. Click "Schedule Service" → Fill out form
3. Submit and see confirmation

---

## Application URL
The app should be running at: `http://localhost:3001`

All features are fully functional with realistic mock data and complete workflows! 