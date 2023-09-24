var map;
var res = { prev: null };
var marker;
const routePath = [
  "Tamilnadu Agricultural University Main Gate,2W7M+CX P N Pudur, Tamil Nadu, India",
  "M.C. Complex,2W7Q+9V Coimbatore, Tamil Nadu, India",
  "Lawley Road Bus Stop,2W7R+JP Coimbatore, Tamil Nadu, India",
  "Government College of Technology, Bus Station, Coimbatore",
  "Venkitapuram Bus Station,Janaki Nagar, Kuppakonam Pudur, Coimbatore, Tamil Nadu 641038",
  "Saibaba Colony Bus Stop, 2XG2+QF Coimbatore, Tamil Nadu",
  "Sivananda Colony Bus Stop, Coimbatore",
  "Power House Bus Stop, Coimbatore",
  "Karpagam Bus Stop, Coimbatore",
  "Kalyan Bus Stop,2XC9+34 Coimbatore, Tamil Nadu, India",
  "G.P. Hospital,2X9C+X7 Coimbatore, Tamil Nadu, India",
];
// const revRoutePath=routePath.reverse();
// Async function to demonstrate setTimeout with async/await
var rint;
function delayedExecution() {
  min = Math.ceil(25);
  max = Math.floor(27);
  rint = Math.floor(Math.random() * (max - min)) + min;
  setInterval(async() => {
    rint++;
  }, 60000);
  // await new Promise(resolve => setTimeout(resolve, 60000));
  // You can continue with your asynchronous code here
}

// Call the async function

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: 11.0310248, lng: 76.9047783 },
    zoom: 13,
    mapId: "4504f8b37365c3d0",
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road.local",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "transit.station.bus",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
    ],
    // mapTypeId: google.maps.MapTypeId.SATELLITE
  });
  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);
}
async function plotCords(from, to) {
  const GCT = new google.maps.LatLng(11.019588, 76.938453);
  const Gandhipuram = new google.maps.LatLng(11.0164479, 76.9689813);
  // const {TransitMode} = await google.maps.importLibrary("routes")
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var request = {
    origin: from,
    destination: to,
    travelMode: google.maps.TravelMode["TRANSIT"],
    transitOptions: {
      // departureTime: new Date(Date.now() ),
      modes: [google.maps.TransitMode.BUS],
    },
    provideRouteAlternatives: true,
  };
  const directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function (directionsResult, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      // console.log(directionsResult);
      directionsRenderer.setDirections(directionsResult);
      // Get the legs property of the DirectionsResult object.
      const routes = directionsResult.routes;
      var rcnt = 0;
      var fix = 0;
      var avl = false;
      var sfix = 0;

      routes.forEach(function (route) {
        rcnt += 1;
        const legs = route.legs;

        // Iterate over the legs property and get the steps property of each leg.
        legs.forEach(function (leg) {
          const steps = leg.steps;
          var scnt = 0;
          // Iterate over the steps property and get the transitDetails property of each step.
          steps.forEach(function (step) {
            scnt += 1;
            try {
              // console.log(step.transit.line.short_name);
              // Display the stop name and arrival time in a console log.
              if (step.transit.line.short_name =="70") {
                fix = rcnt - 1;
                avl = true;
                sfix = scnt - 1;
              }
            } catch (error) {
              // console.log(error);
            }
          });
        });
      });
      // console.log(fix);
      if (avl) {
        directionsRenderer.setRouteIndex(fix);
        directionsRenderer.setMap(map);
        var destTime = document.getElementById("DestTime");
        var arrTime = document.getElementById("ArrTime");
        var step = directionsResult.routes[fix].legs[0].steps[sfix];
        arrTime.innerText = findDifferenceInMinutes(
          step.transit.departure_time.text
        ) -rint;
        
        destTime.innerText =
          step.transit.arrival_time.text +
          "  (" +
          (findDifferenceInMinutes(step.transit.arrival_time.text) -rint)+
          " Min)";
        whereIsMyBus(
          routePath.indexOf(directionsResult.request.origin.query),
          routePath.indexOf(directionsResult.request.destination.query),
          findDifferenceInMinutes(step.transit.arrival_time.text) -rint,step
        );
        res = {
          route: directionsResult.routes[fix],
          prev: directionsRenderer,
          step: sfix,
        };
      }
    }
  });
}

var preStation={"Start":"","Stop":""}

window.onload = function () {

  document
    .getElementById("searchBtn")
    .addEventListener("click", async (event) => {
      try {
        var x = res["prev"];
        x.setMap(null);
      } catch (error) {
        console.log(error);
      }
      var from = document.getElementById("from").value;
      var to = document.getElementById("to").value;
      if (preStation["Start"] !=  from && preStation["Stop"]!=  to) {
        preStation={ "Start": from, "Stop": to }
        delayedExecution();        
      }
      plotCords(from, to);
      console.log(rint);

      // console.log(res);
    });
  
  const offcanvas = new bootstrap.Offcanvas(
    document.getElementById("offcanvasScrolling")
  );
  offcanvas.show();
};

function findDifferenceInMinutes(timeString) {
  const currentDate = new Date(Date.now() );
  const timeObject = new Date();
  const targetTimeArray = timeString.split(":");
  timeObject.setHours(parseInt(targetTimeArray[0], 10));
  timeObject.setMinutes(parseInt(targetTimeArray[1], 10));
  const differenceInMilliseconds = timeObject.getTime() - currentDate.getTime();
  const differenceInMinutes = differenceInMilliseconds / 60000;
  // console.log(differenceInMinutes, timeObject, currentDate);
  const upbus = document.getElementById("upBus");
  upbus.style.display = "block";
  return differenceInMinutes;
}

function findDiff(timeString,timeString2) {
  const timeObject2 = new Date();
  const timeObject = new Date();
  const targetTimeArray = timeString.split(":");
  const targetTimeArray2 = timeString.split(":");
  timeObject2.setHours(parseInt(targetTimeArray2[0], 10));
  timeObject2.setMinutes(parseInt(targetTimeArray2[1], 10));
  timeObject.setHours(parseInt(targetTimeArray[0], 10));
  timeObject.setMinutes(parseInt(targetTimeArray[1], 10));
  const differenceInMilliseconds = timeObject.getTime() - timeObject2.getTime();
  const differenceInMinutes = differenceInMilliseconds / 60000;
  return differenceInMinutes;
}

async function  whereIsMyBus(startL, endL,time) {
  var rind = 1;
  if (time > 10 ) {
    rind = 2;
  }
  if (startL < endL) {
    var path = findPath(routePath[startL - rind], routePath[endL],time)
    console.log(path)
    // geocoder.geocode({address:routePath[startL-rind] }, (results, status) => {
    //   const marker = new AdvancedMarkerElement({
    //     position:results[0].geometry.location ,
    //     map: map,
    //     content: priceTag // Use a property value as the marker title
    //   });
    //   console.log(path)
    //   var k = 0;
    //   setInterval(() => {
    //     if (k < path.lat_lngs.length) {
    //   console.log("Hello")

    //       marker.position = path.lat_lngs[k];
    //     }
    //     k++;
    //   },1000);
    //   console.log(results[0].geometry.location,results[0]);
    // })

  } else {
    var path = findPath(routePath[startL + rind], routePath[endL],time)
    console.log(path)
    // geocoder.geocode({address:routePath[startL+rind] }, (results, status) => {
 
    //   const marker = new AdvancedMarkerElement({
    //     position:results[0].geometry.location ,
    //     map: map,
    //     content: priceTag // Use a property value as the marker title
    //   });
    //   console.log(path.lat_lngs.length,path)
    //   var k = 0;
    //   setInterval(() => {
    //     if (k < path.lat_lngs.length) {
    //       marker.position = path.lat_lngs[k];
    //     }
    //     k++;
    //   },1000);

    // })
  }
}
async function  moveBus(from, path,time)
{
  const geocoder = new google.maps.Geocoder();
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const priceTag = document.createElement("img");
  priceTag.src = ".\.\\static\\assets\\images\\jsTree\\bus.png";
  
  geocoder.geocode({address:from}, (results, status) => {
 
    const marker = new AdvancedMarkerElement({
      position:results[0].geometry.location ,
      map: map,
      content: priceTag // Use a property value as the marker title
    });
    console.log(path.lat_lngs.length,path)
    var k = 0;
    setInterval(() => {
      if (k < path.lat_lngs.length) {
        marker.position = path.lat_lngs[k];
      }
 
      k++;
    },Math.floor(time*60*1000/path.lat_lngs.length));

  })
}
function findPath(from,to,time)
{
  var request = {
    origin: from,
    destination: to,
    travelMode: google.maps.TravelMode["TRANSIT"],
    transitOptions: {
      // departureTime: new Date(Date.now() ),
      modes: [google.maps.TransitMode.BUS],
    },
    provideRouteAlternatives: true,
  };
  const directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function (directionsResult, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      // console.log(directionsResult);
      // directionsRenderer.setDirections(directionsResult);
      // Get the legs property of the DirectionsResult object.
      const routes = directionsResult.routes;
      var rcnt = 0;
      var fix = 0;
      var avl = false;
      var sfix = 0;

      routes.forEach(function (route) {
        rcnt += 1;
        const legs = route.legs;

        // Iterate over the legs property and get the steps property of each leg.
        legs.forEach(function (leg) {
          const steps = leg.steps;
          var scnt = 0;
          // Iterate over the steps property and get the transitDetails property of each step.
          steps.forEach(function (step) {
            scnt += 1;
            try {
              // console.log(step.transit.line.short_name);
              // Display the stop name and arrival time in a console log.
              if (step.transit.line.short_name =="70") {
                fix = rcnt - 1;
                avl = true;
                sfix = scnt - 1;
              }
            } catch (error) {
              // console.log(error);
            }
          });
        });
      });
      // console.log(fix);
      if (avl) {
        var step = directionsResult.routes[fix].legs[0].steps[sfix];
        moveBus(from,step,time);
        return step;
      }
      else
      {
        return null;
        }
    }
  });
}
initMap();
