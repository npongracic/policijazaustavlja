import firebase from 'firebase';

class Backend {
  uid = '';
  locationsRef = null;
  // initialize Firebase Backend
  constructor() {
    firebase.initializeApp({
      apiKey: 'AIzaSyDhEc0q4nBrXTS9MwGYYYUxEqhf6QzP1_Y',
      authDomain: 'policijazaustavlja-8a754.firebaseapp.com',
      databaseURL: 'https://policijazaustavlja-8a754.firebaseio.com/',
      storageBucket: '',
    });

    firebase.auth().signInAnonymously().catch((error) => {
        alert(error.message);
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user);
            // User is signed in.
            this.uid = user.uid;
            // ...
        } else {
            // User is signed out.
            // ...
        }
        // ...
    });
  }

  setUid(value) {
    this.uid = value;
  }
  getUid() {
    return this.uid;
  }

  removeLocation(locations) {
    console.log(locations);
    if (!Array.isArray(locations)) {
        locations = [locations];
    }

    for(var i = 0; i < locations.length; i++) {
        this.locationsRef.child(locations[i]._id).remove();
    }
  }

  // retrieve the messages from the Backend
  loadLocations(callback) {
    this.locationsRef = firebase.database().ref('police');
    this.locationsRef.off();

    const onReceive = (data) => {
      const message = data.val();
      
      console.log("Load locations:");
      console.log(message);

      var items = [];
      data.forEach((child) => {
          var message = child.val();
          items.push({
            _id: child.key,
            key: child.key + Date.now(),
            coordinates: {
                latitude: message.latitude,
                longitude: message.longitude,
            },
            title: message.name
          });

      });

      callback(items);
      
    };

    this.locationsRef.limitToLast(20).on('value', onReceive);
    //this.locationsRef.limitToLast(20).on('child_removed', onReceive);
  }
  // send the message to the Backend
  sendLocation(location) {
      this.locationsRef.push(location);
  }
  // close the connection to the Backend
  close() {
    if (this.locationsRef) {
      this.locationsRef.off();
    }
  }
}

export default new Backend();