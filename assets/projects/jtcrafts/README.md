# JTC - Jad Touma Crafts Website

A beautiful, modern website for JTC (Jad Touma Crafts), a family-owned woodworking business specializing in custom furniture made from premium Lamaika wood.

## Features

- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Modern UI**: Clean, elegant design with smooth animations
- **Sections**:
  - Hero section with call-to-action
  - Furniture showcase (Lamaika wood)
  - Christmas decorations gallery
  - About section
  - Contact form
- **Admin Dashboard**: Secure admin panel for managing products and viewing contact submissions

## Getting Started

1. Open `index.html` in your web browser
2. No build process or dependencies required - it's a simple, static website

## Admin Access

### First Time Setup

1. Navigate to `admin-login.html` in your browser
2. Default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. **IMPORTANT**: Change these credentials immediately after first login by editing `admin-login.js` or implementing a password change feature

### Admin Dashboard Features

- **View Contact Submissions**: See all contact form submissions with name, email, phone, and message
- **Product Management**: 
  - Add products with images and descriptions
  - Edit existing products
  - Delete products
  - Products automatically appear on the main website
  - Separate categories for Furniture and Christmas Decorations

## Customization

### Adding Products

**Recommended Method (Admin Dashboard):**
1. Log in to the admin dashboard at `admin-login.html`
2. Go to the "Product Management" tab
3. Click "Add Product"
4. Fill in product details and image URL
5. Products will automatically appear on the main website

**Manual Method:**
1. Add your images to an `images` folder
2. Use the admin dashboard to add products, or manually edit localStorage (not recommended)

### Contact Form

The contact form automatically saves all submissions to localStorage. You can view them in the admin dashboard under "Contact Submissions". All submissions include:
- Name
- Email
- Phone (if provided)
- Message
- Date and time of submission

### Colors

You can customize the color scheme by modifying the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #8B4513;    /* Main brown color */
    --secondary-color: #D2691E;  /* Accent brown */
    --accent-color: #CD853F;     /* Light brown */
}
```

## File Structure

```
jtcrafts/
├── index.html           # Main website
├── styles.css           # Main website styling
├── script.js            # Main website JavaScript
├── admin-login.html     # Admin login page
├── admin-dashboard.html # Admin dashboard
├── admin-styles.css     # Admin panel styling
├── admin-login.js       # Admin login functionality
├── admin-dashboard.js   # Admin dashboard functionality
└── README.md            # This file
```

## Data Storage

All data is stored in the browser's localStorage:
- Contact form submissions: `contactSubmissions`
- Products: `products`
- Admin credentials: `adminUsername`, `adminPassword`, `adminLoggedIn`

**Note**: For production use, consider migrating to a proper backend database as localStorage is browser-specific and can be cleared.

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

## Security Notes

⚠️ **Important**: The current admin system uses localStorage for authentication, which is suitable for local development but not secure for production. For a live website:

1. Implement proper server-side authentication
2. Use a secure database (not localStorage)
3. Add HTTPS encryption
4. Implement proper password hashing
5. Add rate limiting and CSRF protection

## Future Enhancements

- Backend integration for secure data storage
- Email notifications for new contact submissions
- Image upload functionality (currently uses URLs)
- Product categories and filtering
- Search functionality
- Social media integration

---

Made with ❤️ for JTC - Jad Touma Crafts
