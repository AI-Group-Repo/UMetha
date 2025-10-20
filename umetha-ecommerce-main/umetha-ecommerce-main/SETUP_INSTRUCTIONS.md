# Virtual Try-On Setup Instructions

## Environment Variables Setup

Add these environment variables to your `.env.local` file:

```env
# Nano Banana API Keys
VIRTUAL_NANO_BANANA_API_KEY=AIzaSyBuMNq5iSwx8ukhYqwppHOCSjoTkrCZq2o
FURNITURE_NANO_BANANA_API_KEY=AIzaSyBR58M02Kz0yYdRG5JePfzl7p1HxTRe8Dw

# Remove.bg API Key (optional, for background removal)
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

## Features Implemented

### 🎯 Virtual Fitting Room (`/virtual-room`)
- **Upload your photo** - Users can upload their own photo
- **Select products** - Choose from available clothing items
- **AI Virtual Try-On** - Uses Nano Banana API to generate realistic try-on images
- **Download results** - Save the generated images
- **Real-time processing** - Shows loading states and progress

### 🏠 Room Visualizer (`/room-visualizer`)
- **Upload room photo** - Users can upload their room image
- **Select furniture** - Choose from available furniture pieces
- **AI Room Visualization** - Uses Nano Banana API to place furniture in the room
- **Download results** - Save the generated room visualizations
- **Real-time processing** - Shows loading states and progress

## How It Works

1. **User uploads their photo** (for clothing) or room photo (for furniture)
2. **User selects a product** from the available options
3. **System processes images** - Compresses and optimizes images
4. **AI generates result** - Nano Banana API creates realistic try-on/visualization
5. **User sees result** - Displays the generated image with download option

## API Integration

- **Virtual Try-On**: Uses `VIRTUAL_NANO_BANANA_API_KEY` for clothing try-on
- **Furniture Try-On**: Uses `FURNITURE_NANO_BANANA_API_KEY` for room visualization
- **Image Processing**: Sharp for compression, Remove.bg for background removal (optional)
- **Error Handling**: Comprehensive error handling and user feedback

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `/virtual-room` or `/room-visualizer`
3. Upload a photo and select a product
4. Click "Try On Now" or "Try in Room"
5. Wait for the AI to generate the result
6. Download the generated image

## Notes

- The system automatically compresses images for optimal API performance
- Background removal is optional but recommended for better results
- Both modules work independently with their own API keys
- Results are generated in real-time using the Nano Banana API
