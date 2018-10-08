import React, { Component } from 'react';
import './SideNav.css';

class SideNav extends Component {

  buildRestaurantList() {
    console.log(this.props.selectedRestaurantId);

    return this.props.restaurants.map(restaurant => {
      let restaurantListItem;
      if (restaurant.venue.id === this.props.selectedRestaurantId) {
        restaurantListItem = <li className="selected" key={restaurant.venue.id}> {restaurant.venue.name} </li>;
      } else {
        restaurantListItem = <li key={restaurant.venue.id}> {restaurant.venue.name} </li>;
      }
      return restaurantListItem;
    })
  }

  render() {
    return(
       <div className="sideNav bar">
        <div className="search-filter-bar">
          <button className="filter-button"> FILTER </button>
          <input type="text" name="search" placeholder="Search.."></input>
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
