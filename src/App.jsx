import styles from "./App.module.css";

const App = () => (
    <div className={styles.appShell}>
        <main className={styles.pageContent}>
            <h1>Moodboard Builder</h1>
            <p>Collect the images, colors, and details behind your next idea.</p>
        </main>
    </div>
);

export default App;
