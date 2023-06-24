import React from "react";
const veryCloudy =
  "https://www.dropbox.com/s/xu76g31mxovfc4p/ezgif.com-gif-maker%20%2816%29.gif?raw=1";
const lightClouds =
  "https://www.dropbox.com/s/bxl9b9m2hvikfsu/ezgif.com-gif-maker%20%2817%29.gif?raw=1";
const lightRain =
  "https://www.dropbox.com/s/8mey5b8p5mlos29/Rain%28Light%29.gif?raw=1";
const heavyRain =
  "https://www.dropbox.com/s/novwfujik3ini17/ezgif.com-gif-maker%20%2818%29.gif?raw=1";
const littleSnow =
  "https://www.dropbox.com/s/h5d5oty0646dmtt/Snow%28Light%29.gif?raw=1";
const bigSnow =
  "https://www.dropbox.com/s/lox9e6bfhxvb0vo/ezgif.com-gif-maker%20%2819%29.gif?raw=1";
const beach = "https://www.dropbox.com/s/h0qcoq0mxcd18ku/Beach.gif?raw=1";
const cityImg =
  "https://www.dropbox.com/s/qzwsuy6txo0u4ds/CityLandscape.gif?raw=1";
const plainImg =
  "https://www.dropbox.com/s/yz6bh9f1wqbk4k6/Plain%28Feather%29%20%283%29.gif?raw=1";
//react does require that keys are unique,
//and repeating features load the same src multiple times,
//unless exported as a signle variable? No! you need to suspend the image
//as a component... I don't think I can lasy load a function without props so I'll wait to do that
export class PlainImg extends React.Component {
  render() {
    return <img src={plainImg} style={this.props.style} alt="error" />;
  }
}
export class CityImg extends React.Component {
  render() {
    return <img src={cityImg} style={this.props.style} alt="error" />;
  }
}
export class Beach extends React.Component {
  render() {
    return <img src={beach} style={this.props.style} alt="error" />;
  }
}
export class BigSnow extends React.Component {
  render() {
    return <img src={bigSnow} style={this.props.style} alt="error" />;
  }
}
export class LittleSnow extends React.Component {
  render() {
    return <img src={littleSnow} style={this.props.style} alt="error" />;
  }
}
export class HeavyRain extends React.Component {
  render() {
    return <img src={heavyRain} style={this.props.style} alt="error" />;
  }
}
export class LightRain extends React.Component {
  render() {
    return <img src={lightRain} style={this.props.style} alt="error" />;
  }
}
export class LightClouds extends React.Component {
  render() {
    return <img src={lightClouds} style={this.props.style} alt="error" />;
  }
}
export class VeryCloudy extends React.Component {
  render() {
    return <img src={veryCloudy} style={this.props.style} alt="error" />;
  }
}

class WeatherCitySky extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      time: new Date().getHours(),
      city: this.props.city,
      //location:this.props.city.location,
      locationlat: "",
      locationlng: "",
      description: "",
      humidity: 0,
      rain1: 0,
      snow1: 0,
      rain3: 0,
      snow3: 0
    };
  }

  render() {
    var large = {
      display: "flex",
      position: "absolute",
      height: this.props.height ? this.props.height : "85px",
      width: this.props.height ? this.props.height : "85px",
      padding: "8px",
      transform: "translate(-50%, -50%)"
    };
    return (
      <div
        onClick={this.props.onClickThis}
        className={"citybundlemap"}
        style={{
          display: "flex",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          transition: ".3s ease-in",
          width: this.props.height ? this.props.height : 90,
          height: this.props.height ? this.props.height : 90,
          marginBottom: "5px",
          opacity: this.props.hovering ? 1 : 0.8
        }}
      >
        <div
          style={{
            borderRadius: "30px",
            height: "100%",
            width: "100%",
            position: "absolute",
            border: this.props.hovering ? `3px solid green` : "",
            transition: ".3s ease-in"
          }}
        />
        <div>
          {this.state.clouds > 50 || this.state.clouds === 50 ? (
            <VeryCloudy style={large} />
          ) : this.state.clouds < 50 && this.state.clouds > 10 ? (
            <LightClouds style={large} />
          ) : null}
          {(this.state.rain1 > 0 && this.state.rain1 < 0.5) ||
          (this.state.rain3 > 0 && this.state.rain3 < 0.5) ? (
            <LightRain style={large} />
          ) : this.state.rain1 > 0.5 ||
            this.state.rain1 === 0.5 ||
            this.state.rain3 > 0.5 ||
            this.state.rain3 === 0.5 ? (
            <HeavyRain style={large} />
          ) : null}
          {(this.state.snow1 > 0 && this.state.snow1 < 0.5) ||
          (this.state.snow3 > 0 && this.state.snow3 < 0.5) ? (
            <LittleSnow style={large} />
          ) : this.state.snow1 > 0.5 ||
            this.state.snow1 === 0.5 ||
            this.state.snow3 > 0.5 ||
            this.state.snow3 === 0.5 ? (
            <BigSnow style={large} />
          ) : null}
          {[
            "Houston, Texas, United States",
            "San Francisco, California, United States",
            "Santa Barbara, California, United States",
            "Atlantic City, New Jersey, United States"
          ].includes(this.props.city) ? (
            <Beach style={large} />
          ) : [
              "Detroit, Michigan, United States",
              "Dallas, Texas, United States",
              "Miami, Florida, United States",
              "Charlotte, North Carolina, United States",
              "Chicago, Illinois, United States",
              "Cleveland, Ohio, United States",
              "Columbus, Ohio, United States",
              "Atlanta, Georgia, United States",
              "Austin, Texas, United States",
              "Boston, Massachusetts, United States",
              "Philadelphia, Pennsylvania, United States",
              "Phoenix, Arizona, United States",
              "Pittsburgh, Pennsylvania, United States",
              "Minneapolis, Minnesota, United States",
              "Montreal, Quebec, Canada",
              "Seattle, Washington, United States",
              "Tampa, Florida, United States",
              "Toronto, Ontario, Canada",
              "Vancouver, British Columbia, Canada",
              "Baltimore, Maryland, United States",
              "San Diego, California, United States"
            ].includes(this.props.city) ? (
            <CityImg style={large} />
          ) : (
            <PlainImg style={large} />
          )}
        </div>
      </div>
    );
  }
}

export default WeatherCitySky;
