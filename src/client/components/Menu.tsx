import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
// import { constants } from "buffer";
// import MenuBtn from './common/MenuBtn';

const linkStyle = {
    display: 'flex',
    margin: "0px",
    padding: "0px 0px 20px 0px",
    textDecoration: "none",
    color: 'white',
    height: '5px',
  };

function Menu(){
   
    const menuItems = ["Cluster Overview", "Brokers", "Consumers", "List Topics", "Create Topic", "Delete Topic", "Partitions", "Dead Letter Queue"];
    const menuRoutes = ["/overview", "/brokers", "/consumers","/listtopics", "/createtopic","/deletetopic", "/partitions", "/dlq"];

    const menuBtns = menuItems.map((ele, i)=>{

        return(
            <Button 
                    variant="outlined" 
                    sx={{minWidth: 200, 
                        margin: "5px",
                        textAlign:"left",
                        color: 'primary.dark' }}
                        key={i}>
                            <Link 
                            to= {menuRoutes[i]} 
                            style={linkStyle}>{ele}
                            </Link></Button>
        )
    })

    return (
      <div>{menuBtns}</div>  
    )
}

export default Menu;
