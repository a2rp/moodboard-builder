import { useEffect, useState } from "react";
import { LuArrowUp } from "react-icons/lu";
import styles from "./styles.module.css";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(() => window.scrollY > 50);

    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > 50);

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <button
            className={styles.backToTop}
            type="button"
            aria-label="Back to top"
            title="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <LuArrowUp aria-hidden="true" />
            <span>Top</span>
        </button>
    );
};

export default BackToTop;
