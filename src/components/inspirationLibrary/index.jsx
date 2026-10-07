import { LuCheck, LuImagePlus, LuSearch, LuX } from "react-icons/lu";
import { categoryOptions } from "../../data/inspirations.js";
import styles from "./styles.module.css";

const InspirationLibrary = ({
    inspirations,
    searchTerm,
    category,
    addedIds,
    onSearchChange,
    onCategoryChange,
    onAdd,
}) => (
    <section
        className={styles.inspirationLibrary}
        id="inspiration"
        aria-labelledby="inspiration-title"
    >
        <div className={styles.libraryHeading}>
            <div>
                <h2 id="inspiration-title">Find a starting point</h2>
                <p>Pick a reference to add it to the canvas.</p>
            </div>
            <span className={styles.resultCount}>
                {inspirations.length}{" "}
                {inspirations.length === 1 ? "reference" : "references"}
            </span>
        </div>

        <div className={styles.libraryTools}>
            <label className={styles.searchBox}>
                <LuSearch aria-hidden="true" />
                <span className={styles.visuallyHidden}>Search references</span>
                <input
                    type="search"
                    value={searchTerm}
                    placeholder="Search photos, places, and details"
                    onChange={(event) => onSearchChange(event.target.value)}
                />
                {searchTerm && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => onSearchChange("")}
                    >
                        <LuX aria-hidden="true" />
                    </button>
                )}
            </label>

            <label className={styles.categorySelect}>
                <span>Category</span>
                <select
                    value={category}
                    onChange={(event) => onCategoryChange(event.target.value)}
                    aria-label="Filter by category"
                >
                    {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </label>
        </div>

        {inspirations.length > 0 ? (
            <div className={styles.referenceGrid}>
                {inspirations.map((item) => {
                    const isAdded = addedIds.has(item.id);

                    return (
                        <article className={styles.referenceCard} key={item.id}>
                            <div className={styles.imageWrap}>
                                <img
                                    src={`${import.meta.env.BASE_URL}${item.src}`}
                                    alt={item.alt}
                                    loading="lazy"
                                />
                                <span className={styles.categoryTag}>
                                    {item.category}
                                </span>
                            </div>
                            <div className={styles.referenceDetails}>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.mood}</p>
                                </div>
                                <button
                                    className={
                                        isAdded
                                            ? styles.addedButton
                                            : styles.addButton
                                    }
                                    type="button"
                                    aria-label={
                                        isAdded
                                            ? `${item.title} is on the board`
                                            : `Add ${item.title} to the board`
                                    }
                                    aria-pressed={isAdded}
                                    disabled={isAdded}
                                    onClick={() => onAdd(item)}
                                >
                                    {isAdded ? (
                                        <LuCheck aria-hidden="true" />
                                    ) : (
                                        <LuImagePlus aria-hidden="true" />
                                    )}
                                    <span>{isAdded ? "On board" : "Add"}</span>
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        ) : (
            <div className={styles.emptyResults}>
                <LuSearch aria-hidden="true" />
                <h3>No references found</h3>
                <p>Try another word or choose a different category.</p>
                <button
                    type="button"
                    onClick={() => {
                        onSearchChange("");
                        onCategoryChange(categoryOptions[0]);
                    }}
                >
                    Clear filters
                </button>
            </div>
        )}
    </section>
);

export default InspirationLibrary;
