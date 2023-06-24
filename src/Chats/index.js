import React from "react";
import Chatter from "./Chatter";
import RecentChat from "./RecentChat";
import search1 from ".././Images/search.png";
import firebase from ".././init-firebase";
//import settings33 from ".././Icons/Images/settings33.png";

import {
  collection,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where
} from "@firebase/firestore";
import Sudo, { standardCatch } from "../Sudo";

const forbiddenUsernames = [
  "event",
  "events",
  "club",
  "clubs",
  "shop",
  "shops",
  "restaurant",
  "restaurants",
  "service",
  "services",
  "dept",
  "department",
  "departments",
  "classes",
  "class",
  "oldclass",
  "oldclasses",
  "job",
  "jobs",
  "housing",
  "oldhome",
  "page",
  "pages",
  "venue",
  "venues",
  "forum",
  "posts",
  "post",
  "oldelection",
  "elections",
  "election",
  "case",
  "cases",
  "oldcase",
  "oldcases",
  "budget",
  "budgets",
  "oldbudget",
  "oldbudgets",
  "ordinance",
  "ordinances",
  "new",
  "news",
  "login",
  "logins",
  "doc",
  "docs",
  "private",
  "privacy",
  "legal",
  "terms",
  "law",
  "laws",
  "bill",
  "bills"
];
const firestore = getFirestore(firebase);
class ChatsHeader extends React.Component {
  state = {};
  render() {
    const { standbyMode } = this.props;
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSnapshot(
            query(
              collection(firestore, "users"),
              //.where("commtype", "==", this.props.chatFilterChosen)
              where(
                "usernameAsArray",
                "array-contains",
                this.props.userQuery.toLowerCase()
              )
            ),
            (querySnapshot) => {
              let clubResults = [];
              let p = 0;
              if (querySnapshot.empty) {
                console.log("empty");
              } else {
                querySnapshot.docs.forEach((doc) => {
                  p++;
                  if (doc.exists()) {
                    var foo = doc.data();
                    foo.id = doc.id;
                    clubResults.push(foo);
                    if (p === querySnapshot.docs.length) {
                      //console.log(clubResults);
                      this.props.pushEntityResults(clubResults);
                    }
                  }
                });
              }
            },
            (e) => console.log(e.message)
          );
        }}
        style={{
          display:
            !this.props.chatsopen || this.props.pathname === "/login"
              ? "none"
              : "flex",
          position: "relative",
          zIndex: 5,

          border: "none",
          height: "56px",
          width: "100%",
          backgroundColor: "#844fff",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "26px"
        }}
      >
        <div
          onClick={() =>
            this.props.user !== undefined && this.props.profileOpener()
          }
          style={{
            display: "none",
            position: "relative",
            width: "56px",
            height: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(0,0,0,.6)",
              height: "100%",
              position: "absolute",
              zIndex: "1",
              width: "100%"
            }}
          >
            <div
              style={{
                boxShadow: `0px 0px ${standbyMode ? 10 : 0}px ${
                  standbyMode ? 10 : 0
                }px rgb(150,200,255)`,
                textAlign: "center",
                top: "calc(50% - 10px)",
                position: "absolute",
                zIndex: "1",
                width: "100%"
              }}
            >
              <i
                className="fas fa-key"
                style={{
                  position: "absolute",
                  WebkitTextStroke: "1px rgb(240,240,180)",
                  margin: "auto",
                  color: "rgb(150,150,250)"
                }}
              ></i>
              &nbsp;.&nbsp;
              <i
                className="fas fa-box"
                style={{
                  fontSize: "20px",
                  color: "rgb(150,150,250)",
                  WebkitTextStroke: "1px rgb(240,240,180)"
                }}
              ></i>
            </div>
          </div>
          {/*this.props.user !== undefined ? (
            !this.props.chatsopen || this.props.pathname === "/login" ? null : (
              <img
                src={this.props.user.photoThumbnail}
                alt={this.props.user.username}
                style={{
                  height: "100%",
                  width: "56px"
                }}
              />
            )
          ) : (
            <Link
              to={{
                state: {
                  openChatWhenClose: true
                },
                pathname: "/login"
              }}
            >
              Login
            </Link>
            )*/}
        </div>
        &nbsp;
        <div>
          <div>search</div>
          <div style={{ display: "flex" }}>
            <img
              src={search1}
              style={{
                zIndex: "1",
                display: this.props.achatisopen ? "flex" : "none",
                position: "relative",
                height: "42px",
                width: "42px"
              }}
              alt="error"
            />
            <input
              value={this.props.userQuery}
              style={{
                display: "flex",
                position: "relative",
                backgroundColor: "rgba(0,0,0,0)",
                color: "white",
                fontSize:
                  this.props.width < 300
                    ? "16px"
                    : this.props.width < 600
                    ? "20px"
                    : "26px",
                left: "0px",
                width: "100%",
                border: "none"
              }}
              onChange={this.props.editUserQuery}
              placeholder={"users"}
            />
          </div>
        </div>
        {this.props.showclear && (
          <div
            onClick={this.props.clearQuery}
            style={{
              top: "11px",
              fontSize: this.props.userQuery === "" ? "" : "14px",
              right: "120px",
              justifyContent: "flex-end",
              alignItems: "center",
              display: "flex",
              position: "fixed",
              borderRadius: "10px",
              height: "20px",
              width: "20px",
              backgroundColor: "rgb(255, 255, 255)",
              color: "#844fff",
              opacity: this.props.userQuery === "" ? ".1" : ".9"
            }}
          >
            <div>&times;&nbsp;</div>
          </div>
        )}
        {/*<img
            onClick={this.props.chatscloser}
            src="https://www.dropbox.com/s/zw3yisjvrkdwm03/switch%20accounts%20icon%20%281%29.png?raw=1"
            className="switch_accounts"
            alt="error"
          />*/}
        {/*<img
          onClick={this.props.openCommsSort}
          src={sort}
          style={{
            display: this.props.showsort ? "flex" : "none",
            position: "absolute",
            top: "0px",
            right: "56px",
            height: "56px",
            width: "56px",
            zIndex: "9990"
          }}
          alt="error"
        />*/}
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            top: "5px",
            right: "10px",
            textDecoration: "none",
            display: "flex",
            position: "absolute",
            backgroundColor: "rgb(230, 240, 250)",
            width: "36px",
            height: "46px",
            borderRadius: "20px",
            color: "navy",
            transition: ".3s ease-in",
            zIndex: "1"
          }}
          onClick={() => {
            this.props.chatcloser();
          }}
        >
          <div
            style={{
              left: "8px",
              position: "absolute",
              width: "10px",
              height: "10px",
              transform: "rotate(45deg)",
              borderTop: "3px solid",
              borderRight: "3px solid"
            }}
          ></div>
        </div>
      </form>
    );
  }
}
class Chats extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.state = {
      width,
      height,
      right: "0",
      topics: ["*"],
      spam: [],
      content: [],
      allcontents: [],
      hideMore: true,
      lastVisible: 0,
      clubResults: [],
      chatFilterChosen: "user",
      n: 30,
      openGroupFilter: false,
      deletedMsgs: [],
      hiddenMsgs: [],
      userQuery: "",
      recentChats: [],
      openUser: "",
      allChats: [],
      doitonce: false,
      recentPeople: [],
      entityId: null,
      entityType: "user",
      recipients: [],
      chats: [],
      notes: []
    };
  }
  moreMessages = () => {
    this.state.lastMessage &&
      onSnapshot(
        query(
          collection(firestore, "chats"),
          where("threadId", "==", this.state.threadId),
          orderBy("time", "desc"),
          startAfter(this.state.lastMessage),
          limit(25),
          (querySnapshot) => {
            let p = 0;
            let f = [];
            let spam = [];
            if (querySnapshot.empty) {
              return null;
            } else {
              querySnapshot.docs.forEach((doc) => {
                p++;
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  foo.collection = "chats";
                  if (foo.entityType) {
                    if (
                      !this.props.user.mutedUsers ||
                      !this.props.user.mutedUsers.includes(foo.authorId)
                    ) {
                      f.push(foo);
                    } else {
                      spam.push(foo);
                    }
                  }
                }
              });
              if (p === querySnapshot.docs.length) {
                this.getMessages(f, spam);
              }
            }
          },
          (e) => console.log(e.message)
        )
      );
  };
  againBackMessages = () => {
    this.state.againMessage &&
      onSnapshot(
        query(
          collection(firestore, "chats"),
          where("threadId", "==", this.state.threadId),
          orderBy("time", "desc"),
          startAfter(this.state.againMessage),
          limit(25),
          (querySnapshot) => {
            let p = 0;
            let f = [];
            let spam = [];
            if (querySnapshot.empty) {
              return null;
            } else {
              querySnapshot.docs.forEach((doc) => {
                p++;
                if (doc.exists) {
                  var foo = doc.data();
                  foo.id = doc.id;
                  foo.collection = "chats";
                  if (foo.entityType) {
                    if (
                      !this.props.user.mutedUsers ||
                      !this.props.user.mutedUsers.includes(foo.authorId)
                    ) {
                      f.push(foo);
                    } else {
                      spam.push(foo);
                    }
                  }
                }
              });
              if (p === querySnapshot.docs.length) {
                this.getMessages(f, spam);
              }
            }
          },
          (e) => console.log(e.message)
        )
      );
  };
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      let width = window.innerWidth; // * 0.01;
      let height = window.innerHeight; // * 0.01;
      this.setState({
        width,
        height
      });
    }, 200);
  };
  componentDidUpdate = async (prevProps) => {
    if (
      this.props.auth !== undefined &&
      this.state.threadId !== this.state.lastthreadId
    )
      this.setState({ lastthreadId: this.state.threadId }, () => {
        this.props.loadGreenBlue("getting thread " + this.state.threadId);
        this.state.entityId &&
          getDoc(doc(firestore, this.state.entityType, this.state.entityId))
            .then((doc) => {
              var foo = doc.data();
              foo.id = doc.id;
              this.setState({ thisentity: foo });
            })
            .catch(standardCatch);

        this.getChats(this.props.vintageName);
      });
    if (
      this.state.recentChats !== [] &&
      this.state.lastRecentChats !== this.state.recentChats
    ) {
      let b = [];
      let p = 0;
      this.state.recentChats.forEach((x) => {
        p++;
        b.push(x.topic);
        if (p === this.state.recentChats.length) {
          var unique = [...new Set(b)];
          this.setState({
            topics: unique,
            lastRecentChats: this.state.recentChats
          });
        }
      });
    }
  };
  getMessages = (f, spam) => {
    //console.log("recentChats", f);
    this.setState({
      lastMessage: f[f.length - 1],
      againMessage: f[f.length + 25 - 1],
      lastRecipients: this.state.recipients,
      recentChats: f,
      topics: []
    });
    let b = 0;
    let le = [];
    f.concat(spam);
    f.map((x) => {
      b++;
      if (x.contents) {
        le.push(x.contents);
        if (f.length === b && this.state.allcontents !== le) {
          console.log("content chats", f);
          this.setState({
            allcontents: le,
            content: le
          });
        }
      }
      return x;
    });
  };
  getChats = (vintage) => {
    var snap;
    if (!vintage) {
      snap = [
        collection(firestore, "chats"),
        where("threadId", "==", this.state.threadId)
      ];
    } else {
      snap = [
        collection(firestore, "chats"),
        where("threadId", "==", this.state.threadId),
        where("vintage", "==", vintage)
      ];
    }
    onSnapshot(
      query(...snap, orderBy("time", "desc"), limit(25)),
      async (querySnapshot) => {
        let f = [];
        let spam = [];
        let p = 0;
        if (querySnapshot.empty) {
          this.props.unloadGreenBlue();
          console.log("empty", this.state.threadId);
        } else {
          querySnapshot.docs.forEach((chat) => {
            p++;
            if (chat.exists) {
              var foo = chat.data();
              foo.id = chat.id;
              foo.collection = "chats";
              if (
                !this.props.user.mutedUsers ||
                !this.props.user.mutedUsers.includes(foo.authorId)
              ) {
                f.push(foo);
              } else {
                spam.push(foo);
              }
            }
          });
          if (p === querySnapshot.docs.length) {
            Promise.all(
              f[0].recipients.map(async (foo) => {
                var recipient = await this.props.hydrateUser(foo);

                return recipient && recipient;
              })
            ).then(async (recipientsProfiled) => {
              var author = await this.props.hydrateUser(f[0].authorId);
              if (author) {
                Promise.all(
                  f.map(async (foo) => {
                    foo.author = author;
                    foo.recipientsProfiled = recipientsProfiled;
                    foo.droppedPost =
                      foo.droppedId &&
                      (await this.props.getDrop(foo.droppedId));
                    foo.droppedPost && console.log(foo.droppedPost);
                    return foo;
                  })
                ).then((f) => {
                  this.props.unloadGreenBlue();
                  this.getMessages(f, spam);
                });
              }
            });
          }
        }
      },
      (e) => console.log(e.message + "chats")
    );
  };
  addUsertoRec = (x) => {
    var reg =
      this.state.recipients.constructor === Array
        ? [...this.state.recipients, x.id].sort()
        : [this.state.recipients, x.id].sort();
    var threadId = this.state.entityType + this.state.entityId + reg.sort();
    this.setState({
      entityId: null,
      entityType: "user",
      recipients: reg,
      threadId,
      topics: [],
      recentChats: [],
      chosenTopic: "*"
    });
  };
  removeUserfromRec = (x) => {
    var shortenRecip = this.state.recipients.filter((e) => e !== x.id);
    var threadId =
      this.state.entityType + this.state.entityId + shortenRecip.sort();
    this.setState({
      entityId: null,
      entityType: "user",
      recipients: shortenRecip.sort(),
      threadId,
      topics: [],
      recentChats: []
    });
  };
  componentDidMount = () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  achatisopenfalse = () =>
    this.setState({
      achatopen: false,
      achatisopen: false
      //threadId: ""
    });
  render() {
    const { standbyMode } = this.state;
    let threads = [];
    this.props.auth !== undefined &&
      this.state.recipients &&
      this.state.chats
        .sort((a, b) => b.time - a.time)
        .map((obj) => {
          return threads.push(obj.threadId);
        });

    let chatsWithinTopic1 = [];
    threads.map((obj) => {
      var topChat = this.state.chats.find((x) => x.threadId === obj);
      return chatsWithinTopic1.push(topChat);
    });
    let chatsWithinTopic = [];
    var test = this.state.openSpam ? this.state.spam : this.state.chats;
    //pushed
    test &&
      test.map((x) => {
        var thisfinal = chatsWithinTopic1.find((y) => x.id === y.id);
        return thisfinal && chatsWithinTopic.push(thisfinal);
      });
    let noteList = [];
    let noteTitles = [];
    //pushed
    this.state.notes &&
      this.state.notes.map((x) => {
        noteTitles.push(x.message);
        return noteList.push(x._id);
      });
    var usersThatHaventBlocked =
      this.props.auth !== undefined &&
      this.state.users &&
      this.state.users.filter(
        (x) => !x.blockedUsers || !x.blockedUsers.includes(this.props.auth.uid)
      );
    //console.log(usersThatHaventBlocked);
    return (
      <div
        style={{
          height: this.props.chatsopen ? "min-content" : "0px",
          overflow: "hidden",
          position: "relative",
          width: "100%",
          backgroundColor: "rgb(20, 20, 20)"
        }}
      >
        <ChatsHeader
          chatcloser={this.props.chatcloser}
          setChats={this.props.setChats}
          standbyMode={standbyMode}
          setFoundation={this.props.setFoundation}
          setIndex={this.props.setIndex}
          forumOpen={this.props.forumOpen}
          getUserInfo={this.props.getUserInfo}
          clearQuery={() => this.setState({ userQuery: "" })}
          pushEntityResults={(users) =>
            this.setState({
              users
            })
          }
          openCommsSort={() => this.setState({ openGroupFilter: true })}
          chatFilterChosen={this.state.chatFilterChosen}
          userQuery={this.state.userQuery}
          editUserQuery={(e) =>
            this.setState({ userQuery: e.target.value.toLowerCase() })
          }
          showclear={this.props.chatsopen && !this.state.achatopen}
          width={this.props.width}
          auth={this.props.auth}
          profileOpener={this.props.profileOpener}
          user={this.props.user}
          chatsopen={this.props.chatsopen}
          achatisopen={this.achatisopen}
        />
        <div
          style={{
            display: "none",
            //display: this.props.chatsopen ? "inline-block" : "none",
            padding: "0px 10px",
            width: "calc(100% - 20px)",
            position: this.state.achatopen ? "fixed" : "relative",
            color: "grey",
            flexDirection: "column"
          }}
        >
          {/*<Vintages
          rsaPrivateKeys={this.state.rsaPrivateKeys}
          ddb={this.state.ddb}
            show={true}
            auth={this.props.auth}
            user={this.props.user}
            vintageOfKeys={this.props.vintageOfKeys}
            setParentState={this.props.setNapkin}
            deviceCollection={() => firebase.firestore().collection("devices")}
            userUpdatable={() =>
              this.props.auth !== undefined &&
              firebase.firestore().collection("user").doc(this.props.auth.uid)
            }
            userDatas={() =>
              this.props.auth !== undefined &&
              firebase
                .firestore()
                .collection("userDatas")
                .doc(this.props.auth.uid)
            }
          />*/}
          <br />
          <div style={{ display: "flex" }}>
            {this.state.informationAbout ? (
              <div style={{ display: "inline-block" }}>
                While Firestore data is encrypted by Google in transit & their
                cloud, it is&nbsp;
                <span
                  style={{
                    color: "red"
                  }}
                >
                  unencrypted
                </span>
                &nbsp;in your browser's cache.
              </div>
            ) : (
              <div style={{ display: "inline-block" }}>
                End-to-end, on-device, encryption should be fashioned on
                the&nbsp;
                <span
                  style={{
                    color: "red"
                  }}
                >
                  private devices
                </span>
                &nbsp;you would like to hold your keys.
              </div>
            )}
            <div
              style={{
                color: "white",
                padding: "9px",
                paddingTop: "2px",
                borderRadius: "15px",
                border: "1px solid",
                height: "10px"
              }}
              onClick={() =>
                this.setState({
                  informationAbout: !this.state.informationAbout
                })
              }
            >
              i
            </div>
          </div>
          <br />
          Your&nbsp;
          <span
            style={{
              color: "red"
            }}
          >
            prime-number-key
          </span>
          &nbsp;can decipher jumbled messages & media (
          <span
            style={{
              color: "green"
            }}
          >
            if non-convict
          </span>
          ) and share this ability with other devices. Chats are encrypted with
          their own&nbsp;
          <span style={{ color: "rgb(200,210,220)" }}>
            <span style={{ textDecoration: "underline" }}>
              keyboxes per threadId
            </span>{" "}
            [recipients, entityCollection+doc.id]
          </span>
          ,{" "}
          <span
            style={{
              color: "rgb(30,120,210)"
            }}
          >
            Devices will have to be re-forged by revisiting an&nbsp;
            <span
              style={{
                color: "red"
              }}
            >
              active
            </span>
            &nbsp;device.
          </span>{" "}
          If you cannot visit an active device your messages and media will
          likely be unreadable forever.
        </div>
        <br />
        <br />
        <div
          style={{
            color: "grey",
            width: "100%"
          }}
        >
          {this.state.userQuery === "" ? (
            <p>
              Recent:
              {this.state.chatFilterChosen === "user"
                ? "all"
                : this.state.chatFilterChosen}
              ~
            </p>
          ) : (
            <p>
              {this.state.chatFilterChosen}
              &nbsp; query results~
            </p>
          )}
          <br />
          {
            <div>
              {this.props.auth === undefined &&
                "Sign in to view other usernames"}
              <br />
              {this.props.auth === undefined ? (
                <Sudo
                  ref={{ current: {} }}
                  forbiddenUsernames={forbiddenUsernames}
                  phoneNumberCollection={"numbers"}
                  width={this.props.width}
                  rooturi={"https://tpt.net.co/"} //comment out to use click
                  homeuri={"https://tpt.net.co"} // emulateRoot onroot instead
                  logoutofapp={this.props.logoutofapp}
                  auth={this.props.auth}
                  lastWidth={this.props.lastWidth}
                  availableHeight={this.props.appHeight}
                  backgroundColor={null} //transparent
                  position={"relative"}
                  supportemail={"nick@thumbprint.us"}
                  welcomeName={"Thumbprint.us - Social calendar"}
                  onroot={true}
                  emulateRoot={(e) => this.setState(e)}
                  getUserInfo={this.props.getUserInfo}
                  setAuth={this.props.setAuth}
                  //
                  meAuth={this.props.auth}
                  user={this.state.user}
                  pathname={this.props.pathname}
                  navigate={this.props.navigate}
                  useTopComment={null}
                  memberMessage=""
                  subTop=""
                  useTitle={<span></span>}
                  useCan={null} //trash
                  useCanComment={null}
                  root={(a) => this.state.onroot && <div></div>}
                  rootArguments={[
                    {
                      current: {}
                    }
                  ]}
                  subRoot=""
                  //emulateRoot={() => this.props.navigate("/")}
                  home={!this.state.onroot && <div></div>} //Are drug gangs not pharmacists because they have no shop nor employees?
                  //Do employees of regular businesses with diverse customers have to report gifted sweat up to $15,000 per year?
                />
              ) : (
                <div
                  onClick={() => {
                    this.props.logoutofapp();
                  }}
                >
                  logout
                </div>
              )}
            </div>
          }
          {this.state.userQuery === "" &&
            chatsWithinTopic &&
            chatsWithinTopic
              .sort((a, b) => b.time - a.time)
              .map((ppl) => {
                const permittedUsers = ppl.recipientsProfiled;
                if (
                  ppl.message &&
                  !this.state.deletedMsgs.includes(ppl.id) &&
                  !this.state.hiddenMsgs.includes(ppl.id) &&
                  ((!this.state.vintageYearSelected && !ppl.vintage) ||
                    this.state.vintageYearSelected === ppl.vintage)
                ) {
                  return (
                    <RecentChat
                      notes={this.state.notes}
                      noteList={noteList}
                      noteTitles={noteTitles}
                      recentChats={this.state.recentChats}
                      chats={this.state.chats}
                      user={this.props.user}
                      auth={this.props.auth}
                      ppl={ppl}
                      achatisopen={() => {
                        this.setState({
                          recipients: ppl.recipients,
                          entityId: ppl.entityId,
                          entityType: ppl.entityType,
                          chosenTopic: ppl.topic,
                          threadId:
                            ppl.entityType +
                            ppl.entityId +
                            ppl.recipients.sort()
                        });
                      }}
                      key={ppl.id}
                      permittedUsers={permittedUsers}
                      users={this.state.users}
                    />
                  );
                } else return null;
              })}
          {usersThatHaventBlocked &&
            usersThatHaventBlocked.map((user) => {
              return (
                <div
                  key={user.id}
                  className="chatname1"
                  onClick={() => {
                    var recipients = [];
                    if (user.id === this.props.auth.uid) {
                      recipients = [user.id];
                    } else {
                      recipients = [user.id, this.props.auth.uid];
                    }

                    this.setState({
                      recipients,
                      //this.props.user && this.props.user.username + "," + user.username,
                      entityId: null,
                      chosenTopic: "*",
                      threadId: "user" + null + recipients.sort(),
                      achatopen: true
                    });
                    //this.openPeer(x);
                  }}
                >
                  {user.username}
                  {/*<span className="connectionsignaloff">&#9675;</span>*/}
                </div>
              );
            })}
          {this.state.hideMore ? null : (
            <div
              onClick={() => {
                if (this.state.chatFilterChosen === "user") {
                  return false;
                } else {
                  const center = new firebase.firestore.GeoPoint(0, 0);
                  const center1 = new firebase.firestore.GeoPoint(0, 72);
                  const center2 = new firebase.firestore.GeoPoint(0, 144);
                  const center3 = new firebase.firestore.GeoPoint(0, -144);
                  const center4 = new firebase.firestore.GeoPoint(0, -72);
                  [center, center1, center2, center3, center4].map((x) => {
                    return null; /*geocollection
                      .near({ center: x, radius: 8587 })
                      .where(
                        "titleAsArray",
                        "array-contains",
                        this.state.userQuery
                      )
                      .orderBy("titleAsArray")
                      .limit(25)
                      .startAfter(this.state.lastVisible)
                      .onSnapshot((querySnapshot) => {
                        let f = [];
                        let p = 0;
                        if (querySnapshot.empty) {
                          console.log("empty");
                          this.setState({ hideMore: true });
                        } else {
                          this.setState({
                            lastVisible:
                              querySnapshot.docs[querySnapshot.docs.length - 1]
                          });
                          querySnapshot.docs.forEach((doc) => {
                            p++;
                            if (doc.exists) {
                              var foo = doc.data();
                              foo.id = doc.id;
                              f.push(foo);
                              if (p === querySnapshot.docs.length) {
                                this.setState({
                                  clubResults: [...this.state.clubResults, ...f]
                                });
                              }
                            }
                          });
                        }
                      });*/
                  });
                }
              }}
            >
              More
            </div>
          )}
        </div>
        <Chatter
          getRoomKeys={this.props.getRoomKeys}
          keyBoxes={this.props.keyBoxes}
          parent={this.props.parent}
          droppedPost={this.props.droppedPost}
          linkDrop={this.props.linkDrop}
          dropId={this.props.dropId}
          droppedCommentsOpen={this.props.droppedCommentsOpen}
          storageRef={this.props.storageRef}
          getUserInfo={this.props.getUserInfo}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          onDeleteVideo={this.props.onDeleteVideo}
          handleSaveVideo={this.props.handleSaveVideo}
          achatisopen={this.props.achatisopen}
          threadId={this.state.threadId}
          width={this.props.width}
          thisentity={this.props.thisentity}
          communities={this.props.communities}
          accessToken={this.props.accessToken}
          recipients={this.state.recipients}
          rangeChosen={this.props.rangeChosen}
          parlayRecip={this.props.parlayRecip}
          forumOpen={this.props.forumOpen}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          clearFilesPreparedToSend={this.props.clearFilesPreparedToSend}
          filePreparedToSend={this.props.filePreparedToSend}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          signedIn={this.props.signedIn}
          s={this.props.s}
          loadGapiApi={this.props.loadGapiApi}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          notes={this.state.notes}
          entityTitle={this.props.entityTitle}
          entityType={this.state.entityType}
          entityId={this.state.entityId}
          chatFilterChosen={this.state.chatFilterChosen}
          auth={this.props.auth}
          achatopen={this.state.achatopen}
          achatisopenfalse={(x) => {
            if (x === "erasequery") {
              this.setState({ userQuery: "" });
            }
            this.achatisopenfalse();
          }}
          cc={this.achatisopenfalse}
          user={this.props.user}
          recentChats={this.state.recentChats}
          users={this.state.users}
          addUsertoRec={this.addUsertoRec}
          removeUserfromRec={this.removeUserfromRec}
          chats={this.state.openSpam ? this.state.spam : this.state.chats}
          topics={this.state.topics}
          chatsopen={this.props.chatsopen}
          //clearall={() => this.setState({ topics: [], recentChats: [] })}
          chosenTopic={this.state.chosenTopic}
          listHiddenMsgs={this.props.listHiddenMsgs}
          listDeletedMsgs={this.props.listDeletedMsgs}
          chooseTopic={(x) => this.props.setTopic(x)}
          addThirty={() => this.setState({ n: this.state.n + 30 })}
          n={this.state.n}
          allcontents={this.state.allcontents}
          contents={this.state.content}
          hiddenMsgs={this.props.hiddenMsgs}
          deletedMsgs={this.props.deletedMsgs}
        />
        {/*<GroupFilter
          notes={this.state.notes}
          user={this.props.user}
          openSpam={this.state.openSpam}
          chatFilterChanger={(e) => {
            var x = e.target.id;
            if (x === "spam") {
              x = "user";
              this.setState({ openSpam: true });
            } else {
              this.setState({ openSpam: false });
            }
            this.setState({ chatFilterChosen: x });
          }}
          show={this.state.openGroupFilter}
          close={() => this.setState({ openGroupFilter: false })}
          chatFilterChosen={this.state.chatFilterChosen}
        />*/}
        {/*<Profile
          pathname={this.props.pathname}
          hydrateUserFromUserName={this.props.hydrateUserFromUserName}
          following={this.props.following}
          getProfile={this.props.getProfile}
          profileEvents={this.props.profileEvents}
          profileJobs={this.props.profileJobs}
          profileClubs={this.props.profileClubs}
          profileServices={this.props.profileServices}
          profileClasses={this.props.profileClasses}
          profileDepartments={this.props.profileDepartments}
          profileRestaurants={this.props.profileRestaurants}
          profileShops={this.props.profileShops}
          profilePages={this.props.profilePages}
          profileVenues={this.props.profileVenues}
          profileHousing={this.props.profileHousing}
          //
          parents={this.props.parents}
          logoutofapp={() => {
            this.props.logoutofapp();
          }}
          close={() => this.props.profileOpener()}
          stripeKey={this.props.stripeKey}
          iAmCandidate={this.props.iAmCandidate}
          iAmJudge={this.props.iAmJudge}
          iAmRepresentative={this.props.iAmRepresentative}
          random={this.props.random}
          setScopeCode={this.props.setScopeCode}
          scopecode={this.props.scopecode}
          myDocs={this.props.myDocs}
          moreDocs={this.props.moreDocs}
          againBackDocs={this.props.againBackDocs}
          chats={this.state.chats}
          filePreparedToSend={this.props.filePreparedToSend}
          clearFilePreparedToSend={this.props.clearFilePreparedToSend}
          showpicker2={this.props.showpicker2}
          picker2={this.props.picker2}
          loadGapiApi={this.props.loadGapiApi}
          signedIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          loadYoutubeApi={this.props.loadYoutubeApi}
          s={this.props.s}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          profileOpen={this.props.profileOpen}
          users={this.state.users}
          user={this.props.user}
          auth={this.props.auth}
          deletedEvts={this.state.deletedEvts}
          deletedClbs={this.state.deletedClbs}
          deletedJobs={this.state.deletedJobs}
        />*/}
      </div>
    );
  }
}

export default Chats;
/*
**"Show chats? We create an asymmetric key-pair for this device, " +
"then you can share your private user key, & then your thread keys, " +
"with this device securely. (a) 1. The first time you do this, you’ll " +
"have to visit your original device, 2. then come back. (b) You can also " +
"have the option to save the keyBoxes object-array in a file, then drop it " +
"into a new device.  IF YOU DO NOT DO EITHER OF THESE and lose all your " +
"devices with your rsaKeyPair, your messages will not be recoverable for " +
"about 10 years if you guess the prime private key. In contrast with other " +
"companies toting privacy these chats ACTUALLY retain end-to-end encryption " +
"when backed up (in the cloud)"
*/
