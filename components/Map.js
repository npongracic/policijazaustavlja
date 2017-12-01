import React, { Component } from 'react';
import MapView from 'react-native-maps';
import Backend from '../Backend';
import geolib from 'geolib';

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

const earthRadiusInKM = 6371;
const radiusInKM = 3;
const aspectRatio = 1;

var watchID = null;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  theCopsButton: {
    backgroundColor: '#03a9f4',
    padding: 20,
  },
  theCopsButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  allClearButton: {
    backgroundColor: '#66bb6a',
    padding: 20,
  },
  allClearButtonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default class Map extends Component<{}> {
  constructor(props) {
    super(props);

    // Bjelovar centar svijeta
    this.state = {
      region : {
        latitude: 45.897630,
        longitude: 16.840130
      },
      differentValue: "old",
      markers: [],
      showPoliceAlert: true
    };

  }

  deg2rad (angle) {
      return angle * 0.017453292519943295 // (angle / 180) * Math.PI;
  }

  rad2deg (angle) {
      return angle * 57.29577951308232 // angle / Math.PI * 180
  }

  // you need to invoke this method to update your map's region.
  showRegion(locationCoords) {
      if (locationCoords && locationCoords.latitude && locationCoords.longitude) {
          var radiusInRad = radiusInKM / earthRadiusInKM;
          var longitudeDelta = this.rad2deg(radiusInRad / Math.cos(this.deg2rad(locationCoords.latitude)));
          var latitudeDelta = aspectRatio * this.rad2deg(radiusInRad);

          this.setState((oldState) => {
            return { ...oldState,  ...{ region: { 
                latitude: locationCoords.latitude, 
                longitude: locationCoords.longitude, 
                latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta 
              }
            }}
          });
      }
  }


  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      this.showRegion({longitude: position.coords.longitude, latitude: position.coords.latitude});
    }, (error) => {
        alert(JSON.stringify(error))
    }, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
    });
  }

  append(currentLocations = [], locations) {
    if (!Array.isArray(locations)) {
      locations = [locations];
    }
    return locations.concat(currentLocations);
  }

  componentWillMount() {
    this.showRegion({
      latitude: 45.897630,
      longitude: 16.840130
    });

    this.getUserLocation();
    Backend.loadLocations((locations) => {
      this.setState((oldState) => {
        return {
          ...oldState,
          ...{ markers: locations }
        }
      });
    });

    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.state.markers.forEach((marker) => {
        var distance = geolib.getDistance(position.coords, marker.coordinates);
        console.log(distance);
        if(distance < 1000) {
          if(this.state.showPoliceAlert) {
            alert('Policija u blizini!');
          }
        }
      });
    }, (error) => {
        alert(JSON.stringify(error))
    }, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 50
    });
  }

  componentWillUnmount() {
    Backend.close();
    if(this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }
  }

  clearPolice() {
    this.newState({showPoliceAlert: false});

    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);

      var locations = this.state.markers.filter((marker) => {
        var dist = geolib.getDistance(position.coords, marker.coordinates);
        console.log("Udaljenost je:" + dist);
        return  dist <= 1000;

      });
      Backend.removeLocation(locations);
      this.setState((oldState) => {
        return { ...oldState,  ...{ showPoliceAlert: true }}
      });
    }, (error) => {
        alert(JSON.stringify(error));
        this.setState((oldState) => {
          return { ...oldState,  ...{ showPoliceAlert: true }}
        });
    }, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
    });
  }

  newState(state) {
    this.setState((oldState) => {
      return { ...oldState,  ...state}
    });
  }

  reportPolice() {
    this.newState({showPoliceAlert: false});
    console.log(this.state);
 
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      var key = 'AIzaSyCKtwSeiP3GbZJIVZ3A0Wi3ziLRB-MJe_I';

      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&latlng=${position.coords.latitude},${position.coords.longitude}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.status !== 'OK') {
              throw new Error(`Geocode error: ${json.status}`);
            }
  
            Backend.sendLocation({
              name: json.results[0].formatted_address,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });

            //console.log(json);
            this.newState({showPoliceAlert: true});
            //return json;
          });


    }, (error) => {
        alert(JSON.stringify(error));
        this.setState((oldState) => {
          return { ...oldState,  ...{ showPoliceAlert: true }}
        });
    }, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
    });

   
  }

  render() {
    return(
      <View style={styles.container}>
        <MapView style={styles.map}
          region={this.state.region}>
          {this.state.markers.map(marker => (
            <MapView.Marker 
              coordinate={marker.coordinates}
              title={marker.title}
              key={marker.key}
            />
          ))}
        </MapView>
        <TouchableOpacity style={styles.theCopsButton} activeOpacity={0.8}
          onPress={() => this.reportPolice()}>
          <Text style={styles.theCopsButtonText}>Policija!!!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allClearButton} activeOpacity={0.8}
        onPress={() => this.clearPolice()}>
          <Text style={styles.allClearButtonText}>Sve čisto!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
