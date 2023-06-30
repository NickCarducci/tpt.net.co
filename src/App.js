import React from "react";
import Geohash from "latlon-geohash";
import { QrReader } from "react-qr-reader";
import QRCode from "react-qr-code";
import firebase, { firebaseConfig } from "./init-firebase";
import oldfirebase from "firebase/compat/app";
import "firebase/compat/firestore";
import * as geofirestore from "geofirestore";
import MainFooter from "./MainFooter";
import SDB from "./scopedb";
import "./styles.css";

import Mapbox from "./Mapbox";
import Chats from "./Chats";
import PromptAuth from "./PromptAuth";
import { specialFormatting, standardCatch } from "./Sudo";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import Find from "./Find";
import Make from "./Make";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import Bank from "./Bank";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signOut
} from "firebase/auth";
const firestore = getFirestore(firebase);
class ViewProfile extends React.Component {
  state = {
    myEvents: []
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.auth !== this.props.auth) {
      this.props.auth !== undefined &&
        onSnapshot(
          query(
            collection(firestore, "oldEvent"),
            where("authorId", "==", this.props.auth.uid)
          ),
          (querySnapshot) => {
            this.setState({
              myEvents: querySnapshot.docs
                .map((doc) => {
                  return doc.exists() && { ...doc.data(), id: doc.id };
                })
                .filter((x) => x)
            });
          }
        );
    }
  };
  render() {
    const { viewProfile } = this.props;
    //console.log(this.state.myEvents);
    return (
      <div>
        <div
          style={{
            backgroundColor: "white",
            //transition: ".3s ease-in",
            transform: `translateX(${viewProfile ? "0%" : "100%"})`,
            position: viewProfile ? "absolute" : "fixed",
            width: "100%",
            paddingBottom: "60px"
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "white",
              alignItems: "center",
              display: "flex",
              height: "56px",
              width: "100%",
              backgroundColor: "rgb(180,100,230)"
            }}
          >
            <div
              onClick={() =>
                this.props.setApp({
                  viewProfile: false
                })
              }
              style={{
                margin: "15px",
                width: "20px",
                height: "20px",
                borderBottom: "2px solid white",
                borderLeft: "2px solid white",
                transform: "rotate(45deg)"
              }}
            />
            My past events
            <div onClick={() => this.setState({ viewBanks: true })}>Bank</div>
          </div>
          {this.state.myEvents.map((x, i) => {
            return (
              <div
                key={i}
                onClick={() => {
                  this.props.navigate(`/oldEvent/${x.id}`);
                }}
              >
                {x.title}
              </div>
            );
          })}
        </div>
        <div
          style={{
            backgroundColor: "white",
            //transition: ".3s ease-in",
            transform: `translateX(${this.state.viewBanks ? "0%" : "100%"})`,
            position: this.state.viewBanks ? "absolute" : "fixed",
            width: "100%",
            paddingBottom: "60px"
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "white",
              alignItems: "center",
              display: "flex",
              height: "56px",
              width: "100%",
              backgroundColor: "rgb(180,100,230)"
            }}
          >
            <div
              onClick={() =>
                this.setState({
                  viewBanks: false
                })
              }
              style={{
                margin: "15px",
                width: "20px",
                height: "20px",
                borderBottom: "2px solid white",
                borderLeft: "2px solid white",
                transform: "rotate(45deg)"
              }}
            />
            Banking
          </div>
          <Bank
            getUserInfo={this.props.getUserInfo}
            user={this.props.user}
            auth={this.props.auth}
            navigate={this.props.navigate}
            pathname={this.props.pathname}
          />
        </div>
      </div>
    );
  }
}
class EventsAt extends React.Component {
  state = { sameaddress: [] };
  componentDidMount = () => {
    this.seekEvents();
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.eventsAt !== prevProps.eventsAt) {
      this.seekEvents();
    }
  };
  seekEvents = () => {
    onSnapshot(
      query(
        collection(firestore, "event"),
        where("collection", "==", "event"),
        where("place_name", "==", this.props.eventsAt)
      ),
      (querySnapshot) => {
        //if (querySnapshot.docs.length === 0) return window.alert("dev error");
        this.setState({
          sameaddress: querySnapshot.docs
            .map((doc) => {
              if (doc.exists()) {
                return { ...doc.data(), id: doc.id };
              } else return null;
            })
            .filter((x) => x)
        });
      }
    );
  };
  render() {
    const { sameaddress } = this.state;
    const cityFromPlaceName = this.props.eventsAt
      .split(",")
      .map((x, i) => {
        return i === 0
          ? null
          : i === 2
          ? x.replaceAll(/[\d]/g, "").slice(0, -1)
          : x;
      })
      .filter((x) => x)
      .join();
    //console.log(sameaddress, this.props.mapThis, this.props.eventsAt);
    return (
      <div
        style={{
          zIndex: "1",
          display: "block",
          position: "absolute",
          width: "100%",
          minHeight: "100%",
          backgroundColor: "white"
        }}
      >
        <div
          onClick={() => {
            this.props.navigate(`/${cityFromPlaceName}`);
            this.props.setApp({ eventsAt: null });
          }}
          style={{
            padding: "0px 4px",
            borderRadius: "10px",
            color: "white",
            backgroundColor: "navy",
            position: "absolute",
            right: "10px",
            top: "10px",
            fontSize: "20px"
          }}
        >
          &times;
        </div>
        {sameaddress.map((x, i) => {
          //console.log(x);
          return (
            <div
              key={i}
              onClick={() => this.props.navigate(`/event/${x.id}`)}
              style={{ padding: "4px 10px", margin: "4px 0px" }}
            >
              {x.title} - {new Date(x.date.seconds * 1000).toLocaleString()}
            </div>
          );
        })}
      </div>
    );
  }
}
const reverst = (foo, oldCollection, geo) =>
  geo
    ? geo
        //.firestore()
        .collection(foo.collection)
        //.doc(foo.id)
        .add(foo)
        .then(() => {
          console.log("document moved");
          deleteDoc(doc(firestore, oldCollection, foo.id))
            .then(() =>
              console.log(`doc moved to ${foo.collection} collection ` + foo.id)
            )
            .catch(standardCatch);
        })
        .catch(standardCatch)
    : addDoc(collection(firestore, foo.collection), foo)
        .then(() => {
          console.log("doc moved " + oldCollection);
          deleteDoc(doc(firestore, oldCollection, foo.id))
            .then(() =>
              console.log(`doc moved to ${foo.collection} collection ` + foo.id)
            )
            .catch(standardCatch);
        })
        .catch(standardCatch);
class EntityEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDate: props.entityEvent.date
        ? new Date(props.entityEvent.date.seconds * 1000)
        : new Date(),
      newAttendee: "",
      tickets: [],
      ticketsTaken: [],
      ticketsReserved: [],
      newRows: "40",
      newSeats: "40",
      users: [],
      newPrice: 0
    };
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.entityEvent !== prevProps.entityEvent) {
      this.getVenue();
    }
  };
  getVenue = () => {
    onSnapshot(
      doc(firestore, "entity", this.props.entityEvent.venueId),
      (doc) => {
        console.log(doc.exists(), this.props.entityEvent.venueId);
        this.setState({
          venueOfEvent: doc.exists() && { ...doc.data(), id: doc.id }
        });
      },
      (e) => console.log(e, "venueOfEvent")
    );
  };
  componentDidMount = () => {
    this.getVenue();
  };
  render() {
    const { entityEvent, auth } = this.props;
    //console.log(this.state.eventDate);
    var rowseats = [],
      alphabet = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ];
    var seats =
      this.state.section &&
      this.state.venueOfEvent &&
      this.state.venueOfEvent[this.state.section]
        ? Number(this.state.venueOfEvent[this.state.section].split(":")[1])
        : this.state.section &&
          this.state.chosenVenue &&
          this.state.chosenVenue[this.state.section]
        ? Number(this.state.chosenVenue[this.state.section].split(":")[1])
        : entityEvent.seats
        ? Number(entityEvent.seats)
        : 40;
    var rows =
      this.state.section &&
      this.state.venueOfEvent &&
      this.state.venueOfEvent[this.state.section]
        ? Number(this.state.venueOfEvent[this.state.section].split(":")[0])
        : this.state.section &&
          this.state.chosenVenue &&
          this.state.chosenVenue[this.state.section]
        ? Number(this.state.chosenVenue[this.state.section].split(":")[0])
        : entityEvent.rows
        ? Number(entityEvent.rows)
        : 40;
    this.state.chosenVenue &&
      console.log(this.state.chosenVenue[this.state.section], rows, seats);
    for (let y = 1; y < rows + 1; y++) {
      for (let x = 1; x < seats + 1; x++) {
        rowseats.push([y, x, [x, y]]);
      }
    }
    const rowseat = rowseats.map(([x, y, z]) => [
      ((x - 0) / (seats + 1)) * 500,
      ((y - 0) / (rows + 1)) * 500,
      z
    ]);
    //console.log(this.state.tickets);
    const isAdmin =
      this.props.auth !== undefined &&
      (this.props.auth.uid === entityEvent.authorId ||
        entityEvent.admin.includes(this.props.auth.uid));
    return (
      <div
        style={{
          zIndex: "1",
          display: "flex",
          position: "absolute",
          minWidth: "100%",
          minHeight: "100%",
          backgroundColor: "white"
        }}
      >
        <div
          onClick={() => {
            this.props.navigate(`/${entityEvent.city}`);
            this.props.setApp({ entityEvent: null });
          }}
          style={{
            padding: "0px 4px",
            borderRadius: "10px",
            color: "white",
            backgroundColor: "navy",
            position: "absolute",
            left: "calc(100vw - 45px)",
            top: "10px",
            fontSize: "20px"
          }}
        >
          &times;
        </div>

        {isAdmin && (
          <div
            style={{
              padding: "0px 4px",
              borderRadius: "10px",
              color: "white",
              backgroundColor: "navy",
              position: "absolute",
              left: "calc(100vw - 45px)",
              top: "50px",
              fontSize: "20px"
            }}
            onClick={() => {
              var answer = window.confirm("Want to delete?");
              console.log(entityEvent.collection);
              answer &&
                deleteDoc(
                  doc(firestore, entityEvent.collection, entityEvent.id)
                )
                  .then(() => {
                    this.props.navigate(`/${entityEvent.city}`);
                    this.props.setApp({ entityEvent: null });
                    console.log(
                      `document moved to ${entityEvent.collection} collection ` +
                        entityEvent.id
                    );
                  })
                  .catch(standardCatch);
            }}
          >
            d
          </div>
        )}
        <div>
          <img
            style={{ width: "200px", maxwidth: "100%" }}
            src={entityEvent.chosenPhoto}
            alt={entityEvent.chosenPhoto}
          />
          {entityEvent.collection}
          <br />
          {entityEvent.title}
          <br />
          {entityEvent.body}
          <br />
          <div>
            {isAdmin && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  var answer = window.confirm(
                    "Want to add " +
                      this.state.newTicketer.username +
                      " to the event's ticket booth?"
                  );
                  answer &&
                    updateDoc(doc(firestore, "event", entityEvent.id), {
                      ticketers: arrayUnion(this.state.newTicketer.id)
                    });
                }}
              >
                {this.state.users.map((x, i) => {
                  const selectedTicketer =
                    this.state.newTicketer &&
                    this.state.newTicketer.id === x.id;
                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: selectedTicketer ? "blue" : "",
                        color: selectedTicketer ? "white" : ""
                      }}
                      onClick={(e) =>
                        this.setState({
                          newTicketer: x
                        })
                      }
                    >
                      {x.username}
                    </div>
                  );
                })}
                <input
                  placeholder="username"
                  onChange={(e) =>
                    this.setState(
                      {
                        userQuery: e.target.value
                      },
                      () => {
                        clearTimeout(this.searcher);
                        this.searcher = setTimeout(() => {
                          onSnapshot(
                            query(
                              collection(firestore, "users"),
                              where(
                                "usernameAsArray",
                                "array-contains",
                                this.state.userQuery
                              )
                            ),
                            (querySnapshot) => {
                              this.setState({
                                users: querySnapshot.docs.map((doc) => {
                                  return { ...doc.data(), id: doc.id };
                                })
                              });
                            }
                          );
                        }, 3000);
                      }
                    )
                  }
                />
                <button type="submit">save</button>
              </form>
            )}
            {this.props.auth === undefined ? null : entityEvent.ticketers &&
              entityEvent.ticketers.includes(this.props.auth.uid) ? (
              <div>
                {this.state.ticketsForPatron}
                {this.state.openQrReader && (
                  <QrReader
                    className="qr-reader"
                    scanDelay={3000}
                    onResult={(result, error) => {
                      if (result) {
                        const uid = result.text;
                        if (uid) {
                          this.setState(
                            {
                              ticketsForPatron: entityEvent[uid]
                            },
                            () => {
                              getDoc(doc(firestore, "users", uid)).then(
                                (doc) => {
                                  if (doc.exists()) {
                                    window.alert(doc.data().username);
                                  }
                                }
                              );
                            }
                          );
                        }
                      }

                      if (error) {
                        console.info(error);
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                )}
                <div
                  onClick={() =>
                    this.setState({ openQrReader: !this.state.openQrReader })
                  }
                  style={{
                    border: "2px solid",
                    padding: "0px 4px",
                    width: "max-content",
                    borderRadius: "6px",
                    backgroundColor: "red",
                    color: "white"
                  }}
                >
                  {!this.state.openQrReader ? "Start" : "Stop"} Ticketing
                </div>
              </div>
            ) : (
              entityEvent[this.props.auth.uid] && (
                <div>
                  Your tickets:
                  {entityEvent[this.props.auth.uid].map((x, i) => (
                    <span key={i} style={{ margin: "0px 4px" }}>
                      {x}
                    </span>
                  ))}
                  <br />
                  <QRCode value={this.props.auth.uid} />
                </div>
              )
            )}
            {entityEvent.place_name}
            <br />
            {isAdmin ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const event = [
                      "housing",
                      "event",
                      "job",
                      "plan",
                      "oldEvent"
                    ].includes(entityEvent.collection),
                    eventCollectionNow = !event
                      ? null
                      : new Date(entityEvent.date.seconds * 1000) > new Date()
                      ? "event"
                      : "oldEvent",
                    eventCollection = !event
                      ? null
                      : this.state.eventDate < new Date()
                      ? "oldEvent"
                      : "event";
                  if (!event) return null;
                  var answer = window.confirm(
                    `Update ${eventCollectionNow} date to ` +
                      this.state.eventDate.toLocaleString()
                  );
                  const isChanged =
                    (eventCollection === "oldEvent" &&
                      new Date(entityEvent.date.seconds * 1000) > new Date()) ||
                    (eventCollection === "event" &&
                      new Date(entityEvent.date.seconds * 1000) < new Date());
                  console.log("isChanged", isChanged);

                  answer &&
                    isChanged &&
                    reverst(
                      {
                        ...entityEvent,
                        collection: eventCollection,
                        date: this.state.eventDate
                      },
                      eventCollectionNow,
                      this.GeoFirestore
                    );
                  this.props.navigate(`/${entityEvent.city}`);
                  this.props.setApp({ entityEvent: null });
                  //window.location.reload();
                  //this.props.navigate(`/${entityEvent.city}`);

                  /*(isChanged ? setDoc : updateDoc)(
                    doc(
                      firestore,
                      event ? eventCollection : "entity",
                      entityEvent.id
                    ),
                    {
                      date: this.state.eventDate,
                      updatedAt: new Date()
                    }
                  )
                    .then(() => {
                      deleteDoc(
                        doc(
                          firestore,
                          eventCollection === "oldEvent" ? "event" : "oldEvent",
                          entityEvent.id
                        )
                      )
                        .then(() =>
                          console.log(
                            `document moved to ${entityEvent.collection} collection ` +
                              entityEvent.id
                          )
                        )
                        .catch(standardCatch);
                    })
                    .catch((e) => console.log(e, "edit date"));*/
                }}
                style={{ display: "flex" }}
              >
                <DateTimePicker
                  className="react-datetime-picker"
                  onChange={(newValue) =>
                    this.setState({ eventDate: new Date(newValue) })
                  }
                  value={this.state.eventDate}
                  shouldOpenWidgets={({ reason, widget }) =>
                    widget === "calendar"
                  }
                />
                {this.state.eventDate.getTime() !==
                  new Date(entityEvent.date.seconds * 1000).getTime() && (
                  <button type="submit">Save</button>
                )}
              </form>
            ) : (
              entityEvent.date &&
              new Date(entityEvent.date.seconds * 1000).toLocaleString()
            )}
            <div
              onClick={() => {
                this.props.navigate(`/${entityEvent.city}`);
                this.props.setApp({ entityEvent: null });
                /*window.location.href =
                "https://" +
                window.location.hostname +
                "/" +
                entityEvent.city;*/
              }}
              style={{
                borderRadius: "10px",
                padding: "10px",
                margin: "4px 10px",
                backgroundColor: "blue",
                color: "white"
              }}
            >
              Go to {entityEvent.city}
            </div>
            <div>
              <form
                style={{ display: "flex" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  isAdmin &&
                    updateDoc(doc(firestore, "event", entityEvent.id), {
                      venueId: this.state.chosenVenue
                        ? this.state.chosenVenue.id
                        : deleteField()
                    }).catch((e) => console.log(e, "venueId"));
                }}
              >
                {this.state.venue && (
                  <select
                    onChange={(e) => {
                      const chosenVenue = this.state.venue.find(
                        (x) => x.id === e.target.value
                      );
                      this.setState({ chosenVenue, section: null });
                    }}
                    value={this.state.chosenVenue && this.state.chosenVenue.id}
                  >
                    {[{ title: "venues" }, ...this.state.venue].map((x, i) => {
                      return (
                        <option key={i} value={x.id}>
                          {x.title}
                        </option>
                      );
                    })}
                  </select>
                )}
                {this.state.chosenVenue && <button>Use</button>}
              </form>
              {this.state.venueOfEvent ? (
                <div
                  style={{
                    border: "2px solid",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    width: "max-content"
                  }}
                  onClick={() => {
                    if (!isAdmin) return null;
                    var answer = window.confirm(
                      "Remove venue " +
                        this.state.venueOfEvent.title +
                        " from event " +
                        this.props.entityEvent.title +
                        "?"
                    );
                    answer &&
                      updateDoc(doc(firestore, "event", entityEvent.id), {
                        venueId: deleteField()
                      }).catch((e) => console.log(e, "venueId"));
                  }}
                >
                  {this.state.venueOfEvent.title}
                </div>
              ) : (
                <div
                  onClick={() => {
                    onSnapshot(
                      query(
                        collection(firestore, "entity"),
                        where("collection", "==", "venue"),
                        where("authorId", "==", this.props.auth.uid)
                      ),
                      (querySnapshot) => {
                        this.setState(
                          {
                            venue: querySnapshot.docs
                              .map((doc) => {
                                return (
                                  doc.exists() && { ...doc.data(), id: doc.id }
                                );
                              })
                              .filter((x) => x)
                          },
                          () => {
                            onSnapshot(
                              query(
                                collection(firestore, "entity"),
                                where("collection", "==", "venue"),
                                where(
                                  "admin",
                                  "array-contains",
                                  this.props.auth.uid
                                )
                              ),
                              (querySnapshot) => {
                                this.setState({
                                  venue: [
                                    ...querySnapshot.docs
                                      .map((doc) => {
                                        return (
                                          doc.exists() && {
                                            ...doc.data(),
                                            id: doc.id
                                          }
                                        );
                                      })
                                      .filter((x) => x),
                                    ...this.state.venue
                                  ]
                                });
                              }
                            );
                          }
                        );
                      }
                    );
                  }}
                >
                  Get Venues
                </div>
              )}
            </div>
            <div>
              {/*this.props.auth !== undefined &&
                (this.props.auth.uid === entityEvent.authorId ||
                  entityEvent.admin.includes(this.props.auth.uid)) &&
                this.state.chosenVenue &&
                this.state.section && (
                  <div
                    onClick={() => {
                      var answer = window.confirm(
                        `Save section ` +
                          this.state.section +
                          ` to venue ` +
                          this.state.chosenVenue.title
                      );
                      answer &&
                        updateDoc(
                          doc(firestore, "entity", this.state.chosenVenue.id)
                        ,{
                          [this.state.section]:this.state.rows
                        });
                    }}
                  >
                    Save section to venue
                  </div>
                )*/}
              {this.props.auth !== undefined &&
                this.props.auth.uid === entityEvent.authorId && (
                  <div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (this.state.chosenVenue) {
                          var answer1 = window.confirm(
                            "Save " +
                              this.state.chosenVenue.title +
                              " section " +
                              this.state.section +
                              " as " +
                              this.state.newRows +
                              ":" +
                              this.state.newSeats
                          );
                          return (
                            answer1 &&
                            updateDoc(
                              doc(
                                firestore,
                                "entity",
                                this.state.chosenVenue.id
                              ),
                              {
                                [this.state.section]:
                                  this.state.newRows + ":" + this.state.newSeats
                              }
                            )
                          );
                        }
                        var answer = window.confirm(
                          "Update all sections to default " +
                            this.state.newRows +
                            ":" +
                            this.state.newSeats
                        );
                        answer &&
                          updateDoc(doc(firestore, "event", entityEvent.id), {
                            rows: this.state.newRows,
                            seats: this.state.newSeats
                          });
                      }}
                      style={{ display: "flex" }}
                    >
                      <div
                        style={{
                          width: "max-content"
                        }}
                        onClick={() =>
                          this.setState({
                            newSection: !this.state.newSection
                          })
                        }
                      >
                        Add section +
                      </div>
                      <input
                        style={{ width: "80px" }}
                        placeholder="rows"
                        max={70}
                        min={1}
                        type="number"
                        onChange={(e) => {
                          this.setState({
                            newRows: e.target.value
                          });
                        }}
                      />
                      <input
                        style={{ width: "80px" }}
                        placeholder="seats"
                        max={70}
                        min={1}
                        type="number"
                        onChange={(e) => {
                          this.setState({
                            newSeats: e.target.value
                          });
                        }}
                      />
                      <button type="submit">Save</button>
                    </form>
                    {this.state.newSection && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (this.state.newSection !== "") {
                            if (this.state.chosenVenue) {
                              //return console.log(this.state.chosenVenue);
                              return updateDoc(
                                doc(
                                  firestore,
                                  "entity",
                                  this.state.chosenVenue.id
                                ),
                                {
                                  [this.state.newSection]: "40:40"
                                }
                              )
                                .then(() => this.setState({ newSection: null }))
                                .catch((e) => console.log(e, "section"));
                            }
                            updateDoc(doc(firestore, "event", entityEvent.id), {
                              sections: arrayUnion(this.state.newSection)
                            })
                              .then(() => this.setState({ newSection: null }))
                              .catch((e) => console.log(e, "section"));
                          }
                        }}
                      >
                        <input
                          placeholder="name"
                          //value={this.state.newSection}
                          onChange={(e) => {
                            this.setState({
                              newSection: specialFormatting(
                                e.target.value,
                                true
                              )
                            });
                          }}
                        />
                      </form>
                    )}
                  </div>
                )}
              <div style={{ display: "flex" }}>
                {this.state.venueOfEvent ? (
                  <select
                    value={this.state.section}
                    onChange={(e) =>
                      this.setState({ section: e.target.value, tickets: [] })
                    }
                  >
                    {[
                      "section",
                      ...Object.keys(this.state.venueOfEvent).filter((x) =>
                        /[A-Z\d]/.test(x.charAt(0))
                      )
                    ].map((x, i) => (
                      <option key={i}>{x}</option>
                    ))}
                  </select>
                ) : this.state.chosenVenue ? (
                  <select
                    value={this.state.section}
                    onChange={(e) =>
                      this.setState({ section: e.target.value, tickets: [] })
                    }
                  >
                    {[
                      "section",
                      ...Object.keys(this.state.chosenVenue).filter((x) =>
                        /[A-Z\d]/.test(x.charAt(0))
                      )
                    ].map((x, i) => (
                      <option key={i}>{x}</option>
                    ))}
                  </select>
                ) : (
                  entityEvent.sections && (
                    <select
                      value={this.state.section}
                      onChange={(e) =>
                        this.setState({ section: e.target.value, tickets: [] })
                      }
                    >
                      {["section", ...entityEvent.sections].map((x, i) => (
                        <option key={i}>{x}</option>
                      ))}
                    </select>
                  )
                )}
                <span>
                  {rows}rows:{seats}seats
                </span>
              </div>
              {isAdmin ? (
                <div
                  style={{
                    textDecoration: this.state.section && "underline"
                  }}
                  onClick={() => {
                    if (this.state.tickets.length > 0) {
                      this.setState({ changePrices: true });
                    } else if (this.state.section) {
                      this.setState({
                        tickets: rowseat
                          .map(([x, y, z], i) => {
                            const ticket = String([this.state.section, ...z]);
                            if (
                              entityEvent.ticketsTaken &&
                              entityEvent.ticketsTaken.includes(ticket)
                            )
                              return null;
                            if (
                              entityEvent.ticketsReserved &&
                              entityEvent.ticketsReserved.includes(ticket)
                            )
                              return null;
                            if (this.state.tickets.includes(ticket)) {
                              return null;
                            } else return ticket;
                          })
                          .filter((x) => x)
                      });
                    }
                  }}
                >
                  {this.state.tickets.length > 0
                    ? "Edit prices"
                    : this.state.section && "select all"}
                </div>
              ) : null}
              {this.state.changePrices && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (this.props.pathname.includes("/oldEvent/"))
                      return window.alert(
                        "this event is too old. no tickets " +
                          (isAdmin ? "are " : "can be made ") +
                          "available"
                      );
                    var answer = window.confirm(
                      "Update prices (" +
                        this.state.newPrice +
                        ") for tickets " +
                        this.state.tickets
                    );
                    answer &&
                      this.state.tickets.map((x) => {
                        return updateDoc(
                          doc(
                            firestore, //this.props.pathname.includes("/oldEvent/")?"oldEvent":
                            "event",
                            entityEvent.id
                          ),
                          { [x]: this.state.newPrice }
                        );
                      }); //.then(() => window.location.reload());
                  }}
                >
                  <input
                    value={this.state.newPrice}
                    type="number"
                    onChange={(e) =>
                      this.setState({ newPrice: e.target.value })
                    }
                  />
                </form>
              )}
              {/*this.state.tickets.map((x, i) => {
                return (
                  <div key={i}>
                    {x}:{entityEvent[x] ? entityEvent[x] : 0}
                  </div>
                );
              })*/}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  display:
                    this.state.section && this.state.section !== "section"
                      ? "block"
                      : "none",
                  position: "relative",
                  height: "500px",
                  width: "600px"
                }}
              >
                {rowseat.map(([x, y, z], i) => {
                  const ticket = String([this.state.section, ...z]);
                  return (
                    !isNaN(x) &&
                    !isNaN(y) && (
                      <g key={i}>
                        {this.state.hoveringtickets === ticket && (
                          <text
                            x={x}
                            y={y}
                            fontFamily="Verdana"
                            fontSize="5"
                            fill="blue"
                          >
                            {ticket}:
                            {entityEvent[ticket] ? entityEvent[ticket] : 0}
                          </text>
                        )}
                        <rect
                          cursor="pointer"
                          opacity={
                            this.state.hoveringtickets === ticket ||
                            this.state.tickets.includes(ticket)
                              ? 1
                              : 0.6
                          }
                          onClick={() => {
                            if (
                              entityEvent.ticketsTaken &&
                              entityEvent.ticketsTaken.includes(ticket)
                            )
                              return window.alert(
                                (this.props.auth !== undefined &&
                                entityEvent[this.props.auth.uid].includes(
                                  ticket
                                )
                                  ? "You have"
                                  : "Someone has") +
                                  " already purchased this ticket (" +
                                  ticket +
                                  ")"
                              );
                            if (
                              entityEvent.ticketsReserved &&
                              entityEvent.ticketsReserved.includes(ticket) &&
                              !isAdmin
                            )
                              return window.alert(
                                "This seat (" + ticket + ") is reserved."
                              );
                            if (this.state.tickets.includes(ticket)) {
                              this.setState({
                                tickets: this.state.tickets.filter(
                                  (x) => x !== ticket
                                )
                              });
                            } else
                              this.setState({
                                tickets: [...this.state.tickets, ticket]
                              });
                          }}
                          x={x}
                          y={y}
                          width={10}
                          height={6}
                          stroke={"white"}
                          fill={
                            this.state.tickets.includes(ticket)
                              ? isAuthor
                                ? "firebrick"
                                : "blue"
                              : entityEvent.ticketsTaken &&
                                entityEvent.ticketsTaken.includes(ticket)
                              ? "dimgrey"
                              : entityEvent.ticketsReserved &&
                                entityEvent.ticketsReserved.includes(ticket)
                              ? "black"
                              : "orange"
                          }
                          strokeWidth={0.5}
                          key={i}
                          onMouseEnter={(e) => {
                            this.setState({ hoveringtickets: ticket });
                          }}
                        />
                      </g>
                    )
                  );
                })}
              </svg>

              {this.props.auth !== undefined ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (this.props.pathname.includes("/oldEvent/"))
                      return window.alert(
                        "this event is too old. no tickets " +
                          (isAdmin ? "are " : "can be made ") +
                          "available"
                      );
                    if (isAdmin) {
                      if (this.state.tickets.length === 0) return null;
                      const toRemove =
                        entityEvent.ticketsReserved &&
                        entityEvent.ticketsReserved.filter((x) =>
                          this.state.tickets.includes(x)
                        );
                      if (toRemove && toRemove.length > 0) {
                        var answer = window.confirm(
                          "Want to reinstate these tickets (" +
                            this.state.tickets +
                            ") for availability?"
                        );
                        return (
                          answer &&
                          updateDoc(doc(firestore, "event", entityEvent.id), {
                            ticketsReserved: arrayRemove(...toRemove)
                          })
                        );
                      }
                      var answer1 = window.confirm(
                        "Want to reserve these tickets (" +
                          this.state.tickets +
                          ") for whatever?"
                      );
                      return (
                        answer1 &&
                        updateDoc(doc(firestore, "event", entityEvent.id), {
                          ticketsReserved: arrayUnion(...this.state.tickets)
                        })
                      );
                    }
                    var answer2 = window.confirm(
                      "Want to buy these tickets (" + this.state.tickets + ")?"
                    );
                    if (answer2) {
                      const takeTickets = () =>
                        updateDoc(doc(firestore, "event", entityEvent.id), {
                          [this.props.auth.uid]: arrayUnion(
                            ...this.state.tickets
                          ),
                          ticketsTaken: arrayUnion(...this.state.tickets)
                        });
                      var total = 0;
                      this.state.tickets.forEach((x) => {
                        total = total + (entityEvent[x] ? entityEvent[x] : 0);
                      });
                      if (total === 0) {
                        return takeTickets();
                      }
                      if (!this.props.user.customerId)
                        return window.alert(
                          "You haven't setup a customer account yet. Visit you 'Bank' in the events section."
                        );
                      const user = this.props.hydrateUser(entityEvent.authorId);
                      if (!user.stripeId || (user.stripeId && user.stripeLink))
                        return window.alert(
                          "This event maker hasn't setup a bank account yet."
                        );
                      await fetch(
                        "https://king-prawn-app-j2f2s.ondigitalocean.app/transfer",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "Application/JSON",
                            "Access-Control-Request-Method": "POST",
                            "Access-Control-Request-Headers": [
                              "Origin",
                              "Content-Type"
                            ] //allow referer
                          },
                          body: JSON.stringify({
                            customerId: this.props.user.customerId,
                            total: this.state.total,
                            stripeId: user.stripeId
                          })
                        }
                      )
                        .then(async (res) => await res.json())
                        .then(async (result) => {
                          if (result.status) return console.log(result);
                          if (result.error) return console.log(result);
                          if (!result.setupIntent)
                            return console.log("dev error (Cash)", result);
                          takeTickets();
                          window.location.reload();
                        })
                        .catch(standardCatch);
                    }
                  }}
                  style={{
                    fontSize: "8px",
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap"
                  }}
                >
                  {this.state.tickets.map((x, i) => (
                    <span style={{ margin: "0px 4px" }} key={i}>
                      {x}
                    </span>
                  ))}
                  <button type="submit">
                    {isAdmin ? "reserve" : "submit"}
                  </button>
                </form>
              ) : (
                <div>you must login to buy tickets (no refunds)</div>
              )}
            </div>
          </div>
          {this.props.auth !== undefined &&
            (this.props.auth.uid === entityEvent.authorId ||
              entityEvent.admin.includes(this.props.auth.uid)) && <div />}
        </div>
      </div>
    );
  }
}
/**
 * 
    ...this.state.tickets.map((x) => {
      return {
        [x]: this.state.attendees
      };
    }),
if (this.state.attendees.length > this.state.tickets.length) {
  return window.alert(
    "You have more attendees than tickets selected. Delete an attendee or select another ticket."
  );
} else if (
  this.state.tickets.length > this.state.attendees.length
) {
  return window.alert(
    "You have selected more tickets than you have attendees. Deselect a ticket or add another attendee."
  );
}
<i>You can transfer ownership of less than 10 seats</i>
<form
  style={{ display: "flex" }}
  onSubmit={(e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.newAttendee === "") return null;
    var answer = window.confirm(
      "Add ticket for " + this.state.newAttendee + "?"
    );
    answer &&
      this.setState({
        attendees: [
          ...this.state.attendees,
          this.state.newAttendee
        ],
        newAttendee: ""
      });
  }}
>
  {this.state.attendees.length > 9 ? (
    <input
      minLength={2}
      value={this.state.newAttendee}
      placeholder="attendee"
      onChange={(e) =>
        this.setState({
          newAttendee: e.target.value
        })
      }
    />
  ) : (
    "tickets"
  )}
  <select
    onChange={(e) => {
      let attendees = [];
      for (let x = 0; x < e.target.value; x++) {
        attendees.push("*");
      }
      this.setState({
        attendees
      });
    }}
  >
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
      <option>{x}</option>
    ))}
  </select>
</form>
{this.state.attendees.map((x) => {
  return (
    <div
      onClick={() => {
        if (x === "*") return null;
        //delete
      }}
    >
      {x}
    </div>
  );
})}
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    let sdb = new SDB();
    this.state = {
      user: "",
      cityapisLoaded: [],
      sdb,
      loading: true,
      createSliderOpen: false,
      switchCommunitiesOpen: false,
      switchCMapOpen: false,
      menuOpen: false,
      billSelected: "",
      bills: [],
      cards: ["First", "Second", "Third"],
      goSignupConfirmedPlay: false,
      watchingSignupVideo: false,
      justOpened: true,
      loginOpen: false,
      events: [],
      center: [-74.00597, 40.71427],
      city: "New York, New York, United States",
      distance: 15,
      chosenEdmevent: undefined,
      queryingWait: false,
      chatsopen: false,
      eventChosen: "",
      ok: true,
      recordedUsers: [],
      recordedUserNames: [],
      users: [],
      event: [],
      recordedEntityNames: [],
      recordedEntities: [],
      entity: [],
      subtype: "party & clubbing"
      //zoomChangedRecently:false
    };
    this.CreateEventThePage = React.createRef();
    this.CreateEvent = React.createRef();
    this.ref = React.createRef();
    this.gui = React.createRef();
    this.pa = React.createRef();
    this.ra = React.createRef();
    this.pinch = React.createRef();
    this.hydrateUserFromUserName.user = this.hydrateUserFromUserName.bind(this);
    this.hydrateUserFromUserName.closer = this.hydrateUserFromUserName.bind(
      this
    );
    this.hydrateUser.closer = this.hydrateUser.bind(this);
    this.hydrateUser.user = this.hydrateUser.bind(this);
    this.GeoFirestore = geofirestore.initializeApp(
      oldfirebase.initializeApp(firebaseConfig).firestore()
    );
    this.hydrateEntityFromName.closer = this.hydrateEntityFromName.bind(this);
    this.hydrateEntityFromName.entity = this.hydrateEntityFromName.bind(this);
    this.hydrateEntity.closer = this.hydrateEntity.bind(this);
    this.hydrateEntity.entity = this.hydrateEntity.bind(this);
  }
  componentDidMount = async () => {
    this.handleURLPathnameParams(); //handleNewCity
  };

  handleURLPathnameParams = async () => {
    const params = this.props.pathname
      .split("/")
      .filter((x) => x !== "")
      .map((x) => x.replaceAll("%20", " "));
    var newCityToQuery = params[0];
    const letterEntered = /^[\W\D]/;
    if (!newCityToQuery || !letterEntered.test(newCityToQuery)) return null;
    if (!newCityToQuery.includes(",")) {
      var entityEvent = {};
      if (params.length > 2) {
        if (params[1] === "ticketmaster") {
          const ticketmaster = this.state.event.find((x) => x.id === params[2]);
          console.log(this.state.event, ticketmaster);
          return this.setState({
            ticketmaster
          });
        }
        console.log(params);
        //[collection,name,community]
        const pos = [params[0], params[1], params[2]]; //.replace(/_/g, " ")];
        var entityNamed = await this.hydrateEntityFromName([...pos]).entity();
        entityEvent = entityNamed && JSON.parse(entityNamed);
      } else if (params.length > 1) {
        if (params[0] === "events") {
          const eventsAt = params[1];
          console.log("eventsAt", eventsAt);
          return this.setState({
            eventsAt
          });
        }
        //[id,collection]

        const event = ["event", "plan", "job", "housing"].includes(params[0]);
        onSnapshot(
          doc(
            firestore,
            params[0] === "oldEvent" ? params[0] : event ? "event" : "entity",
            params[1]
          ),
          (doc) => {
            this.setState({
              entityEvent: doc.exists() && { ...doc.data(), id: doc.id }
            });
          }
        );
      } else if (params.length === 1) {
        //username
        return null;
      }
    } else {
      newCityToQuery = specialFormatting(newCityToQuery).replace(/_/g, " ");
      //if (newCityToQuery !== this.props.city)
      console.log(newCityToQuery);
      await fetch(
        //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${newCityToQuery}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
      )
        .then(async (response) => await response.json())
        .then((body) => {
          var city = body.features[0].place_name;
          if (city) {
            console.log("found " + city);

            const center = body.features[0].center;
            const latlng = [center[1], center[0]];
            const query = this.GeoFirestore.collection("event")
              .where("collection", "==", "event")
              .near({
                center: new oldfirebase.firestore.GeoPoint(...latlng),
                radius: this.state.distance
              });
            // Get query (as Promise)
            query
              //.get()
              .onSnapshot(
                (value) => {
                  if (value.docs.length === 0)
                    return console.log("empty ", latlng);
                  const events = value.docs
                    .map((doc) => {
                      var foo = doc.exists && { ...doc.data(), id: doc.id };
                      /**
                       * EDIT DATE COLLECTION
                       */
                      const isChanged =
                        (foo.collection === "oldEvent" &&
                          new Date(foo.date.seconds * 1000) > new Date()) ||
                        (foo.collection === "event" &&
                          new Date(foo.date.seconds * 1000) < new Date());
                      isChanged && console.log("isChanged", doc.id);
                      var oldCollection = foo.collection,
                        newCollection =
                          foo.collection === "oldEvent" ? "event" : "oldEvent";
                      foo.collection = isChanged
                        ? newCollection
                        : foo.collection;
                      isChanged &&
                        reverst(foo, oldCollection, this.GeoFirestore);
                      return foo;
                    })
                    .filter((x) => x);
                  console.log("success", events);
                  this.setState(
                    {
                      city,
                      center,
                      events
                    },
                    async () => {
                      const cityapi = city.split(",")[0]; //.replace(/[, ]+/g, "_");
                      const stateapi = city.split(", ")[1];
                      //.replace(/ /g, "_");

                      //const statefull = states.getStateNameByStateCode(state);
                      await fetch(
                        `https://edmtrain.com/api/locations?state=${stateapi}&city=${cityapi}&client=a82999b7-c837-4ea7-bed7-b957cf526730`
                      )
                        .then(async (response) => await response.json())
                        .then((body) => {
                          //console.log("edmtrain", cityapi, stateapi, body);
                          if (body.data[0]) {
                            const id = body.data[0].id;
                            // if nearby city this.getEdmTrainpoint(cityapi, state) repeat loop back
                            // otherwise, continue
                            id &&
                              this.getAgainTrain(id, cityapi, stateapi, latlng);
                          }
                          //this.setState({ edmTrainevents: text })
                        })
                        .catch((err) => console.log(err.message));
                    }
                  );
                  // All GeoDocument returned by GeoQuery, like the GeoDocument added above
                },
                (e) => standardCatch(e, "evennt")
              );
          }
        })
        .catch((err) => {
          console.log(err);
          alert("please try another city name");
        });
    }
  };
  getAgainTrain = async (id, cityapi, stateapi, latlng) => {
    const time = new Date(),
      range = 604800000; //this.props.queriedDate;

    const THIS_YEAR = new Date().getFullYear();
    const THIS_MONTH = new Date().getMonth() + 1;
    const getMonthDays = (month = THIS_MONTH, year = THIS_YEAR) => {
      const months30 = [4, 6, 9, 11];
      const leapYear = year % 4 === 0;

      return month === 2
        ? leapYear
          ? 29
          : 28
        : months30.includes(month)
        ? 30
        : 31;
    };
    const OKDATE = new Date(time);
    const day = OKDATE.getDate();
    const month = OKDATE.getMonth() + 1;
    const year = OKDATE.getFullYear();
    const monthdays = getMonthDays(month, year);
    var rangeInDays = Math.round(range / 86400000);
    const nextWeek =
      day + rangeInDays > monthdays
        ? rangeInDays - (monthdays - day)
        : day + rangeInDays;
    const nextMonth = month < 12 ? month + 1 : 1;
    const nextyear =
      day + rangeInDays > monthdays && nextMonth === 1
        ? new Date(OKDATE.setFullYear(OKDATE.getFullYear() + 1)).getFullYear()
        : OKDATE.getFullYear();
    //const nextmonthdays = getMonthDays(nextmonth, nextyear)

    const paddedday = day < 10 ? "0" + day : day;
    const paddedNextWeek = nextWeek < 10 ? "0" + nextWeek : nextWeek;
    const paddedMonth = month < 10 ? "0" + month : month;
    const paddedNextMonth = nextMonth < 10 ? "0" + nextMonth : nextMonth;
    const endmonth =
      day + rangeInDays > monthdays ? paddedNextMonth : paddedMonth;
    //return res.send(id, year, nextMonth, today)
    const startDate = `${year}-${paddedMonth}-${paddedday}`;
    const quotesStart = JSON.stringify(startDate);
    const stringStart = quotesStart.replace(/['"]+/g, "");
    const goodDate = `${nextyear}-${endmonth}-${paddedNextWeek}`;
    const quotesDate = JSON.stringify(goodDate);
    const stringDate = quotesDate.replace(/['"]+/g, "");
    const url =
      "https://edmtrain.com/api/events?locationIds=" +
      id +
      "&startDate=" +
      stringStart +
      "&endDate=" +
      stringDate +
      "&client=a82999b7-c837-4ea7-bed7-b957cf526730";
    //console.log(url);
    await fetch(url)
      .then(async (response) => await response.json())
      .then((body) => {
        var boh = body.data;
        let them = [];
        boh && boh.length === 0 && console.log("No edm train events", body);
        var thiss = new Date(time);
        thiss.setHours(12, 0, 0, 0);
        boh.map((data) => {
          data.message = data.name
            ? data.name
            : String(data.artistList.map((x) => x.name));
          data.subtype = "party & clubbing";
          data.datel = new Date(
            new Date(data.date).setHours(0, 0, 0, 0) + 86400000
          );
          data.place_name = data.venue.address;
          if (data.datel.getTime() - thiss > 0) {
            return them.push(data);
          } else return null;
        });
        var touch = new Date(time);
        touch.setHours(0, 0, 0, 0);
        const neww = new Date(touch).getTime();
        this.setState({
          edmStore: { [cityapi + stateapi + neww + range]: them }
        });
        //console.log("edm train", them);

        let dol = [];
        this.state.events.map((ev) => {
          ev.datel = new Date(
            new Date(ev.date).setHours(0, 0, 0, 0) + 86400000
          );
          if (
            new Date(ev.datel).setHours(0, 0, 0, 0) > time &&
            new Date(ev.datel).setHours(0, 0, 0, 0) < time + range
          ) {
            dol.push(ev);
          }

          return null;
        });
        const event = them
          ? [...them, ...this.state.events].sort((a, b) => b.datel - a.datel)
          : this.state.events;
        console.log("all events", event);
        this.setState(
          {
            event //: this.state.events
          },
          async () => {
            const consumerSecret = "iAkWSqAXXAFLtxiFJYQJeqYpWcZDVUbt";
            const url = `https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=${Geohash.encode(
              ...latlng,
              [9]
            )}&size=150&apikey=${consumerSecret}`;
            await fetch(url)
              .then(async (response) => await response.json())
              .then((body) => {
                console.log(latlng, body._embedded.events);
                this.setState({
                  event: [
                    ...body._embedded.events.map((x) => {
                      const location = x._embedded.venues[0].location,
                        center = [
                          Number(location.longitude),
                          Number(location.latitude)
                        ];
                      //console.log(center);
                      return {
                        ...x,
                        subtype:
                          x.classifications[0].segment.name === "Music"
                            ? "concert"
                            : x.classifications[0].segment.name === "Sports"
                            ? "sport"
                            : "recreation",
                        center,
                        date: x.dates.start.dateTime
                      };
                    }),
                    ...this.state.event
                  ]
                });
              })
              .catch((err) => console.log(err.message));
          }
        );
      })
      .catch((err) => console.log(err.message));
  };
  // plus sign
  createSliderOpener = () => {
    this.setState({
      createSliderOpen: true
    });
  };
  createSliderCloser = () => {
    this.setState({
      createSliderOpen: false
    });
  };
  billSelected = (event) => {
    this.setState({ billSelected: event.packageId });
  };
  updateBills = (results) => {
    this.setState({ bills: [...this.state.bills, ...results.packages] });
  };
  // render
  goSignupConfirmed = () => {
    this.setState({ watchingSignupVideo: true });
  };
  signupConfirmClose = () => {
    this.setState({ watchingSignupVideo: false });
  };

  switchCommunitiesOpener = () => {
    this.setState({
      switchCommunitiesOpen: !this.state.switchCommunitiesOpen
    });
  };
  switchCommunitiesCloser = () => {
    this.setState({
      switchCommunitiesOpen: false
    });
  };
  eventOpener = () => {
    this.setState({ eventsOpen: true });
  };
  eventCloser = () => {
    this.setState({ eventsOpen: false });
  };
  //console.log(this.state.sw[0], this.state.ne[0])
  switchCMapOpener = () => {
    this.setState({ switchCMapOpen: true });
  };
  switchCMapCloser = () => {
    this.setState({ switchCMapOpen: false });
  };
  choosetheedm = (eventEdm) => {
    this.setState({ chosenEdmevent: eventEdm });
    this.eventCloser();
    this.switchCMapCloser();
  };
  doneQueryCity = () => {
    this.setState({ queryingWait: false });
  };
  startQueryCity = () => {
    this.setState({ queryingWait: true });
  };
  changeCity = (center) => {
    this.setState({ center });
  };
  async setKey(key, method) {
    let res = await this.state.sdb[method](key);

    this.setState({
      key
    });
    //this.props.history.replace('/plan')
    //this.props.history.replace(`/plans/${res.id}`)
    return res;
  }
  eventTypesOpener = () => {
    this.setState({
      typesOrTiles: true
    });
  };
  eventTypesCloser = () => {
    this.setState({
      typesOrTiles: null
    });
  };
  mapcity = () => {
    this.eventTypesCloser();
    this.eventCloser();
  };
  chooseEvent = (event) => {
    this.setState({ eventChosen: event });
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.pathname !== prevProps.pathname) {
      this.handleURLPathnameParams();
    }
    if (this.state.zoomChosen !== this.state.scrollChosen) {
      this.setState({
        zoomChosen: this.state.scrollChosen,
        radioChosen: this.state.scrollChosen
      });
    }
    if (this.state.zoomChosen !== this.state.radioChosen) {
      this.setState({
        zoomChosen: this.state.radioChosen,
        scrollChosen: this.state.radioChosen
      });
    } /*
    if (
      this.props.planner &&
      this.state.edmTrainevents &&
      this.state.events !==
        [...this.props.planner, ...this.state.edmTrainevents]
    ) {
      this.setState({
        events: [...this.props.planner, ...this.state.edmTrainevents]
      });
    }*/
  };
  componentWillUnmount = () => {
    clearTimeout(this.timeoutLoading);
    this.hydrateUserFromUserName.closer();
    this.hydrateUser.closer();
    this.hydrateEntityFromName.closer();
    this.hydrateEntity.closer();
  };
  hydrateUser = (userId) => {
    let fine = true;
    const { recordedUsers } = this.state;

    return {
      user: async () => {
        if (!userId) return null;
        if (!recordedUsers.includes(userId)) {
          this.setState({
            recordedUsers: [...recordedUsers, userId]
          });
          var close = onSnapshot(
            doc(firestore, "users", userId),
            async (doc) => {
              if (!userId) close();
              if (doc.exists()) {
                var user = doc.data();
                user.id = doc.id;

                var skills = [
                  ...(user.experiences ? user.experiences : []),
                  ...(user.education ? user.education : []),
                  ...(user.hobbies ? user.hobbies : [])
                ];
                user.skills = skills.map(
                  (x) => x.charAt(0).toUpperCase() + x.slice(1)
                );

                var rest = this.state.users.filter((x) => x.id !== user.id);

                this.setState({ users: [...rest, user] });
              }
            },
            standardCatch
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            getDoc(doc(firestore, "users", userId))
              .then(async (doc) => {
                if (doc.exists()) {
                  var user = doc.data();
                  user.id = doc.id;

                  var skills = [
                    ...(user.experiences ? user.experiences : []),
                    ...(user.education ? user.education : []),
                    ...(user.hobbies ? user.hobbies : [])
                  ];
                  user.skills = skills.map(
                    (x) => x.charAt(0).toUpperCase() + x.slice(1)
                  );

                  var rest = this.state.users.filter((x) => x.id !== user.id);
                  this.setState({ users: [...rest, user] });
                  return user && resolve(JSON.stringify(user));
                } else return resolve("{}");
              })
              .catch(standardCatch);
            if (!userId) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);

            //const tmt = setInterval(() => {
            var user = this.state.users.find((x) => x.id === userId);

            if (user) {
              //clearInterval(tmt);
              resolve(JSON.stringify(user));
            } else resolve("{}");
            //}, 2000);
            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  hydrateUserFromUserName = (profileUserName) => {
    let fine = true;
    const { recordedUserNames } = this.state;
    return {
      user: async () => {
        if (!recordedUserNames.includes(profileUserName)) {
          this.setState({
            recordedUserNames: [...recordedUserNames, profileUserName]
          });
          var close = onSnapshot(
            query(
              collection(firestore, "users"),
              where("username", "==", profileUserName)
            ),
            (querySnapshot) => {
              querySnapshot.docs.forEach(async (doc) => {
                if (doc.exists()) {
                  var user = doc.data();
                  user.id = doc.id;

                  var skills = [
                    ...(user.experiences ? user.experiences : []),
                    ...(user.education ? user.education : []),
                    ...(user.hobbies ? user.hobbies : [])
                  ];
                  user.skills = skills.map(
                    (x) => x.charAt(0).toUpperCase() + x.slice(1)
                  );

                  var rest = this.state.users.filter((x) => x.id !== user.id);
                  var users = [...rest, user];
                  this.setState({ users });
                }
              });
            },
            standardCatch
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            getDocs(
              query(
                collection(firestore, "users"),
                where("username", "==", profileUserName)
              )
            )
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  resolve("{}");
                } else {
                  querySnapshot.docs.forEach(async (doc) => {
                    if (doc.exists()) {
                      var user = doc.data();
                      user.id = doc.id;

                      var skills = [
                        ...(user.experiences ? user.experiences : []),
                        ...(user.education ? user.education : []),
                        ...(user.hobbies ? user.hobbies : [])
                      ];
                      user.skills = skills.map(
                        (x) => x.charAt(0).toUpperCase() + x.slice(1)
                      );

                      var rest = this.state.users.filter(
                        (x) => x.id !== user.id
                      );
                      this.setState({ users: [...rest, user] });
                      return resolve(JSON.stringify(user));
                    } else return resolve("{}");
                  });
                }
              })
              .catch((e) => {
                console.log(e.message);
                return resolve(null);
              });
            if (!profileUserName) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            console.log("again profile", profileUserName);
            //const tmt = setInterval(() => {
            var user = this.state.users.find(
              (x) => x.username === profileUserName
            );

            if (user) {
              console.log("again", user);
              // clearInterval(tmt);
              resolve(JSON.stringify(user));
            } else resolve("{}");
            //}, 2000);
            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => (fine = false)
    };
  };

  hydrateEntityFromName = (
    entityCollection,
    nameUnparsed,
    communityNameUnparsed
  ) => {
    let fine = true;
    const { recordedEntityNames } = this.state;
    return {
      entity: async () => {
        if (!communityNameUnparsed) return null;
        var communityName = communityNameUnparsed.replace(/_/g, " ");
        var name = nameUnparsed.replace(/_/g, " ");
        if (!recordedEntityNames.includes(name + communityNameUnparsed)) {
          this.setState({
            recordedEntityNames: [
              ...recordedEntityNames,
              name + communityNameUnparsed
            ]
          });
          const eventTypeChosen = ["housing", "event", "job", "plan"].includes(
            entityCollection
          );
          var close = onSnapshot(
            query(
              collection(eventTypeChosen ? "event" : "entity"),
              where("collection", "==", entityCollection),
              where("messageLower", "==", name.toLowerCase())
            ),
            (querySnapshot) => {
              querySnapshot.docs.forEach(async (doc) => {
                if (doc.exists()) {
                  var enti = doc.data();
                  enti.id = doc.id;
                  enti.collection = entityCollection;
                  var rest = this.state.entity.filter(
                    (x) => x.id !== enti.id && x.entityType !== enti.entityType
                  );
                  var entity = [...rest, enti];
                  this.setState({ entity });
                }
              });
            },
            standardCatch
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            getDocs(
              query(
                collection(eventTypeChosen ? "event" : "entity"),
                where("collection", "==", entityCollection),
                where("messageLower", "==", name.toLowerCase())
              )
            )
              .then((querySnapshot) => {
                querySnapshot.docs.forEach(async (doc) => {
                  if (doc.exists()) {
                    var entity = doc.data();
                    entity.id = doc.id;
                    entity.collection = entityCollection;
                    var rest = this.state.entity.filter(
                      (x) =>
                        x.id !== entity.id && x.collection !== entity.collection
                    );
                    this.setState({ entity: [...rest, entity] });
                    const done = JSON.stringify(entity);
                    return done && resolve(done);
                  }
                });
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("{}");
              });
            if (!name) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!name) {
              reject(!name);
            }
            var com = await this.getCommunityByName(communityName).community();
            var community = com && JSON.parse(com);
            if (Object.keys(community).length !== 0) {
              const tmt = setInterval(() => {
                var entity = this.state.entity.find(
                  (x) =>
                    x.message.toLowerCase() === name.toLowerCase() &&
                    x.communityId === community.id
                );

                if (entity) {
                  clearInterval(tmt);
                  resolve(JSON.stringify(entity));
                }
              }, 2000);

              this.recheck.push(tmt);
            } else {
              //const tmt = setInterval(() => {
              var entity = this.state.entity.find(
                (x) =>
                  (x.message ? x.message : x.title).toLowerCase() ===
                    name.toLowerCase() && x.communityId === community.id
              );

              if (entity) {
                //clearInterval(tmt);
                resolve(JSON.stringify(entity));
              } else resolve("{}");
              //}, 1000);
              //this.recheck.push(tmt);
            }
          });
        }
      },
      closer: () => (fine = false)
    };
  };
  hydrateEntity = (entityId, entityType) => {
    let fine = true;
    const { recordedEntities } = this.state;
    return {
      entity: async () => {
        if (!recordedEntities.includes(entityType + entityId)) {
          this.setState({
            recordedEntities: [...recordedEntities, entityType + entityId]
          });
          const event = ["event", "plan", "job", "housing"].includes(
            entityType
          );
          var close = onSnapshot(
            doc(
              firestore,
              entityType === "oldEvent"
                ? entityType
                : event
                ? "event"
                : "entity",
              entityId
            ),
            (async (doc) => {
              if (doc.exists()) {
                var entity = doc.data();
                entity.id = doc.id;
                entity.collection = entityType;
                var rest = this.state.entity.filter(
                  (x) =>
                    x.id !== entity.id && x.collection !== entity.collection
                );
                this.setState({ entity: [...rest, entity] });
              }
            },
            standardCatch)
          );
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            getDoc(
              doc(
                firestore,
                entityType === "oldEvent"
                  ? entityType
                  : event
                  ? "event"
                  : "entity",
                entityId
              )
            )
              .then(async (doc) => {
                if (doc.exists()) {
                  var entity = doc.data();
                  entity.id = doc.id;
                  entity.collection = entityType;
                  var rest = this.state.entity.filter(
                    (x) =>
                      x.id !== entity.id && x.collection !== entity.collection
                  );

                  this.setState({ entity: [...rest, entity] });
                  const done = JSON.stringify(entity);
                  return done && resolve(done);
                }
              })
              .catch((e) => {
                console.log(e.message);
                return resolve("{}");
              });
            if (!fine) {
              close();
            }
          });
        } else {
          return await new Promise(async (resolve, reject) => {
            !fine && reject(!fine);
            if (!entityId) {
              reject(!entityId);
            }
            //const tmt = setTimeout(() => {
            var entity = this.state.entity.find(
              (x) => x.id === entityId // && x.collection !== entityType
            );

            if (entity) {
              //clearTimeout(tmt);
              resolve(JSON.stringify(entity));
            } else resolve("{}");
            //}, 2000);
            //this.recheck.push(tmt);
          });
        }
      },
      closer: () => (fine = false)
    };
  };

  chooseCitypoint = async (location, distance, city, cityapi, state) => {
    if (!this.state.loading && !this.state.haltChooseCity) {
      this.setState({ loading: true });
      this.timeoutLoading = setTimeout(this.setState({ loading: false }), 5000);
      console.log(city);
      const center = [JSON.parse(location[0]), JSON.parse(location[1])];
      this.setState({ center, city, cityapi, state });
      if (this.state.using) {
        return null;
      } else {
        //this.chooseCitypoint(location, distance, city, cityapi, state);
        this.setState({ using: true });
        if (this.state.cityapisLoaded.includes(cityapi)) {
          console.log(this.state[`${cityapi}`]);
          return this.setState({
            edmTrainevents: this.state[`${cityapi}`]
          });
        } else {
          //this.getEdmTrainpoint(cityapi, state);
          this.setState({
            ok: false,
            cityapisLoaded: [...this.state.cityapisLoaded, cityapi]
          });
          this.fetchCities(location, distance, city);
          var Lat = location[0];
          var Length = distance * 1.60934;
          var Ratio = 100;
          var WidthPixel = window.innerWidth;
          //console.log(WidthPixel + Ratio + Lat + Length);
          this.calculateZoom(
            WidthPixel,
            Ratio,
            Lat,
            Length,
            location,
            distance,
            city
          );
          console.log(location);
        }
      }
    }
  };
  /*chooseCitypoint = async (location, distance, city, cityapi, state) => {
    if (!this.state.loading && !this.state.haltChooseCity) {
      this.setState({ loading: true });
      this.timeoutLoading = setTimeout(this.setState({ loading: false }), 5000);
      console.log(city);
      const center = [JSON.parse(location[0]), JSON.parse(location[1])];
      this.setState({ center, city, cityapi, state });
      var Lat = location[0];
      var Length = distance * 1.60934;
      var Ratio = 100;
      var WidthPixel = window.innerWidth;
      //console.log(WidthPixel + Ratio + Lat + Length);
      this.calculateZoom(
        WidthPixel,
        Ratio,
        Lat,
        Length,
        location,
        distance,
        city
      );
      console.log(location);
    }
  };*/
  calculateZoom = (
    WidthPixel,
    Ratio,
    Lat,
    Length,
    location,
    distance,
    city
  ) => {
    Length = Length * 1000;
    var k = WidthPixel * 156543.03392 * Math.cos((Lat * Math.PI) / 180);
    //console.log(k);
    var myZoom = Math.round(Math.log((Ratio * k) / (Length * 100)) / Math.LN2);
    myZoom = myZoom - 1;
    //https:// gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to/31551#31551
    if (this.state.scrollChosen !== myZoom && city !== this.state.city) {
      this.setState({ scrollChosen: myZoom });
    }
    return myZoom;
  };
  fetchCities = async (location, distance, city) => {
    await fetch(
      "https://us-central1-thumbprint-1c31n.cloudfunctions.net/chooseCity",
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/JSON",
          "Access-Control-Request-Method": "POST"
        },
        body: JSON.stringify({ location, distance }),
        maxAge: 10
        //"mode": "cors",
      }
    )
      .then(async (response) => await response.json())
      .then((body) => {
        this.setState({ distance, city });
        console.log("Success", body.sendit);
        this.setState({ events: body.sendit });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  tilesOpener = () => {
    this.setState({
      typesOrTilesMap: false
    });
  };
  tilesCloser = () => {
    this.setState({
      typesOrTilesMap: null
    });
  };
  eventTypesOpener = () => {
    this.setState({
      typesOrTilesMap: true
    });
  };
  eventTypesCloser = () => {
    this.setState({
      typesOrTilesMap: null
    });
  };
  etypeChanger = (e) => {
    const targetid = e.target.id.toString();
    console.log(targetid);
    if (targetid === "all") {
      this.setState({
        subtype: [
          "food",
          "business",
          "tech",
          "recreation",
          "education",
          "arts",
          "sports",
          "concerts",
          "parties",
          "festivals"
        ]
      });
    } else {
      this.setState({
        subtype: targetid
      });
    }
  };
  mapConcentrate = () => {
    this.eventCloser();
    this.switchCMapCloser();
  };
  render() {
    //console.log(this.props.user);
    //var placeholderEventsSearch =
    //this.state.city === undefined ? "Events" : `${this.state.city} Events`;
    const hiddenUserData = (ath) => {
        //console.log("hiddenuserdata");
        onSnapshot(
          doc(firestore, "userDatas", ath.uid),
          (doc) => {
            var userDatas = undefined;
            if (doc.exists()) {
              var u = this.state.user;
              userDatas = doc.data(); //{...,doc.id}

              //delete u.defaultEmail;
              const user = {
                ...u,
                ...userDatas,
                userDatas: true
              };
              this.setState(
                {
                  user,
                  userDatas
                }
                //() => this.getEntities(meAuth)
              );
            } else
              console.log(
                `user: ${
                  this.state.user.username //+ " " + ath.uid
                }, has no hidden data`
              );
          },
          standardCatch
        );
      },
      logoutofapp = (yes) => {
        var answer = yes || window.confirm("Are you sure you want to log out?");
        if (!answer) {
          //this.ra.current.click();
          return this.gui.current.click();
        } //ra;//null;
        signOut(getAuth())
          .then(async () => {
            console.log("logged out");
            await setPersistence(getAuth(), browserSessionPersistence);
            this.setState({
              user: undefined,
              auth: undefined
            });
            this.ra.current.click();
          })
          .catch((err) => {
            console.log(err);
          });
      };
    const meAuth =
      window.meAuth &&
      window.meAuth.constructor === Object &&
      Object.keys(window.meAuth).length > 0
        ? window.meAuth
        : undefined;
    //console.log(this.state.event);
    return (
      <div
        ref={this.pinch}
        style={{
          fontFamily: '"Muli", sans-serif'
        }}
      >
        <PromptAuth
          ref={{
            current: {
              pa: this.pa,
              gui: this.gui,
              ra: this.ra
            }
          }}
          onPromptToLogin={() => {}} //this.props.history.push("/login")}
          verbose={true}
          onStart={() => {
            //if (window.meAuth !== undefined) return this.props.navigate("/");
            window.alert("loading authentication...");
          }}
          onEnd={() => {
            //window.alert("loading authentication...");
          }}
          windowKey={"meAuth"} //window.meAuth
          hydrateUser={(me, reload, isStored) => {
            if (me && me.constructor === Object) {
              if (isStored) return console.log("isStored: ", me); //all but denied

              if (me.isAnonymous) return console.log("anonymous: ", me);

              if (!me.uid)
                return this.setState({
                  user: undefined,
                  auth: undefined
                });
              //console.log("me", me);
              //this.pa.current.click();

              onSnapshot(
                doc(firestore, "users", me.uid),
                (doc) =>
                  doc.exists() &&
                  this.setState(
                    {
                      user: { ...doc.data(), id: doc.id },
                      loaded: true
                    },
                    () => hiddenUserData(me)
                  )
              );
              return reload && window.location.reload();
            }
            console.log("me", me);
          }} //detract alternative, kurt carface bank
          onFinish={() => {}}
          meAuth={meAuth === undefined ? null : meAuth}
        />
        {/*
          <PrivateRoute
            exact
            path="/chats/:id"
            component={props => (
              <Store>
              <Dashboard
              {...props}
              openUsers={this.state.openUsers}/></Store>
            )}
            />*/}
        {/*<div
              className="closemapper"
              onClick={this.props.eventOpener}
            >
              &#10957;
            </div>*/}
        <Mapbox
          event={this.state.event}
          center={this.state.center}
          distance={this.state.distance}
          city={this.state.city}
          subtype={this.state.subtype}
        />
        <Find
          navigate={this.props.navigate}
          subtype={this.state.subtype}
          setApp={(e) => this.setState(e)}
        />
        <MainFooter
          user={this.state.user}
          chatopener={() => this.setState({ chatsopen: true })}
          chatcloser={() => this.setState({ chatsopen: false })}
          chatsopen={this.state.chatsopen}
          loginOpen={this.state.loginOpen}
          toggle={this.createSliderOpener}
          eventOpener={this.eventOpener}
          eventCloser={this.eventCloser}
          eventsOpen={this.state.eventsOpen}
          //zoomChangedRecentlyFuncTrue={() => this.setState({ zoomChangedRecently: true })}
          //zoomChangedRecentlyFunc={() => this.setState({ zoomChangedRecently: false })}
          //zoomChangedRecently={this.state.zoomChangedRecently}
        />
        <Chats
          logoutofapp={logoutofapp}
          loadGreenBlue={() => {}}
          unloadGreenBlue={() => {}}
          hydrateUserFromUserName={async (username) => {
            var userResult =
              username && (await this.hydrateUserFromUserName(username).user());
            return userResult && JSON.parse(userResult);
          }}
          hydrateUser={async (userId) => {
            var userResult = userId && (await this.hydrateUser(userId).user());
            return userResult && JSON.parse(userResult);
          }}
          hydrateEntity={async (id, collection) => {
            var entity = await this.hydrateEntity(id, collection).entity();
            return entity && JSON.parse(entity);
          }}
          hydrateEntityFromName={async (collection, name, communityName) => {
            var entity = await this.hydrateEntityFromName(
              collection,
              name,
              communityName
            ).entity();
            return entity && JSON.parse(entity);
          }}
          user={this.state.user}
          auth={meAuth}
          chatsopen={this.state.chatsopen}
          recipientsProfiled={[]}
          chatopener={() => this.setState({ chatsopen: true })}
          chatcloser={() => this.setState({ chatsopen: false })}
          getUserInfo={() => this.gui.current.click()}
          setAuth={(auth) => this.setState(auth, () => this.pa.current.click())}
        />
        {this.props.pathname === "/plan" && (
          <div
            style={{
              width: "100%"
            }}
          >
            <div
              style={{
                fontSize: "20px",
                color: "white",
                alignItems: "center",
                display: "flex",
                textIndent: "56px",
                height: "56px",
                width: "100%",
                backgroundColor: "rgb(180,100,230)"
              }}
            >
              <div
                onClick={() => this.props.navigate("/")}
                style={{
                  position: "absolute",
                  margin: "15px",
                  width: "20px",
                  height: "20px",
                  borderBottom: "2px solid black",
                  borderLeft: "2px solid black",
                  transform: "rotate(45deg)"
                }}
              />
            </div>
            <Make
              recipients={[]}
              initial={"event"}
              auth={meAuth}
              navigate={this.props.navigate}
              loadGreenBlue={() => {}}
              unloadGreenBlue={() => {}}
            />
          </div>
        )}
        <div
          style={{
            backgroundColor: "white",
            //transition: ".3s ease-in",
            transform: `translateX(${this.state.eventsOpen ? "0%" : "100%"})`,
            position: this.state.eventsOpen ? "absolute" : "fixed",
            width: "100%"
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "white",
              alignItems: "center",
              display: "flex",
              height: "56px",
              width: "100%",
              backgroundColor: "rgb(180,100,230)"
            }}
          >
            <div
              onClick={() =>
                this.setState({
                  eventsOpen: false
                })
              }
              style={{
                margin: "15px",
                width: "20px",
                height: "20px",
                borderBottom: "2px solid white",
                borderLeft: "2px solid white",
                transform: "rotate(45deg)"
              }}
            />
            Events in {this.state.city}
            <div
              onClick={() => this.setState({ viewProfile: true })}
              style={{
                margin: "15px",
                width: "20px",
                height: "20px"
              }}
            >
              Me
            </div>
          </div>
          {this.state.event
            .filter((x) => x.subtype.includes(this.state.subtype))
            .map((x, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    this.props.navigate(`/event/${x.id}`);
                  }}
                >
                  <img
                    style={{ width: "40px" }}
                    src={x.chosenPhoto}
                    alt={x.message}
                  />
                  {x.title}
                </div>
              );
            })}
        </div>

        <ViewProfile
          setApp={(e) => this.setState(e)}
          viewProfile={this.state.viewProfile}
          auth={meAuth}
          navigate={this.props.navigate}
          getUserInfo={() => this.gui.current.click()}
          user={this.state.user}
          pathname={this.props.pathname}
        />
        {this.state.eventsAt && (
          <EventsAt
            eventsAt={this.state.eventsAt}
            navigate={this.props.navigate}
            setApp={(e) => this.setState(e)}
          />
        )}

        {this.state.ticketmaster && (
          <div
            style={{
              zIndex: "1",
              display: "block",
              position: "absolute",
              width: "100%",
              minHeight: "100%",
              backgroundColor: "white"
            }}
          >
            <div
              onClick={() => {
                this.props.navigate("/");
                this.setState({ ticketmaster: null });
              }}
              style={{
                padding: "0px 4px",
                borderRadius: "10px",
                color: "white",
                backgroundColor: "navy",
                position: "absolute",
                right: "10px",
                top: "10px",
                fontSize: "20px"
              }}
            >
              &times;
            </div>
            <a style={{ padding: "10px" }} href={this.state.ticketmaster.url}>
              {this.state.ticketmaster.name}
            </a>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {this.state.ticketmaster.images &&
                this.state.ticketmaster.images.map((x, i) => {
                  if (i !== 0) return null;
                  return (
                    <img
                      key={i}
                      alt={this.state.ticketmaster.name}
                      src={x.url}
                    />
                  );
                })}
            </div>
          </div>
        )}
        {this.state.entityEvent && (
          <EntityEvent
            entityEvent={this.state.entityEvent}
            auth={meAuth}
            navigate={this.props.navigate}
            setApp={(e) => this.setState(e)}
            pathname={this.props.pathname}
          />
        )}
        <div
          className={
            this.state.user && this.state.user.webhook
              ? "showingwindow"
              : "notshowingwindow"
          }
        >
          {" "}
          Window Popup
        </div>
      </div>
    );
  }
}

export default App;
