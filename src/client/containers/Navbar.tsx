import React, { useState, useEffect } from "react";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import Button, { buttonClasses } from '@mui/material/Button';
import { useQuery } from "@apollo/client";
import { CLUSTER_SUMMARY } from '../queries/graphQL'; 
import Grid from '@mui/material/Grid';


const linkStyle = {
    display: 'flex',
    padding: "0px 0px 20px 0px",
    textDecoration: "none",
    height: '20px',
    backgroundColor: 'none'
  };

  // '#71ABC5'
const btnStyle = {
    minWidth: 150, 
    size: 'large',
    margin: "0px",
    textAlign:"right",
    textTransform: 'unset',
    color: 'primary.main',
    };
 
const ButtonBar = () => {

    let connectStatus = 'Loading';
    const { loading, data } = useQuery(CLUSTER_SUMMARY);
    
    if(!loading) {
        console.log('status is... ', data);
        connectStatus = 'Connected';
    }
    
    const [selected, setSelected] = useState(false);

    const menuItems = [ "Overview", "Brokers", "Consumers", "List Topics", "Partitions", "Dead Letter Queue"];
    const menuRoutes = ["/overview", "/brokers", "/consumers","/listtopics", "/partitions", "/dlq"];

   const handleClick = () => {
    setSelected(true);
   }
   
    let selectedBorder = (selected)=>{
        let fill = selected
        if(fill) {
            const btnStyle = {
                minWidth: 150, 
                margin: "0px",
                border: 5,
                textAlign:"right",
                textTransform: 'unset',
                };
        }
}

//    useEffect(() => {
//     console.log('entered useEffect Hook');
//     if (selected){
//         console.log('selected is true');
//         // btnStyle.border= 10;
//     }}, [selected]);

    const menuBtns = menuItems.map((ele, i)=>{
        return( 
            <Button 
                    onClick={handleClick}        
                    variant="outlined"
                    sx={btnStyle}
                    key={i}
                        >
                            <Link 
                            to= {menuRoutes[i]} 
                            style={linkStyle}>{ele}
                            </Link></Button>
        )
    })

    return (
        <Grid>
        <Stack 
        direction="row" 
        spacing={5} 
        marginLeft='33px'>
            <Button sx={btnStyle}>Kafka Cluster is {connectStatus}</Button>
            {menuBtns}
        </Stack>
        </Grid>
    )
}
 
export default ButtonBar;