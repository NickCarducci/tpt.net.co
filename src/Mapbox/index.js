import React from "react";
import Marker from "./Marker";
import MappCluster from "./MappCluster";
import PropTypes from "prop-types";
import MapGL, { FlyToInterpolator, Layer, Source } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-calendar/dist/Calendar.css";
import MappGroup from "./MappGroup";

class Zoomer extends React.Component {
  state = {};
  render() {
    const { zoomChosen } = this.props;
    const zoomArray = [8, 11, 14, 17];
    return (
      <div
        onMouseLeave={() =>
          this.setState({
            hover8: false,
            hover11: false,
            hover14: false,
            hover17: false
          })
        }
      >
        {zoomArray.map((x, i) => {
          return (
            <div
              key={x}
              onMouseEnter={() => this.setState({ ["hover" + x]: true })}
              onClick={() => {
                const lio = zoomArray.lastIndexOf(zoomChosen);
                if (lio - i > 1) {
                  const fa = zoomArray[lio - 1];
                  if (fa) {
                    this.props.clickZoomer(fa);
                  } else this.props.clickZoomer(8);
                } else this.props.clickZoomer(x);
              }}
              style={{
                textAlign: "right",
                alignItems: "center",
                justifyContent: "flex-end",
                color: this.state["hover" + x] ? "black" : "rgb(8,8,8)",
                display: "flex",
                opacity:
                  zoomChosen === x
                    ? "1"
                    : this.state["hover" + x]
                    ? ".5"
                    : ".3",
                transition: ".1s ease-in"
              }}
            >
              <span
                style={{
                  height: "10px",
                  width: "10px",
                  backgroundColor:
                    zoomChosen === x ? "rgb(8,8,8)" : "rgba(0,0,0,0)",

                  transition: ".3s ease-in"
                }}
              />
              &nbsp;
              {
                [
                  //worldview,
                  "scope",
                  "buildings",
                  "roads",
                  "street"
                ][i]
              }
            </div>
          );
        })}
      </div>
    );
  }
}
const getDuration = (startViewState, endViewState) => {
  const degPerSecond = 100;
  const deltaLat = Math.abs(startViewState.latitude - endViewState.latitude);
  let deltaLng = Math.abs(startViewState.longitude - endViewState.longitude);
  // Transition to the destination longitude along the smaller half of the circle
  if (deltaLng > 180) deltaLng = 360 - deltaLng;
  return (Math.max(deltaLng, deltaLat) / degPerSecond) * 1000;
};
//the weasel coalition
//unfortunately libertarians would rather deficit than reconcile tax
//real income
/*const metersToPixels = (meters, latitude) =>
  Math.round(meters / 0.075 / Math.cos((latitude * Math.PI) / 180));
// https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
const circleColorOpts = [
  "match",
  ["get", "distance"],
  8,
  "rgba(255,240,180,.3)",
  9,
  "rgba(255,240,160,.3)",
  10,
  "rgba(255,220,160,.3)",
  11,
  "rgba(255,200,160,.3)",
  12,
  "rgba(255,180,160,.3)",
  13,
  "rgba(235,200,160,.3)",
  14,
  "rgba(215,215,160,.3)",
  15,
  "rgba(200,235,160,.3)",
  16,
  "rgba(180,255,160,.3)",
  17,
  "rgba(160,235,200,.3)",
  18,
  "rgba(160,215,215,.3)",
  19,
  "rgba(160,200,235,.3)",
  20,
  "rgba(160,180,255,.3)",
  "rgba(160,180,255,.3)"
];*/
const setByMapbox = async (latitude, longitude) =>
  await fetch(
    //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${latitude},${longitude}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
  )
    .then(async (response) => await response.json())
    .then((body) => {
      var city = body.features[0].place_name;
      if (city) {
        var center = body.features[0].center;
        return [city, center];
      } else return true;
    })
    .catch(() => true);
const handleLocation = async (place_name, deviceLocation, lastCoords) => {
  let getLoc = null;
  if (!deviceLocation) {
    if (!navigator.geolocation)
      return window.alert(
        "Geolocation is not supported by your browser " + navigator.userAgent
      );
    getLoc = true;
  } else if (deviceLocation === "red") {
    window.alert(
      "your browser-settings do not allow this site to access your location"
    );
    var answer = window.confirm(`travel to ${place_name}?`);
    //stops all processes, so...
    if (answer) return place_name;
    getLoc = true;
  } else {
    var answer1 = window.confirm(`travel to ${deviceLocation.place_name}?`);
    if (answer1) return true;

    answer1 = window.confirm("get location again?");
    if (!answer1) return null;
    getLoc = true;
  }
  if (getLoc) {
    return await new Promise((resolve) => {
      var opts = { enableHighAccuracy: true };
      opts.timeout = 5000;
      opts.maximumAge = Infinity;
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const strshortner = (str) =>
            Number(str.slice(0, str.lastIndexOf(".") + 4));
          var center = [
            strshortner(String(position.coords.longitude)),
            strshortner(String(position.coords.latitude))
          ];
          if (
            !lastCoords ||
            (Math.abs(lastCoords[0] - center[0]) > 0.01 &&
              Math.abs(lastCoords[1] - center[1]) > 0.01)
          ) {
            const sbm = await setByMapbox(...center);
            var bun = null; //promised object
            if (sbm) {
              bun = { deviceLocation: { place_name, center } };
              if (sbm !== true) {
                bun.mapbox = sbm;
                //["Fair Haven, New Jersey, United States", Array(2)]
                console.log("mapbox " + sbm);
              }
              return bun && resolve(JSON.stringify(bun));
            }
          } else {
            console.log("same place " + lastCoords);
            return resolve(JSON.stringify({ lastCoords }));
          }
        },
        (positionError) => resolve(JSON.stringify(positionError)),
        opts
      );
    });
  } else
    console.log(
      "your browser bypassed location by navigator.geolocation.getCurrentPosition"
    );
};
class Mapbox extends React.Component {
  constructor(props) {
    super(props);
    var dayLiked =
      new Date().getHours() > 4 && new Date().getHours() < 12
        ? true
        : new Date().getHours() > 12 && new Date().getHours() < 20
        ? 1
        : false;

    this.state = {
      shade: 9,
      offscreens: [],
      tellMeAll: "",
      now: new Date().getTime(),
      periods: [],
      chosenVector: "earthquake",
      dayLiked,
      lastDayLiked: dayLiked,
      showInfoWindow: false,
      viewport: {
        width: window.innerWidth,
        height: "100%",
        pitch: 60, // pitch in degrees
        bearing: -60,
        longitude: props.center[0],
        latitude: props.center[1],
        zoom: 8
      },
      deviceLocation: false,
      zoomChosen: 8
    };
    this._cluster = React.createRef();
    this.mapRef = React.createRef();
    this.communityLogo = React.createRef();
    this.onClick = this.onClick.bind(this);
    this.darkModeQuery = window.matchMedia(`(prefers-color-scheme: dark)`);
    this.lightModeQuery = window.matchMedia(`(prefers-color-scheme: light)`);
  }
  onClick(cluster) {
    const { geometry } = cluster;
    this.resizee(
      false,
      false,
      geometry.coordinates,
      this.state.viewport.zoom < 6
        ? 6
        : this.state.viewport.zoom < 9
        ? 9
        : this.state.viewport.zoom < 13
        ? 13
        : this.state.viewport.zoom < 16
        ? 16
        : this.state.viewport.zoom + 2
    );
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.resizee);
    window.addEventListener(this.darkModeQuery, this.setDark);
    window.addEventListener(this.lightModeQuery, this.setLight);
    this.props.center &&
      this.setState({
        readyForMap: true
      });
  };
  setDark = (darkModeQuery) =>
    this.setState({
      darkMode: darkModeQuery.length !== 0,
      darkModeListener: darkModeQuery
    });
  setLight = (lightModeQuery) =>
    this.setState({
      lightMode: lightModeQuery.length !== 0,
      preferenceListener: lightModeQuery
    });
  componentWillUnmount = () => {
    const { preferenceListener, darkModeListener } = this.state;
    if (preferenceListener)
      window.removeEventListener(this.lightModeQuery, this.setLight);
    if (darkModeListener)
      window.removeEventListener(this.darkModeQuery, this.setDark);
    window.removeEventListener("resize", this.resizee);
  };
  resizee = (event, commChange, coords, zoom) => {
    const { mapbox } = this.state;
    if (mapbox) {
      var viewport = { ...this.state.viewport };
      var { lng, lat } = mapbox.getCenter();
      viewport.longitude = coords ? coords[0] : lng;
      viewport.latitude = coords ? coords[1] : lat;
      viewport.zoom = zoom ? zoom : this.state.zoomChosen;
      //const{offsetHeight,offsetWidth} = this.mapPage;
      viewport.width = window.innerWidth;
      viewport.height = "100%";
      viewport.transitionDuration = "auto";
      viewport.transitionInterpolator = new FlyToInterpolator();
      const timeout = getDuration(this.state.viewport, viewport);
      //viewport.width = this.props.width;
      //viewport.height = this.props.height - 56;
      /*viewport.onTransitionStart = () => {
      this.animatedResize(this.state.viewPortHeight);
      clearTimeout(this.end);
      this.end = setTimeout(
        () => this.animatedResize(this.state.viewPortHeight),
        timeout
      );
      //mapbox.resize();
    };*/
      const handleResize = () => {
        clearTimeout(this.end);
        this.end = setTimeout(() => {
          console.log("resize mapbox");
          if (commChange) {
            this.updateSnowfall();
          }
        }, timeout);
      };
      viewport.onTransitionStart = handleResize;
      this.setState({ flyOver: true, viewport }, () =>
        setTimeout(() => this.setState({ flyOver: false }), timeout)
      );
    }
  };

  /*animatedResize = (height) => {
    var anim;
    const newHeight = this.mapPage.current.offsetHeight;
    const add = (num) => num + 1;
    const sub = (num) => num - 1;
    const animate = (height) => {
      height = height < newHeight ? add(height) : sub(height);
      if (height !== newHeight) {
        var viewport = { ...this.state.viewport };
        viewport.height = height;
        viewport.width = "100%";
        this.setState({ viewport }, () => {
          anim = requestAnimationFrame(() => animate(height));
        });
      }
    };
    animate(height);
    if (height === newHeight) {
      cancelAnimationFrame(anim);
    }
  };*/

  componentDidUpdate = (prevProps) => {
    if (this.state.dayLiked !== this.state.lastDayLiked) {
      this.setState({
        lastDayLiked: this.state.dayLiked,
        preferTimeBasedMap: this.state.dayLiked
      });
    }
    if (
      prevProps.forumOpen !== this.props.forumOpen ||
      this.state.lastzoomChosen !== this.state.zoomChosen
    )
      this.setState({ lastzoomChosen: this.state.zoomChosen }, () => {
        this.state.mapbox && this.resizee(false);
      });
    if (this.props.center !== prevProps.center) {
      console.log("location change " + this.props.center);
      this.resizee(false, false, this.props.center);
    }
    if (
      this.props.entityEvent &&
      this.props.entityEvent !== prevProps.entityEvent
    ) {
      this.props.entityEvent.center &&
        this.setState({
          viewport: {
            ...this.state.viewport,
            longitude: this.props.entityEvent.center[1],
            latitude: this.props.entityEvent.center[0]
          }
        });
    }
  };
  updateSnowfall = () =>
    this.setState(
      { showPeriods: false },
      async () =>
        await fetch(
          `https://api.weather.gov/points/${this.props.center[1]},${this.props.center[0]}`
        )
          .then(async (res) => await res.json())
          .then(async (result) => {
            if (result.properties) {
              //https://api.weather.gov/gridpoints/LOX/154,44/forecast
              var link =
                "https://api.weather.gov/gridpoints/" +
                result.properties.gridId +
                "/" +
                result.properties.gridX +
                "," +
                result.properties.gridY +
                "/forecast/hourly";
              await fetch(link, {
                Accept: "application/geo+json",
                "User-Agent": "(thumbprint.us, nick@thumbprint.us)"
              })
                .then(async (res) => await res.json())
                .then((result) => {
                  if (result.status) {
                    this.setState({ showPeriods: false });
                  } else {
                    this.setState({
                      showPeriods: true,
                      periods: result.properties.periods
                    });
                    //this.state.readyForMap && this.updateForecast();
                  }
                })
                .catch((err) => console.log(err.message));
            }
          })
          .catch((err) => console.log(err.message))
    );

  openCluster = (x) =>
    this.setState({
      tellMeAll: x.place_name
    });
  handleMapboxResults = (out) => {
    const city = out.mapbox[0];
    const center = out.mapbox[1];
    //console.log("found " + city, center);
    if (city !== this.props.city) {
      const cityapi = city.replace(/[, ]+/g, "_");
      const state = city.split(", ")[1];
      const stateapi = state.replaceAll(/ /g, "_");
      this.setState(
        {
          deviceLocation: { city, center }
        },
        () => {
          this.props.chooseCitypoint(
            center,
            this.state.distance,
            city,
            cityapi,
            stateapi,
            null
          );
          console.log("set " + city, center);
          this.props.setCommunity({ city });
        }
      );
    } else {
      this.resizee(false, false, center);
    }
  };
  handlePinTouch = async (deviceLocation) => {
    const { lastCoords } = this.state;
    var place_name = this.props.city;
    var center = this.props.center;
    if (deviceLocation && deviceLocation.place_name) {
      place_name = deviceLocation.place_name;
      center = deviceLocation.center;
    }
    const error = (err) => {
      if (err.code === 1) {
        //("PERMISSION_DENIED:Permission denied")
        this.setState({ deviceLocation: "red" });
      } else if ([2, 3].includes(err.code)) {
        if (err.code === 2) {
          this.setState({ deviceLocation: "orange" });
          window.alert(
            "systemError:POSITION_UNAVAILABLE:Permission allowed, location disabled:please try again later"
          );
        } else if (err.code === 3) {
          this.setState({ deviceLocation: false });
          window.alert(
            "devError:TIMEOUT:Permission allowed, timeout reached:please check your browser settings, try again later or contact nick@thumbprint.us please"
          );
        }
      }
    };
    const loc = await handleLocation(
      this.props.city,
      deviceLocation,
      lastCoords
    );
    if (loc) {
      const location = JSON.parse(loc);
      if (location.constructor === Object && Object.keys(location).length > 0) {
        console.log(location.mapbox);
        console.log("pin touched");
        if (location.code) return error(location);
        if (location.deviceLocation) {
          center = location.deviceLocation.center;
          place_name = location.deviceLocation.place_name;
        }
        this.setState(
          {
            lastCoords: center,
            deviceLocation: location.deviceLocation && location.deviceLocation
          },
          () => {
            if (location.deviceLocation.mapbox) {
              this.handleMapboxResults(location);
            } else if (center) {
              this.changeArea(center, place_name);
            } else if (location.lastCoords) {
              this.resizee(false, false, Object.keys(location).center);
            } else {
              console.log("err Mapbox.js ", center, place_name);
            }
          }
        );
      } else {
        this.resizee(false, false, center);
      }
    } // else console.log("dev unlogged");
  };
  changeArea = (center, city) => {
    console.log("change");
    setTimeout(() => {
      const state = city.split(", ")[1];
      const cityentry = city.split(",")[0];
      this.props.chooseCitypoint(
        center,
        this.props.distance,
        cityentry,
        city.replace(/[, ]+/g, "_"), //cityapi
        state ? state.replace(/ /g, "_") : "ZZ", //stateapi
        null
      );
    }, 1234);
  };
  lighter = () => {
    this.state.mapbox.setStyle(
      this.props.apple
        ? "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr"
        : "mapbox://styles/nickcarducci/ckri5jikv29qy17pfgzm4q41k"
    );
  };
  darker = () => {
    this.state.mapbox.setStyle(
      "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr"
    );
  };
  render() {
    const { shiftRight, commtype, event } = this.props;
    const {
      deviceLocation,
      readyForMap,
      viewport,
      mapbox
    } = this.state; /*: this.props.apple
? "mapbox://styles/nickcarducci/ckoa1yw30265z17mvhmm6is5b"
*/
    //"mapbox://styles/nickcarducci/ck1hrkqiz5q9j1cn573jholv3"
    const mapStyle = this.props.apple
      ? "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr"
      : "mapbox://styles/nickcarducci/ckri5jikv29qy17pfgzm4q41k";
    /*(preferTimeBasedMap === 2 && dayLiked === 2) || lightMode
        ? "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr"
        : (preferTimeBasedMap === 1 && dayLiked === 1) || darkMode //night
        ? "mapbox://styles/nickcarducci/ck1hrh6066cfc1cqpn9ubwl33"
        : preferTimeBasedMap && dayLiked //day
        ? "mapbox://styles/nickcarducci/ckdu8diut0bx919lk1gl327vt"
        : "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr";*/
    const tileChosen = "event";
    const mp /*
      commtype === "classes"
        ? classes
        : commtype === "department"
        ? departments
        : tileChosen === "club"
        ? clubs
        : tileChosen === "job"
        ? jobs
        : tileChosen === "shop"
        ? shops
        : tileChosen === "service"
        ? services
        : tileChosen === "housing"
        ? housing
        : tileChosen === "page"
        ? pages
        : tileChosen === "event"
        ? eve
        : tileChosen === "restaurant"
        ? restaurants
        : [];*/ =
      //this.props.onMapEntities;
      ["event", "job", "housing"].includes(tileChosen)
        ? event
        : this.props.entity;
    var mapThis = mp && mp.length > 0 ? mp : [];
    /**
         * 
    let addresses = [];
    if (mapThis)
      mapThis.mapbox((x) => {
        return addresses.push(x.place_name);
      });
    var object = {};
    var repeats = [];
     var unique = new Set(addresses)
     var firstTime={}
       unique.mapbox(x=>{
         if(addresses.includes(x)&&!firstTime[x]){
           firstTime[x]=true
        inLot.push("")}
       })
       if(rest){
       return repeats.push(pl.place_name)
      
         */
    var inLot = [];
    let names = [];
    var mapit = null;
    if (mapThis && mapThis.constructor === Array) {
      mapThis.filter((x) => x.center || x.venue.address);

      mapThis.map((x) => names.push(x.name ? x.name : x.id));
      var unique = [...new Set(names)];
      mapit =
        unique &&
        mapThis.filter((x) => {
          const id = x.name ? x.name : x.id;
          const first = unique.includes(id);
          unique.filter((y) => y === id);
          return first;
        });
      inLot = mapThis.filter((x) => x && x.place_name === this.state.tellMeAll);
    }
    const rightStyle = {
      display: !this.props.started ? "flex" : "none",
      position: "fixed",
      flexDirection: "column",
      alignItems: "flex-end",
      textAlign: "right",
      transition: ".3s ease-in",
      margin: "6px 0px"
    };
    //console.log("mapit", mapThis);
    function percentToColor(weight) {
      var color1 = [250, 250, 250];
      var color2 = [0, 136, 143];
      var w1 = weight;
      var w2 = 1.4 - w1;
      var timecolor = [
        Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)
      ];
      return `rgb(${timecolor})`;
    }
    const metersToPixels = (meters, latitude) =>
      Math.round(meters / 0.075 / Math.cos((latitude * Math.PI) / 180));
    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
    const circleColorOpts = [
      "match",
      ["get", "distance"],
      8,
      "rgba(255,240,180,.3)",
      9,
      "rgba(255,240,160,.3)",
      10,
      "rgba(255,220,160,.3)",
      11,
      "rgba(255,200,160,.3)",
      12,
      "rgba(255,180,160,.3)",
      13,
      "rgba(235,200,160,.3)",
      14,
      "rgba(215,215,160,.3)",
      15,
      "rgba(200,235,160,.3)",
      16,
      "rgba(180,255,160,.3)",
      17,
      "rgba(160,235,200,.3)",
      18,
      "rgba(160,215,215,.3)",
      19,
      "rgba(160,200,235,.3)",
      20,
      "rgba(160,180,255,.3)",
      "rgba(160,180,255,.3)"
    ];
    const pixelFloorSize = metersToPixels(
      this.props.distance,
      this.props.center[1]
    );
    //console.log("mapit", this.props.center);
    return (
      <div
        style={{
          backgroundColor: "rgb(100,0,0)",
          position: "fixed",
          width: "100%",
          height: "100%"
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            transition: ".3s ease-in",
            bottom: "56px",
            position: "fixed",
            zIndex: "9",
            left: "50px",
            width: "0px",
            height: "70px",
            boxShadow: "0px 0px 50px 20px rgb(20,20,20)"
          }}
        >
          <div
            onClick={this.lighter}
            style={{
              transform: "translateX(-50%)",
              width: "50px",
              height: "50%"
            }}
          ></div>
          <div
            onClick={this.darker}
            style={{
              transform: "translateX(-50%)",
              width: "50px",
              height: "50%"
            }}
          ></div>
        </div>
        <div
          style={{
            userSelect: "none",
            backgroundColor: "white",
            transition: ".3s ease-in",
            top: "10px",
            position: "absolute",
            zIndex: "2"
          }}
        >
          <div
            onClick={() => this.setState({ deviceLocation: null })}
            style={{
              zIndex: "3",
              right: shiftRight ? "190px" : "90px",
              bottom: "43px",
              position: "fixed",
              fontSize:
                this.state.hoveringPin && deviceLocation ? "20px" : "0px",
              transition: ".3s ease-in"
            }}
          >
            &times;
          </div>
          <div
            onClick={() => this.setState({ deviceLocation: null })}
            style={{
              zIndex: "3",
              right: shiftRight ? "190px" : "90px",
              bottom: "43px",
              position: "fixed",
              fontSize:
                this.state.hoveringPin && deviceLocation ? "20px" : "0px",
              transition: ".3s ease-in"
            }}
          >
            &times;
          </div>
          <i
            onMouseEnter={() =>
              !this.state.hoveringPin &&
              //deviceLocation &&
              this.setState({ hoveringPin: true }, () => {
                setTimeout(() => this.setState({ hoveringPin: false }), 5000);
              })
            }
            onClick={() => {
              if (this.state.offscreens.length > 0) {
                console.log(
                  this.state.offscreens.length + " offscreen(s) cleared"
                );
                this.setState({ offscreens: [] }, () =>
                  this.props.resetLastQuery()
                );
              } else if (deviceLocation === "orange") {
                this.setState({ deviceLocation: false }, () => {
                  /*navigator.permissions
                    .revoke({ name: "geolocation" })
                    .then((result) => {
                      console.log(result.state);
                    })
                    .catch((err) => {
                      console.log(err.message);*/
                  window.alert(
                    "location button reset:please disable from your browser settings " +
                      "if you want to disable our code running on your browser to GET the " +
                      "coordinantes of your device again, although only this button triggers " +
                      "it and we do not have abstracted server calls elsewhere. see open-source " +
                      "github.com/nickcarducci/wavepoint.la"
                  );
                  // });
                });
              } else
                this.state.hoveringPin && this.handlePinTouch(deviceLocation);
            }}
            className="fas fa-map-pin"
            style={{
              ...rightStyle,
              borderRadius: "10px",
              padding: "4px 10px",
              right: shiftRight ? "140px" : "40px",
              backgroundColor:
                deviceLocation === "red"
                  ? "rgb(170,100,145)"
                  : "rgb(100,100,255)",
              boxShadow: `0px 0px 10px 2px ${
                deviceLocation === "red"
                  ? "rgb(220,70,80)"
                  : deviceLocation === "orange"
                  ? "rgb(20,20,20)"
                  : deviceLocation
                  ? "rgb(10,255,255)"
                  : "rgb(170,170,170)"
              }`,
              border: `3px solid ${
                this.state.hoveringPin ? "white" : "rgb(150,200,250)"
              }`,
              color:
                deviceLocation === "red"
                  ? "rgb(75,25,25)"
                  : deviceLocation === "orange"
                  ? "rgb(235,165,110)"
                  : deviceLocation
                  ? "rgb(10,255,255)"
                  : "rgb(20,20,140)"
            }}
          />
        </div>
        <div
          style={{
            right: "0px",
            top: "56px",
            position: "absolute",
            zIndex: "2"
          }}
        >
          <Zoomer
            allOpen={
              this.state.hoverAccessories ||
              this.props.height > 600 ||
              this.state.hover1 ||
              this.state.hover2 ||
              this.state.hover3 ||
              this.state.hover4
            }
            hover1={this.state.hover1}
            hover2={this.state.hover2}
            hover3={this.state.hover3}
            hover4={this.state.hover4}
            clickZoomer={(zoomChosen) => this.setState({ zoomChosen })}
            zoomChosen={this.state.zoomChosen}
            height={this.props.height}
          />
        </div>
        {/*<Accessories
          rightStyle={rightStyle}
          offscreens={this.state.offscreens}
          suggestionsOnMap={suggestionsOnMap}
          plume={() => {
            //this.props.openStart();
            //window.scrollTo(0, 0);
            this.setState({
              suggestionsOnMap: suggestionsOnMap ? null : suggestions
            });
          }}
          mapbox={mapbox}
          clickZoomer={this.props.clickZoomer}
          eventTypes={this.props.eventTypes}
          displayPreferences={this.props.displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          calToggle={this.props.calToggle}
          woah={this.props.woah}
          shiftRight={this.props.shiftRight}
          goToRadius={this.props.goToRadius}
          monthCalOpen={this.props.monthCalOpen}
          invites={this.props.invites}
          selfvites={this.props.selfvites}
          fonish={this.props.fonish}
          materialDateOpen={this.props.materialDateOpen}
          pathname={this.props.pathname}
          started={false}
          forumOpen={this.props.forumOpen}
          tilesMapOpen={this.props.tilesMapOpen}
          chatsopen={this.props.chatsopen}
          achatopen={this.props.achatopen}
          setFoundation={this.props.setFoundation}
          setIndex={this.props.setIndex}
          go1={this.props.go1}
          setData={this.props.setData}
          current={this.props.current}
          current1={this.props.current1}
          y={this.props.y}
          toggleCloseStuff={this.props.toggleCloseStuff}
          start={this.props.start}
          unStart={this.props.unStart}
          tilesOpener={this.props.tilesOpener}
          openStart={this.props.openStart}
          range={this.props.range}
          queriedDate={this.props.queriedDate}
          backtotoday={this.backtotoday}
          alltime={this.props.alltime}
          sliderchange={this.props.sliderchange}
          distance={this.props.distance}
          trueZoom={this.props.trueZoom}
          zoomUpdated={this.state.zoomUpdated}
          chooseEvents={this.props.chooseEvents}
          commtype={this.props.commtype}
          openchat={this.props.openchat}
          tileChosen={this.props.tileChosen}
          openForum={this.props.openForum}
          openthestuff={this.props.openthestuff}
          zoomChoose1={this.props.zoomChoose1}
          zoomChoose2={this.props.zoomChoose2}
          zoomChoose3={this.props.zoomChoose3}
          zoomChoose4={this.props.zoomChoose4}
          queryDate={this.props.queryDate}
          zoomChosen={this.props.zoomChosen}
          community={this.props.community}
          city={this.props.city}
        />*/}
        {
          //mounted &&
          readyForMap ? (
            /*<canvas style={{ display: "none" }} ref={this.communityLogo} />*/
            <MapGL
              pitchEnabled
              touchRotate
              dragRotate
              ref={this.mapRef}
              minZoom={7}
              onLoad={() => {
                if (this.mapRef && this.mapRef.current) {
                  const mapbox = this.mapRef.current.getMap();
                  //console.log("viewport", this.state.viewport);
                  //map.setTerrain({source: 'mapbox-dem', exaggeration: 1.5});
                  this.setState({
                    mapbox
                  });
                }
              }}
              onError={(err) => window.alert(Object.values(err))}
              onViewportChange={(viewport) =>
                this.setState(
                  {
                    viewport
                  },
                  () => {
                    if (mapbox) {
                      const bnds = mapbox.getBounds();
                      if (bnds) {
                        const bounds = {
                          north: bnds._ne.lat,
                          south: bnds._sw.lat,
                          west: bnds._sw.lng,
                          east: bnds._ne.lng
                        };
                        this.setState({
                          bounds: [
                            bounds.north,
                            bounds.south,
                            bounds.east,
                            bounds.west
                          ]
                        });
                      }
                    }
                  }
                )
              }
              mapStyle={mapStyle}
              /*mapStyle={{
                version: 8,
                sources: {type:"vector",source-layer:mapStyle},
                layers: [id:"mapURL"]
              }}*/
              //mapLib={import("mapbox-gl")}
              mapboxApiAccessToken="pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ"
              {...viewport}
              transition={{
                duration: 300,
                delay: 0
              }}
            >
              <Source
                id="floor"
                type="geojson"
                data={{
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      //match get distance
                      properties: {
                        distance: this.props.distance
                      },
                      //layer lnglat
                      geometry: {
                        type: "Point",
                        coordinates: this.props.center
                      }
                    }
                  ]
                }}
              />
              <Layer
                {...{
                  id: "floor",
                  type: "circle",
                  source: "floor",
                  //"source-layer": "landuse", //for vector
                  //filter: ["==", "class", "park"], //??
                  paint: {
                    // make circles larger as the user zooms from 12 to 22
                    "circle-radius": {
                      stops: [
                        [7, 0], //[zoom,width]
                        [22, pixelFloorSize * 10000]
                      ],
                      base: 2
                    },
                    "circle-stroke-color": "rgb(200,200,230)",
                    "circle-stroke-width": 2,
                    "circle-color": circleColorOpts
                  }
                }}
              />
              {mapbox && (
                <MappCluster
                  ref={this._cluster}
                  mapbox={mapbox}
                  element={(cluster) => (
                    <MappGroup
                      zoomChosen={this.state.zoomChosen}
                      openCluster={this.openCluster}
                      mapThis={mapit}
                      onClick={this.onClick}
                      {...cluster}
                    />
                  )}
                >
                  {mapit &&
                    mapit.map((obj, i) => {
                      //console.log(obj);
                      var id = obj._id ? obj._id : obj.id;
                      if (!obj.venue && this.props.subtype !== obj.subtype)
                        return null;
                      if (
                        this.props.subtype !== "party & clubbing" &&
                        obj.venue
                      )
                        return null; //console.log(this.props.subtype, x.venue);
                      //console.log("this date" + new Date(x.date._seconds * 1000));
                      if (obj.id.length < 10) {
                        let names = [];
                        obj.artistList.map((e) => {
                          return names.push(e.name.toUpperCase());
                        });
                      }
                      if (obj.center || (obj.venue && obj.venue.longitude)) {
                        //i === 0 && console.log(obj);
                        //if (!x.venue) console.log(x);
                        //console.log(this.props.tileChosen);

                        var today = new Date().getTime() / 1000;
                        var eventDate = this.props.event.date
                          ? new Date(this.props.event.date).getTime() / 1000
                          : new Date();
                        var chopped = (eventDate - today) / 86400;
                        var colorTime = chopped.toString().substr(0, 3);
                        const timecolor = percentToColor(colorTime / 7);
                        var goo = {};
                        var photo1 = event.chosenPhoto
                          ? event.chosenPhoto
                          : goo;
                        var community = event.community;
                        /*var boxShadow = `0 0 4px 3px ${timecolor}`;
                        const to = `${
                          commtype === "classes"
                            ? "/class"
                            : commtype === "department"
                            ? "/department"
                            : tileChosen === "event"
                            ? String(event.id).length < 10
                              ? "/events/edmtrain/" + event.id
                              : "/event/" + event.id
                            : tileChosen === "restaurant"
                            ? "/restaurant"
                            : tileChosen === "club"
                            ? "/club"
                            : tileChosen === "job"
                            ? "/job" + event.id
                            : tileChosen === "shop"
                            ? "/shop"
                            : tileChosen === "service"
                            ? "/service"
                            : tileChosen === "housing"
                            ? "/housing" + event.id
                            : tileChosen === "page"
                            ? "/page"
                            : "/"
                        }/${
                          ["event", "job"].includes(tileChosen)
                            ? ""
                            : (community
                                ? community.message
                                : this.props.cityapi) +
                              "/" +
                              (event.message ? event.message : event.title)
                        }`;
                        const [x, y] = this._context.viewport.project(
                          obj.venue
                            ? [obj.venue.longitude, obj.venue.latitude]
                            : center
                        );*/
                        //!obj.venue && console.log(obj);
                        return (
                          /*<Link
                            to={to}
                            style={{
                              position: "absolute",
                              boxShadow: "#fff",
                              left: x,
                              top: y,
                              userSelect: "none"
                            }}
                          >
                            {String(event.id).length > 10 ? (
                              <img
                                style={{ boxShadow, cursor: "pointer" }}
                                className="mapicons"
                                src={photo1}
                                alt="error"
                              />
                            ) : (
                              <img
                                style={{ boxShadow, cursor: "pointer" }}
                                className="mapicons"
                                src={
                                  "https://www.dropbox.com/s/s8qd8boe74trqv1/edmtrain.png?raw=1"
                                }
                                alt="error"
                                onClick={this.props.openalladdresses}
                              />
                            )}
                          </Link>*/
                          <Marker
                            communities={this.props.communities}
                            chooseEdmevent={this.props.chooseEdmevent}
                            mapThis={mapThis}
                            openalladdresses={() => this.openCluster(obj)}
                            community={community}
                            commtype={commtype}
                            tileChosen={tileChosen}
                            //center={this.state.center}
                            id={id}
                            key={id}
                            //ref={this["myRef" + x.id]}
                            longitude={
                              obj.venue
                                ? obj.venue.longitude
                                : Number(obj.center[1])
                            }
                            latitude={
                              obj.venue
                                ? obj.venue.latitude
                                : Number(obj.center[0])
                            }
                            event={obj}
                            cityapi={this.props.city}
                            chooseEvent={this.props.chooseEvent}
                            show={this.state.showInfoWindow}
                            coordinates={
                              obj.venue
                                ? [obj.venue.longitude, obj.venue.latitude]
                                : [obj.center[1], obj.center[0]]
                            }
                            anchor="bottom"
                          />
                        );
                      } else return null;
                    })}
                </MappCluster>
              )}
            </MapGL>
          ) : (
            <div
              style={{
                backgroundColor: "rgb(20,120,60)",
                display: "flex",
                height: "100%",
                width: "100%",
                overflow: "hidden"
              }}
            >
              <img
                style={{
                  display: "flex",
                  height: "100%",
                  width: "auto"
                }}
                alt="error"
                src="https://www.dropbox.com/s/bt07kz13tvjgz8x/Screen%20Shot%202020-07-18%20at%208.52.33%20AM.png?raw=1"
              />
            </div>
          )
        }
        {/*<div
          style={{
            opacity: weatherOpen ? 1 : 0,
            zIndex: weatherOpen ? 1 : -9999,
            width: weatherOpen ? "min-content" : "0px",
            maxHeight: weatherOpen ? "100px" : "0px",
            display: "flex",
            position: "fixed",
            top: "106px",
            left: "71px",
            height: "100px",
            overflowX: "auto",
            overflowY: "hidden",
            transition: ".3s ease-in"
          }}
        >
          <div
            style={{
              display: "flex",
              position: "fixed",
              top: "106px",
              left: "71px",
              width: "calc(100% - 151px)",
              height: "100px",
              overflowX: "auto",
              overflowY: "hidden"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                height: "50px",
                width: "min-content"
              }}
            >
              {this.state.periods.map((note) => {
                var eventDate1 = new Date(note.endTime);
                return (
                  [0, 4, 8, 12, 16, 20].includes(eventDate1.getHours()) && (
                    <div key={eventDate1}>
                      <img
                        style={{ width: "auto", height: "100%" }}
                        src={note.icon}
                        alt="err"
                      />
                      <div
                        style={{
                          backgroundColor: "rgb(220,220,220)",
                          borderRadius: "5px",
                          fontSize: "12px"
                        }}
                      >
                        {eventDate1.getHours() === 0
                          ? eventDate1.toLocaleDateString()
                          : eventDate1.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
          {this.state.chosenVector === "snowfall" ? (
            <div
              onClick={() =>
                this.setState({ hideSnowfall: !this.state.hideSnowfall })
              }
              style={{
                display: "flex",
                position: "fixed",
                top: "176px",
                left: "71px",
                width: "calc(100% - 151px)",
                height: "30px",
                backgroundColor: "rgba(250,250,250,.8)",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.state.hideSnowfall ? "Open" : "Close"}
            </div>
          ) : null}
        </div>*/}

        <div
          //group-cluster; opened
          style={{
            zIndex: "6",
            display: this.state.tellMeAll !== "" ? "flex" : "none",
            position: "fixed",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            bottom: "0px",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          {inLot && inLot[0] && inLot[0].venue && inLot[0].venue.name}
          <br />
          {inLot && inLot[0] && inLot[0].venue && inLot[0].venue.address}
          <div
            onClick={() => {
              this.setState({ tellMeAll: "" });
            }}
            style={{
              display: "flex",
              position: "fixed",
              right: "10px",
              top: "10px",
              fontSize: "40px"
            }}
          >
            &times;
          </div>
          {inLot.map((x) => {
            var eventDate = new Date(
              x.date
                ? x.date.seconds
                  ? x.date.seconds * 1000
                  : x.date
                : this.state.new
            ).getTime();
            var chopped = (eventDate - this.state.now) / 86400000;

            var diffDays = chopped.toString().substr(0, 3);
            /*var cityCommunity = x.community ? x.community.message : x.city;
            const entityURI =
              tileChosen === "club"
                ? "/clubs/"
                : tileChosen === "restaurant"
                ? "/restaurants/"
                : tileChosen === "shop"
                ? "/shops/"
                : tileChosen === "service"
                ? "/services/"
                : tileChosen === "page"
                ? "/pages/"
                : tileChosen === "venue"
                ? "/venues/"
                : tileChosen === "class"
                ? x.endDate < new Date()
                  ? {
                      pathname:
                        "/classes/" +
                        cityCommunity +
                        "/" +
                        x.message +
                        "/" +
                        `${new Date(x.endDate.seconds * 1000).getFullYear()}-${
                          new Date(x.endDate.seconds * 1000).getMonth() + 1
                        }-${new Date(x.endDate.seconds * 1000).getDate()}`
                    }
                  : "/classes/"
                : tileChosen === "department"
                ? "/departments/"
                : tileChosen === "housing"
                ? "/housing/" + x.id
                : tileChosen === "job"
                ? "/job/" + x.id
                : x.id && x.id.length > 10
                ? "/event/" + x.id
                : "/events/edmtrain/" + x.id;*/

            return (
              <div
                key={x.id}
                to={
                  "https://" + x.ticketLink
                  /* entityURI.includes("edmtrain")
                    ? entityURI
                    : entityURI + cityCommunity + "/" + x.message*/
                }
                style={{
                  maxWidth: "calc(100% - 60px)",
                  width: "max-content",
                  right: "0px",
                  display: "flex",
                  border: "1px solid black",
                  color: "black",
                  fontSize: "20px",
                  textDecoration: "none"
                }}
                // onClick={() => this.props.chooseEdmevent(x)}
                onClick={() => {
                  window.location.href = x.ticketLink;
                }}
              >
                <span
                  style={{
                    wordBreak: "break-all"
                  }}
                >
                  {x.name
                    ? x.name
                    : x.artistList
                    ? x.artistList.map((x) => x.name)
                    : x.message}
                  {eventDate && (
                    <div
                      style={{
                        display: "flex",
                        color: "grey",
                        fontSize: "16px",
                        margin: "5px"
                      }}
                    >
                      {new Date(eventDate).toLocaleDateString()}
                    </div>
                  )}
                </span>
                &nbsp;-
                <div
                  style={{
                    color: "grey",
                    fontSize: "16px",
                    margin: "5px"
                  }}
                >
                  {eventDate && (
                    <div
                      style={{
                        color: "grey",
                        fontSize: "16px",
                        margin: "5px"
                      }}
                    >
                      {
                        ["sun", "mon", "tue", "wen", "thu", "fri", "sat"][
                          new Date(eventDate).getDay()
                        ]
                      }
                    </div>
                  )}{" "}
                  <div
                    style={{
                      margin: "3px",
                      fontSize: "12px",
                      width: "12px",
                      height: "12px",
                      border: "1px solid",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {diffDays.includes(".") ? diffDays.split(".")[0] : diffDays}
                  </div>
                  days
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
Mapbox.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};
export default Mapbox;
