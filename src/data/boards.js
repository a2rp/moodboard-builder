export const initialBoard = {
    title: "Still House",
    brief: "A quiet guesthouse shaped by salt air and slow mornings.",
    mood: "Grounded",
    paletteId: "paper-clay",
    items: [
        { id: "seed-coast", type: "image", inspirationId: "coast-forest", size: "large" },
        { id: "seed-cafe", type: "image", inspirationId: "cafe-table", size: "medium" },
        { id: "seed-leaf", type: "image", inspirationId: "yellow-leaf", size: "small" },
        { id: "seed-notes", type: "image", inspirationId: "visual-notes", size: "small" },
        { id: "seed-hills", type: "image", inspirationId: "golden-hills", size: "medium" },
        {
            id: "seed-note",
            type: "note",
            size: "note",
            text: "A place to take your time. Let the materials feel found, not finished.",
        },
        { id: "seed-shore", type: "image", inspirationId: "rocky-shore", size: "wide" },
    ],
};

export const blankBoard = {
    title: "Untitled board",
    brief: "Start with a place, a phrase, or a feeling.",
    mood: "Collected",
    paletteId: "paper-clay",
    items: [],
};
