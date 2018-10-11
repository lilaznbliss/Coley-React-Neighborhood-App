import React, { Component } from 'react';
import './SideNav.css';

class SideNav extends Component {

  //function that builds the restaurant list in the side nav
  buildRestaurantList() {

    return this.props.visibleRestaurants.map(restaurant => {
      let restaurantListItem;

      if (restaurant.venue.id === this.props.selectedRestaurantId) {
        restaurantListItem = <li  className="restaurant-item selected" aria-label="restaurant name" key={restaurant.venue.id} onClick={() => {this.openMarker(restaurant)}}> {restaurant.venue.name} </li>;
      } else {
        restaurantListItem = <li className="restaurant-item" aria-label="restaurant name" key={restaurant.venue.id} onClick={() => {this.openMarker(restaurant)}}> {restaurant.venue.name} </li>;
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

  //function that filters the restaurant list
  searchRestaurants = (event) => {
    let query = event.target.value.trim().toLowerCase();
    this.props.markersArray.forEach(marker => {
      if (marker.title.toLowerCase().search(query) > -1) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    });
    let restaurantFilter = this.props.restaurants.filter(restaurant =>
      restaurant.venue.name.toLowerCase().search(query) > -1);
    this.props.relevantRestaurants(restaurantFilter);
  }

//    (If I wanted to add a filter button later on)      <button className="filter-button"> FILTER </button>
  render() {
    return(
       <div className="sideNav bar">
        <div className="search-filter-bar">
          <input type="text" role="search" aria-label="search by restaurant name" name="search" placeholder="Search.." onChange={(event) => {this.searchRestaurants(event)}}></input>
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
