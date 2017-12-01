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

  // retrieve the messages from the Backend
  loadLocations(callback) {
    this.locationsRef = firebase.database().ref('police');
    this.locationsRef.off();

    const onReceive = (data) => {
      const message = data.val();
      //console.log(message);
      callback({
        _id: data.key + Date.now(),
        key: data.key + Date.now(),
        coordinates: {
            latitude: message.latitude,
            longitude: message.longitude,
        },
        title: message.name
      });
    };

    this.locationsRef.limitToLast(20).on('child_added', onReceive);
  }
  // send the message to the Backend
  sendLocation(location) {
    for (let i = 0; i < location.length; i++) {
        /*
      this.locationsRef.push({
        text: message[i].text,
        user: message[i].user,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });*/
    }
  }
  // close the connection to the Backend
  close() {
    if (this.locationsRef) {
      this.locationsRef.off();
    }
  }
}

export default new Backend();