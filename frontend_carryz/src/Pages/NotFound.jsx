import styles from "../css/NotFound.module.css"
import { Link } from "react-router-dom";

function Notfound() {
    return (
        <div className={styles.loginBackground}>
            <h2>404 Not Found</h2>
            <p className={styles.textStyle}>
                Contact +94 775 320 757 for assistance.
                <br />
                <Link to="/" className={styles.textStyle}>Go back to Home</Link>
            </p>
            
        </div>
    );
}

export default Notfound;