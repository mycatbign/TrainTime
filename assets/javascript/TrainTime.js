$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA_4LU-iaooUVHeD5X0UAw5rsvsjLCaLSY",
        authDomain: "traintime-c9e2c.firebaseapp.com",
        databaseURL: "https://traintime-c9e2c.firebaseio.com",
        projectId: "traintime-c9e2c",
        storageBucket: "traintime-c9e2c.appspot.com",
        messagingSenderId: "49023501433"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    // when a new train is added it is added to the database as an object
    $("#addTrain").on("click", function () {
        event.preventDefault();
        var trainObj = {};
        trainObj.name = $("#trainName").val().trim();
        trainObj.destination = $("#trainDestination").val().trim();
        // store first train time in epoch time
        trainObj.first = moment($("#firstTrainTime").val().trim(), "HH:mm").format("X");
        trainObj.frequency = $("#trainFrequency").val().trim();
        database.ref().push({
            name: trainObj.name,
            destination: trainObj.destination,
            first: trainObj.first,
            frequency: trainObj.frequency
        });
    });

    // print out the train schedule
    function updateTrainSchedule(train) {

        // create a list element to add to the table
        var tbody = $("#currentTrainSchedule");
        var tr = $("<tr>");
        tbody.append(tr);

        // add the train name to DOM    
        var td = $("<td>");
        td.text(train.name);
        tr.append(td);

        // add train destination to DOM
        td = $("<td>");
        td.text(train.destination);
        tr.append(td);

        // add train frequency to DOM
        td = $("<td>");
        td.text(train.frequency);
        tr.append(td);

        // set up variables to compute next train time and minutes to next train
        var frequency = train.frequency;
        var firstTime = train.first;
        firstTime = moment(firstTime, "hh:mm").subtract(1, "years").format("X");
        // turn first train in to unix time stamp
        var trainTime = moment.unix(firstTime);
        // calculate difference between now and first train
        var difference = moment().diff(moment(trainTime), "minutes");
        // time to next train
        var trainRemain = difference % frequency;
        // minutes until next train arrives
        var minUntil = frequency - trainRemain;
        // calculate next train time
        var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');

        // add next train time to DOM
        td = $("<td>");
        td.text(nextArrival);
        tr.append(td);

        // add how many minutes out the train is
        td = $("<td>");
        td.text(minUntil);
        tr.append(td);
    };

    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        var trainObj = {};
        trainObj.name = childSnapshot.val().name;
        trainObj.destination = childSnapshot.val().destination;
        trainObj.first = childSnapshot.val().first;
        trainObj.frequency = childSnapshot.val().frequency;
        // update the train schedule whenever another train is added
        updateTrainSchedule(trainObj);
    });

    function refreshSchedule() {
        var trainObj = {};
        trainObj.name = childSnapshot.val().name;
        trainObj.destination = childSnapshot.val().destination;
        trainObj.first = childSnapshot.val().first;
        trainObj.frequency = childSnapshot.val().frequency;
        // update the train schedule 
        updateTrainSchedule(trainObj);
    }

    // set a timer to update the train schedule
    var counter = setInterval(refreshSchedule, 60000);

});

