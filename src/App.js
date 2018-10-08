import React, { Component } from 'react';
import axios from 'axios';

import './App.css';
import SideNav from './components/SideNav.js';
import HamburgerMenu from './components/HamburgerMenu.js';
import './components/HamburgerMenu.css';



class App extends Component {

  state = {
    restaurants: []
  }

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
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.8706391, lng: -104.770058},
      zoom: 10.83
    })

    let infoWindow = new window.google.maps.InfoWindow({
      maxWidth: 200
    })

    this.state.restaurants.forEach(myRestaurant => {
      //restaurant content info string
      let contentInfo =
        '<div className="content">' +
          '<div className="siteNotice">' +
          '</div>' +
          '<h2 id="firstHeading className="firstHeading">' + myRestaurant.venue.name + '</h2>' +
          '<div className="bodyContent">' +
            '<p><strong>Location: </strong><br>' +
            myRestaurant.venue.location.formattedAddress[0] + '<br>' +
            myRestaurant.venue.location.formattedAddress[1] + '<br>' +
            myRestaurant.venue.location.formattedAddress[2] + '</p>' +
            /*myRestaurant.venue.delivery ?
              '<p><strong>Delivery:  </strong><br>' +
              myRestaurant.venue.delivery +
              '</p>' : '' +*/
          '</div>' +
        '</div>';

      //Create a marker for each restaurant location
      const marker = new window.google.maps.Marker({
        position: {lat: myRestaurant.venue.location.lat, lng: myRestaurant.venue.location.lng},
        map: map,
        title: myRestaurant.venue.name,
      })

      //Creates an event listener for each Marker
      marker.addListener('click', ()=> {
        infoWindow.setContent(contentInfo);
        infoWindow.open(map,marker)
      })
    })
  }

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
        console.log(response)
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
          <SideNav />
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
