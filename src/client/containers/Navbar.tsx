import React, { useState } from "react";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import Button, { buttonClasses } from '@mui/material/Button';
import { useQuery } from "@apollo/client";
import { CLUSTER_SUMMARY } from '../queries/graphQL'; 

const linkStyle = {
    display: 'flex',
    padding: "0px 0px 20px 0px",
    textDecoration: "none",
    color: '#71ABC5',
    height: '10px',
  };



const ButtonBar = () => {

    let connectStatus = 'Loading';
    const { loading, data } = useQuery(CLUSTER_SUMMARY);
    
    if(!loading) {
        console.log('status is... ', data);
        connectStatus = 'Connected';
    }

    
    const [selected, setSelected] = useState(false);
    console.log("NavBar", selected);

    const menuItems = [ ` Kafka Cluster is ${connectStatus}`, "Brokers", "Consumers", "List Topics", "Partitions", "Dead Letter Queue"];
    const menuRoutes = [ "/", "/brokers", "/consumers","/listtopics", "/partitions", "/dlq"];

    // let filled = selected ? "filled" : "outlined";

 
    const menuBtns = menuItems.map((ele, i)=>{
        return( 
            <Button 
                    onClick={() => setSelected(true)}        
                    variant="outlined"
                    sx={{minWidth: 150, 
                        margin: "0px",
                        fontsize: 18,
                        textAlign:"right",
                        textTransform: 'unset',
                        color: 'palette.primary.dark' }}
                        key={i}
                        >
                            <Link 
                            to= {menuRoutes[i]} 
                            style={linkStyle}>{ele}
                            </Link></Button>
        )
    })

    return (
        <Stack 
        direction="row" 
        spacing={5} 
        marginLeft='10px'>
          
           {menuBtns}
        </Stack>
    )
}
 
export default ButtonBar;