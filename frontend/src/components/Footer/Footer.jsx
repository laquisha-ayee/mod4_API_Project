import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <p>
                &copy; {new Date().getFullYear()} Mod 4 Project | 
                <a 
                    href="https://github.com/laquisha-ayee/mod4_API_Project.git" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ marginLeft: "8px" }}
                >
                    GitHub
                </a>
            </p>
        </footer>
    );
}

export default Footer;