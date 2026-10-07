import { useCallback, useEffect, useState } from "react";
import BackToTop from "./components/backToTop/index.jsx";
import BoardControls from "./components/boardControls/index.jsx";
import ConfirmationDialog from "./components/confirmationDialog/index.jsx";
import InspirationLibrary from "./components/inspirationLibrary/index.jsx";
import MoodboardCanvas from "./components/moodboardCanvas/index.jsx";
import QuickGuide from "./components/quickGuide/index.jsx";
import SavedBoards from "./components/savedBoards/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import { blankBoard, initialBoard } from "./data/boards.js";
import {
    categoryOptions,
    getInspirationById,
    inspirations,
} from "./data/inspirations.js";
import { getPaletteById, paletteOptions } from "./data/palettes.js";
import styles from "./App.module.css";

const draftStorageKey = "moodboard-builder-working-board";
const savedStorageKey = "moodboard-builder-saved-boards";
const maxSavedBoards = 12;
const moodOptions = ["Grounded", "Airy", "Collected", "Playful"];
const itemSizes = ["large", "medium", "wide", "small", "note"];

const isValidBoardItem = (item) => {
    if (!item || typeof item !== "object" || typeof item.id !== "string") {
        return false;
    }

    if (item.type === "note") {
        return typeof item.text === "string";
    }

    return (
        item.type === "image" &&
        typeof item.id === "string" &&
        getInspirationById(item.inspirationId)
    );
};

const normalizeBoardItem = (item) => ({
    ...item,
    size: item.type === "note"
        ? "note"
        : itemSizes.includes(item.size)
          ? item.size
          : "small",
    text: item.type === "note" ? item.text.slice(0, 180) : item.text,
});

const copyInitialBoard = () => ({
    ...initialBoard,
    items: initialBoard.items.map((item) => ({ ...item })),
});

const readWorkingBoard = () => {
    try {
        const savedBoard = JSON.parse(
            localStorage.getItem(draftStorageKey) || "null",
        );

        if (
            !savedBoard ||
            typeof savedBoard !== "object" ||
            !Array.isArray(savedBoard.items)
        ) {
            return copyInitialBoard();
        }

        const validItems = savedBoard.items
            .filter(isValidBoardItem)
            .map(normalizeBoardItem);

        return {
            ...initialBoard,
            ...savedBoard,
            title: typeof savedBoard.title === "string" ? savedBoard.title.slice(0, 48) : initialBoard.title,
            brief: typeof savedBoard.brief === "string" ? savedBoard.brief.slice(0, 180) : initialBoard.brief,
            mood: moodOptions.includes(savedBoard.mood) ? savedBoard.mood : initialBoard.mood,
            paletteId: paletteOptions.some((item) => item.id === savedBoard.paletteId)
                ? savedBoard.paletteId
                : initialBoard.paletteId,
            items: validItems,
        };
    } catch {
        return copyInitialBoard();
    }
};

const readSavedBoards = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(savedStorageKey) || "[]");

        if (!Array.isArray(saved)) {
            return [];
        }

        return saved
            .filter(
                (item) =>
                    item &&
                    typeof item.id === "string" &&
                    Array.isArray(item.items) &&
                    typeof item.title === "string",
            )
            .map((item) => ({
                ...item,
                title: item.title.slice(0, 48),
                brief: typeof item.brief === "string" ? item.brief.slice(0, 180) : "",
                mood: moodOptions.includes(item.mood) ? item.mood : initialBoard.mood,
                paletteId: paletteOptions.some((palette) => palette.id === item.paletteId)
                    ? item.paletteId
                    : initialBoard.paletteId,
                items: item.items
                    .filter(isValidBoardItem)
                    .map(normalizeBoardItem),
            }))
            .slice(0, maxSavedBoards);
    } catch {
        return [];
    }
};

const App = () => {
    const [board, setBoard] = useState(readWorkingBoard);
    const [savedBoards, setSavedBoards] = useState(readSavedBoards);
    const [confirmation, setConfirmation] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState(categoryOptions[0]);
    const [saveMessage, setSaveMessage] = useState("");
    const palette = getPaletteById(board.paletteId);
    const searchWords = searchTerm.trim().toLowerCase();
    const filteredInspirations = inspirations.filter((item) => {
        const matchesCategory =
            category === categoryOptions[0] || item.category === category;
        const searchContent = [item.title, item.category, item.mood, ...item.keywords]
            .join(" ")
            .toLowerCase();

        return matchesCategory && (!searchWords || searchContent.includes(searchWords));
    });
    const addedIds = new Set(
        board.items
            .filter((item) => item.type === "image")
            .map((item) => item.inspirationId),
    );

    useEffect(() => {
        try {
            localStorage.setItem(draftStorageKey, JSON.stringify(board));
        } catch {
            return undefined;
        }

        return undefined;
    }, [board]);

    useEffect(() => {
        try {
            localStorage.setItem(savedStorageKey, JSON.stringify(savedBoards));
        } catch {
            return undefined;
        }

        return undefined;
    }, [savedBoards]);

    const handleFieldChange = (field, value) => {
        setBoard((currentBoard) => ({ ...currentBoard, [field]: value }));
    };

    const handleAddNote = () => {
        setBoard((currentBoard) => ({
            ...currentBoard,
            items: [
                ...currentBoard.items,
                {
                    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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

    const handleAddInspiration = (inspiration) => {
        setBoard((currentBoard) => {
            const alreadyAdded = currentBoard.items.some(
                (item) =>
                    item.type === "image" &&
                    item.inspirationId === inspiration.id,
            );

            if (alreadyAdded) {
                return currentBoard;
            }

            const sizes = ["small", "wide", "medium"];

            return {
                ...currentBoard,
                items: [
                    ...currentBoard.items,
                    {
                        id: `reference-${inspiration.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        type: "image",
                        inspirationId: inspiration.id,
                        size: sizes[currentBoard.items.length % sizes.length],
                    },
                ],
            };
        });
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
        const itemIndex = board.items.findIndex((piece) => piece.id === item.id);
        const noteNumber = board.items
            .slice(0, itemIndex + 1)
            .filter((piece) => piece.type === "note").length;
        const itemLabel = inspiration?.title ?? `Note ${noteNumber}`;

        setConfirmation({ type: "remove-item", itemId: item.id, itemLabel });
    };

    const handleSaveBoard = () => {
        if (savedBoards.length >= maxSavedBoards) {
            setSaveMessage(
                "You have 12 saved boards. Remove a snapshot before saving another.",
            );
            return;
        }

        const snapshot = {
            ...board,
            id: `saved-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            savedAt: new Date().toISOString(),
            items: board.items.map((item) => ({ ...item })),
        };

        setSavedBoards((currentBoards) => [snapshot, ...currentBoards]);
        setSaveMessage(`Saved "${board.title || "Untitled board"}" to this device.`);
    };

    const handleRestoreBoard = (savedBoard) => {
        setBoard({
            title: savedBoard.title,
            brief: savedBoard.brief,
            mood: savedBoard.mood,
            paletteId: savedBoard.paletteId,
            items: savedBoard.items.map((item) => ({ ...item })),
        });
        setSaveMessage(`Restored "${savedBoard.title || "Untitled board"}".`);
        document.getElementById("board")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleRequestRemoveSaved = (savedBoard) => {
        setConfirmation({
            type: "remove-saved",
            savedId: savedBoard.id,
            itemLabel: savedBoard.title || "Untitled board",
        });
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
            setSaveMessage("");
        } else if (confirmation.type === "remove-item") {
            setBoard((currentBoard) => ({
                ...currentBoard,
                items: currentBoard.items.filter(
                    (item) => item.id !== confirmation.itemId,
                ),
            }));
        } else if (confirmation.type === "remove-saved") {
            setSavedBoards((currentBoards) =>
                currentBoards.filter((item) => item.id !== confirmation.savedId),
            );
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
    const confirmationIsSavedRemoval = confirmation?.type === "remove-saved";
    const confirmationTitle = confirmationIsReset
        ? "Start a new board?"
        : confirmationIsSavedRemoval
          ? "Remove saved snapshot?"
          : "Remove this piece?";
    const confirmationDescription = confirmationIsReset
        ? "This clears the working board, including its images and notes. Saved snapshots will stay available."
        : confirmationIsSavedRemoval
          ? `Remove "${confirmation?.itemLabel}" from your saved boards? Your working board will stay as it is.`
          : `Remove "${confirmation?.itemLabel}" from this board? Your saved snapshots will stay unchanged.`;
    const confirmationLabel = confirmationIsReset
        ? "Start new board"
        : confirmationIsSavedRemoval
          ? "Remove snapshot"
          : "Remove piece";

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
            <SiteHeader savedCount={savedBoards.length} />
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
                        onSave={handleSaveBoard}
                        saveMessage={saveMessage}
                        onNoteChange={handleNoteChange}
                        onMove={handleMoveItem}
                        onRequestRemove={handleRequestRemove}
                    />

                    <InspirationLibrary
                        inspirations={filteredInspirations}
                        searchTerm={searchTerm}
                        category={category}
                        addedIds={addedIds}
                        onSearchChange={setSearchTerm}
                        onCategoryChange={setCategory}
                        onAdd={handleAddInspiration}
                    />

                    <SavedBoards
                        items={savedBoards}
                        onRestore={handleRestoreBoard}
                        onRequestRemove={handleRequestRemoveSaved}
                        onSaveCurrent={handleSaveBoard}
                    />

                    <QuickGuide />
                </main>
            </div>
            <SiteFooter />
            <BackToTop />
            <ConfirmationDialog
                isOpen={Boolean(confirmation)}
                title={confirmationTitle}
                description={confirmationDescription}
                confirmLabel={confirmationLabel}
                onCancel={handleCancelConfirmation}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default App;
