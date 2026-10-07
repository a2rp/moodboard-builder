import { LuArrowDownUp, LuBookmark, LuSearch } from "react-icons/lu";
import styles from "./styles.module.css";

const guideSteps = [
    {
        number: "01",
        title: "Set the feeling",
        text: "Name your board, write a short brief, and choose a mood and color story.",
        icon: LuBookmark,
    },
    {
        number: "02",
        title: "Collect references",
        text: "Search the local library by keyword or category, then add photos to your canvas.",
        icon: LuSearch,
    },
    {
        number: "03",
        title: "Make it yours",
        text: "Edit notes, reorder pieces, save a snapshot, or download a JSON board summary.",
        icon: LuArrowDownUp,
    },
];

const QuickGuide = () => (
    <section className={styles.quickGuide} id="guide" aria-labelledby="guide-title">
        <div className={styles.guideHeading}>
            <div>
                <h2 id="guide-title">Build in three moves</h2>
                <p>A clear direction starts with a few good choices.</p>
            </div>
            <span>01 - 03</span>
        </div>
        <ol className={styles.guideSteps}>
            {guideSteps.map(({ number, title, text, icon: Icon }) => (
                <li className={styles.guideStep} key={number}>
                    <div className={styles.stepTopline}>
                        <span>{number}</span>
                        <Icon aria-hidden="true" />
                    </div>
                    <div>
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </div>
                </li>
            ))}
        </ol>
    </section>
);

export default QuickGuide;
