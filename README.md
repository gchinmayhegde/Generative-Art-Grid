# 🎨 Generative Art Grid

A powerful, interactive generative art tool designed for UI designers and creative professionals. Create stunning, reproducible patterns with real-time controls and professional export capabilities.

[Generative Art Grid Demo]: https://generative-art-grid21.vercel.app/

## ✨ Features

### 🎯 Core Functionality
- **5 Unique Pattern Types**: Moving Lights, Waveforms, Light Rays, Diagonal Strata, Soft Grain
- **Seeded Generation**: Reproducible patterns with shareable seed codes
- **Real-time Animation**: Live wallpaper mode with adjustable speeds
- **Designer Mode**: UI-friendly subtle patterns vs. vibrant art mode
- **Responsive Grid**: 2×2 to 8×8 grid layouts

### 🎨 Creative Controls
- **5 Color Palettes**: Warm, Cool, Neon, Pastel, Monochrome
- **Complexity Slider**: 0-10 detail levels for each pattern
- **Interactive Modal**: Detailed view with live parameter adjustments
- **Surprise Me**: Random generation for creative inspiration

### 💾 Professional Export
- **Export Card**: Professional collectible-style cards with metadata
- **Artwork Only**: Clean pattern exports without UI
- **High Resolution**: 2x scale exports for crisp results
- **Share Links**: URL-based configuration sharing

### ⌨️ Power User Features
- **Keyboard Shortcuts**: 
  - `Space` - Play/Pause animations
  - `Ctrl+S` - Export card
  - `Ctrl+R` - Regenerate patterns
  - `T` - Toggle theme
- **URL Parameters**: Direct linking to specific configurations
- **Local Storage**: Settings persistence across sessions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/generative-art-grid.git
cd generative-art-grid

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 🎮 How to Use

### Basic Usage
1. **Adjust Grid Size**: Use the slider to change from 2×2 to 8×8 layouts
2. **Select Palette**: Choose from 5 carefully crafted color schemes
3. **Set Complexity**: Control pattern detail levels (0-10)
4. **Toggle Modes**: Switch between Designer (UI-friendly) and Art modes
5. **Animate**: Enable live wallpaper mode with speed controls

### Advanced Features
1. **Click Any Tile**: Open detailed modal with individual controls
2. **Copy Seeds**: Share exact pattern configurations
3. **Export Options**: Create professional cards or clean artwork files
4. **Share Links**: Send direct URLs with your configurations

### URL Sharing
Share specific configurations using URL parameters:
```
?seed=240281130&cols=4&palette=Cool&complexity=6&live=1&designer=1
```

## 🏗️ Project Structure

```
generative-art-grid/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ArtTile.jsx     # Individual pattern tile
│   │   ├── ControlsPanel.jsx # Main controls interface
│   │   ├── TileModal.jsx   # Detailed tile view
│   │   └── ExportCard.jsx  # Export card template
│   ├── hooks/              # Custom React hooks
│   │   └── useAnimationLoop.js # Animation timing
│   ├── utils/              # Core utilities
│   │   ├── generators.js   # Pattern generation algorithms
│   │   └── seed.js         # Seeded randomization
│   ├── pages/              # Page components
│   │   └── Home.jsx        # Main application
│   └── index.css           # Global styles
├── public/                 # Static assets
└── dist/                   # Build output
```

## 🎨 Pattern Types

### Moving Lights
Animated light sources with smooth circular movements, perfect for dynamic backgrounds.

### Waveform
Flowing sine waves with customizable frequency and amplitude variations.

### Light Rays
Interactive ray effects that simulate cursor following or user interaction.

### Diagonal Strata
Layered diagonal patterns with smooth gradients and rotation effects.

### Soft Grain
Subtle texture patterns ideal for design system backgrounds.

## ⚙️ Technical Details

### Built With
- **React 19** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **HTML2Canvas** - Export functionality
- **Canvas API** - Pattern rendering

### Key Features
- **Seeded PRNG**: Mulberry32 algorithm for reproducible randomness
- **Performance Optimized**: RequestAnimationFrame for smooth 60fps animations
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Mobile Responsive**: Optimized for all screen sizes
- **Theme Support**: Dark/Light mode with system preference detection

## 🔧 Configuration

### Environment Variables
No environment variables required - runs entirely client-side.

### Customization
Extend patterns by adding new generators to `src/utils/generators.js`:

```javascript
export function drawCustomPattern(ctx, w, h, options = {}) {
  // Your pattern logic here
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow the existing code style
2. Add new patterns to the generators file
3. Ensure mobile responsiveness
4. Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by generative art pioneers and creative coding community
- Built for designers who need reproducible, professional-grade patterns
- Special thanks to the open-source libraries that made this possible

## 🚀 Roadmap

- [ ] Custom color palette creator
- [ ] Pattern marketplace/sharing
- [ ] Batch export functionality  
- [ ] SVG export support
- [ ] Plugin system for custom patterns
- [ ] Real-time collaboration features

**Made with ❤️ for designers and creative professionals**
