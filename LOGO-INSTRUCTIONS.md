# Tharaka University Logo Setup

## Instructions for Adding the Official Logo

To use the official Tharaka University logo in the website:

1. **Save the Logo Image**:
   - Take the official Tharaka University logo image you provided
   - Save it as `tharaka-university-logo.png` in the `public/` folder
   - Recommended size: 400x400 pixels or higher for best quality

2. **Update the Logo Component**:
   - The logo component is located at `components/TharakaLogo.tsx`
   - Currently shows a placeholder "TU" circle
   - Once the image is added, update the component to use the actual image:

```tsx
<Image
  src="/tharaka-university-logo.png"
  alt="Tharaka University Logo"
  width={sizePixels[size]}
  height={sizePixels[size]}
  className="w-full h-full object-contain"
  priority
/>
```

3. **Logo Usage**:
   - The logo appears in headers across all pages
   - Available in multiple sizes: sm, md, lg, xl
   - Can be displayed with or without text
   - Maintains aspect ratio and quality at all sizes

## Current Status

- ✅ Logo component created and integrated
- ✅ Official logo image added to `/public/tharaka-university-logo.png`
- ✅ Logo component updated to use the official image
- ✅ Logo displays correctly across all pages and sizes

## Brand Colors Used

The website uses the official Tharaka University colors:
- Primary Purple: #3E4095
- Gold: #ECD362  
- Blue: #00AFEF

These colors are applied consistently across all UI elements, buttons, and branding.