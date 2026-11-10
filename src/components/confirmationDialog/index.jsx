import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LuTriangleAlert, LuX } from "react-icons/lu";
import styles from "./styles.module.css";

const ConfirmationDialog = ({
    isOpen,
    title,
    description,
    confirmLabel = "Confirm",
    fallbackFocusId,
    onCancel,
    onConfirm,
}) => {
    const cancelButtonRef = useRef(null);
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousFocus = document.activeElement;
        const appRoot = document.getElementById("root");
        const previousAriaHidden = appRoot?.getAttribute("aria-hidden");
        const previousInert = appRoot?.hasAttribute("inert") ?? false;
        const previousBodyOverflow = document.body.style.overflow;

        if (appRoot) {
            appRoot.setAttribute("inert", "");
            appRoot.setAttribute("aria-hidden", "true");
        }

        document.body.style.overflow = "hidden";
        cancelButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCancel();
                return;
            }

            if (event.key === "Tab") {
                const dialog = dialogRef.current;
                const focusable = Array.from(
                    dialog?.querySelectorAll(
                        "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])",
                    ) ?? [],
                ).filter(
                    (element) =>
                        !element.hasAttribute("hidden") &&
                        element.getClientRects().length > 0,
                );
                const first = focusable?.[0];
                const last = focusable?.[focusable.length - 1];

                if (!first || !last) {
                    event.preventDefault();
                    dialog?.focus();
                } else if (
                    event.shiftKey &&
                    (document.activeElement === first ||
                        !dialog.contains(document.activeElement))
                ) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    (document.activeElement === last ||
                        !dialog.contains(document.activeElement))
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousBodyOverflow;

            if (appRoot) {
                if (!previousInert) {
                    appRoot.removeAttribute("inert");
                }

                if (previousAriaHidden === null) {
                    appRoot.removeAttribute("aria-hidden");
                } else {
                    appRoot.setAttribute("aria-hidden", previousAriaHidden);
                }
            }

            if (previousFocus?.isConnected) {
                previousFocus.focus?.();
            } else {
                document.getElementById(fallbackFocusId)?.focus?.();
            }
        };
    }, [fallbackFocusId, isOpen, onCancel]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
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
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmation-title"
                aria-describedby="confirmation-description"
                tabIndex={-1}
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
        </div>,
        document.body,
    );
};

export default ConfirmationDialog;
