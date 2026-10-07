import { LuArrowDown, LuArrowUp, LuImage, LuTrash2 } from "react-icons/lu";
import { getInspirationById } from "../../data/inspirations.js";
import styles from "./styles.module.css";

const BoardCard = ({
    item,
    position,
    total,
    noteNumber,
    onNoteChange,
    onMove,
    onRequestRemove,
}) => {
    const inspiration =
        item.type === "image" ? getInspirationById(item.inspirationId) : null;
    const label = item.type === "note" ? `note ${noteNumber}` : inspiration?.title;
    const itemLayout = styles[item.size] ?? styles.small;

    return (
        <article className={`${styles.boardCard} ${itemLayout}`}>
            <div className={styles.cardActions} aria-label={`Actions for ${label}`}>
                <button
                    type="button"
                    aria-label={`Move ${label} earlier`}
                    title="Move earlier"
                    disabled={position === 0}
                    onClick={() => onMove(item.id, -1)}
                >
                    <LuArrowUp aria-hidden="true" />
                </button>
                <button
                    type="button"
                    aria-label={`Move ${label} later`}
                    title="Move later"
                    disabled={position === total - 1}
                    onClick={() => onMove(item.id, 1)}
                >
                    <LuArrowDown aria-hidden="true" />
                </button>
                <button
                    className={styles.removeButton}
                    type="button"
                    aria-label={`Remove ${label} from board`}
                    title="Remove from board"
                    onClick={() => onRequestRemove(item)}
                >
                    <LuTrash2 aria-hidden="true" />
                </button>
            </div>

            {inspiration ? (
                <>
                    <img
                        className={styles.cardImage}
                        src={`${import.meta.env.BASE_URL}${inspiration.src}`}
                        alt={inspiration.alt}
                        loading="lazy"
                    />
                    <div className={styles.imageCaption}>
                        <span>{inspiration.category}</span>
                        <strong>{inspiration.title}</strong>
                    </div>
                </>
            ) : (
                <div className={styles.notePanel}>
                    <span className={styles.noteIcon}>
                        <LuImage aria-hidden="true" />
                        Note {noteNumber}
                    </span>
                    <label className={styles.visuallyHidden} htmlFor={`note-${item.id}`}>
                        Edit note {noteNumber}
                    </label>
                    <textarea
                        id={`note-${item.id}`}
                        value={item.text}
                        maxLength={180}
                        rows={5}
                        onChange={(event) => onNoteChange(item.id, event.target.value)}
                    />
                    <span className={styles.noteLength}>{item.text.length}/180</span>
                </div>
            )}
        </article>
    );
};

export default BoardCard;
