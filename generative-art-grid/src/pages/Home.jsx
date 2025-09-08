// src/pages/Home.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import ControlsPanel from "../components/ControlsPanel";
import Playbar from "../components/Playbar";
import ArtTile from "../components/ArtTile";
import TileModal from "../components/TileModal";
import ExportCard from "../components/ExportCard";
import { generateTileSpecs } from "../utils/generators";
import { generateSeed } from "../utils/seed.js";
import html2canvas from "html2canvas";
import { FaDownload, FaLink, FaEye } from "react-icons/fa";

const DEFAULT_SETTINGS = {
  gridSize: 4,
  palette: 'Cool',
  complexity: 4,
  animationSpeed: 1.0,
  isAnimating: false,
  designerMode: false,
  seed: null
};

export default function Home({ theme, setTheme }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('generative-art-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  
  const [tiles, setTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportCard, setShowExportCard] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const gridRef = useRef();
  const exportCardRef = useRef();
  const artworkCloneRef = useRef();

  // Load settings from URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSettings = {};
    
    if (urlParams.has('seed')) urlSettings.seed = parseInt(urlParams.get('seed'));
    if (urlParams.has('cols')) urlSettings.gridSize = parseInt(urlParams.get('cols'));
    if (urlParams.has('palette')) urlSettings.palette = urlParams.get('palette');
    if (urlParams.has('complexity')) urlSettings.complexity = parseInt(urlParams.get('complexity'));
    if (urlParams.has('live')) urlSettings.isAnimating = urlParams.get('live') === '1';
    if (urlParams.has('designer')) urlSettings.designerMode = urlParams.get('designer') === '1';
    
    if (Object.keys(urlSettings).length > 0) {
      setSettings(prev => ({ ...prev, ...urlSettings }));
    }
  }, []);

  // Update URL when settings change
  const updateURL = useCallback((newSettings) => {
    const params = new URLSearchParams();
    if (newSettings.seed) params.set('seed', newSettings.seed);
    params.set('cols', newSettings.gridSize);
    params.set('palette', newSettings.palette);
    params.set('complexity', newSettings.complexity);
    if (newSettings.isAnimating) params.set('live', '1');
    if (newSettings.designerMode) params.set('designer', '1');
    
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
  }, []);

  // Persist settings and regenerate tiles
  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('generative-art-settings', JSON.stringify(newSettings));
    updateURL(newSettings);
    
    // Regenerate tiles with new settings
    const count = newSettings.gridSize * newSettings.gridSize;
    const specs = generateTileSpecs(count, {
      gridCols: newSettings.gridSize,
      palette: newSettings.palette,
      complexity: newSettings.complexity,
      designerMode: newSettings.designerMode,
      seed: newSettings.seed
    });
    setTiles(specs);
  }, [updateURL]);

  // Generate initial tiles
  const regenerateTiles = useCallback(() => {
    const newSeed = generateSeed();
    const newSettings = { ...settings, seed: newSeed };
    handleSettingsChange(newSettings);
  }, [settings, handleSettingsChange]);

  // Initialize on mount
  useEffect(() => {
    if (tiles.length === 0) {
      if (!settings.seed) {
        regenerateTiles();
      } else {
        handleSettingsChange(settings);
      }
    }
  }, [tiles.length, settings, regenerateTiles, handleSettingsChange]);

  // Handle surprise me
  const handleSurpriseMe = useCallback((surpriseSettings) => {
    const newSettings = { ...settings, ...surpriseSettings };
    handleSettingsChange(newSettings);
  }, [settings, handleSettingsChange]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    const resetSettings = { ...DEFAULT_SETTINGS, seed: generateSeed() };
    handleSettingsChange(resetSettings);
  }, [handleSettingsChange]);

  // Toggle animation
  const toggleAnimation = useCallback(() => {
    const newSettings = { ...settings, isAnimating: !settings.isAnimating };
    handleSettingsChange(newSettings);
  }, [settings, handleSettingsChange]);

  // Change animation speed
  const handleSpeedChange = useCallback((newSpeed) => {
    const newSettings = { ...settings, animationSpeed: newSpeed };
    handleSettingsChange(newSettings);
  }, [settings, handleSettingsChange]);

  // Share current configuration
  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      showToast('Failed to copy link');
    }
  };

  // Export as card
  const handleExportCard = async () => {
    if (!gridRef.current || !exportCardRef.current) return;
    
    setIsExporting(true);
    try {
      // Clone the grid content into the export card
      const artworkClone = gridRef.current.cloneNode(true);
      artworkClone.style.transform = 'none';
      artworkClone.style.maxWidth = 'none';
      
      if (artworkCloneRef.current) {
        artworkCloneRef.current.innerHTML = '';
        artworkCloneRef.current.appendChild(artworkClone);
      }

      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Export the card
      const canvas = await html2canvas(exportCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f172a',
        onclone: (clonedDoc) => {
          // Ensure fonts are loaded in cloned document
          const clonedCard = clonedDoc.querySelector('[data-export-card]');
          if (clonedCard) {
            clonedCard.style.fontFamily = 'system-ui, -apple-system, sans-serif';
          }
        }
      });

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      a.download = `generative-card-${settings.seed}-${timestamp}.png`;
      a.click();
      
      showToast('Card exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      showToast('Export failed. Please try again.');
    }
    setIsExporting(false);
  };

  // Export artwork only
  const handleExportArtwork = async () => {
    if (!gridRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(gridRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f172a'
      });

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      a.download = `generative-artwork-${settings.seed}-${timestamp}.png`;
      a.click();
      
      showToast('Artwork exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      showToast('Export failed. Please try again.');
    }
    setIsExporting(false);
  };

  // Show toast message
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName.toLowerCase() === 'input') return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          toggleAnimation();
          break;
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleExportCard();
          }
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            regenerateTiles();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAnimation, handleExportCard, regenerateTiles]);

  const getPatternTypes = () => {
    const types = [...new Set(tiles.map(tile => tile.label))];
    return types.slice(0, 3); // Limit for metadata
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Header theme={theme} setTheme={setTheme} />
            <div className="flex items-center gap-4">
              <Playbar
                isPlaying={settings.isAnimating}
                onTogglePlay={toggleAnimation}
                animationSpeed={settings.animationSpeed}
                onSpeedChange={handleSpeedChange}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <ControlsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onSurpriseMe={handleSurpriseMe}
              onReset={handleReset}
            />

            {/* Export Controls */}
            <div className="mt-6 glass rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-white mb-3">Export</h4>
              
              <button
                onClick={handleExportCard}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-gradient text-white font-medium hover:scale-105 transition-transform disabled:opacity-50"
              >
                <FaDownload />
                {isExporting ? 'Exporting...' : '💾 Export Card'}
              </button>

              <button
                onClick={handleExportArtwork}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors text-white text-sm"
              >
                <FaEye />
                Artwork Only
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors text-white text-sm"
              >
                <FaLink />
                Share Link
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mt-6 glass rounded-xl p-4">
              <h4 className="font-semibold text-white mb-3 text-sm">Shortcuts</h4>
              <div className="space-y-1 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Play/Pause</span>
                  <kbd className="bg-black/30 px-1 rounded">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Export</span>
                  <kbd className="bg-black/30 px-1 rounded">Ctrl+S</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Regenerate</span>
                  <kbd className="bg-black/30 px-1 rounded">Ctrl+R</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6">
              <div 
                ref={gridRef}
                className="grid gap-4 place-items-center"
                style={{
                  gridTemplateColumns: `repeat(${settings.gridSize}, 1fr)`
                }}
              >
                <AnimatePresence mode="popLayout">
                  {tiles.map((tile) => (
                    <ArtTile
                      key={tile.id}
                      spec={{
                        ...tile,
                        palette: settings.palette,
                        complexity: settings.complexity,
                        designerMode: settings.designerMode
                      }}
                      isAnimating={settings.isAnimating}
                      animationSpeed={settings.animationSpeed}
                      onClick={setSelectedTile}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Grid Info */}
            <div className="mt-4 text-center text-sm text-gray-400">
              {tiles.length} unique patterns • Seed: #{settings.seed?.toString().substring(0, 8)} • 
              {settings.isAnimating ? ' Live Animation' : ' Static'} • 
              {settings.designerMode ? ' Designer Mode' : ' Art Mode'}
            </div>
          </div>
        </div>
      </div>

      {/* Tile Modal */}
      <TileModal
        spec={selectedTile ? {
          ...selectedTile,
          palette: settings.palette,
          complexity: settings.complexity,
          designerMode: settings.designerMode
        } : null}
        isOpen={!!selectedTile}
        onClose={() => setSelectedTile(null)}
        globalAnimationSpeed={settings.animationSpeed}
      />

      {/* Hidden Export Card */}
      <div className="fixed -left-[9999px] top-0">
        <ExportCard
          ref={exportCardRef}
          artworkRef={artworkCloneRef}
          settings={settings}
          metadata={{
            patterns: getPatternTypes(),
            dateCreated: new Date().toISOString()
          }}
          data-export-card
        />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}