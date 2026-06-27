# NovaMart - E-Commerce Capstone Website

NovaMart is a complete multi-page e-commerce website built as the final capstone project for the Qwetrum Technologies Web Development Internship.

## Live Demo

Live Website: PASTE_LIVE_WEBSITE_LINK_HERE

## GitHub Repository

Repository Link: (https://github.com/nayabusama-ummi/NovaMart-ecommerce-capstone)

## Project Overview

NovaMart is a responsive e-commerce website that allows users to browse products, search items, filter by category, sort products, view product details, add products to cart, update cart quantities, remove products, and complete a UI-only checkout form with validation.

The website uses localStorage to save cart data, so the cart remains available even after refreshing the browser.

## Pages Included

- Home Page
- Shop / Products Page
- Product Detail Page
- Cart Page
- Checkout Page
- Portfolio Page

## Features

- Responsive multi-page layout
- Bootstrap-based design
- Product search
- Category filter
- Product sorting
- Product detail page
- Add to cart functionality
- Remove from cart functionality
- Increase and decrease cart quantity
- Cart subtotal, shipping, tax, and total calculation
- Cart data saved using localStorage
- Checkout form validation
- UI-only order success message
- Portfolio page showing internship journey

## Tech Stack

- HTML5
- CSS3
- Bootstrap
- JavaScript
- localStorage
- GitHub Pages

## Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Shop Page

![Shop Page](screenshots/shop-products.png)

### Product Detail Page

![Product Detail](screenshots/product-detail.png)

### Cart Page

![Cart Page](screenshots/cart-with-products.png)

### Checkout Validation

![Checkout Validation](screenshots/checkout-validation-error.png)

### Checkout Success

![Checkout Success](screenshots/checkout-success.png)

### Portfolio Page

![Portfolio](screenshots/portfolio.png)

## Challenges Faced

One major challenge was managing cart data across multiple pages. I solved this by using localStorage and creating reusable JavaScript functions for getting, saving, updating, and displaying cart data.

Another challenge was combining search, filter, and sorting together. I solved this by first filtering the products based on search text and category, then applying sorting to the filtered product list.

Checkout validation was also important because users should not submit empty or incorrect data. I added validation for name, email, phone, address, city, and postal code.

## What I Learned

Through this project, I learned how to organize a complete front-end project, create multiple linked pages, use JavaScript for dynamic content, manage browser storage with localStorage, validate forms, and deploy a static website live using GitHub Pages.

## Technologies I Want to Learn Next

1. React.js
2. Node.js

## Author

Nayab Usama
Qwetrum Technologies Web Development Internship  
Final Week Capstone Project
