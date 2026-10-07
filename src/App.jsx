import { useState } from "react";
import BoardControls from "./components/boardControls/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import { initialBoard } from "./data/boards.js";
import { getPaletteById } from "./data/palettes.js";
import styles from "./App.module.css";

const App = () => {
    const [board, setBoard] = useState(initialBoard);
    const palette = getPaletteById(board.paletteId);

    const handleFieldChange = (field, value) => {
        setBoard((currentBoard) => ({ ...currentBoard, [field]: value }));
    };

    const handleAddNote = () => {
        setBoard((currentBoard) => ({
            ...currentBoard,
            items: [
                ...currentBoard.items,
                {
                    id: `note-${Date.now()}`,
                    type: "note",
                    size: "note",
                    text: "Add a thought, material, or small detail to remember.",
                },
            ],
        }));
    };

    return (
        <div
            className={styles.appShell}
            style={{
                "--page": palette.background,
                "--paper": palette.paper,
                "--ink": palette.ink,
                "--ink-muted": palette.muted,
                "--border": palette.border,
                "--accent": palette.accent,
                "--accent-dark": palette.accentDark,
                "--accent-soft": palette.accentSoft,
                "--sage": palette.sage,
            }}
        >
            <SiteHeader />
            <div className={styles.appFrame}>
                <aside className={styles.inspector} aria-label="Board settings">
                    <BoardControls
                        board={board}
                        onFieldChange={handleFieldChange}
                        onMoodChange={(mood) => handleFieldChange("mood", mood)}
                        onPaletteChange={(paletteId) =>
                            handleFieldChange("paletteId", paletteId)
                        }
                        onAddNote={handleAddNote}
                    />
                </aside>

                <main className={styles.workspace} id="board">
                    <section className={styles.workspaceHeading}>
                        <div>
                            <p className={styles.sectionLabel}>Visual direction</p>
                            <h1>{board.title || "Untitled board"}</h1>
                            <p className={styles.workspaceDescription}>
                                {board.brief || "Your board is ready for its first reference."}
                            </p>
                        </div>
                        <span className={styles.moodBadge}>{board.mood}</span>
                    </section>

                    <section className={styles.placeholderSection}>
                        <h2>Your canvas</h2>
                        <p>
                            {board.items.length} pieces gathered so far. Add a note from the
                            brief panel as you shape the direction.
                        </p>
                    </section>

                    <section
                        className={styles.placeholderSection}
                        id="inspiration"
                    >
                        <h2>Find a starting point</h2>
                        <p>
                            A curated local photo library will help you collect a visual
                            direction.
                        </p>
                    </section>

                    <section className={styles.placeholderSection} id="saved">
                        <h2>Saved boards</h2>
                        <p>Save a snapshot to return to this direction later.</p>
                    </section>

                    <section className={styles.placeholderSection} id="guide">
                        <h2>Make a moodboard</h2>
                        <p>
                            Name the direction, collect references, add notes, then save a
                            snapshot to this browser.
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default App;
