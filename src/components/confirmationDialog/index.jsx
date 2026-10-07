import { useEffect, useRef } from "react";
import { LuTriangleAlert, LuX } from "react-icons/lu";
import styles from "./styles.module.css";

const ConfirmationDialog = ({
    isOpen,
    title,
    description,
    confirmLabel = "Confirm",
    onCancel,
    onConfirm,
}) => {
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousFocus = document.activeElement;
        cancelButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCancel();
                return;
            }

            if (event.key === "Tab") {
                const dialog = event.currentTarget.querySelector("[role='dialog']");
                const focusable = dialog?.querySelectorAll("button:not(:disabled)");
                const first = focusable?.[0];
                const last = focusable?.[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previousFocus?.focus?.();
        };
    }, [isOpen, onCancel]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={styles.dialogOverlay}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onCancel();
                }
            }}
        >
            <section
                className={styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmation-title"
                aria-describedby="confirmation-description"
            >
                <button
                    className={styles.closeButton}
                    type="button"
                    aria-label="Close dialog"
                    onClick={onCancel}
                >
                    <LuX aria-hidden="true" />
                </button>
                <span className={styles.dialogIcon}>
                    <LuTriangleAlert aria-hidden="true" />
                </span>
                <h2 id="confirmation-title">{title}</h2>
                <p id="confirmation-description">{description}</p>
                <div className={styles.dialogActions}>
                    <button
                        className={styles.cancelButton}
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onCancel}
                    >
                        Keep working
                    </button>
                    <button
                        className={styles.confirmButton}
                        type="button"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ConfirmationDialog;
