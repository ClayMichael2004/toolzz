import {Link} from "react-router-dom"

const Sidebar=()=>{
    return (
        <aside
        style={{
            width: "250px",
            background: "#111827",
            color : "white",
            padding: "20px"
        }}
        >
            <h2>Toolzz</h2>
            <nav>
                <ul style={{ listStyle: "none", padding: "0"}}>
                    <li><Link to="/" style={{color: "white"}}>Commit Generator</Link></li>
                    <li><Link to="/error" style={{color: "white"}}>Error Explainer</Link></li>
                    <li><Link to="/readme" style={{color: "white"}}>README Generator</Link></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;