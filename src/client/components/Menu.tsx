import React from "react";
import { Link } from "react-router-dom";

const linkStyle = {
    margin: "1rem",
    textDecoration: "none",
    color: 'white'
  };

function Menu(){

return(
    <>
        <div>Cluster</div>
        <nav className="navbar">
            <ul>
            <li><Link to="/brokers" style={linkStyle}>Brokers</Link></li>
            <li><Link to="/producers" style={linkStyle}>Producers</Link></li>
            <li><Link to="/consumers" style={linkStyle}>Consumers</Link></li>
            <li><Link to="/topics" style={linkStyle}>Topics</Link></li>
            <li><Link to="/partitions" style={linkStyle}>Partitions</Link></li>
            </ul>
        </nav>
    </>
    );
}

export default Menu;