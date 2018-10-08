import React, { Component } from 'react';
import './SideNav.css';

class SideNav extends Component {

  buildRestaurantList() {
    return this.props.restaurants.map(restaurant => {
      return <li key={restaurant.venue.id}> {restaurant.venue.name} </li>
    })
  }

  render() {
    return(
       <div className="sideNav bar">
        <div className="search-filter-bar">
        </div>
        <div className="restaurant-list">
          <ul className="restaurant-list-info">
            {this.buildRestaurantList()}
          </ul>
        </div>
      </div>
    )
  }
}

export default SideNav;
