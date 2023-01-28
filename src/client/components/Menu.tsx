import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

const linkStyle = {
    display: 'flex',
    margin: "0px",
    padding: "0px 0px 20px 0px",
    textDecoration: "none",
    color: 'white',
    height: '5px',
  };

function Menu(){

    return(
        <>
            <div>Cluster</div>
            <nav className="navbar">
                <Button variant="contained" sx={{minWidth: 170, margin: "5px", background: "#6599CC"}}><Link to="/overview" style={linkStyle}>Cluster Overview</Link></Button><br />
                <Button variant="contained" sx={{minWidth: 170, margin: "5px", background: "#6599CC"}}><Link to="/brokers" style={linkStyle}>Brokers</Link></Button><br />
                <Button variant="contained" sx={{minWidth: 170, margin: "5px", background: "#6599CC"}}><Link to="/consumers" style={linkStyle}>Consumers</Link></Button><br />
                <Button variant="contained" sx={{minWidth: 170, margin: "5px", background: "#6599CC"}}><Link to="/listtopics" style={linkStyle}>List Topics</Link></Button><br />
                <Button variant="contained" sx={{minWidth: 170, margin: "5px", background: "#6599CC"}}><Link to="/createtopic" style={linkStyle}>Create Topic</Link></Button><br />
                <Button variant="contained" sx={{minWidth: 170, margin: "5px", background: "#6599CC"}}><Link to="/deletetopic" style={linkStyle}>Delete Topic</Link></Button><br />
                <Button variant="contained" sx={{minWidth: 170, margin: "5px", background: "#6599CC"}}><Link to="/topicrecorddelete" style={linkStyle}>Delete Topic Records</Link></Button><br />
                <Button variant="contained" sx={{minWidth: 170, margin: "5px", background: "#6599CC"}}><Link to="/partitions" style={linkStyle}>Partitions</Link></Button>
                <Button variant="contained" sx={{minWidth: 170, margin: "5px", background: "#6599CC"}}><Link to="/dlq" style={linkStyle}>Dead Letter Queue</Link></Button>
            </nav>
        </>
    );
}

export default Menu;