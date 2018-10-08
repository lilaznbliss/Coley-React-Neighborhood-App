import React, { Component } from 'react';
import './SideNav.css';

class SideNav extends Component {

  buildRestaurantList() {

    return this.props.restaurants.map(restaurant => {
      let restaurantListItem;

      if (restaurant.venue.id === this.props.selectedRestaurantId) {
        restaurantListItem = <li className="selected" key={restaurant.venue.id} onClick={() => {this.openMarker(restaurant)}}> {restaurant.venue.name} </li>;
      } else {
        restaurantListItem = <li key={restaurant.venue.id} onClick={() => {this.openMarker(restaurant)}}> {restaurant.venue.name} </li>;
      }

      return restaurantListItem;
    })
  }

  //Creates and opens a marker for the restaurant list item
  openMarker = (restaurant) => {
    let contentInfo = this.props.makeContentInfo(restaurant);
    let marker = this.props.markersArray.find(m => {
      return (m.restaurantId === restaurant.venue.id ? m : null)
    });
    this.props.openMarker(restaurant, marker, contentInfo);
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
