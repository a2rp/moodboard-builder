import { LuBookmark, LuClock3, LuRotateCcw, LuTrash2 } from "react-icons/lu";
import { getInspirationById } from "../../data/inspirations.js";
import { getPaletteById } from "../../data/palettes.js";
import styles from "./styles.module.css";

const formatSavedDate = (savedAt) => {
    const date = new Date(savedAt);

    return Number.isNaN(date.getTime())
        ? "Saved board"
        : new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
          }).format(date);
};

const SavedBoards = ({ items, onRestore, onRequestRemove, onSaveCurrent }) => (
    <section className={styles.savedBoards} id="saved" aria-labelledby="saved-title">
        <div className={styles.savedHeading}>
            <div>
                <h2 id="saved-title">Saved boards</h2>
                <p>Snapshots stay on this device. Keep up to 12 directions.</p>
            </div>
            <span className={styles.savedCount}>{items.length} / 12 saved</span>
        </div>

        {items.length > 0 ? (
            <div className={styles.savedGrid}>
                {items.map((item) => {
                    const palette = getPaletteById(item.paletteId);
                    const firstImage = item.items.find((piece) => piece.type === "image");
                    const preview = firstImage
                        ? getInspirationById(firstImage.inspirationId)
                        : null;

                    return (
                        <article className={styles.savedCard} key={item.id}>
                            <div className={styles.savedPreview}>
                                {preview ? (
                                    <img
                                        src={`${import.meta.env.BASE_URL}${preview.src}`}
                                        alt=""
                                        loading="lazy"
                                    />
                                ) : (
                                    <span
                                        className={styles.emptyPreview}
                                        style={{ backgroundColor: palette.accentSoft }}
                                    >
                                        <LuBookmark aria-hidden="true" />
                                    </span>
                                )}
                                <span className={styles.moodLabel}>{item.mood}</span>
                            </div>
                            <div className={styles.savedBody}>
                                <div className={styles.savedTitleRow}>
                                    <h3>{item.title || "Untitled board"}</h3>
                                    <span
                                        className={styles.paletteDot}
                                        style={{ backgroundColor: palette.accent }}
                                        aria-label={`${palette.name} color story`}
                                        title={palette.name}
                                    />
                                </div>
                                <p>{item.brief || "No brief added yet."}</p>
                                <span className={styles.savedDate}>
                                    <LuClock3 aria-hidden="true" />
                                    {formatSavedDate(item.savedAt)}
                                </span>
                                <div className={styles.savedActions}>
                                    <button
                                        className={styles.restoreButton}
                                        type="button"
                                        onClick={() => onRestore(item)}
                                    >
                                        <LuRotateCcw aria-hidden="true" />
                                        Restore board
                                    </button>
                                    <button
                                        className={styles.removeButton}
                                        type="button"
                                        aria-label={`Remove saved board ${item.title || "Untitled board"}`}
                                        onClick={() => onRequestRemove(item)}
                                    >
                                        <LuTrash2 aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        ) : (
            <div className={styles.emptySaved}>
                <LuBookmark aria-hidden="true" />
                <h3>No snapshots yet</h3>
                <p>Save the current direction when you want to compare it later.</p>
                <button type="button" onClick={onSaveCurrent}>
                    Save this board
                </button>
            </div>
        )}
    </section>
);

export default SavedBoards;
