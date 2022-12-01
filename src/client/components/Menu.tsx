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
            <button><Link to="/brokers" style={linkStyle}>Brokers</Link></button><br />
            <button><Link to="/producers" style={linkStyle}>Producers</Link></button><br />
            <button><Link to="/consumers" style={linkStyle}>Consumers</Link></button><br />
            <button><Link to="/topics" style={linkStyle}>Topics</Link></button><br />
            <button><Link to="/partitions" style={linkStyle}>Partitions</Link></button>
        </nav>
    </>
    );
}

export default Menu;