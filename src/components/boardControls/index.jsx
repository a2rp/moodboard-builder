import { LuNotebookPen, LuRotateCcw } from "react-icons/lu";
import { paletteOptions } from "../../data/palettes.js";
import styles from "./styles.module.css";

const moodOptions = ["Grounded", "Airy", "Collected", "Playful"];

const BoardControls = ({
    board,
    onFieldChange,
    onMoodChange,
    onPaletteChange,
    onAddNote,
    onRequestReset,
}) => (
    <section className={styles.boardControls} aria-labelledby="controls-title">
        <div className={styles.controlsHeading}>
            <p className={styles.label}>Board brief</p>
            <h2 id="controls-title">Set the feeling</h2>
            <p className={styles.description}>
                Give your references a point of view.
            </p>
        </div>

        <div className={styles.fieldGroup}>
            <label htmlFor="board-title">Board name</label>
            <input
                id="board-title"
                type="text"
                value={board.title}
                maxLength={48}
                onChange={(event) => onFieldChange("title", event.target.value)}
            />
            <span className={styles.helperText}>
                {board.title.length}/48 characters
            </span>
        </div>

        <div className={styles.fieldGroup}>
            <label htmlFor="board-brief">Creative brief</label>
            <textarea
                id="board-brief"
                value={board.brief}
                rows={3}
                maxLength={180}
                onChange={(event) => onFieldChange("brief", event.target.value)}
            />
            <span className={styles.helperText}>
                A short phrase helps keep the board focused.
            </span>
        </div>

        <div className={styles.optionGroup}>
            <h3>Feeling</h3>
            <div className={styles.moodOptions} role="group" aria-label="Board feeling">
                {moodOptions.map((mood) => (
                    <button
                        className={board.mood === mood ? styles.moodActive : styles.moodButton}
                        key={mood}
                        type="button"
                        aria-pressed={board.mood === mood}
                        onClick={() => onMoodChange(mood)}
                    >
                        <span aria-hidden="true" />
                        {mood}
                    </button>
                ))}
            </div>
        </div>

        <div className={styles.optionGroup}>
            <h3>Color story</h3>
            <div className={styles.paletteOptions} role="group" aria-label="Board color story">
                {paletteOptions.map((palette) => (
                    <button
                        className={
                            board.paletteId === palette.id
                                ? styles.paletteActive
                                : styles.paletteButton
                        }
                        key={palette.id}
                        type="button"
                        aria-pressed={board.paletteId === palette.id}
                        onClick={() => onPaletteChange(palette.id)}
                    >
                        <span className={styles.paletteColors} aria-hidden="true">
                            <span style={{ backgroundColor: palette.accent }} />
                            <span style={{ backgroundColor: palette.sage }} />
                            <span style={{ backgroundColor: palette.background }} />
                        </span>
                        <span>{palette.name}</span>
                    </button>
                ))}
            </div>
        </div>

        <button className={styles.addNoteButton} type="button" onClick={onAddNote}>
            <LuNotebookPen aria-hidden="true" />
            Add a note
        </button>

        <button className={styles.resetButton} type="button" onClick={onRequestReset}>
            <LuRotateCcw aria-hidden="true" />
            Start a new board
        </button>

        <p className={styles.storageHint}>
            Your working draft saves in this browser when local storage is available.
        </p>
    </section>
);

export default BoardControls;
