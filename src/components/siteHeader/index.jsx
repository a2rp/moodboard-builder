import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { LuArrowUpRight, LuLayoutGrid, LuMenu, LuX } from "react-icons/lu";
import styles from "./styles.module.css";

const navigation = [
    { label: "Board", href: "#board" },
    { label: "Inspiration", href: "#inspiration" },
    { label: "Saved boards", href: "#saved" },
    { label: "Guide", href: "#guide" },
];

const SiteHeader = ({ savedCount = 0 }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!headerRef.current?.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={styles.siteHeader} ref={headerRef}>
            <div className={styles.headerInner}>
                <a className={styles.brand} href="#board" onClick={closeMenu}>
                    <span className={styles.brandMark}>
                        <LuLayoutGrid aria-hidden="true" />
                    </span>
                    <span className={styles.brandText}>
                        <strong>Gather</strong>
                        <small>Moodboard studio</small>
                    </span>
                </a>

                <nav
                    className={
                        menuOpen ? styles.navigationOpen : styles.navigation
                    }
                    id="main-navigation"
                    aria-label="Main navigation"
                >
                    {navigation.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                        >
                            {item.label}
                            {item.label === "Saved boards" && savedCount > 0 && (
                                <span className={styles.savedCount}>
                                    {savedCount}
                                </span>
                            )}
                        </a>
                    ))}
                </nav>

                <div className={styles.headerActions}>
                    <a
                        className={styles.repositoryLink}
                        href="https://github.com/a2rp/moodboard-builder"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaGithub aria-hidden="true" />
                        <span>Repository</span>
                        <LuArrowUpRight aria-hidden="true" />
                    </a>
                    <button
                        className={styles.menuButton}
                        type="button"
                        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                        aria-expanded={menuOpen}
                        aria-controls="main-navigation"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default SiteHeader;
