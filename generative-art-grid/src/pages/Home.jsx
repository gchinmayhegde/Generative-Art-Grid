import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Controls from "../components/Controls";
import ArtTile from "../components/ArtTile";
import { generateTileSpecs } from "../utils/generators";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_COLS = 4;
const DEFAULT_ROWS = 3;

export default function Home({ theme, setTheme }) {
  const [tiles, setTiles] = useState([]);
  const gridRef = useRef();

  const regenerate = (cols = DEFAULT_COLS, rows = DEFAULT_ROWS) => {
    const specs = generateTileSpecs(cols * rows);
    setTiles(specs);
  };

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center gap-6">
      <div className="w-full max-w-6xl glass rounded-2xl p-6">
        <Header theme={theme} setTheme={setTheme} />
        <Controls
          onRefresh={() => regenerate()}
          exportRef={gridRef}
        />
        <div className="mt-6" ref={gridRef}>
          <motion.div
            layout
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence>
              {tiles.map((t) => (
                <ArtTile key={t.id} spec={t} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        Tip: Refresh to generate a new unique set. Hover tiles for micro-interaction.
      </div>
    </div>
  );
}
