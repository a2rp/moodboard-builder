import {
    LuDownload,
    LuImagePlus,
    LuNotebookPen,
} from "react-icons/lu";
import BoardCard from "../boardCard/index.jsx";
import styles from "./styles.module.css";

const MoodboardCanvas = ({
    board,
    palette,
    onAddNote,
    onDownload,
    onNoteChange,
    onMove,
    onRequestRemove,
}) => {
    const noteCount = board.items.filter((item) => item.type === "note").length;

    return (
        <section className={styles.moodboardCanvas} aria-labelledby="canvas-title">
            <div className={styles.canvasHeading}>
                <div>
                    <h2 id="canvas-title">Your canvas</h2>
                    <p>Gather the references that make the direction feel clear.</p>
                </div>
                <div className={styles.canvasActions}>
                    <span className={styles.pieceCount}>
                        {board.items.length} {board.items.length === 1 ? "piece" : "pieces"}
                    </span>
                    <button type="button" onClick={onAddNote}>
                        <LuNotebookPen aria-hidden="true" />
                        Add note
                    </button>
                    <button className={styles.downloadButton} type="button" onClick={onDownload}>
                        <LuDownload aria-hidden="true" />
                        Export board
                    </button>
                </div>
            </div>

            <div
                className={styles.canvasFrame}
                style={{
                    "--canvas-paper": palette.paper,
                    "--canvas-background": palette.background,
                    "--canvas-border": palette.border,
                    "--canvas-ink": palette.ink,
                    "--canvas-muted": palette.muted,
                    "--canvas-accent": palette.accent,
                    "--canvas-accent-dark": palette.accentDark,
                    "--canvas-note": palette.accentSoft,
                }}
            >
                <div className={styles.canvasTopline}>
                    <div className={styles.canvasTitle}>
                        <span className={styles.canvasMark} aria-hidden="true">
                            <LuImagePlus />
                        </span>
                        <div>
                            <strong>{board.title || "Untitled board"}</strong>
                            <span>{board.mood} direction</span>
                        </div>
                    </div>
                    <div className={styles.colorStory} aria-label={`${palette.name} color story`}>
                        <span style={{ backgroundColor: palette.accent }} />
                        <span style={{ backgroundColor: palette.sage }} />
                        <span style={{ backgroundColor: palette.paper }} />
                        <span>{palette.name}</span>
                    </div>
                </div>

                {board.items.length > 0 ? (
                    <div className={styles.canvasGrid}>
                        {board.items.map((item, index) => {
                            const noteNumber = board.items
                                .slice(0, index + 1)
                                .filter((piece) => piece.type === "note").length;

                            return (
                                <BoardCard
                                    item={item}
                                    key={item.id}
                                    position={index}
                                    total={board.items.length}
                                    noteNumber={noteNumber}
                                    onNoteChange={onNoteChange}
                                    onMove={onMove}
                                    onRequestRemove={onRequestRemove}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyCanvas}>
                        <LuImagePlus aria-hidden="true" />
                        <h3>Start collecting</h3>
                        <p>Add a note here or choose a reference from the library below.</p>
                        <button type="button" onClick={onAddNote}>
                            Add your first note
                        </button>
                    </div>
                )}

                <div className={styles.canvasFooter}>
                    <span>{noteCount} {noteCount === 1 ? "note" : "notes"} in this direction</span>
                    <span>Draft stays on this device</span>
                </div>
            </div>
        </section>
    );
};

export default MoodboardCanvas;
