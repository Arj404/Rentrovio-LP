# Rentrovio Landing Page

A professional landing page for Rentrovio - a comprehensive rent management SaaS platform designed for landlords, tenants, and caretakers.

## 🎯 Overview

This landing page showcases the multi-role capabilities of the Rentrovio platform while maintaining a cohesive brand identity and highlighting the comprehensive feature set across all user roles.

## 🎨 Design Features

- **Modern, Professional Design** - Clean and contemporary layout
- **Multi-Role Focus** - Dedicated sections for Landlords, Tenants, and Caretakers
- **Interactive Elements** - Dynamic role switching and smooth animations
- **Beta Waitlist Signup** - Functional email collection with local storage
- **Coming Soon Badge** - Pricing section with development status indicator
- **Mobile-First Responsive** - Optimized for all devices

## 🎨 Color Palette

```css
:root {
  --primary: #38040e; /* Deep Burgundy */
  --background: #f9fafb; /* Light Gray */
  --card-background: #eae0d5; /* Cream */
  --text-primary: #1a1a1a; /* Dark Gray */
  --text-secondary: #22333b; /* Medium Gray */
  --success: #7fa07e; /* Green */
  --error: #e63946; /* Red */
  --warning: #f5cb5c; /* Orange */
}
```

## 📁 Project Structure

```
rentrovio-landing/
├── index              # Main landing page
├── styles.min.css              # Main stylesheet with CSS custom properties
├── script.min.js               # Interactive JavaScript functionality
├── assets/
│   └── images/
│       ├── logo.png        # Company logo
│       └── app_icon.png    # App favicon
└── README.md              # This file
```

## 🔧 Technology Stack

- **HTML5** - Semantic markup and structure
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript (ES6+)** - Interactive functionality
- **Inter Font** - Modern typography from Google Fonts

## ✨ Key Features

### User Role Sections

- **Landlord Dashboard** - Property management, earnings tracking, staff coordination
- **Tenant Portal** - Unit management, payments, maintenance requests
- **Caretaker Interface** - Multi-property oversight, task management, utilities

### Interactive Components

- **Beta Signup Form** - Email validation and local storage
- **Role Switching** - Dynamic content updates for different user types
- **Scroll Animations** - Intersection Observer API for smooth reveals
- **Mobile Navigation** - Responsive hamburger menu
- **Notification System** - Success/error messages for user actions

### Pricing

- **$10/month** for Landlord Pro plan
- **First month free** promotion
- **Coming Soon** badge indicating development status

## 🚀 Getting Started

1. Open `index` in any modern web browser
2. The page is fully self-contained with no external dependencies
3. All assets and scripts are included locally

## 📱 Responsive Design

The landing page is built with a mobile-first approach and includes:

- Mobile navigation with hamburger menu
- Responsive grid layouts
- Optimized touch targets
- Scalable typography
- Flexible image handling

## 🧪 Features to Test

1. **Beta Signup Form**

   - Email validation
   - Duplicate email detection
   - Success/error notifications
   - Local storage persistence

2. **User Role Switching**

   - Tab navigation between roles
   - Dynamic content updates
   - Navigation tab updates

3. **Responsive Design**

   - Mobile menu functionality
   - Layout adaptation across screen sizes
   - Touch-friendly interactions

4. **Scroll Animations**
   - Feature cards fade-in on scroll
   - Testimonial reveals
   - Header background changes

## 💾 Data Storage

- **Beta signups** are stored in browser localStorage
- **Waitlist counter** updates dynamically based on stored emails
- No backend integration required for basic functionality

## 🎛️ Customization

### Colors

Update CSS custom properties in `styles.min.css` under the `:root` selector.

### Content

Modify text content directly in `index` or update the JavaScript data objects in `script.min.js` for dynamic content.

### Features

Add new features by extending the JavaScript component objects in `script.min.js`.

## 🔮 Future Enhancements

- Backend integration for email collection
- Google Analytics integration
- A/B testing framework
- Advanced animations library
- Performance optimizations
- SEO enhancements

## 📄 License

This project is part of the Rentrovio product suite. All rights reserved.

---

**Built with ❤️ for property management professionals**
