  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyDmITCvTFr4KW2LhEzccA6JelMMc0cC9rs",
      authDomain: "train-a4754.firebaseapp.com",
      databaseURL: "https://train-a4754.firebaseio.com",
      projectId: "train-a4754",
      storageBucket: "train-a4754.appspot.com",
      messagingSenderId: "174134368955"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // 2. Button for adding trains
  $("#search").on("click", function(event) {
      event.preventDefault();

      // Grabs user input
      var trainName = $("#trainName").val().trim();
      var trainDestination = $("#trainDestination").val().trim();
      console.log(moment($("#firstTrain").val().trim()), "firstTrain")
      var firstTrain = moment($("#firstTrain").val().trim(), "HH:mm").format("X");
      var frequency = $("#frequency").val().trim();

      // Creates local "temporary" object for holding train data
      var newTrain = {
          trainName: trainName,
          trainDestination: trainDestination,
          firstTrain: firstTrain,
          frequency: frequency
      };

      // Uploads train data to the database
      database.ref().push(newTrain);

      // Logs everything to console
      console.log(newTrain.trainName);
      console.log(newTrain.trainDestination);
      console.log(newTrain.firstTrain);
      console.log(newTrain.frequency);

      alert("Train stop successfully added");

      // Clears all of the text-boxes
      $("#trainName").val("");
      $("#trainDestination").val("");
      $("#firstTrain").val("");
      $("#frequency").val("");
  });

  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val(), 'snapShot');

      // Store everything into a variable.
      var trainName = childSnapshot.val().trainName;
      var trainDestination = childSnapshot.val().trainDestination;
      var firstTrain = childSnapshot.val().firstTrain;
      var frequency = childSnapshot.val().frequency;

      // Train Info
      console.log(trainName);
      console.log(trainDestination);
      console.log(firstTrain);
      console.log(frequency);

      // Prettify the train start
      var firstTrainPretty = moment.unix(firstTrain).format("HH:mm");

      // Calculate the minutes between each stop using hardcore math
      // To calculate the minutes away
      var trainMinutes = moment().diff(moment(firstTrain, "X"), "minutes");
      console.log(trainMinutes, "trainMinutes");

      // Calculate the new arrival time
      // Assumptions
      var tFrequency = 5;

      // Time is 4:30 AM
      var firstTime = firstTrain;

      // First Time (pushed back 5 minutes to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      console.log(diffTime % tFrequency)
      var tRemainder = diffTime % tFrequency;
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      // Create the new row
      var newRow = $("<tr>").append(
          $("<td>").text(trainName),
          $("<td>").text(trainDestination),
          $("<td>").text(firstTrainPretty),
          $("<td>").text(trainMinutes),
          $("<td>").text(frequency),

      );

      // Append the new row to the table
      $("#train-schedule > tbody").append(newRow);
  });