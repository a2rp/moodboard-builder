import { useCallback, useEffect, useState } from "react";
import BoardControls from "./components/boardControls/index.jsx";
import ConfirmationDialog from "./components/confirmationDialog/index.jsx";
import MoodboardCanvas from "./components/moodboardCanvas/index.jsx";
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
    const [confirmation, setConfirmation] = useState(null);
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

    const handleNoteChange = (itemId, text) => {
        setBoard((currentBoard) => ({
            ...currentBoard,
            items: currentBoard.items.map((item) =>
                item.id === itemId ? { ...item, text } : item,
            ),
        }));
    };

    const handleMoveItem = (itemId, direction) => {
        setBoard((currentBoard) => {
            const fromIndex = currentBoard.items.findIndex((item) => item.id === itemId);
            const toIndex = fromIndex + direction;

            if (fromIndex < 0 || toIndex < 0 || toIndex >= currentBoard.items.length) {
                return currentBoard;
            }

            const nextItems = [...currentBoard.items];
            [nextItems[fromIndex], nextItems[toIndex]] = [
                nextItems[toIndex],
                nextItems[fromIndex],
            ];

            return { ...currentBoard, items: nextItems };
        });
    };

    const handleRequestReset = () => setConfirmation({ type: "reset" });

    const handleRequestRemove = (item) => {
        const inspiration =
            item.type === "image" ? getInspirationById(item.inspirationId) : null;
        const itemLabel = inspiration?.title ?? "note";

        setConfirmation({ type: "remove-item", itemId: item.id, itemLabel });
    };

    const handleCancelConfirmation = useCallback(() => {
        setConfirmation(null);
    }, []);

    const handleConfirm = useCallback(() => {
        if (!confirmation) {
            return;
        }

        if (confirmation.type === "reset") {
            setBoard({ ...blankBoard, items: [] });
        } else {
            setBoard((currentBoard) => ({
                ...currentBoard,
                items: currentBoard.items.filter(
                    (item) => item.id !== confirmation.itemId,
                ),
            }));
        }

        setConfirmation(null);
    }, [confirmation]);

    const handleDownload = () => {
        const exportData = {
            title: board.title,
            brief: board.brief,
            mood: board.mood,
            palette: palette.name,
            exportedAt: new Date().toISOString(),
            pieces: board.items.map((item) => {
                if (item.type === "note") {
                    return { type: "note", text: item.text };
                }

                const inspiration = getInspirationById(item.inspirationId);

                return {
                    type: "image",
                    title: inspiration?.title ?? "Reference",
                    category: inspiration?.category ?? "",
                    image: inspiration?.src ?? "",
                };
            }),
        };
        const file = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json;charset=utf-8",
        });
        const fileUrl = URL.createObjectURL(file);
        const link = document.createElement("a");
        const fileName =
            board.title.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() ||
            "moodboard";

        link.href = fileUrl;
        link.download = `${fileName}-board.json`;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    };

    const confirmationIsReset = confirmation?.type === "reset";

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
                        onRequestReset={handleRequestReset}
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

                    <MoodboardCanvas
                        board={board}
                        palette={palette}
                        onAddNote={handleAddNote}
                        onDownload={handleDownload}
                        onNoteChange={handleNoteChange}
                        onMove={handleMoveItem}
                        onRequestRemove={handleRequestRemove}
                    />

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
                isOpen={Boolean(confirmation)}
                title={
                    confirmationIsReset
                        ? "Start a new board?"
                        : "Remove this piece?"
                }
                description={
                    confirmationIsReset
                        ? "This clears the working board, including its images and notes. Saved snapshots will stay available."
                        : `Remove “${confirmation?.itemLabel}” from this board? This will not change your saved snapshots.`
                }
                confirmLabel={confirmationIsReset ? "Start new board" : "Remove piece"}
                onCancel={handleCancelConfirmation}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default App;
