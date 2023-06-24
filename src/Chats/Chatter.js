import React from "react";
import { Link } from "react-router-dom";
import rsa from "js-crypto-rsa";
import back from ".././Images/back777.png";
import firebase from ".././init-firebase";
//import RSA from "../../.././widgets/authdb";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from "@firebase/firestore";
import Recorder from "./Recorder";
import MessageClean from "./MessageClean";
import RollFiles from "./RollFiles";

const firestore = getFirestore(firebase);
class Media extends React.Component {
  state = {
    selectedFolder: "*"
  };
  render() {
    const { parent, shortId, videoRecorderOpen, isDroppedIn } = this.props;
    const isAuthor =
      this.props.auth !== undefined && parent.authorId === this.props.auth.uid;
    const onlyPost = this.props.onlyPost && !isDroppedIn && videoRecorderOpen;
    return (
      <div
        style={{
          overflow: "hidden",
          transition: ".3s ease-in",
          backgroundColor: "rgb(220,190,180)",
          display: "flex",
          position: "relative",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: onlyPost ? "6px" : "0px",
          height: onlyPost ? "min-content" : "0px"
        }}
      >
        {parent.videos && parent.videos.length > 0 && (
          <RollFiles
            user={this.props.user}
            auth={this.props.auth}
            isAuthor={isAuthor}
            meAuth={this.props.meAuth}
            getUserInfo={this.props.getUserInfo}
            videos={parent.videos}
            selectedFolder={this.state.selectedFolder}
            shortId={`${shortId}`}
            unloadGreenBlue={this.props.unloadGreenBlue}
            getVideos={this.props.getVideos}
          />
        )}
        {this.props.auth !== undefined &&
          parent.authorId === this.props.auth.uid &&
          videoRecorderOpen && (
            <Recorder
              parent={parent}
              vintageOfKeys={this.props.vintageOfKeys}
              setNapkin={this.props.setNapkin}
              user={this.props.user}
              collection={"chatMeta"}
              unloadGreenBlue={this.props.unloadGreenBlue}
              loadGreenBlue={this.props.loadGreenBlue}
              getUserInfo={this.props.getUserInfo}
              storageRef={this.props.storageRef}
              topic={this.state.selectedFolder}
              getVideos={this.props.getVideos}
              getFolders={this.props.getFolders}
              folders={this.props.folders}
              videos={this.props.videos}
              isPost={true}
              auth={this.props.auth}
              room={this.props.room}
              threadId={this.props.threadId}
              setPost={this.props.setPost}
              entityType={this.props.entityType}
              entityId={this.props.entityId}
            />
          )}
      </div>
    );
  }
}
class Message extends React.Component {
  render() {
    const { message, noteList, noteTitles } = this.props;
    return (
      <div
        className={{
          display: "flex",
          position: "relative",
          width: "min-content",
          maxWidth: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "min-content"
          }}
        >
          <div
            style={{
              margin: "0px 12px",
              display: "flex",
              position: "relative",
              color: "rgb(50,50,50)",
              height: "100%",
              width: "max-content",
              fontSize: "15px",
              paddingTop: "10px",
              alignItems: "center"
            }}
          >
            <div
              style={{
                position: "absolute",
                height: "26px",
                width: "26px",
                boxShadow: "inset 0px 0px 5px 1px rgb(200,200,200)",
                borderRadius: "50px"
              }}
            />
            {this.props.message.author &&
            this.props.message.author.photoThumbnail ? (
              <img
                alt="error"
                src={this.props.message.author.photoThumbnail}
                style={{ width: "26px", height: "auto", borderRadius: "50px" }}
              />
            ) : (
              <div
                style={{
                  backgroundColor: `${this.props.message.author.profilergb}`,
                  width: "26px",
                  height: "auto",
                  borderRadius: "50px"
                }}
              />
            )}
            <div
              style={{
                color: "rgb(120,160,255)",
                width: "max-content",
                display: "flex",
                position: "relative",
                fontSize: "14px",
                bottom: "10px",
                flexDirection: "column"
              }}
            >
              &nbsp;
              <div
                style={{
                  width: "max-content",
                  display: "flex",
                  position: "relative",
                  fontSize: "14px",
                  bottom: "0px"
                }}
              >
                &nbsp;{this.props.message.author.name}
              </div>
              <div
                style={{
                  width: "max-content",
                  display: "flex",
                  position: "relative",
                  fontSize: "14px",
                  bottom: "0px"
                }}
              >
                &nbsp;&nbsp;{this.props.message.author.username}
              </div>
            </div>
          </div>
        </div>
        <MessageClean
          noteList={noteList}
          noteTitles={noteTitles}
          parent={this.props.parent}
          droppedPost={this.props.droppedPost}
          linkDrop={this.props.linkDrop}
          dropId={this.props.dropId}
          droppedCommentsOpen={this.props.droppedCommentsOpen}
          //
          communities={this.props.communities}
          threadId={this.props.threadId}
          openTopics={this.props.openTopics}
          closeTheTopics={this.props.closeTheTopics}
          chosenTopic={this.props.chosenTopic}
          onDrag={this.props.onDrag}
          onDragStart={this.props.onDragStart}
          offDrag={this.props.offDrag}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          notes={this.props.notes}
          users={this.props.users}
          listHiddenMsgs={this.props.listHiddenMsgs}
          listDeletedMsgs={this.props.listDeletedMsgs}
          message={message}
          filteredSenders={this.props.filteredSenders}
          auth={this.props.auth}
          signedIn={this.props.signedIn}
          contentLinker={this.props.contentLinker}
          contents={this.props.contents}
        />
      </div>
    );
  }
}

class MessageSplit extends React.Component {
  render() {
    const { message, sender, authorCount, noteList, noteTitles } = this.props;
    return (
      <div
        /*ref={(ref) => {
          // Callback refs are preferable when
          // dealing with dynamic refs
          this.refsArray[message.id] = ref;
        }}*/
        style={{
          width: "min-content",
          maxWidth: "calc(100% - 20px)"
        }}
      >
        {
          //authorCount % 6 !== 1 &&
          this.props.recentChats &&
          this.props.recentChats !== [] &&
          this.props.recentChats[this.props.recentChats.length - 1].id !==
            message.id &&
          //&& jol[message.authorId] !== message.id
          !this.props.dop.includes(message.id) ? (
            <MessageClean
              noteList={noteList}
              noteTitles={noteTitles}
              parent={this.props.parent}
              droppedPost={this.props.droppedPost}
              linkDrop={this.props.linkDrop}
              dropId={this.props.dropId}
              droppedCommentsOpen={this.props.droppedCommentsOpen}
              //
              communities={this.props.communities}
              threadId={this.props.threadId}
              openTopics={this.props.openTopics}
              closeTheTopics={this.props.closeTheTopics}
              chosenTopic={this.props.chosenTopic}
              onDrag={this.props.onDrag}
              onDragStart={this.props.onDragStart}
              offDrag={this.props.offDrag}
              onDelete={this.props.onDelete}
              handleSave={this.props.handleSave}
              notes={this.props.notes}
              users={this.props.users}
              shareDoc={this.props.shareDoc}
              s={this.props.s}
              message={message}
              contents={this.props.contents}
              auth={this.props.auth}
              listHiddenMsgs={this.props.listHiddenMsgs}
              listDeletedMsgs={this.props.listDeletedMsgs}
              filteredSenders={this.props.filteredSenders}
              contentLinker={this.props.contentLinker}
              signedIn={this.props.signedIn}
              sender={sender}
            />
          ) : (
            <Message
              noteList={noteList}
              noteTitles={noteTitles}
              parent={this.props.parent}
              droppedPost={this.props.droppedPost}
              linkDrop={this.props.linkDrop}
              dropId={this.props.dropId}
              droppedCommentsOpen={this.props.droppedCommentsOpen}
              //
              communities={this.props.communities}
              threadId={this.props.threadId}
              openTopics={this.props.openTopics}
              closeTheTopics={this.props.closeTheTopics}
              chosenTopic={this.props.chosenTopic}
              moveDoc={this.props.moveDoc}
              onDrag={this.props.onDrag}
              onDragStart={this.props.onDragStart}
              offDrag={this.props.offDrag}
              onDelete={this.props.onDelete}
              handleSave={this.props.handleSave}
              notes={this.props.notes}
              contentLinker={this.props.contentLinker}
              shareDoc={this.props.shareDoc}
              s={this.props.s}
              message={message}
              authorCount={authorCount}
              auth={this.props.auth}
              listHiddenMsgs={this.props.listHiddenMsgs}
              listDeletedMsgs={this.props.listDeletedMsgs}
              recentChats={this.props.recentChats}
              users={this.props.users}
              sender={sender}
              contents={this.props.contents}
              signedIn={this.props.signedIn}
              filteredSenders={this.props.filteredSenders}
            />
          )
        }
      </div>
    );
  }
}
class AddRemoveSenders extends React.Component {
  state = { ask: false };
  render() {
    const { usersforaddrem } = this.props;
    return (
      <div
        style={
          this.props.userQuery !== ""
            ? {
                display: "flex",
                position: "absolute",
                overflowY: "scroll",
                flexDirection: "column",
                width: "100%",
                color: "white",
                zIndex: "99",
                justifyContent: "center"
              }
            : {
                display: "none"
              }
        }
      >
        <br />
        {/*
  
  
    // add/remove + empty query
    */}
        {this.props.userQuery !== "" && !this.state.ask ? (
          usersforaddrem !== undefined &&
          usersforaddrem
            //.filter(obj => this.props.recipients.includes(obj.id))
            .map((x) => {
              //if (this.props.recipients.indexOf(x.id) < 1)
              if (
                this.props.auth !== undefined &&
                x.id !== this.props.auth.uid
              ) {
                return (
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      justifyContent: "center",
                      zIndex: "9999",
                      margin: "1px 2px",
                      padding: "5px",
                      width: "auto",
                      backgroundColor: "rgba(51, 51, 51, 0.687)"
                    }}
                  >
                    {/*
        
        
        // Add / Remove
        */}
                    {this.props.recipients.includes(x.id) ? (
                      <div
                        style={{ width: "min-content" }}
                        onClick={() => {
                          this.props.removeUserfromRec(x);
                        }}
                      >
                        -&nbsp;
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          this.setState({ ask: x });
                        }}
                        style={{ color: "grey", width: "min-content" }}
                      >
                        +&nbsp;
                      </div>
                    )}
                    <div
                      style={
                        this.props.recipients.includes(x.id)
                          ? { color: "white", width: "min-content" }
                          : { color: "grey", width: "min-content" }
                      }
                    >
                      {x && x.username}
                    </div>
                  </div>
                );
              } else return null;
            })
        ) : (
          <div>
            <div onClick={() => this.setState({ ask: false })}>&times;</div>Add{" "}
            {this.state.ask.username} in{" "}
            <div
              style={{ textDecoration: "underline" }}
              onClick={() => {
                var answer = window.confirm(
                  `Are you sure you want to create a new chat to include ${this.state.ask.username}?`
                );
                if (answer) this.props.addUsertoRec(this.state.ask);
              }}
            >
              new
            </div>{" "}
            or{" "}
            <div
              style={{ textDecoration: "underline" }}
              onClick={() => {
                var reg = [...this.props.recipients].push(this.state.ask.id);
                var answer = window.confirm(
                  `Are you sure you want to copy ${this.state.ask.username} on all previous chats?  This cannot be undone (you will have to delete them)`
                );
                if (answer) {
                  var threadId =
                    this.props.entityType + this.props.entityId + reg.sort();
                  var prethreadId =
                    this.props.entityType +
                    this.props.entityId +
                    this.props.recipients.sort();
                  getDocs(
                    query(
                      collection(firestore, "chats"),
                      where("threadId", "==", prethreadId)
                    )
                  )
                    .then((docs) => {
                      docs.forEach((doc) => {
                        if (doc.exists) {
                          this.props.alterRecipients({
                            entityId: this.props.entityId,
                            entityType: this.props.entityType,
                            recipients: reg.sort(),
                            threadId
                          });
                          doc.ref.update({
                            threadId,
                            recipients: firebase.firestore.FieldValue.arrayUnion(
                              this.state.ask.id
                            )
                          });
                        }
                      });
                    })
                    .catch((err) => console.log(err.message));
                }
              }}
            >
              same
            </div>
          </div>
        )}
      </div>
    );
  }
}
class FilterSenders extends React.Component {
  render() {
    return (
      <div
        style={
          this.props.userQuery === ""
            ? {
                display: "flex",
                position: "absolute",
                overflowY: "scroll",
                flexDirection: "column",
                width: "100%",
                color: "white",
                zIndex: "99",
                justifyContent: "center"
              }
            : {
                display: "none"
              }
        }
      >
        <br />

        {this.props.users &&
          this.props.recipients &&
          this.props.users
            .filter((obj) => this.props.recipients.includes(obj.id))
            .map((x) => {
              return (
                <div
                  key={x.id}
                  style={{
                    display: "flex",
                    position: "relative",
                    justifyContent: "center",
                    zIndex: "9999",
                    margin: "1px 2px",
                    padding: "5px",
                    width: "auto",
                    backgroundColor: "rgba(51, 51, 51, 0.687)"
                  }}
                >
                  <div
                    onClick={() => this.props.changeFilteredSenders(x)}
                    style={
                      this.props.filteredSenders.includes(x.id)
                        ? { color: "white", width: "min-content" }
                        : { color: "grey", width: "min-content" }
                    }
                  >
                    {x.username}
                  </div>
                </div>
              );
            })}
      </div>
    );
  }
}
class MessageMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { foo: [], dop: [], creationDate: "" };
    // create a ref to store the textInput DOM element
    //this.grabbottomofchat = React.createRef();
    //this.refsArray = [];
  }
  /*isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  }*/
  componentDidUpdate = (prevProps) => {
    if (
      this.props.recipients &&
      this.props.recentChats &&
      this.props.recentChats !== prevProps.recentChats
    ) {
      var x =
        this.props.recipients.constructor === Array
          ? this.props.recipients
          : [this.props.recipients];
      let dop = [];
      x.map((hj) => {
        var jot = this.props.recentChats.sort((a, b) => {
          return b.time.seconds - a.time.seconds;
        });
        var jol = jot.find(({ authorId }) => authorId === hj)
          ? jot.find(({ authorId }) => authorId === hj)
          : false;
        dop.push(jol.id);
        if (jot.length > 0 && dop.length === this.props.recipients.length) {
          this.setState({ jot, dop });
        }
        return dop;
      });
    }
    if (
      this.state.jot &&
      this.state.jot.length > 0 &&
      this.state.lastDop !== this.state.dop
    ) {
      var datethis = this.state.jot[0].time.seconds * 1000;
      var goo = new Date(datethis).toLocaleString();
      this.setState({
        lastDop: this.state.dop,
        creationDate: goo
      });
    }
  };
  render() {
    const { noteList, noteTitles } = this.props;
    let authorCount = 0;
    var chatsWithinTopic = this.props.recentChats.filter((x) => {
      return x.topic === this.props.chosenTopic;
    });
    var filteredSenders =
      this.props.auth !== undefined
        ? this.props.recipients.constructor === Array
          ? [...this.props.recipients, this.props.auth.uid]
          : [this.props.recipients, this.props.auth.uid]
        : null;
    return (
      <div
        style={{
          backgroundColor: "rgb(250,250,250)",
          height: "min-content",
          display: "flex",
          position: "relative",
          margin: "0px 5px",
          marginRight: "5px",
          flexDirection: "column",
          justifyContent: "flex-end",
          top: "20px",
          alignItems: "flex-start"
        }}
      >
        {this.props.n < this.props.recentChats ? (
          <div
            onClick={this.props.addThirty}
            style={{
              color: "black"
            }}
          >
            Grab more
          </div>
        ) : (
          <div
            style={{ width: "max-content", color: "grey", fontSize: "14px" }}
          >
            Chat started {this.state.creationDate}
          </div>
        )}
        <div
          style={{
            borderRadius: "3px",
            padding: "1px",
            fontSize: "10px",
            backgroundColor: "rgb(100,100,100)",
            color: "black"
          }}
          onClick={this.props.moreMessages}
        >
          More
        </div>
        {this.state.dop !== [] &&
          chatsWithinTopic &&
          chatsWithinTopic !== [] &&
          chatsWithinTopic
            .sort((a, b) => {
              return a.time.seconds - b.time.seconds;
            })
            .map((message) => {
              authorCount++;
              // eslint-disable-next-line
              if (
                filteredSenders === [] ||
                filteredSenders === null ||
                !filteredSenders ||
                filteredSenders === "" ||
                filteredSenders.includes(message.authorId) ||
                filteredSenders === message.authorId
              ) {
                if (
                  this.props.recentChats.findIndex((x) => x.id === message.id) >
                  this.props.recentChats.length - this.props.n
                ) {
                  if (
                    this.props.deletedMsgs.includes(message.id) === false &&
                    this.props.hiddenMsgs.includes(message.id) === false
                  ) {
                    return (
                      <MessageSplit
                        noteList={noteList}
                        noteTitles={noteTitles}
                        parent={this.props.parent}
                        droppedPost={this.props.droppedPost}
                        linkDrop={this.props.linkDrop}
                        dropId={this.props.dropId}
                        droppedCommentsOpen={this.props.droppedCommentsOpen}
                        //
                        communities={this.props.communities}
                        threadId={this.props.threadId}
                        openTopics={this.props.openTopics}
                        closeTheTopics={this.props.closeTheTopics}
                        chosenTopic={this.props.chosenTopic}
                        onDelete={this.props.onDelete}
                        handleSave={this.props.handleSave}
                        notes={this.props.notes}
                        openAChat={this.props.openAChat}
                        //
                        dop={this.state.dop}
                        users={this.props.users}
                        auth={this.props.auth}
                        listHiddenMsgs={this.props.listHiddenMsgs}
                        listDeletedMsgs={this.props.listDeletedMsgs}
                        filteredSenders={this.props.filteredSenders}
                        contentLinker={this.props.contentLinker}
                        signedIn={this.props.signedIn}
                        key={message.id}
                        shareDoc={this.props.shareDoc}
                        s={this.props.s}
                        authorCount={authorCount}
                        contents={this.props.contents}
                        message={message}
                        recentChats={this.props.recentChats}
                      />
                    );
                  } else return null;
                } else return null;
              } else return null;
            })}
        <div
          style={{
            borderRadius: "3px",
            padding: "1px",
            fontSize: "10px",
            backgroundColor: "rgb(100,100,100)",
            color: "black"
          }}
          onClick={this.props.againBackMessages}
        >
          Back
        </div>
        {/*<div ref={this.grabbottomofchat} />
        !this.props.closeTopics && (
          <div
            style={{
              backgroundColor: "rgba(51,51,51,0)",
              display: "flex",
              position: "absolute",
              width: "100%",
              height: `calc(100% + 1200px)`,
              zIndex: "9999"
            }}
            className="closetopicforeground"
            onClick={this.props.closeTheTopics}
          />
          )*/}
      </div>
    );
  }
}
class TopicsVids extends React.Component {
  state = {};
  render() {
    const {
      topics //, contents
    } = this.props;
    /*var docsWithinTopic = this.props.recentChats.filter((x) => {
      return x.topic === this.props.chosenTopic && x.contents;
    });*/
    var foldersCarry =
      this.props.folders.length > 0
        ? [...topics, ...this.props.folders]
        : topics;
    var folders = [...new Set(foldersCarry)];
    return (
      <div
        style={{
          top: "10px",
          height: "min-content",
          display: "flex",
          position: "relative",
          color: "grey",
          width: "100%",
          flexDirection: "column"
        }}
      >
        {this.props.sidemenuWidth === "50%" && this.props.openWhat === "docs" && (
          <select
            value={this.props.selectedFolder}
            onChange={this.props.handleFolder}
          >
            {folders.map((x, i) => {
              return <option key={i}>{x}</option>;
            })}
          </select>
        )}
        {this.props.openWhat === "docs" ? (
          <Media
            auth={this.props.auth}
            shortId={this.props.threadId}
            parent={{ videos: [] }}
            opened={false}
          />
        ) : this.props.openWhat === "topics" ? (
          <div
            style={{
              display: "flex",
              position: "relative",
              color: "white",
              zIndex: "0",
              overflowY: "auto",
              width: "inherit",
              height: "100%",
              backgroundColor: "rgb(5,5,5)",
              flexDirection: "column",
              paddingBottom: "70px"
            }}
          >
            {topics &&
              topics.map((topic) => {
                let hee = [];
                return (
                  <div
                    key={topic}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      //console.log(JSON.parse(e.dataTransfer.getData("text")));
                      //e.stopPropagation();
                      //var link = e.dataTransfer.getData("URL");
                      //console.log(link);
                    }}
                    onDrop={(e) => {
                      //let link = e.dataTransfer.getData("moveDoc");
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        var link = e.dataTransfer.getData("URL");
                        const thiss = this.props.chats.find((x) => {
                          return x.message === link;
                        });
                        updateDoc(doc(firestore, "chats", thiss.id), {
                          topic,
                          time: new Date()
                        }).catch((err) => console.log(err.message));
                      } catch (e) {
                        console.log(e.message);
                        // If the text data isn't parsable we'll just ignore it.
                        return;
                      }
                    }}
                    onClick={
                      topic === this.props.chosenTopic
                        ? this.props.openWhat === "topics"
                          ? this.props.openDocs
                          : () => this.props.chooseTopic(topic)
                        : () => this.props.chooseTopic(topic)
                    }
                    style={
                      topic === this.props.chosenTopic
                        ? {
                            padding: "10px",
                            borderLeft: "3px solid white",
                            width: "calc(100% - 23px)",
                            color: "white",
                            wordBreak: "break-word",
                            fontSize: "16px"
                          }
                        : {
                            padding: "10px",
                            border: "1px solid #333",
                            width: "calc(100% - 23px)",
                            color: "grey",
                            wordBreak: "break-word",
                            fontSize: "12px"
                          }
                    }
                  >
                    {topic.toString()}
                    {this.props.contents.filter((x) => x.topic === topic)
                      .length > 0 && (
                      <div style={{ display: "flex" }}>
                        <p>&#9776;</p>
                        <p>
                          {
                            this.props.allcontents.filter(
                              (x) => x.topic === topic
                            ).length
                          }
                        </p>
                      </div>
                    )}
                    {this.props.chats &&
                      this.props.auth !== undefined &&
                      this.props.chats
                        .filter((chat) => {
                          let foo = [];
                          if (
                            chat.recipients.map((recipient) =>
                              this.props.recipients
                                .map((pq) => foo.push(pq.id))
                                .includes(recipient)
                            )
                          ) {
                            hee.push(chat);
                          }
                          return hee;
                        })
                        .filter((x) => x.topic === topic)
                        .filter(
                          (chat) =>
                            !chat.readUsers ||
                            !chat.readUsers.includes(this.props.auth.uid)
                        ).length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            position: "absolute",
                            transform: "translate(-10%,10%)",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            width: "100%"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              position: "absolute",
                              bottom: "-17px",
                              width: "0",
                              height: "0",
                              borderTop: "15px solid transparent",
                              borderBottom: "15px solid transparent",

                              borderLeft: "15px solid green",
                              transform: "rotate(45deg)"
                            }}
                          />
                          <p
                            style={{
                              bottom: "-7px",
                              right: "6px",
                              position: "absolute",
                              fontSize: "10px"
                            }}
                          >
                            {this.props.chats &&
                              this.props.auth !== undefined &&
                              this.props.chats
                                .filter((chat) => {
                                  let foo = [];
                                  if (
                                    chat.recipients.map((recipient) =>
                                      this.props.recipients
                                        .map((pq) => foo.push(pq.id))
                                        .includes(recipient)
                                    )
                                  ) {
                                    hee.push(chat);
                                  }
                                  return hee;
                                })
                                .filter((x) => x.topic === topic)
                                .filter(
                                  (chat) =>
                                    !chat.readUsers ||
                                    !chat.readUsers.includes(
                                      this.props.auth.uid
                                    )
                                ).length}
                          </p>
                        </div>
                      )}
                  </div>
                );
              })}
          </div>
        ) : null}
      </div>
    );
  }
}
class ChatAccessories extends React.Component {
  render() {
    var placeholderusersearch = this.props.filterBySender ? "Search" : "Search";
    //console.log(this.props.profileChecker);
    return (
      <div
        style={
          this.props.profileChecker && !this.props.openusersearch
            ? {
                display: "flex",
                position: "fixed",
                backgroundColor: "rgba(35, 108, 255, 0.121)",
                flexDirection: "column",
                color: "white",
                zIndex: "9999",
                width: "100%",
                height: "100%"
              }
            : this.props.openusersearch
            ? {
                display: "flex",
                position: "fixed",
                backgroundColor: "rgba(35, 108, 255, 0.121)",
                flexDirection: "column",
                top: "0px",
                right: "0px",
                color: "white",
                zIndex: "9999",
                width: "300px",
                height: "500px"
              }
            : { display: "none" }
        }
      >
        <div
          onClick={this.props.opentheusersearch2}
          style={
            this.props.openusersearch
              ? {
                  display: "flex",
                  position: "fixed",
                  flexDirection: "column",
                  color: "white",
                  backgroundColor: "rgba(35, 108, 255, 0.721)",
                  top: "0px",
                  right: "0px",
                  zIndex: "9999",
                  width: "300px",
                  height: "500px"
                }
              : { display: "none" }
          }
        />
        {/*<div
          onClick={this.props.opentheusersearch}
          style={
            this.props.openusersearch
              ? {
                  display: "flex",
                  position: "fixed",
                  flexDirection: "column",
                  backgroundColor: "rgba(22, 22, 27, 0.787)",
                  color: "white",
                  zIndex: "9999",
                  width: "100%",
                  height: "100%"
                }
              : {
                  display: "none"
                }
          }
        />*/}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            return false;
          }}
          style={
            this.props.openusersearch
              ? {
                  display: "flex",
                  position: "fixed",
                  flexDirection: "column",
                  backgroundColor: "rgba(35, 108, 255, 0.721)",
                  color: "white",
                  zIndex: "9999",
                  top: "30px",
                  right: "100px",
                  width: "200px",
                  height: "200px"
                }
              : {
                  display: "none"
                }
          }
        >
          <input
            value={this.props.userQuery}
            placeholder={placeholderusersearch}
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
              backgroundColor: "#333",
              border: "3px solid #333",
              borderRadius: "0px",
              height: "20px",
              color: "white",
              zIndex: "9999",
              fontSize: "18px"
            }}
            maxLength="30"
            onChange={this.props.changeUserQuery}
          />
          {/*




// filter + empty query
*/}
          <FilterSenders
            removeSelf={this.props.removeSelf}
            filterBySender={this.props.filterBySender}
            userQuery={this.props.userQuery}
            changeFilteredSenders={this.props.changeFilteredSenders}
            recipients={this.props.recipients}
            users={this.props.users}
            auth={this.props.auth}
            filteredSenders={this.props.filteredSenders}
            user={this.props.user}
            openusersearch={this.props.openusersearch}
          />
          <AddRemoveSenders
            alterRecipients={this.props.alterRecipients}
            entityId={this.props.entityId}
            entityType={this.props.entityType}
            usersforaddrem={this.props.usersforaddrem}
            userQuery={this.props.userQuery}
            auth={this.props.auth}
            removeUserfromRec={this.props.removeUserfromRec}
            addUsertoRec={this.props.addUsertoRec}
            recipients={this.props.recipients}
            filterBySender={this.props.filterBySender}
            user={this.props.user}
            users={this.props.users}
            openusersearch={this.props.openusersearch}
          />
        </form>
        <div
          //onClick={this.props.filterBySenderToggle}
          style={
            this.props.openusersearch
              ? {
                  display: "flex",
                  position: "absolute",
                  zIndex: "9999",
                  height: "36px",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px white solid",
                  borderRadius: "45px",
                  padding: "5px 0px",
                  color: "rgba(250,250,250,.687)",
                  flexDirection: "column",
                  backgroundColor: "rgba(51,51,51,.687)",
                  top: "230px",
                  right: "98px",
                  width: "200px"
                }
              : {
                  display: "none"
                }
          }
        >
          {this.props.userQuery === ""
            ? "Filter by author"
            : "Add/remove users"}
          <div style={{ fontSize: "12px", color: "rgba(119,136,153,.687)" }}>
            {this.props.userQuery === ""
              ? "ADD/REMOVE USERS"
              : "FILTER BY AUTHOR"}
          </div>
        </div>
      </div>
    );
  }
}

class ChatterHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGroup: false,
      numberOfMessages:
        props.auth !== undefined &&
        props.recentChats.filter(
          (chat) => !chat.readUsers || !chat.readUsers.includes(props.auth.uid)
        ).length,
      oktopic: props.chosenTopic
    };
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.chosenTopic !== prevProps.chosenTopic) {
      this.setState({ oktopic: this.props.chosenTopic });
    }
  };
  render() {
    var place = this.props.chosenTopic ? this.props.chosenTopic : "Topic";
    return (
      <div
        style={{
          backgroundColor: this.props.sidemenuWidth !== "0" ? "blue" : "red",
          display: "flex",
          position: "relative",
          fontSize: "15px",
          top: "0px",
          height: this.props.closeHeader ? "0px" : "56px",
          width: "min-content",
          color: "white",
          zIndex: this.props.closeHeader ? "-1" : "1",
          flexDirection: "column",
          transition: ".3s ease-out"
        }}
      >
        <div
          style={{ zIndex: "6" }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            //console.log(JSON.parse(e.dataTransfer.getData("text")));
            //e.stopPropagation();
            var link = e.dataTransfer.getData("URL");
            this.props.openWhat === "docs" && this.props.openTopics();
            try {
              const thiss = this.props.chats.find((x) => x.message === link);
              if (thiss) {
                console.log("p");
              }
            } catch (e) {}
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "81px",
              backgroundColor:
                this.props.openWhat === "topics"
                  ? "rgba(35, 108, 255, 0.721)"
                  : "rgb(15,15,15)",
              transition: ".3s ease-in"
            }}
          >
            <div
              onClick={this.props.openTopics}
              style={{
                opacity: this.props.openWhat !== "topics" ? 0 : 1,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "81px",
                boxShadow:
                  this.props.openWhat !== "topics"
                    ? ""
                    : `inset -5px -10px 10px 1px rgb(20,20,20)`,
                color:
                  this.props.openWhat !== "topics"
                    ? "grey"
                    : "rgb(220,220,220)",
                height: this.props.openWhat !== "topics" ? "0px" : "30px",
                fontSize: "15px",
                transition: ".3s ease-in"
              }}
            >
              &nbsp; #&nbsp;
              <div
                style={{
                  fontSize: "12px",
                  height: "15px",
                  minWidth: "15px",
                  paddingTop: ".6px",
                  textAlign: "center",
                  backgroundColor:
                    this.state.numberOfMessages &&
                    this.state.numberOfMessages > 0
                      ? "rgba(230,230,230)"
                      : "",
                  color: "rgb(135, 28, 255)",
                  borderRadius: "45px",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {this.state.numberOfMessages > 999
                  ? " +"
                  : this.state.numberOfMessages > 0
                  ? this.state.numberOfMessages
                  : null}
              </div>
            </div>
          </div>
          <span
            onClick={this.props.openDocs}
            style={{
              flexDirection: "column",
              display: "flex",
              fontSize: "15px",
              backgroundColor:
                this.props.openWhat === "docs"
                  ? "rgba(32, 108, 255, 0.721)"
                  : "rgb(35,35,35)",
              alignItems: "center",
              justifyContent: "center",
              height: this.props.openWhat === "docs" ? "58px" : "26px",
              width: this.props.openWhat === "docs" ? "81px" : "50px",
              color:
                this.props.openWhat === "docs" ? "rgb(220,220,220)" : "grey",
              transition: ".3s ease-in",
              boxShadow:
                this.props.openWhat === "docs"
                  ? "inset -5px 0px 5px 1px rgb(20,20,20)"
                  : "inset -2px 0px 5px 5px rgb(0,0,0)"
            }}
            role="img"
            aria-label="storage files folder"
          >
            {this.props.openWhat === "docs" && (
              <div style={{ fontSize: "10px", overflowWrap: "wrap" }}>
                {" "}
                {this.props.chosenTopic}
              </div>
            )}
            &#128193;
            {this.props.files.length > 0 ? this.props.files.length : ""}
          </span>
          {/*<img
            src={back}
            style={
              this.props.openWhat !== "topics"
                ? {
                    display: "flex",
                    width: "30px",
                    height: "20px"
                  }
                : {
                    display: "none"
                  }
            }
            alt="error"
          />*/}
        </div>
        <div
          style={{
            display: "flex",
            position: "fixed",
            color: "black",
            zIndex: "5",
            width: "100%",
            height: "min-content",
            flexDirection: "row",
            top: "0px",
            left: "82px"
          }}
        >
          <div
            style={{
              paddingBottom: "20px",
              right: "0px",
              display: "flex",
              position: "relative",
              color: "black",
              overflowX: "auto",
              overflowY: "hidden",
              width: "calc(100%)",
              height: "100px"
            }}
          >
            <div
              onClick={this.props.checkProfilesOpen}
              style={{
                backgroundColor: "rgb(20,20,20)",
                display: "flex",
                position: "relative",
                border: "1px grey dotted",
                left: "0px",
                textIndent: "10px",
                height: "20px",
                transition: ".1s ease-in",
                width: "200%",
                zIndex: "1",
                flexDirection: "row"
              }}
            >
              {this.props.entityType !== "users" && (
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    fontSize: "15px",
                    width: "max-content",
                    color: "white"
                  }}
                >
                  {this.props.thisentity
                    ? this.props.thisentity.message
                    : this.props.entityTitle}
                  :
                </div>
              )}
              {this.props.recentChats[0] &&
                this.props.recentChats[0].recipientsProfiled.map(
                  (x) =>
                    this.props.recipients &&
                    this.props.recipients.includes(x.id) && (
                      <div
                        key={x.id}
                        style={{
                          display: "flex",
                          position: "relative",
                          fontSize: "15px",
                          width: "max-content",
                          color: "white"
                        }}
                      >
                        {x.username}
                      </div>
                    )
                )}
            </div>
          </div>
          <form
            style={{
              display: "flex",
              position: "fixed",
              height: "42px",
              left: "50px",
              marginTop: "25px",
              zIndex: "5",
              width: "80%"
            }}
            onSubmit={(e) => {
              e.preventDefault();
              return false;
            }}
          >
            <input
              onMouseEnter={() => this.setState({ hoverHeader: true })}
              onMouseLeave={() => this.setState({ hoverHeader: false })}
              autoCorrect="off"
              onChange={(e) => {
                var t = e.target.value;
                this.setState({ oktopic: t });
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                  this.props.chooseTopic(t);
                }, 200);
              }}
              value={this.state.oktopic}
              placeholder={place}
              style={{
                height: !this.state.hoverHeader ? "30px" : "40px",
                transition: ".2s ease-in",
                display: "flex",
                position: "fixed",
                textIndent: "36px",
                width: "80%",
                backgroundColor: "white",
                alignItems: "center",
                color: "black",
                border: "0.5px dotted #999",
                zIndex: "5"
              }}
            />
            {this.state.isGroup &&
              this.props.group.admin.includes(this.props.auth.uid) && (
                <span
                  role="img"
                  aria-label="Announcement"
                  style={{
                    display: "flex",
                    position: "relative",
                    height: "56px",
                    right: "0px",
                    alignItems: "center",
                    color: this.state.authoritarianTopic ? "black" : "grey"
                  }}
                  onClick={() => this.setState({ authoritarianTopic: true })}
                >
                  &#128274;
                </span>
              )}
          </form>
        </div>
      </div>
    );
  }
}
class CheckProfiler extends React.Component {
  render() {
    var q = this.props.thisentity
      ? this.props.thisentity.message
      : this.props.entityTitle;
    var thiscommunity = this.props.thisentity
      ? this.props.this.thisentity.community
      : null;
    var city = this.props.thisentity ? this.props.thisentity.city : null;
    return (
      <div
        onClick={this.props.checkProfilesClose}
        style={
          this.props.profileChecker
            ? {
                display: "flex",
                position: "fixed",
                top: "0px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(41,51,90,.687)",
                zIndex: "9999",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }
            : {
                display: "flex",
                position: "fixed",
                top: "0px",
                left: "50%",
                transform: "translateX(-250%)",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(51,51,51,.687)",
                zIndex: "9999",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }
        }
      >
        {this.props.entityType !== "users" && (
          <Link
            key={this.props.entityId}
            to={
              thiscommunity
                ? this.props.entityType === "classes"
                  ? this.props.thisentity &&
                    new Date(this.props.thisentity.endDate.seconds * 1000) <
                      new Date()
                    ? `/classes/${
                        thiscommunity
                          ? thiscommunity.message
                          : this.props.cityapi
                      }/${q}/${new Date(
                        this.props.thisentity.endDate.seconds * 1000
                      ).getFullYear()}-${
                        new Date(
                          this.props.thisentity.endDate.seconds * 1000
                        ).getMonth() + 1
                      }-${new Date(
                        this.props.thisentity.endDate.seconds * 1000
                      ).getDate()}`
                    : `/classes/${
                        thiscommunity
                          ? thiscommunity.message
                          : this.props.cityapi
                      }/${q}`
                  : "/" +
                    this.props.entityType +
                    "/" +
                    thiscommunity.message +
                    "/" +
                    q
                : "/" + this.props.entityType + "/" + city + "/" + q
            }
            style={{ color: "white" }}
          >
            {q}
          </Link>
        )}
        {this.props.recentChats[0] &&
          this.props.recentChats[0].recipientsProfiled.map((x) => {
            return (
              <Link
                key={x.id}
                to={"/at/" + x.username}
                style={{
                  color: "white"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    height: "33px",
                    width: "33px",
                    boxShadow: "inset 0px 0px 5px 1px rgb(200,200,200)",
                    borderRadius: "50px"
                  }}
                />
                <img
                  style={{
                    height: "33px",
                    width: "33px",
                    borderRadius: "50px"
                  }}
                  src={x.photoThumbnail}
                  alt={x.username}
                />
                {x.username}
              </Link>
            );
          })}
        <div
          style={
            this.props.openusersearch
              ? {
                  display: "none"
                }
              : {
                  display: "flex",
                  position: "fixed",
                  right: "40px",
                  top: "80px",
                  zIndex: "9999",
                  backgroundColor: "rgba(73, 73, 214, 0.585)",
                  color: "white",
                  border: "1px dotted white",
                  borderRadius: "45px",
                  height: "45px",
                  width: "45px",
                  justifyContent: "center",
                  alignItems: "center"
                }
          }
          onClick={this.props.opentheusersearch2}
        >
          +
        </div>
      </div>
    );
  }
}
class ChatterSender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authoritarianTopic: false,
      sendTitlePlan: "",
      message: "",
      heightOfText: "36px"
    };
    this.getHeightOfText = React.createRef();
  }

  sendChat = async ({
    rangeChosen,
    threadId,
    authorId,
    recipients,
    message,
    topic,
    authoritarianTopic,
    time,
    entityType,
    entityId
  }) => {
    //if (!this.props.vintageName)
    //return window.alert("you'll have to name a vintage for encrypted chats");
    var add = {
      droppedId: this.props.droppedId || null,
      rangeChosen: rangeChosen || null,
      threadId,
      authorId,
      recipients,
      message,
      topic,
      authoritarianTopic,
      time,
      entityType,
      entityId
      //vintage: this.props.vintageName
    };
    (this.state.parent
      ? updateDoc(doc(firestore, "chats", this.state.parent.id), add)
      : addDoc(collection(firestore, "chats"), add)
    ).catch((err) => console.log(err.message));
  };

  componentDidUpdate = async (prevProps) => {
    if (this.state.message !== this.state.lastMessage) {
      this.setState({
        lastMessage: this.state.message,
        heightOfText: this.getHeightOfText.current.offsetHeight
      });
    }
    if (this.state.sendTitlePlan !== this.state.lastSendTitlePlan) {
      let spaces = [];
      for (let x = 0; x < this.state.sendTitlePlan.length; x++) {
        spaces.push(<p>&nbsp;</p>);
      }
      this.setState({ lastSendTitlePlan: this.state.sendTitlePlan, spaces });
    }
  };
  render() {
    //const devices = [];
    return (
      <form
        style={{
          display: "flex",
          position: "relative",
          zIndex: "5",
          width: "100%",
          height: "min-content",
          textIndent: "5px",
          fontSize: "10px",
          transition: ".3s ease-in"
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if (
            (this.state.message !== "" && this.props.chosenTopic !== "") ||
            (this.props.parent && this.props.parent.droppedPost)
          ) {
            // now you get the result of verification in boolean
            this.sendChat({
              rangeChosen: this.props.rangeChosen,
              threadId:
                this.props.entityType +
                this.props.entityId +
                this.props.recipients.sort(),
              authorId: this.props.auth.uid,
              recipients: this.props.recipients,
              message: this.state.message,
              topic: this.props.chosenTopic,
              authoritarianTopic: this.state.authoritarianTopic,
              time: new Date(),
              entityType: this.props.entityType,
              entityId: this.props.entityId
            });
            this.setState({ message: "" });
            if (this.props.recentChats.length === 0) {
              this.props.achatisopenfalse("erasequery");
            }
          }
        }}
      >
        {/*<div
        style={
          this.state.askIfPlan
            ? {
                display: "flex",
                position: "absolute",
                bottom: "56px",
                width: "100%",
                minHeight: "56px",
                zIndex: "9999",
                textIndent: "20px",
                wordBreak: "break-all",
                fontSize: "15px",
                color: "grey"
              }
            : {
                display: "none"
              }
        }
      >
        "{spaces}"
      </div>*/}
        {this.state.message !== "" && (
          <div
            style={{
              display: "flex",
              width: "56px",
              justifyContent: "center",
              color: "rgb(211, 211, 211)",
              fontSize: "15px"
            }}
          >
            {this.state.message.length}
            <br />
            /1001
          </div>
        )}
        <div
          ref={this.getHeightOfText}
          style={{
            zIndex: "-1",
            opacity: 0,
            width: "70%",
            display: "flex",
            position: "fixed",
            left: "56px",
            bottom: "100px",
            padding: "10px",
            paddingBottom: "11px",
            height: "min-content",
            minHeight: "56px",
            textIndent: "20px",
            wordWrap: "break-word",
            wordBreak: "break-all",
            resize: "none",
            border: "1px solid white",
            whiteSpace: "pre-line"
          }}
        >
          {this.state.message}
        </div>
        <div
          onClick={() => {
            if (this.state.message !== "") {
              var answer = window.confirm("remove progress?");
              if (answer) {
                this.setState({ message: "" });
              }
            } else if (this.state.sendTitlePlan === "") {
              this.setState({ message: "reminder to " });
            }
          }}
          style={{
            boxShadow: "inset 0px 0px 5px 1px rgb(0,0,0)",
            display: "flex",
            position: "absolute",
            maxWidth: "300px",
            wordBreak: "break-all",
            height: "36px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "40px",
            padding: "5px 10px",
            color: "grey",
            bottom: "137px",
            right: "10px",
            backgroundColor: "rgb(200,200,250)",
            opacity:
              this.state.message &&
              !this.state.message.startsWith("reminder to ")
                ? 0.5
                : 1,
            fontSize: "18px"
          }}
        >
          {this.state.sendTitlePlan}
        </div>
        <Link
          //to="/new"
          to={{
            pathname: "/new",
            state: {
              sendTitlePlan: this.state.sendTitlePlan,
              entityId: this.props.entityId,
              entityType: this.props.entityType,
              recipients: this.props.recipients,
              topics:
                this.props.topics && this.props.topics.length > 0
                  ? this.props.topics
                  : ["*"]
            }
          }}
          style={
            this.state.sendTitlePlan
              ? {
                  textDecoration: "none",
                  boxShadow: "inset 0px 0px 5px 1px rgb(0,0,0)",
                  display: "flex",
                  position: "absolute",
                  width: "max-content",
                  height: "36px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "40px",
                  padding: "5px 20px",
                  color: "blue",
                  bottom: "77px",
                  right: "10px",
                  backgroundColor: "rgb(200,200,250)",
                  fontSize: "18px"
                }
              : {
                  display: "none"
                }
          }
        >
          send as plan
        </Link>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            left: "56px",
            right: "60px",
            height: "min-content"
          }}
        >
          <div style={{ display: "flex" }}>
            {" "}
            <button
              type="submit"
              style={
                this.state.message !== "" ||
                (this.props.parent && this.props.parent.droppedPost)
                  ? {
                      display: "flex",
                      position: "relative",
                      bottom: "0px",
                      height: "36px",
                      width: "max-content",
                      padding: "0px 5px",
                      backgroundColor: "white",
                      color: "black",
                      transition: ".3s ease-out"
                    }
                  : {
                      display: "flex",
                      position: "relative",
                      bottom: "-56px",
                      height: "36px",
                      width: "max-content",
                      padding: "0px 5px",
                      backgroundColor: "white",
                      color: "black",
                      transition: ".3s ease-in"
                    }
              }
            >
              Send it
            </button>
            <div
              onClick={() => {
                if (!["", "reminder to "].includes(this.state.message)) {
                  var answer = window.confirm("remove progress?");
                  if (answer) this.setState({ message: "" });
                } else {
                  this.setState({ message: "" });
                }
              }}
              style={
                this.state.message !== ""
                  ? {
                      display: "flex",
                      position: "relative",
                      bottom: "0px",
                      height: "36px",
                      width: "max-content",
                      padding: "0px 5px",
                      backgroundColor: "white",
                      color: "black",
                      transition: ".3s ease-out"
                    }
                  : {
                      display: "flex",
                      position: "relative",
                      bottom: "-56px",
                      height: "36px",
                      width: "max-content",
                      padding: "0px 5px",
                      backgroundColor: "white",
                      color: "black",
                      transition: ".3s ease-in"
                    }
              }
            >
              &times;
            </div>
          </div>
          {/*(this.props.user !== undefined || this.props.entity) && (
            <div style={{ color: "blue" }}>
              Private RSA Key . Used on {devices.length} devices
            </div>
          )*/}
          <textarea
            placeholder=" •••"
            className="chatinput1"
            style={
              this.state.message !== ""
                ? {
                    height: this.state.heightOfText,
                    maxHeight: "90vh",
                    display: "flex",
                    position: "relative",
                    padding: "10px",
                    left: "0px",
                    right: "-56px",
                    minHeight: "36px",
                    zIndex: "9999",
                    textIndent: "20px",
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    resize: "none",
                    border: "1px solid blue"
                  }
                : {
                    height: "36px",
                    maxHeight: "90vh",
                    display: "flex",
                    position: "relative",
                    padding: "10px",
                    left: "0px",
                    right: "-56px",
                    minHeight: "36px",
                    zIndex: "9999",
                    textIndent: "20px",
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    resize: "none",
                    border: "1px solid white"
                  }
            }
            value={this.state.message}
            onChange={(e) => {
              var bee = e.target.value;
              if (
                bee.toLowerCase().startsWith("reminder to") &&
                bee.length > 12
              ) {
                this.setState({
                  askIfPlan: true,
                  sendTitlePlan: bee.substring(
                    bee.lastIndexOf("reminder to") + 12,
                    bee.length
                  )
                });
              } else if (this.state.askIfPlan) {
                this.setState({ askIfPlan: false, sendTitlePlan: "" });
              }
              this.setState({ message: bee });
            }}
            maxLength="1001"
          />
        </div>
      </form>
    );
  }
}
class Chatter extends React.Component {
  constructor(props) {
    super(props);
    //let rsaPrivateKeys = new RSA();
    this.state = {
      chats: [],
      //rsaPrivateKeys,
      closeDrop: true,
      selectedFolder: "*",
      folders: [],
      videos: [],
      lastFiles: [],
      files: [],
      roomOpen: true,
      message: "",
      closeHeader: false,
      answers: [],
      sidemenuWidth: "0",
      openWhat: "topics",
      accessToken: "",
      authorizedScopes: false,
      filteredSenders: [],
      hiddenMsgs: [],
      deletedMsgs: [],
      users: [],
      userQuery: "",
      lastUserQuery: "",
      lastRecipients: [],
      authorCount: 0,
      s: "",
      filePreparedToSend: [],
      gapiReady: false,
      signedIn: false
    };
    this.grabbottomofchat = React.createRef();
  }
  componentDidMount = () => {
    this.move();
  };
  componentWillUnmount = () => {
    clearTimeout(this.snos);
  };
  move = () => {
    clearTimeout(this.snos);
    this.snos = setTimeout(() => {
      this.grabbottomofchat &&
        this.grabbottomofchat.current &&
        this.grabbottomofchat.current.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  };
  findRoom = () => {
    onSnapshot(
      doc(firestore, "rooms", this.props.threadId),
      async (doc) => {
        if (doc.exists) {
          var room = doc.data();
          room.id = doc.id;

          this.setState({ room });
          if (room.here && room.here.length === 0) {
            getDocs(
              query(
                collection(firestore, "candidates"),
                where("roomId", "==", room.id),
                where("authorId", "==", this.props.auth.uid)
              )
            )
              .then((docs) => {
                docs.forEach((doc) => {
                  if (doc.exists) {
                    deleteDoc(doc(firestore, "candidates", doc.id))
                      .then(() => console.log("candidate cleared " + room.id))
                      .catch((e) => console.log(e.message));
                  }
                });
              })
              .catch((e) => console.log(e.message));
          }
        } else {
          setDoc(doc(firestore, "rooms", this.props.threadId), {
            publicKey: ""
          });
          this.setState({ room: { id: this.props.threadId } });
        }
      },
      (e) => console.log(e.message)
    );
  };
  handleDelete = () => {
    deleteDoc(doc(firestore, "chats", this.state.parent.id))
      .then(() => {
        //this.props.cancelRebeat({ rebeat: null });
        this.setState({ parent: null });
        console.log("deleted progress");
      })
      .catch((e) => console.log(e.message));
  };
  handleKeysForRoom = (room) => {
    const { threadId, user } = this.props;
    const recipientsProfiled = [];
    const { rsaPrivateKeys } = this.state;
    //const rooms = firebase.firestore().collection("rooms");
    this.props.getRoomKeys(
      room,
      rsaPrivateKeys,
      threadId,
      recipientsProfiled,
      "rooms", //roomsCollection,
      user
    );
  };
  componentDidUpdate = (prevProps) => {
    if (
      this.props.user !== undefined &&
      this.props.user.key &&
      this.props.recentChats &&
      this.props.recipientsProfiled &&
      this.props.recipientsProfiled.length > 0 &&
      this.props.recipientsProfiled.length === this.props.recipients.length &&
      this.state.room &&
      this.state.room !== this.state.lastRoom
    ) {
      this.handleKeysForRoom(this.state.room);
      this.setState({ lastRoom: this.state.room }, () => {
        const { room } = this.state;

        /*
        room = {
          id: collection + doc.id,
          ["saltedKeys" + userId]: roomKeyInBox,
          ...,
          ["saltedKeys" + userId]: roomKeyInBox
        }
        */
        const roomKey = room["saltedKey" + this.props.auth.uid];
        this.setState({ roomKey }, () => {
          let p = 0;
          let chats = [];
          this.props.recentChats.map(async (x) => {
            p++;
            var foo = { ...x };
            const message = await rsa.decrypt(
              x.message,
              this.props.user.key,
              "SHA-256",
              {
                name: "RSA-PSS"
              }
            );
            if (message) {
              foo.message = message;
              chats.push(foo);
            }
          });
          if (p === this.props.recentChats.length) {
            this.setState({ chats });
          }
        });
      });
    }
    if (
      this.props.threadId !== "" &&
      this.props.threadId !== prevProps.threadId
    ) {
      this.move();
      this.setState({ gotFirstBatch: false });
      this.findRoom();
    }
    if (
      this.props.users &&
      (prevProps.users !== this.props.users ||
        this.state.lastUserQuery !== this.state.userQuery) &&
      this.state.userQuery !== ""
    ) {
      this.setState({
        usersforaddrem: this.props.users.filter((x) =>
          x.username.toLowerCase().includes(this.state.userQuery.toLowerCase())
        ),
        lastUserQuery: this.state.userQuery
      });
    }
    if (this.props.achatisopen !== prevProps.achatisopen) {
      this.move();
    }
  };
  handleNewParent = () => {
    if (this.props.auth !== undefined) {
      var add = {
        time: new Date(),
        authorId: this.props.auth.uid,
        message: "",
        recipients: this.props.recipients,
        entityId: this.props.entityId,
        entityType: this.props.entityType,
        threadId: this.props.threadId,
        topic: this.props.chosenTopic
      };

      addDoc(collection(firestore, "chats"), add)
        .then((doc) => {
          console.log("parent made " + JSON.stringify(add));
          this.setState({
            parent: { id: doc.id, ...add, collection: "chats" }
          });
          onSnapshot(
            doc(firestore, "chats", doc.id),
            (doc) => {
              if (doc.exists) {
                var parent = doc.data();
                parent.id = doc.id;
                parent.collection = "chats";
                this.setState({ parent });
              }
            },
            (e) => console.log(e.message)
          );
        })
        .catch((e) => console.log(e.message));
    } else {
      var answer = window.confirm("want to sign in?");
      if (answer) {
        this.props.getUserInfo();
      }
    }
  };
  openDrop = (x) => {
    this.setState(x);
    if (!this.state.parent) {
      this.handleNewParent();
    } else if (this.state.parent) {
      console.log("parent deleted");
      this.handleDelete();
    } else {
      window.alert("unhandled");
    }
  };
  handleClose = () => {
    const { parent } = this.state;
    if (parent.droppedPost) {
      var answer = window.confirm(
        "all progress will be lost for " + JSON.stringify(parent)
      );
      if (answer) {
        this.handleDelete();
        this.handleClose2();
      }
    } else this.handleClose2();
  };
  handleClose2 = () => {
    if (this.state.videoRecorderOpen) {
      var answer = window.confirm("close video? video will be lost");
      if (answer) this.setState({ videoRecorderOpen: false });
    } else if (this.state.profileChecker) {
      this.setState({ profileChecker: false });
    } else if (this.state.openusersearch) {
      this.setState({ openusersearch: false });
    } else if (this.state.sidemenuWidth === "0") {
      this.props.cc();
      this.props.achatisopenfalse();
    } else {
      this.setState({ sidemenuWidth: "0" });
    }
  };
  render() {
    const { chats } = this.state;
    var filteredSenders = this.props.recipients;
    let noteList = [];
    let noteTitles = [];
    this.props.notes &&
      this.props.notes.map((x) => {
        noteTitles.push(x.message);
        return noteList.push(x._id);
      });
    //console.log("recentChats", this.props.recipients);
    return (
      <div
        style={{
          height: "100%",
          display:
            this.props.chatsopen && this.props.achatopen ? "flex" : "none",
          position: "fixed",
          bottom: "0px",
          width: "100%",
          top: "0px",
          zIndex: "5",
          backgroundColor: "rgb(10, 10, 10)",
          flexDirection: "column",
          transition: ".01s ease-in"
        }}
      >
        <ChatterHeader
          recentChats={this.props.recentChats}
          files={this.state.files}
          closeHeader={this.state.closeHeader}
          width={this.props.width}
          thisentity={this.props.thisentity}
          sidemenuWidth={this.state.sidemenuWidth}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          entityId={this.props.entityId}
          chats={this.props.chats}
          auth={this.props.auth}
          checkProfilesOpen={() => this.setState({ profileChecker: true })}
          users={this.props.users}
          recipients={this.props.recipients}
          chooseTopic={this.props.chooseTopic}
          chosenTopic={this.props.chosenTopic}
          openWhat={this.state.openWhat}
          openTopics={() => {
            if (
              this.state.openWhat === "docs" ||
              this.state.sidemenuWidth === "0"
            ) {
              this.setState({
                sidemenuWidth: "40vw",
                openWhat: "topics"
              });
            } else this.setState({ sidemenuWidth: "0", openWhat: "topics" });
          }}
          openDocs={() => {
            if (
              this.state.sidemenuWidth === "0" ||
              this.state.openWhat === "topics"
            ) {
              this.setState({ sidemenuWidth: "40vw", openWhat: "docs" });
            } else this.setState({ openWhat: "topics" });
          }}
        />
        <div
          style={{
            margin: "0px",
            height: "calc(100% - 56px)",
            display: "grid",
            gridTemplateColumns: "min-content min-content 10fr",
            position: "relative",
            width: `100%`,
            wordBreak: "break-all",
            gridTemplateAreas: `"sidebar content"`,
            transition: "transform 0.3s ease-out"
          }}
        >
          <div
            style={{
              display: "flex",
              height: "max-content",
              minWidth: this.state.sidemenuWidth === "0" ? "0px" : "120px",
              width: this.state.sidemenuWidth,
              transition: ".1s ease-in"
            }}
          >
            <TopicsVids
              selectedFolder={this.state.selectedFolder}
              handleFolder={(e) =>
                this.setState({ selectedFolder: e.target.value })
              }
              videos={this.state.videos}
              folders={this.state.folders}
              threadId={this.props.threadId}
              sidemenuWidth={this.state.sidemenuWidth}
              recentChats={this.props.recentChats}
              auth={this.props.auth}
              recipients={this.props.recipients}
              chats={this.props.chats}
              openDocs={() => this.setState({ openWhat: "docs" })}
              openWhat={this.state.openWhat}
              allcontents={this.props.allcontents}
              chosenTopic={this.props.chosenTopic}
              chooseLink={(link) => this.setState({ chosenLink: link.content })}
              chosenLink={this.state.chosenLink}
              topics={this.props.topics}
              contents={this.props.contents}
              chooseTopic={this.props.chooseTopic}
            />
          </div>
          <div
            draggable={true}
            onClick={() => {
              if (this.state.sidemenuWidth === "0") {
                this.setState({ sidemenuWidth: "40vw" });
              } else this.setState({ sidemenuWidth: "0" });
            }}
            onDrag={() =>
              !this.state.dragging &&
              this.setState({ dragging: true, sidemenuWidth: "40vw" })
            }
            onDragEnd={(e) => {
              this.state.dragging && this.setState({ dragging: false });
              var no = e.screenX;
              this.setState({ sidemenuWidth: no });
            }}
            style={{
              display: "flex",
              position: "relative",
              width: this.state.sidemenuWidth === "0" ? "0px" : "16px",
              top: "6px",
              bottom: "206px",
              backgroundColor: this.state.dragging
                ? "green"
                : this.state.sidemenuWidth === "0"
                ? "grey"
                : "rgb(80,80,80)"
            }}
          />
          <div
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
              overflowY: "auto",
              overflowX: "hidden",
              color: "white",
              alignItems: "center",
              backgroundColor: "rgb(240,250,250)",
              boxShadow:
                this.state.sidemenuWidth === "0"
                  ? ""
                  : "inset 0px -8px 5px 3px rgb(200,200,200)",
              width: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                flexDirection: "column",
                width: "100%",
                height: "min-content"
              }}
            >
              <MessageMap
                noteList={noteList}
                noteTitles={noteTitles}
                parent={this.props.parent}
                droppedPost={this.props.droppedPost}
                linkDrop={this.props.linkDrop}
                dropId={this.props.dropId}
                droppedCommentsOpen={this.props.droppedCommentsOpen}
                communities={this.props.communities}
                threadId={this.props.threadId}
                openTopics={() =>
                  this.state.sidemenuWidth === "0" &&
                  this.setState({ sidemenuWidth: "40vw" })
                }
                //closeTheTopics=//{//() =>//!this.state.sidemenuWidth &&//this.setState({ sidemenuWidth: true })}
                chosenTopic={this.props.chosenTopic}
                onDelete={this.props.onDelete}
                handleSave={this.props.handleSave}
                notes={this.props.notes}
                achatopen={this.props.achatopen}
                shareDoc={(x) => {
                  if (!this.props.s) {
                    this.loadYoutubeApi();
                  }
                  if (this.props.s) {
                    //console.log(this.gapi.auth2);
                    //console.log(this.s);
                    this.props.s.setItemIds([x]);
                    this.props.s.showSettingsDialog();
                  }
                }}
                sidemenuWidth={this.state.sidemenuWidth}
                signedIn={this.state.signedIn}
                recentChats={
                  this.state.encrypted ? chats : this.props.recentChats
                }
                filteredSenders={filteredSenders}
                deletedMsgs={this.state.deletedMsgs}
                hiddenMsgs={this.state.hiddenMsgs}
                listHiddenMsgs={this.props.listHiddenMsgs}
                listDeletedMsgs={this.props.listDeletedMsgs}
                auth={this.props.auth}
                n={this.props.n}
                addThirty={this.props.addThirty}
                recipients={this.props.recipients}
                users={this.props.users}
                contents={this.props.contents}
                /*contentLinker={content =>
                  !this.state.content.includes(content) &&
                  this.setState({ content: [...this.state.content, content] })
                }*/
              />
              <div
                ref={this.grabbottomofchat}
                style={{ backgroundColor: "rgb(245,248,250)" }}
              >
                <ChatterSender
                  vintageName={this.props.vintageName}
                  user={this.props.user}
                  parent={this.state.parent}
                  //
                  chosenTopic={this.props.chosenTopic}
                  achatisopenfalse={this.props.achatisopenfalse}
                  recipients={this.props.recipients}
                  recipientsProfiled={this.props.recipientsProfiled}
                  rangeChosen={this.props.rangeChosen}
                  signedIn={this.props.signedIn}
                  entityType={this.props.entityType}
                  entityId={this.props.entityId}
                  auth={this.props.auth}
                  recentChats={this.props.recentChats}
                  topics={this.props.topics}
                />
              </div>
            </div>
          </div>
          {this.state.videoRecorderOpen &&
            this.state.message === "" &&
            this.state.roomOpen && (
              <div
                style={{
                  bottom: "0px",
                  left: "0px",
                  position: "fixed",
                  zIndex: "9999"
                }}
              >
                <Recorder
                  collection={"chats"}
                  user={this.props.user}
                  getUserInfo={this.props.getUserInfo}
                  topic={this.props.chosenTopic}
                  getVideos={this.props.getVideos}
                  getFolders={this.props.getFolders}
                  folders={this.props.folders}
                  videos={this.props.videos}
                  onDeleteVideo={this.props.onDeleteVideo}
                  handleSaveVideo={this.props.handleSaveVideo}
                  auth={this.props.auth}
                  room={
                    this.state.room
                      ? this.state.room
                      : { id: this.props.threadId }
                  }
                  threadId={this.props.threadId}
                  cancel={() => this.setState({ videoRecorderOpen: false })}
                  entityType={"users"}
                  entityId={null}
                  setPost={(e) => this.setState(e)}
                />
              </div>
            )}
          <ChatAccessories
            alterRecipients={this.props.alterRecipients}
            entityType={this.props.entityType}
            entityId={this.props.entityId}
            checkProfiles={() => this.setState({ profileChecker: true })}
            checkProfilesClose={() => this.setState({ profileChecker: false })}
            profileChecker={this.state.profileChecker}
            addUsertoRec={this.props.addUsertoRec}
            removeUserfromRec={this.props.removeUserfromRec}
            changeFilteredSenders={(x) => {
              if (filteredSenders.includes(x.id)) {
                var foo = filteredSenders;
                foo = foo.filter((e) => e !== x.id);
                this.setState({
                  filteredSenders: foo
                });
              } else {
                this.setState({
                  filteredSenders: [...filteredSenders, x.id]
                });
              }
            }}
            auth={this.props.auth}
            filteredSenders={filteredSenders}
            userQuery={this.state.userQuery}
            changeUserQuery={(e) =>
              this.setState({ userQuery: e.target.value.toLowerCase() })
            }
            openusersearch={this.state.openusersearch}
            opentheusersearch={() =>
              this.setState({ openusersearch: false, filterBySender: false })
            }
            opentheusersearch2={() => {
              if (this.state.openusersearch) {
                this.setState({ openusersearch: false });
              } else this.setState({ openusersearch: true });
            }}
            user={this.props.user}
            filterBySender={this.state.filterBySender}
            users={this.props.users}
            usersforaddrem={this.state.usersforaddrem}
            recipients={this.props.recipients}
          />
        </div>
        <Link
          to={{
            pathname: "/calendar",
            state: {
              prevLocation: window.location.pathname,
              chatwasopen: this.props.achatopen,
              recentchatswasopen: this.props.chatsopen
            }
          }}
          onClick={this.props.parlayRecip}
          style={{
            display: this.state.message !== "" ? "none" : "flex",
            position: "fixed",
            zIndex: "-1",
            width: "38px",
            height: "34px",
            justifyContent: "center",
            alignItems: "center",
            //boxShadow: "inset 0px 0px 5px 1px white",
            padding: "10px",
            color: "white",
            bottom: "0px",
            right: "0px",
            fontSize: "18px"
          }}
        />
        <div
          style={{
            display: this.state.openNewPlan ? "flex" : "none",
            position: "absolute",
            zIndex: "9999",
            width: "86px",
            height: "36px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "40px",
            border: ".5px yellow dashed",
            padding: "5px 10px",
            color: "white",
            bottom: "56px",
            right: "10px",
            backgroundColor: "rgb(200,200,250)",
            fontSize: "18px"
          }}
        />
        <CheckProfiler
          recentChats={this.props.recentChats}
          thisentity={this.props.thisentity}
          communities={this.props.communities}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          auth={this.props.auth}
          checkProfilesClose={() => this.setState({ profileChecker: false })}
          profileChecker={this.state.profileChecker}
          users={this.props.users}
          entityId={this.props.entityId}
          recipients={this.props.recipients}
          user={this.props.user}
          openusersearch={this.state.openusersearch}
          opentheusersearch={() =>
            this.setState({ openusersearch: false, filterBySender: false })
          }
          opentheusersearch2={() => {
            if (this.state.openusersearch) {
              this.setState({ openusersearch: false });
            } else {
              this.setState({ openusersearch: true });
            }
          }}
        />
        <div
          onMouseEnter={() => this.setState({ hoverVideoOpen: true })}
          onMouseLeave={() => this.setState({ hoverVideoOpen: false })}
          onClick={() => {
            if (this.state.videoRecorderOpen) {
              this.setState({
                videoRecorderOpen: false
              });
            } else
              this.setState({
                videoRecorderOpen: true
              });
          }}
          style={{
            backgroundColor: this.state.hoverVideoOpen
              ? "rgba(255,70,50,1)"
              : this.state.videoRecorderOpen
              ? "rgba(255,70,50,.7)"
              : "rgba(255,70,50,.3)",
            display: "flex",
            position:
              this.state.message !== "" || this.state.sidemenuWidth === "40vw"
                ? "none"
                : "fixed",
            zIndex: "5",
            width: "34px",
            height: "34px",
            justifyContent: "center",
            alignItems: "center",
            border: "1px grey dashed",
            padding: "10px",
            color: "black",
            top: "56px",
            right: "0px",
            fontSize: "18px",
            transition: ".2s ease-in"
          }}
        >
          {this.state.videoRecorderOpen ? <div>&times;</div> : "+"}
        </div>
        {/*<ChatPolls
          recentChats={this.props.recentChats}
          open={
            !this.state.profileChecker &&
            !this.state.openusersearch &&
            (this.state.sidemenuWidth === "40vw" || this.state.addPoll)
          }
          answers={answers}
          sidemenuWidth={() =>
            this.setState({
              addPoll: true,
              sidemenuWidth: "0"
            })
          }
          closePolls={() =>
            this.setState({ sidemenuWidth: "40vw", addPoll: false })
          }
          addPoll={this.state.addPoll}
          chosenTopic={this.props.chosenTopic}
        />*/}
        <img
          onClick={() => {
            if (this.state.parent) {
              this.handleClose();
            } else this.handleClose2();
          }}
          src={back}
          alt="error"
          style={{
            zIndex: "1",
            width: "60px",
            top: "0px",
            right: "0px",
            position: "fixed"
          }}
        />
      </div>
    );
  }
}
export default Chatter;

/*!this.state.profileChecker &&
!this.state.openusersearch &&
this.state.openDrivePicker && (
  <YouTube
    openVideoRecorder={() =>
      this.setState({
        videoRecorderOpen: true,
        openDrivePicker: false,
        sidemenuWidth: true
      })
    }
    openDrive={() => this.setState({ openDrivePicker: true })}
    accessToken={this.props.accessToken}
  />
  )*/
/*!this.state.profileChecker &&
!this.state.openusersearch &&
!this.state.openDrivePicker && (
  <div
    onClick={
      this.state.roomOpen
        ? () => this.setState({ roomOpen: false })
        : () => this.setState({ roomOpen: true })
    }
    style={
      this.state.roomOpen
        ? {
            display: "flex",
            position: "fixed",
            zIndex: "9999",
            width: "34px",
            height: "34px",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            color: "white",
            top: "56px",
            right: "0px",
            fontSize: "18px",
            backgroundColor: "rgb(150,150,250)",
            border: "3px rgb(250,150,150) solid",
            borderRadius: "20px"
          }
        : {
            display: "flex",
            position: "fixed",
            zIndex: "9999",
            width: "34px",
            height: "34px",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            color: "white",
            top: "56px",
            right: "0px",
            fontSize: "18px",
            backgroundColor: "rgb(250,150,150)",
            border: "3px rgb(250,150,150) solid",
            borderRadius: "20px"
          }
    }
  >
    {!this.state.roomOpen ? "unlock" : "lock"}
  </div>
)*/
/*<DrivePicker
            switchAccount={this.props.switchAccount}
            s={this.props.s}
            picker={this.picker}
            signOut={this.props.signOut}
            signedIn={this.props.signedIn}
            loadGapiApi={this.props.loadGapiApi}
            openDrivePicker={this.state.openDrivePicker}
            clearFilesPreparedToSend={() =>
              this.setState({ filePreparedToSend: [] })
            }
            changeFilesPreparedToSend={() => {
              this.state.filePreparedToSend.map((x) => {
                return lh.push(x.url);
              });
              this.setState({
                openDrivePicker: false,
                message: lh.toString()
              });
            }}
            filePreparedToSend={this.state.filePreparedToSend}
            openusersearch={this.state.openusersearch}
          />*/
