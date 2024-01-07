//-------------------------------------------------------------------------------------------------------------
/// Configure your settings here:

const serverURL = window.location.hostname; // IP of the computer running this dashboard

// Note: If set to 127.0.0.1 you will not be able to view your plate image, weight or total prints.
//       Those features will only work if viewing the dashboard locally.

//-------------------------------------------------------------------------------------------------------------

// -- Dont touch below

// BambuBoard
// TZ | 11/20/23

let currentState = "OFF";
let modelImage = "";
const consoleLogging = false;
let telemetryObjectMain;

async function retrieveData() {
  // Setting: Point this URL to your local server that is generating the telemetry data from Bambu
  const response = await fetch(
    "http://" + serverURL + ":" + window.location.port + "/data.json"
  );

  let data = await response.text();
  let telemetryObject = JSON.parse(data);

  if (telemetryObject.print && "gcode_state" in telemetryObject.print) {
    currentState = telemetryObject.print.gcode_state;
    telemetryObject = telemetryObject.print;
  } else if (telemetryObject.print) {
    telemetryObject = "Incomplete";
  } else {
    telemetryObject = null;
  }

  return telemetryObject;
}

async function updateAMS(telemetryObject) {
  /// AMS

  // Tray 1

  var tray1Color = telemetryObject.ams.ams[0].tray[0].tray_color;
  var tray1Material = telemetryObject.ams.ams[0].tray[0].tray_sub_brands;
  var tray1FilamentType = telemetryObject.ams.ams[0].tray[0].tray_type;
  var tray1Type = "";
  var tray1UID = telemetryObject.ams.ams[0].tray[0].tag_uid;
  var tray1Remaining = telemetryObject.ams.ams[0].tray[0].remain;

  if (!tray1Remaining) {
    $("#tray1Remaining").text("Unknown");
    $("#tray1ProgressBar").css("background-color", "grey");
  } else {
    if (!tray1FilamentType) {
      tray1FilamentType = "Unknown";
    }

    log(tray1Color);
    $("#tray1Color").css("background-color", "#" + tray1Color);
    $("#tray1Material").text(tray1Material);

    if (!tray1UID) {
      tray1Type = tray1FilamentType;
    } else if (tray1UID === "0000000000000000") {
      tray1Type = "Unknown • " + tray1FilamentType;
    } else {
      tray1Type = "Bambu • " + tray1FilamentType;
    }

    $("#tray1Type").text(tray1Type);
    $("#tray1Remaining").text(tray1Remaining + "%");
    let tray1ProgressBarParent = $("#tray1ProgressBarParent").width();
    if (tray1Remaining < 0) {
      tray1Remaining = 0;
    }
    $("#tray1ProgressBar").width(
      (tray1Remaining * tray1ProgressBarParent) / 100
    );

    if (tray1Remaining >= 20) {
      $("#tray1ProgressBar").css("background-color", "#51a34f");
    } else if (tray1Remaining > 10) {
      $("#tray1ProgressBar").css("background-color", "yellow");
    } else if (tray1Remaining > 2) {
      $("#tray1ProgressBar").css("background-color", "red");
    } else if (tray1Remaining === -1) {
      $("#tray1Remaining").text("Unknown");
      $("#tray1ProgressBar").css("background-color", "grey");
    } else {
      $("#tray1Remaining").text("LOW");
      $("#tray1ProgressBar").css("background-color", "red");
    }

    if (currentState !== "RUNNING") {
      $("#tray1ProgressBar").css("background-color", "grey");
    }
  }
  // Tray 2

  var tray2Color = telemetryObject.ams.ams[0].tray[1].tray_color;
  var tray2Material = telemetryObject.ams.ams[0].tray[1].tray_sub_brands;
  var tray2FilamentType = telemetryObject.ams.ams[0].tray[1].tray_type;
  var tray2Type = "";
  var tray2UID = telemetryObject.ams.ams[0].tray[1].tag_uid;
  var tray2Remaining = telemetryObject.ams.ams[0].tray[1].remain;

  if (!tray2Remaining) {
    $("#tray2Remaining").text("Unknown");
    $("#tray2ProgressBar").css("background-color", "grey");
  } else {
    if (!tray2FilamentType) {
      tray2FilamentType = "Unknown";
    }

    log(tray2Color);
    $("#tray2Color").css("background-color", "#" + tray2Color);
    $("#tray2Material").text(tray2Material);

    if (!tray2UID) {
      tray2Type = tray2FilamentType;
    } else if (tray2UID === "0000000000000000") {
      tray2Type = "Unknown • " + tray2FilamentType;
    } else {
      tray2Type = "Bambu • " + tray2FilamentType;
    }

    $("#tray2Type").text(tray2Type);
    $("#tray2Remaining").text(tray2Remaining + "%");
    let tray2ProgressBarParent = $("#tray2ProgressBarParent").width();
    if (tray2Remaining < 0) {
      tray2Remaining = 0;
    }
    $("#tray2ProgressBar").width(
      (tray2Remaining * tray2ProgressBarParent) / 100
    );

    if (tray2Remaining >= 20) {
      $("#tray2ProgressBar").css("background-color", "#51a34f");
    } else if (tray2Remaining > 10) {
      $("#tray2ProgressBar").css("background-color", "yellow");
    } else if (tray2Remaining > 2) {
      $("#tray2ProgressBar").css("background-color", "red");
    } else if (tray2Remaining === -1) {
      $("#tray2Remaining").text("Unknown");
      $("#tray2ProgressBar").css("background-color", "grey");
    } else {
      $("#tray2Remaining").text("LOW");
      $("#tray2ProgressBar").css("background-color", "red");
    }

    if (currentState !== "RUNNING") {
      $("#tray2ProgressBar").css("background-color", "grey");
    }
  }

  // Tray 3

  var tray3Color = telemetryObject.ams.ams[0].tray[2].tray_color;
  var tray3Material = telemetryObject.ams.ams[0].tray[2].tray_sub_brands;
  var tray3FilamentType = telemetryObject.ams.ams[0].tray[2].tray_type;
  var tray3Type = "";
  var tray3UID = telemetryObject.ams.ams[0].tray[2].tag_uid;
  var tray3Remaining = telemetryObject.ams.ams[0].tray[2].remain;

  // Does not exist
  if (!tray3Remaining) {
    $("#tray3Remaining").text("Unknown");
    $("#tray3ProgressBar").css("background-color", "grey");
  } else {
    if (!tray3FilamentType) {
      tray3FilamentType = "Unknown";
    }

    log(tray3Color);
    $("#tray3Color").css("background-color", "#" + tray3Color);
    $("#tray3Material").text(tray3Material);

    if (!tray3UID) {
      tray3Type = tray3FilamentType;
    } else if (tray3UID === "0000000000000000") {
      tray3Type = "Unknown • " + tray3FilamentType;
    } else {
      tray3Type = "Bambu • " + tray3FilamentType;
    }

    $("#tray3Type").text(tray3Type);
    $("#tray3Remaining").text(tray3Remaining + "%");
    let tray3ProgressBarParent = $("#tray3ProgressBarParent").width();
    if (tray3Remaining < 0) {
      tray3Remaining = 0;
    }
    $("#tray3ProgressBar").width(
      (tray3Remaining * tray3ProgressBarParent) / 100
    );

    if (tray3Remaining >= 20) {
      $("#tray3ProgressBar").css("background-color", "#51a34f");
    } else if (tray3Remaining > 10) {
      $("#tray3ProgressBar").css("background-color", "yellow");
    } else if (tray3Remaining > 2) {
      $("#tray3ProgressBar").css("background-color", "red");
    } else if (tray3Remaining === -1) {
      $("#tray3Remaining").text("Unknown");
      $("#tray3ProgressBar").css("background-color", "grey");
    } else {
      $("#tray3Remaining").text("LOW");
      $("#tray3ProgressBar").css("background-color", "red");
    }

    if (currentState !== "RUNNING") {
      $("#tray3ProgressBar").css("background-color", "grey");
    }
  }
  // Tray 4

  var tray4Color = telemetryObject.ams.ams[0].tray[3].tray_color;
  var tray4Material = telemetryObject.ams.ams[0].tray[3].tray_sub_brands;
  var tray4FilamentType = telemetryObject.ams.ams[0].tray[3].tray_type;
  var tray4Type = "";
  var tray4UID = telemetryObject.ams.ams[0].tray[3].tag_uid;
  var tray4Remaining = telemetryObject.ams.ams[0].tray[3].remain;

  if (!tray4Remaining) {
    $("#tray4Remaining").text("Unknown");
    $("#tray4ProgressBar").css("background-color", "grey");
  } else {
    if (!tray4FilamentType) {
      tray4FilamentType = "Unknown";
    }

    log(tray4Color);
    $("#tray4Color").css("background-color", "#" + tray4Color);
    $("#tray4Material").text(tray4Material);

    if (!tray4UID) {
      tray4Type = tray4FilamentType;
    } else if (tray4UID === "0000000000000000") {
      tray4Type = "Unknown • " + tray4FilamentType;
    } else {
      tray4Type = "Bambu • " + tray4FilamentType;
    }

    $("#tray4Type").text(tray4Type);
    $("#tray4Remaining").text(tray4Remaining + "%");
    let tray4ProgressBarParent = $("#tray4ProgressBarParent").width();
    if (tray4Remaining < 0) {
      tray4Remaining = 0;
    }
    $("#tray4ProgressBar").width(
      (tray4Remaining * tray4ProgressBarParent) / 100
    );

    if (tray4Remaining >= 20) {
      $("#tray4ProgressBar").css("background-color", "#51a34f");
    } else if (tray4Remaining > 10) {
      $("#tray4ProgressBar").css("background-color", "yellow");
    } else if (tray4Remaining > 2) {
      $("#tray4ProgressBar").css("background-color", "red");
    } else if (tray4Remaining === -1) {
      $("#tray4Remaining").text("Unknown");
      $("#tray4ProgressBar").css("background-color", "grey");
    } else {
      $("#tray4Remaining").text("LOW");
      $("#tray4ProgressBar").css("background-color", "red");
    }

    if (currentState !== "RUNNING") {
      $("#tray4ProgressBar").css("background-color", "grey");
    }
  }

  // AMS active
  var amsActiveTrayValue = telemetryObject.ams.tray_now;
  log("AMS Active tray: " + amsActiveTrayValue);

  $("#tray1Active").hide();
  $("#tray2Active").hide();
  $("#tray3Active").hide();
  $("#tray4Active").hide();

  if (currentState !== "RUNNING") {
    $("#tray1Active").css("background-color", "grey");
    $("#tray2Active").css("background-color", "grey");
    $("#tray3Active").css("background-color", "grey");
    $("#tray4Active").css("background-color", "grey");
  } else {
    $("#tray1Active").css("background-color", "#51a34f");
    $("#tray2Active").css("background-color", "#51a34f");
    $("#tray3Active").css("background-color", "#51a34f");
    $("#tray4Active").css("background-color", "#51a34f");
  }

  if (amsActiveTrayValue === null) {
  } else if (amsActiveTrayValue === 255) {
  } else if (amsActiveTrayValue === "0") {
    $("#tray1Active").show();
  } else if (amsActiveTrayValue === "1") {
    $("#tray2Active").show();
  } else if (amsActiveTrayValue === "2") {
    $("#tray3Active").show();
  } else if (amsActiveTrayValue === "3") {
    $("#tray4Active").show();
  }
}

function disableUI() {
  $("#tray1ProgressBar").css("background-color", "grey");
  $("#tray2ProgressBar").css("background-color", "grey");
  $("#tray3ProgressBar").css("background-color", "grey");
  $("#tray4ProgressBar").css("background-color", "grey");
  $("#tray1Active").hide();
  $("#tray2Active").hide();
  $("#tray3Active").hide();
  $("#tray4Active").hide();
  $("#tray1Active").css("background-color", "grey");
  $("#tray2Active").css("background-color", "grey");
  $("#tray3Active").css("background-color", "grey");
  $("#tray4Active").css("background-color", "grey");
}

function log(logText) {
  if (consoleLogging) {
    console.log(logText);
  }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// Call the updateLog function to fetch and parse the data
setInterval(async () => {
  try {
    var telemetryObject = await retrieveData();
    telemetryObjectMain = telemetryObject;
    if (telemetryObject != null) {
      if (telemetryObject != "Incomplete") {
        await updateAMS(telemetryObject);
      }
    } else if (telemetryObject != "Incomplete") {
      // Data is incomplete, but we did get something, just skip for now
    } else {
      disableUI();
    }
  } catch (error) {
    //console.error(error);
    await sleep(1000);
  }
}, 1000);
