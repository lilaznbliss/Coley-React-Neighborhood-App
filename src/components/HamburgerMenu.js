import React, { Component } from 'react';
import './HamburgerMenu.css';

class HamburgerMenu extends Component {

  /*let sideMenu = document.getElementsByClassName("sideNav");

  closeNav() {
    sideMenu.css('width', '0');
  }

  openNav() {
    sideMenu.css('width', '30%');
  }*/

   hamburgerMenuAction() {
    let bars = document.getElementsByClassName("bar");
    for (let i = 0; i < bars.length; i++) {
      console.log('hi');
      bars[i].classList.toggle("change");

    };

  }

  render() {
    return(
      <div className=" bar container" onClick= {this.hamburgerMenuAction}>
        <div className="bar bar1"></div>
        <div className="bar bar2"></div>
        <div className="bar bar3"></div>
      </div>

    )
  }
}

  export default HamburgerMenu;
