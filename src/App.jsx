import { useCallback, useEffect, useState } from "react";
import BoardControls from "./components/boardControls/index.jsx";
import ConfirmationDialog from "./components/confirmationDialog/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import { blankBoard, initialBoard } from "./data/boards.js";
import { getInspirationById } from "./data/inspirations.js";
import { getPaletteById } from "./data/palettes.js";
import styles from "./App.module.css";

const draftStorageKey = "moodboard-builder-working-board";

const readWorkingBoard = () => {
    try {
        const savedBoard = JSON.parse(
            localStorage.getItem(draftStorageKey) || "null",
        );

        if (!savedBoard || !Array.isArray(savedBoard.items)) {
            return { ...initialBoard, items: initialBoard.items.map((item) => ({ ...item })) };
        }

        const validItems = savedBoard.items.filter((item) => {
            if (item.type === "note") {
                return typeof item.id === "string" && typeof item.text === "string";
            }

            return (
                item.type === "image" &&
                typeof item.id === "string" &&
                getInspirationById(item.inspirationId)
            );
        });

        return {
            ...initialBoard,
            ...savedBoard,
            items: validItems.slice(0, 40),
        };
    } catch {
        return { ...initialBoard, items: initialBoard.items.map((item) => ({ ...item })) };
    }
};

const App = () => {
    const [board, setBoard] = useState(readWorkingBoard);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const palette = getPaletteById(board.paletteId);

    useEffect(() => {
        try {
            localStorage.setItem(draftStorageKey, JSON.stringify(board));
        } catch {
            return undefined;
        }

        return undefined;
    }, [board]);

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

    const handleCancelReset = useCallback(() => {
        setResetDialogOpen(false);
    }, []);

    const handleConfirmReset = useCallback(() => {
        setBoard({ ...blankBoard, items: [] });
        setResetDialogOpen(false);
    }, []);

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
                        onRequestReset={() => setResetDialogOpen(true)}
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
            <ConfirmationDialog
                isOpen={resetDialogOpen}
                title="Start a new board?"
                description="This clears the working board, including its images and notes. Saved snapshots will stay available."
                confirmLabel="Start new board"
                onCancel={handleCancelReset}
                onConfirm={handleConfirmReset}
            />
        </div>
    );
};

export default App;
