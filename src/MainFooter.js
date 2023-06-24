import React from "react";
import chats_large from "./Images/chats_large.png";
//import map_plus from "./Images/map_plus.png";
//import chats_map from "./Images/chats_map.png";
//import communities_map from "./Images/communities_map.png";
import map_large from "./Images/map_large.png";
import communities_large from "./Images/communities_large.png";
import { Link } from "react-router-dom";

import "./MainFooterstyle.css";

class MainFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mylatesttap: "",
      zoomChangedRecently: false,
      openstart: false,
      footerform: null,
      chatIcon: "",
      chatMapIcon:
        "https://www.dl.dropboxusercontent.com/s/nmlgbrfu59q9pci/chats%20map%20%282%29.png?dl=0",
      mapPlus:
        "https://www.dl.dropboxusercontent.com/s/kybh3enumrn5y41/map%20plus%20%282%29.png?dl=0",
      communityIcon: "",
      communityMapIcon:
        "https://www.dl.dropboxusercontent.com/s/9ft7trihm17g148/communities%20map%20%282%29.png?dl=0",
      mapIcon: ""
    };
    this.thing = React.createRef();
  }
  componentDidMount() {
    /*window.addEventListener("resize", (e) => {e.preventDefault()
    console.log("zoomed")
    this.setState({zoomChangedRecently:true})});*/
    this.thing.current &&
      this.thing.current.addEventListener("gestureend", (e) => {
        e.preventDefault();
        console.log("touched");
        if (e.scale > 1) {
          this.setState({ zoomChangedRecently: true });
        }
      });
  }
  doubleTap() {
    var now = new Date().getTime();
    var timesince = now - this.state.mylatesttap;
    console.log(timesince);
    if (timesince < 600 && timesince > 0) {
      // double tap
      window.scrollTo(0, 0);
      window.resizeTo(document.body.clientWidth, document.body.clientHeight);
      this.setState({ zoomChangedRecently: false });
    } else {
      // too much time to be a doubletap
    }
  }
  doit = () => {
    this.doubleTap();
    this.setState({ mylatesttap: new Date().getTime() });
  };
  openChats = () => {
    this.props.eventCloser();
    this.props.chatopener();
  };
  closeEventsChats = () => {
    this.props.eventCloser();
    this.props.chatcloser();
  };
  openEventsCloseChats = () => {
    this.props.eventOpener();
    this.props.chatcloser();
  };
  render() {
    return (
      <div ref={this.thing}>
        {/*window.history.length === 1 ? (
            <div>
              <Link to="/events"><img src={communities_large} className="communities_large2" alt="error" /></Link>
              <img src="https://www.dl.dropboxusercontent.com/s/kybh3enumrn5y41/map%20plus%20%282%29.png?dl=0" className="plus_large2" alt="error" onClick={() => {
                this.setState({footerform: "map"})
                this.props.eventOpener()
                }
              }/>
              <Link to="/chats"><img src={chats_large} className="chats_large2" alt="err" onClick={() => this.setState({footerform: "chats"})}/></Link>
            </div>
            ) : null*/}
        <Link to="/">
          <div onClick={this.openChats}>
            {this.props.eventsOpen ? (
              <img
                onClick={this.openChats}
                src={this.state.chatMapIcon}
                className="chats_large3"
                alt="error"
              />
            ) : (
              <img
                onClick={this.openChats}
                src={chats_large}
                className={
                  this.props.chatsopen
                    ? "chats_large2"
                    : window.location.pathname === "/"
                    ? "chats_large2"
                    : window.location.pathname === "/plan"
                    ? "chats_large"
                    : "chats_large"
                }
                alt="error"
              />
            )}
          </div>
        </Link>
        <Link
          to={this.props.chatsopen || this.props.eventsOpen ? "/" : "/plan"}
        >
          <div onClick={this.closeEventsChats}>
            {this.props.eventsOpen ? (
              <img
                onClick={this.props.mapCloser}
                src={this.state.mapPlus}
                className="plus_large3"
                alt="error"
              />
            ) : (
              <img
                src={this.state.mapPlus}
                className={
                  this.props.menuOpen
                    ? "plus_large2"
                    : this.props.chatsopen
                    ? "plus_large2"
                    : window.location.pathname === "/plan"
                    ? "plus_large"
                    : window.location.pathname === "/"
                    ? "plus_large2"
                    : "plus_large"
                }
                onClick={
                  window.location.pathname === "/plan" &&
                  !this.props.eventsOpen &&
                  !this.props.chatsopen
                    ? this.props.toggle
                    : this.props.eventOpener
                }
                alt="error"
              />
            )}
          </div>
        </Link>
        <Link to="/">
          <div onClick={this.openEventsCloseChats}>
            {this.props.eventsOpen ? (
              <img
                src={this.state.communityMapIcon}
                className="communities_large3"
                alt="error"
              />
            ) : (
              <img
                src={communities_large}
                className={
                  this.props.chatsopen
                    ? "communities_large2"
                    : window.location.pathname === "/"
                    ? "communities_large2"
                    : window.location.pathname === "/plan"
                    ? "communities_large"
                    : "communities_large"
                }
                alt="error"
              />
            )}
          </div>
        </Link>
        <Link to="/">
          <img
            onClick={this.closeEventsChats}
            src={map_large}
            className={
              this.props.chatsopen
                ? "map_large4"
                : window.location.pathname === "/plan"
                ? "map_large"
                : window.location.pathname === "/"
                ? "map_large2"
                : window.location.pathname === "/mapcommunities"
                ? "map_large3"
                : "map_large"
            }
            alt="error"
          />
        </Link>
        {/*
          <Route
            render={location => (
              <Link to="/map">
                <div>
                  {!this.props.auth.uid ? (
                    window.location.pathname === "/events" ||
                    window.location.pathname === "/proposals" ? (
                      <img src={map_large} className="map_large3" alt="error" />
                    ) : null
                  ) : null}
                </div>
              </Link>
            )}
          />
                    */}
        {this.state.zoomChangedRecently ? (
          <div onClick={() => this.doit()} className="zoomoutquick">
            Double-tap to zoom out
          </div>
        ) : null}
      </div>
    );
  }
}

export default MainFooter;
