import React, { Component } from 'react';
import axios from 'axios';

import './App.css';
import SideNav from './components/SideNav.js';
import './components/SideNav.css';
import HamburgerMenu from './components/HamburgerMenu.js';
import './components/HamburgerMenu.css';

class App extends Component {

  state = {
    restaurants: [],
    selectedRestaurantId: '',
    markersArray: []
  };

  infoWindow;
  map;

  componentDidMount() {
    this.getRestaurants()
  }

  renderMap = () => {
    //passes Google Maps my API key
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAgXzDKjlWqOt-iPr3sJvcZuCIXbuQ4LlM&callback=initMap')
    window.initMap = this.initMap
    console.log('Map Rendered!')
  }

  initMap = () => {
    //initialize the map
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.8706391, lng: -104.770058},
      zoom: 10.83
    })

    this.infoWindow = new window.google.maps.InfoWindow({
      maxWidth: 200
    })

    let markers = [];

    this.state.restaurants.forEach(myRestaurant => {

      let contentInfo = this.makeContentInfo(myRestaurant);
      let marker = this.makeMarker(myRestaurant);
      markers.push(marker);

      //Creates an event listener for each Marker
      marker.addListener('click', () => {
        this.openMarker(myRestaurant, marker, contentInfo);
      })
    })

    this.setState({markersArray: markers});

    // Removes the highlighting on the restaurant list item when the content info is closed
    window.google.maps.event.addListener(this.infoWindow, 'closeclick', () => {
      this.state.markersArray.forEach(marker => {
        this.bounceOff(marker);
      })
      let selectedElement = document.getElementsByClassName('selected')[0];
      selectedElement.classList.remove('selected');
      this.setState({selectedRestaurantId: ''});
   })
  }

  //function that makes the restaurant content info string
  makeContentInfo = (restaurant) => {
    return '<div className="content">' +
      '<div className="siteNotice">' +
      '</div>' +
      '<h2 id="firstHeading className="firstHeading">' + restaurant.venue.name + '</h2>' +
      '<div className="bodyContent">' +
        '<p><strong>Location: </strong><br>' +
        restaurant.venue.location.formattedAddress[0] + '<br>' +
        restaurant.venue.location.formattedAddress[1] + '<br>' +
        restaurant.venue.location.formattedAddress[2] + '</p>' +
        '</div>' +
        '</div>';
      }

  //Funcion that creates a marker for each restaurant location
  makeMarker = (restaurant) => {
    return new window.google.maps.Marker({
      position: {lat: restaurant.venue.location.lat, lng: restaurant.venue.location.lng},
      map: this.map,
      title: restaurant.venue.name,
      animation: null,
      restaurantId: restaurant.venue.id
    })
  }

  //Function that turns on the bounce animation on a selected marker
  bounceOn = (marker) => {
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
  }

  //Function that turns off the bounce animation on a deselected marker
  bounceOff = (marker) => {
    marker.setAnimation(null);
  }

  //Function that opens the marker for a restaurant
  openMarker = (restaurant, marker, contentInfo) => {
    this.state.markersArray.forEach(m => {
        if (m !== marker) {
          this.bounceOff(m);
      }
    });
    this.infoWindow.setContent(contentInfo);
    this.infoWindow.open(this.map, marker);
    this.bounceOn(marker);
    this.setState({ selectedRestaurantId: restaurant.venue.id});
  }

  //Function that retrieves restaurant information from FourSquare
  getRestaurants = () => {
    //Creates Endpoint and Query Parameters
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?'
    const parameters = {
      client_id: '0SV2TNKYX2QKFWQFYNPJN2D3MVL1DQ4FGWB2HUHODSGFZT1O',
      client_secret: 'N5ZNTGGYEVKPMT2YPUQYQCZJIFOGGGJKGSLGANFJVMJ2EZKS',
      query: 'sushi',
      near: 'Colorado Springs, CO',
      v: '20181006'
    }

    //Uses Axios to query foursquare api
    //Axios processes http get requests
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          restaurants: response.data.response.groups[0].items
        //calls render map
        }, this.renderMap())
      })
      .catch(error => {
        console.log('Error: '+ error)
      })
  }


  render() {
    return (
      <div className='wholePage'>
        <div className='headersBar'>
          <div className="menu">
            <HamburgerMenu />
          </div>
          <div className="app-title">
            <h1>Hannah&#39;s Favorite Sushi Restaurants</h1>
          </div>
        </div>
        <div className='app-window'>
          <SideNav
            restaurants={this.state.restaurants}
            selectedRestaurantId={this.state.selectedRestaurantId}
            markersArray={this.state.markersArray}
            makeContentInfo={this.makeContentInfo}
            makeMarker={this.makeMarker}
            openMarker={this.openMarker}/>
          <div id='map' />
        </div>
      </div>
    );
  }
}

function loadScript (url) {
  const index = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
