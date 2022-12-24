import React from "react";
import './Header.css'



function Header() {

    function minimizeChat(){
        document.getElementById("messages").style.display = "none";
        document.getElementById("bottom_wrapper").style.display = "none";
    }

    function maximizeChat(){
        document.getElementById("messages").style.display = "";
        document.getElementById("bottom_wrapper").style.display = "";
    }

    function closeChat(){
        document.getElementById("messages").style.display = "none";
        document.getElementById("bottom_wrapper").style.display = "none";
        document.getElementById("top_menu").style.display = "none";
    }

    return (
        <div id="top_menu" className="top_menu">
            <div className="buttons">
                <div className="button close" onClick={closeChat}>X</div>
                <div className="button minimize" onClick={minimizeChat}>–</div>
                <div className="button maximize" onClick={maximizeChat}>+</div>

            </div>
            <div className="title"></div>
        </div>
    )


}



export {Header}