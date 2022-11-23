import React from "react";
import { Link } from "react-router-dom";

function Menu(){

return(
    <>
        <div>Cluster</div>
        <nav className="navbar">
            <ul>
            <li><Link to="/brokers">Brokers</Link></li>
            <li><Link to="/producers">Producers</Link></li>
            <li><Link to="/consumers">Consumers</Link></li>
            <li><Link to="/topics">Topics</Link></li>
            <li><Link to="/partitions">Partitions</Link></li>
            </ul>
        </nav>
    </>
    );
}

export default Menu;