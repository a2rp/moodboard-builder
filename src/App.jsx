import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const App = () => (
    <div className={styles.appShell}>
        <SiteHeader />
        <main className={styles.pageContent}>
            <section id="board" className={styles.placeholderSection}>
                <h1>Moodboard Builder</h1>
                <p>Collect the images, colors, and details behind your next idea.</p>
            </section>
            <section id="inspiration" className={styles.placeholderSection}>
                <h2>Inspiration</h2>
                <p>Browse a local library of photographs and visual references.</p>
            </section>
            <section id="saved" className={styles.placeholderSection}>
                <h2>Saved boards</h2>
                <p>Saved boards will stay available in this browser.</p>
            </section>
            <section id="guide" className={styles.placeholderSection}>
                <h2>Guide</h2>
                <p>Choose a mood, add references, then save a snapshot of your board.</p>
            </section>
        </main>
    </div>
);

export default App;
