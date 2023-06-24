import React from "react";
import WeatherCitySky from "./Mapbox/WeatherCitySky";
import { specialFormatting } from "./Sudo";
//Does a warranty indemnity coverage labor contract protect yourself from higher prices?
//Are pilots supposed to rollover insurance or can they determine their own sick days?

const stateCity = [
  {
    name: "Alabama",
    abbreviation: "AL"
  },
  {
    name: "Alaska",
    abbreviation: "AK"
  },
  {
    name: "American Samoa",
    abbreviation: "AS"
  },
  {
    name: "Arizona",
    abbreviation: "AZ"
  },
  {
    name: "Arkansas",
    abbreviation: "AR"
  },
  {
    name: "California",
    abbreviation: "CA"
  },
  {
    name: "Colorado",
    abbreviation: "CO"
  },
  {
    name: "Connecticut",
    abbreviation: "CT"
  },
  {
    name: "Delaware",
    abbreviation: "DE"
  },
  {
    name: "District Of Columbia",
    abbreviation: "DC"
  },
  {
    name: "Federated States Of Micronesia",
    abbreviation: "FM"
  },
  {
    name: "Florida",
    abbreviation: "FL"
  },
  {
    name: "Georgia",
    abbreviation: "GA"
  },
  {
    name: "Guam",
    abbreviation: "GU"
  },
  {
    name: "Hawaii",
    abbreviation: "HI"
  },
  {
    name: "Idaho",
    abbreviation: "ID"
  },
  {
    name: "Illinois",
    abbreviation: "IL"
  },
  {
    name: "Indiana",
    abbreviation: "IN"
  },
  {
    name: "Iowa",
    abbreviation: "IA"
  },
  {
    name: "Kansas",
    abbreviation: "KS"
  },
  {
    name: "Kentucky",
    abbreviation: "KY"
  },
  {
    name: "Louisiana",
    abbreviation: "LA"
  },
  {
    name: "Maine",
    abbreviation: "ME"
  },
  {
    name: "Marshall Islands",
    abbreviation: "MH"
  },
  {
    name: "Maryland",
    abbreviation: "MD"
  },
  {
    name: "Massachusetts",
    abbreviation: "MA"
  },
  {
    name: "Michigan",
    abbreviation: "MI"
  },
  {
    name: "Minnesota",
    abbreviation: "MN"
  },
  {
    name: "Mississippi",
    abbreviation: "MS"
  },
  {
    name: "Missouri",
    abbreviation: "MO"
  },
  {
    name: "Montana",
    abbreviation: "MT"
  },
  {
    name: "Nebraska",
    abbreviation: "NE"
  },
  {
    name: "Nevada",
    abbreviation: "NV"
  },
  {
    name: "New Hampshire",
    abbreviation: "NH"
  },
  {
    name: "New Jersey",
    abbreviation: "NJ"
  },
  {
    name: "New Mexico",
    abbreviation: "NM"
  },
  {
    name: "New York",
    abbreviation: "NY"
  },
  {
    name: "North Carolina",
    abbreviation: "NC"
  },
  {
    name: "North Dakota",
    abbreviation: "ND"
  },
  {
    name: "Northern Mariana Islands",
    abbreviation: "MP"
  },
  {
    name: "Ohio",
    abbreviation: "OH"
  },
  {
    name: "Oklahoma",
    abbreviation: "OK"
  },
  {
    name: "Oregon",
    abbreviation: "OR"
  },
  {
    name: "Palau",
    abbreviation: "PW"
  },
  {
    name: "Pennsylvania",
    abbreviation: "PA"
  },
  {
    name: "Puerto Rico",
    abbreviation: "PR"
  },
  {
    name: "Rhode Island",
    abbreviation: "RI"
  },
  {
    name: "South Carolina",
    abbreviation: "SC"
  },
  {
    name: "South Dakota",
    abbreviation: "SD"
  },
  {
    name: "Tennessee",
    abbreviation: "TN"
  },
  {
    name: "Texas",
    abbreviation: "TX"
  },
  {
    name: "Utah",
    abbreviation: "UT"
  },
  {
    name: "Vermont",
    abbreviation: "VT"
  },
  {
    name: "Virgin Islands",
    abbreviation: "VI"
  },
  {
    name: "Virginia",
    abbreviation: "VA"
  },
  {
    name: "Washington",
    abbreviation: "WA"
  },
  {
    name: "West Virginia",
    abbreviation: "WV"
  },
  {
    name: "Wisconsin",
    abbreviation: "WI"
  },
  {
    name: "Wyoming",
    abbreviation: "WY"
  }
];

class Find extends React.Component {
  state = { searching: "", predictions: [], initial: "event" };
  searcher = (searching) => {
    //console.log(searching);
    this.setState(
      {
        searching: specialFormatting(searching)
      },
      () => {
        clearTimeout(this.closer);
        this.closer = setTimeout(() => this.onSearcher(searching), 2000);
      } /*
      if (searching === "" || !this.props.forumOpen)
        if (searching !== "") {
          if (this.state.lastForumOpen === undefined)
            this.setState({ lastForumOpen: this.props.forumOpen });
          if (!this.props.forumOpen)
            this.props.setIndex({
              forumOpen: true
            });
        } else {
          this.props.setIndex({
            forumOpen: this.state.lastForumOpen
          });
          this.setState({ lastForumOpen: null });
        }
    }*/
    );
  };
  onSearcher = async (lastSearching) => {
    const { typesA = ["(address)"] } = this.props;
    //const { typesE = ["(establishment)"] } = this.props;

    //const numberEntered = /^[\d]/;
    const letterEntered = /^[\W\D]/;
    if (this.state.lastSearching !== lastSearching) {
      this.setState({ lastSearching, typesA }, async () => {
        if (lastSearching && letterEntered.test(lastSearching)) {
          await fetch(
            //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lastSearching}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
          )
            .then(async (response) => await response.json())
            .then(
              (body) =>
                body.features &&
                body.features.constructor === Array &&
                body.features.length > 0 &&
                this.setState(
                  {
                    predictions: [...this.state.predictions, ...body.features],
                    lastPredictions: body.features
                  },
                  () => {}
                ),
              (err) => console.log(err)
            )
            .catch((err) => {
              console.log(err);
              alert("please try another city name");
            });
        }
      });
    } else {
      this.setState({ predictions: this.state.lastPredictions });
    }
  };
  render() {
    const { predictions } = this.state;
    const subtypes =
      this.state.initial === "event"
        ? [
            "food",
            "business",
            "tech",
            "recreation",
            "education",
            "arts",
            "sport",
            "concert",
            "cause",
            "party & clubbing",
            "day party festival"
          ]
        : this.state.initial === "club"
        ? [
            "sport",
            "networking",
            "technology",
            "engineering",
            "science",
            "literature",
            "recreation",
            "arts",
            "medicine",
            "music",
            "non-profit",
            "politics"
          ]
        : this.state.initial === "shop"
        ? [
            "clothing",
            "technology",
            "movies",
            "trinkets",
            "home furnishing",
            "tools",
            "auto",
            "grocery",
            "music",
            "appliances"
          ]
        : this.state.initial === "restaurant"
        ? [
            "chinese",
            "italian",
            "mexican",
            "indian",
            "homestyle & fried",
            "burgers & sandwich",
            "noodles",
            "vegan & health",
            "seafood",
            "breakfast & lunch"
          ]
        : this.state.initial === "service"
        ? [
            "hair, nails & tan",
            "catering",
            "lawyer",
            "mechanic",
            "internist",
            "orthopedist",
            "orthodontist",
            "dentist",
            "graphics & animation",
            "video production",
            "photography",
            "code",
            "architecture",
            "interior design",
            "landscaping",
            "framing",
            "HVAC",
            "painting",
            "plumbing",
            "electrician",
            "accounting",
            "carpentry",
            "welding",
            "masonry",
            "musician",
            "acting",
            "writer",
            "singer"
          ]
        : this.state.initial === "job"
        ? [
            "tech",
            "hospitality",
            "office",
            "auto",
            "home",
            "shipping",
            "education",
            "arts",
            "medical",
            "music",
            "non-profit",
            "business"
          ]
        : this.state.initial === "housing"
        ? [
            "stay",
            "rent",
            "+5m",
            "3-5m",
            "1-3m",
            "800-1m",
            "500-800",
            "100-500",
            "50-100",
            "<50"
          ]
        : this.state.initial === "page"
        ? ["pod", "radio", "television news", "series", "movies"]
        : this.state.initial === "venue"
        ? [
            "in theatre",
            "rewinds & drive-ins",
            "playwrights",
            "music",
            "sport",
            "museum"
          ]
        : false;
    return (
      <div
        onMouseEnter={() =>
          this.setState({ transitionSugg: false }, () =>
            clearTimeout(this.blurring)
          )
        }
        onMouseLeave={() => {
          this.setState(
            { transitionSugg: true },
            () => (this.blurring = setTimeout(this.props.blurSearching, 1200))
          );
        }}
        style={{
          display: "block",
          position: "absolute",
          //backgroundColor: this.state.transitionSugg ? "rgba(0,20,30,.7)" : "",
          transition: `${this.props.focusSuggest ? 0.3 : 1}s ease-in`
          //transform: `scale(${this.props.focusSuggest ? 1 : 0})`
        }}
      >
        <form
          style={{ display: "flex" }}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            style={{
              paddingLeft: "10px",
              margin: "10px",
              height: "36px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid black"
            }}
            value={this.state.searching}
            onChange={(e) => {
              var va = e.target.value;
              this.searcher(va);
            }}
          />
          {this.state.searching !== "" && (
            <div
              onClick={() => this.setState({ searching: "" })}
              style={{
                color: "black",
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "0px 4px",
                height: "min-content"
              }}
            >
              &times;
            </div>
          )}
        </form>
        <div
          style={{
            alignSelf: "right",
            transition: ".3s ease-out",
            maxHeight: !this.props.started ? "" : "0px",
            flexWrap: "wrap",
            display: "flex",
            position: "relative"
            //backgroundImage: `radial-gradient(rgb(160,160,255),rgb(${backgroundColor}))`
          }}
        >
          {this.state.searching === "" ? (
            <div style={{ display: "flex" }}>
              <div
                onClick={() =>
                  this.setState({ openSelector: !this.state.openSelector })
                }
                style={{
                  margin: "10px",
                  height: "20px",
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div
                  style={{
                    borderRadius: "3px",
                    padding: "3px",
                    width: "16px",
                    backgroundColor: "black"
                  }}
                ></div>
                <div
                  style={{
                    borderRadius: "3px",
                    padding: "3px",
                    width: "16px",
                    backgroundColor: "black"
                  }}
                ></div>
                <div
                  style={{
                    borderRadius: "3px",
                    padding: "3px",
                    width: "16px",
                    backgroundColor: "black"
                  }}
                ></div>
              </div>
              {this.state.openSelector && (
                <select
                  value={this.props.subtype}
                  onChange={(e) =>
                    this.props.setApp({
                      subtype: e.target.value
                    })
                  }
                >
                  {subtypes.map((x, i) => {
                    return <option key={i}>{x}</option>;
                  })}
                </select>
              )}
            </div>
          ) : predictions.length === 0 ? (
            <div
              style={{
                paddingLeft: "10px",
                width: "200px",
                color: "rgb(130,130,130)"
              }}
            >
              No communities match
            </div>
          ) : (
            predictions.map((x) => {
              var thiscity = null;
              if (!x.isCommunity) {
                thiscity =
                  x.place_name.split(",")[1] &&
                  stateCity.find((y) =>
                    x.place_name.split(",")[1].includes(y.name)
                  );
              }
              return (
                <div
                  onMouseOver={(e) => {
                    e.stopPropagation();
                    if (this.state.showhover !== x.id) {
                      this.setState({ showhover: x.id });
                    }
                  }}
                  onMouseLeave={() => {
                    clearTimeout(this.leave);

                    this.leave = setTimeout(
                      () => this.setState({ showhover: false }),
                      2789
                    );
                  }}
                  onClick={() => {
                    this.setState({
                      searching: "",
                      predictions: []
                    });
                    this.props.navigate(`/${x.place_name}`);
                  }}
                  key={x.id}
                  style={{
                    top: "2px",
                    paddingLeft: "10px",
                    display: "flex",
                    position: "relative",
                    flexDirection: "column",
                    paddingRight: "5px",
                    width: "min-content",
                    borderLeft:
                      this.props.comm && this.props.comm.id === x.id
                        ? "4px solid pink"
                        : "",
                    color:
                      this.props.comm && this.props.comm.id === x.id
                        ? "grey"
                        : "white"
                  }}
                >
                  <div
                    style={{
                      borderBottomRightRadius: "3px",
                      borderBottomLeftRadius: "3px",
                      padding: "3px",
                      backgroundColor: "rgb(20,20,25)",
                      boxShadow: "0px 5px 5px -3px black"
                    }}
                  >
                    {
                      (x.isCommunity
                        ? x.message
                        : x.place_name
                        ? x.place_name
                        : ""
                      ).split(",")[0]
                    }
                  </div>
                  {thiscity && (
                    <div
                      style={{
                        right: "0px",
                        top: "60px",
                        position: "absolute",
                        borderBottomRightRadius: "3px",
                        borderBottomLeftRadius: "3px",
                        padding: "3px",
                        backgroundColor: "rgb(20,20,25)",
                        boxShadow: "0px 5px 5px -3px black"
                      }}
                    >
                      {thiscity.abbreviation}
                    </div>
                  )}
                  {!x.isCommunity ? (
                    <WeatherCitySky
                      hovering={this.state.showhover === x.id}
                      city={x.place_name}
                      forProfile={true}
                      height={48}
                    />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
}
export default Find;
