import {
    FaFacebookF,
    FaGithub,
    FaLinkedinIn,
    FaYoutube,
} from "react-icons/fa6";
import {
    LuCoffee,
    LuCode,
    LuGlobe,
    LuHeart,
    LuMail,
} from "react-icons/lu";
import styles from "./styles.module.css";

const footerLinks = [
    { label: "Portfolio", href: "https://www.ashishranjan.net", icon: LuGlobe },
    { label: "GitHub", href: "https://github.com/a2rp", icon: FaGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", icon: LuCode },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/aashishranjan",
        icon: FaLinkedinIn,
    },
    {
        label: "Facebook",
        href: "https://www.facebook.com/theash.ashish/",
        icon: FaFacebookF,
    },
    {
        label: "YouTube",
        href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1",
        icon: FaYoutube,
    },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: LuMail },
    {
        label: "Support",
        href: "https://a2rp-donation-page.netlify.app/",
        icon: LuHeart,
    },
    {
        label: "Buy Me a Coffee",
        href: "https://buymeacoffee.com/ashishranjan",
        icon: LuCoffee,
    },
    {
        label: "Patreon",
        href: "https://www.patreon.com/ashishranjan",
        icon: LuHeart,
    },
    {
        label: "Source code",
        href: "https://github.com/a2rp/moodboard-builder",
        icon: LuCode,
    },
];

const SiteFooter = () => (
    <footer className={styles.siteFooter}>
        <div className={styles.footerInner}>
            <div className={styles.footerIdentity}>
                <a
                    className={styles.footerLogo}
                    href="https://www.ashishranjan.net"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Ashish Ranjan portfolio"
                >
                    <img
                        src={`${import.meta.env.BASE_URL}logo.png`}
                        alt="Ashish Ranjan mark"
                    />
                </a>
                <p>
                    © {new Date().getFullYear()}{" "}
                    <a
                        href="https://github.com/a2rp"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ashish Ranjan
                    </a>
                    . All rights reserved.
                </p>
            </div>
            <nav className={styles.footerLinks} aria-label="Profile and support links">
                {footerLinks.map(({ label, href, icon: Icon }) => (
                    <a
                        href={href}
                        key={label}
                        target={href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                    >
                        <Icon aria-hidden="true" />
                        {label}
                    </a>
                ))}
            </nav>
        </div>
    </footer>
);

export default SiteFooter;
