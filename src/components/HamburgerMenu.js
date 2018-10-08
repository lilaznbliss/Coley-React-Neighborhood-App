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
      bars[i].classList.toggle("change");
    };

    let sideNav = document.getElementsByClassName("sideNav")[0];
    if (sideNav.style.display === 'none' || sideNav.style.display === '') {
      sideNav.style.display = 'block';
    } else {
      sideNav.style.display = 'none';
    }

    let map = document.getElementById("map");
    if (map.style.width === '70%') {
      map.style.width = '100%';
    } else {
      map.style.width = '70%';
    }
  }

  render() {
    return(
      <div className="bar container" onClick= {this.hamburgerMenuAction}>
        <div className="bar bar1"></div>
        <div className="bar bar2"></div>
        <div className="bar bar3"></div>
      </div>

    )
  }
}

  export default HamburgerMenu;
