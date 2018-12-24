import React, { Component } from 'react';
import axios from 'axios';

import './App.css';
import SideNav from './components/SideNav.js';
import './components/SideNav.css';
import HamburgerMenu from './components/HamburgerMenu.js';
import './components/HamburgerMenu.css';

import AstroMapMarker from './images/map-marker-small.svg';

class App extends Component {

//various states
  state = {
    restaurants: [],
    visibleRestaurants: [],
    selectedRestaurantId: '',
    markersArray: []
  };

  infoWindow;
  map;

  componentDidMount() {
    this.getRestaurants();
  }

  renderMap = () => {
    //passes Google Maps my API key
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAgXzDKjlWqOt-iPr3sJvcZuCIXbuQ4LlM&callback=initMap')
    window.initMap = this.initMap
  }

  initMap = () => {
    //initialize the map
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.8706391, lng: -104.770058},
      zoom: 10.83,
      styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    })

    this.infoWindow = new window.google.maps.InfoWindow({
      maxWidth: 200
    })
    //array of markers
    let markers = [];
    //creates a marker and content info variable
    this.state.restaurants.forEach(myRestaurant => {

      let contentInfo = this.makeContentInfo(myRestaurant);
      let marker = this.makeMarker(myRestaurant);
      markers.push(marker);

      //Creates an event listener for each Marker
      marker.addListener('click', () => {
        this.openMarker(myRestaurant, marker, contentInfo);
      })
    })
    //sets the state of the markers
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

  //function that updates restaurant visibility array in state
  relevantRestaurants = (updatedRestaurants) => {
    this.setState({visibleRestaurants: updatedRestaurants});
  }

  //function that makes the restaurant content info string
  makeContentInfo = (restaurant) => {
    return '<div className="content">' +
      '<div className="siteNotice">' +
      '</div>' +
      '<h2 id="firstHeading className="firstHeading" tabindex="3" aria-label="restaurant name">' + restaurant.venue.name + '</h2>' +
      '<div className="bodyContent">' +
      '<p tabindex="4" aria-label="restaurant location"><strong>Location: </strong><br>' +
      restaurant.venue.location.formattedAddress[0] + '<br>' +
      restaurant.venue.location.formattedAddress[1] + '<br>' +
      restaurant.venue.location.formattedAddress[2] + '</p>' +
      '<div className="attribution"> <img src="https://i.ibb.co/nC4Rxqx/Foursquare-City-Guide-Android.png" alt="four square logo" tabindex="5"/> </div>' +
      '</div>' +
      '</div>';
      }

  //Funcion that creates a marker for each restaurant location
  makeMarker = (restaurant) => {
    return new window.google.maps.Marker({
      position: {lat: restaurant.venue.location.lat, lng: restaurant.venue.location.lng},
      map: this.map,
      icon: AstroMapMarker,
      //size: new window.google.maps.Size(4,7),
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
          restaurants: response.data.response.groups[0].items,
          visibleRestaurants: response.data.response.groups[0].items
        //calls render map
        }, this.renderMap())
      })
      //catches the possible errors and logs them to the console
      .catch(error => {
        console.log('Error: '+ error)
      })
  }


  render() {
    return (
      <div className='wholePage'>
        <div className='headersBar'>
          <div className="menu">
            <HamburgerMenu tabindex="2" role="menu" aria-label="menu"/>
          </div>
          <div className="app-title">
            <h1 tabindex="1">Hannah&#39;s Favorite Sushi Restaurants</h1>
          </div>
        </div>
        <div className='app-window'>
          <SideNav
            restaurants={this.state.restaurants}
            visibleRestaurants={this.state.visibleRestaurants}
            selectedRestaurantId={this.state.selectedRestaurantId}
            markersArray={this.state.markersArray}
            makeContentInfo={this.makeContentInfo}
            makeMarker={this.makeMarker}
            openMarker={this.openMarker}
            relevantRestaurants={this.relevantRestaurants}/>
          <div id='map' />
        </div>
      </div>
    );
  }
}

//Forms API call for Google maps
//obtained from https://github.com/VolantTyler/tjs-react-neighborhood-map-v2/blob/master/src/App.js
function loadScript (url) {
  const index = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
