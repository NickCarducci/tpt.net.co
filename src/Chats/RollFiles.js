import React from "react";
import firebase from ".././init-firebase";
import rsa from "js-crypto-rsa";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where
} from "@firebase/firestore";
import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";
import { specialFormatting, standardCatch } from "../Sudo";

/*const deletion = (d, db) => db.remove(d).catch(standardCatch);
const destroy = (db) => db.destroy();
const set = (db, c) =>
  !c._id
    ? window.alert(
        "pouchdb needs ._id key:value: JSON.parse= " + JSON.parse(c)
      ) &&
      db
        .destroy()
        .then(() => null)
        .catch(standardCatch)
    : db //has upsert plugin from class constructor
        .upsert(c._id, (copy) => {
          copy = { ...c }; //pouch-db \(construct, protocol)\
          return copy; //return a copy, don't displace immutable object fields
        })
        .then(
          () => null /*"success"*/
/** or
          notes.find((x) => x._id === c._id)
            ? this.db
              .post(c)
              .then(() => null)
              .catch(standardCatch)
          : deletion(c) && set(db, c);  
          * /
        )
        .catch(standardCatch);
const read = async (db, notes /*={}* /) =>
  //let notes = {};
  await db
    .allDocs({ include_docs: true })
    .then(
      (
        allNotes //new Promise cannot handle JSON objects, Promise.all() doesn't
      ) =>
        Promise.all(
          allNotes.rows.map(async (n) => await (notes[n.doc.key] = n.doc))
        )
      // && and .then() are functionally the same;
    )
    .catch(standardCatch);*/
const optsForPouchDB = {
  revs_limit: 1, //revision-history
  auto_compaction: true //zipped...
};
export class Pouchredux {
  constructor(name) {
    this.deletion = (d, db) => db.remove(d).catch(standardCatch);
    this.destroy = (db) => db.destroy();
    this.set = (db, c) =>
      !c._id
        ? window.alert(
            "pouchdb needs ._id key:value: JSON.parse= " + JSON.parse(c)
          )
        : //await db.destroy()
          db //has upsert plugin from class constructor
            .upsert(c._id, (copy) => {
              copy = { ...c }; //pouch-db \(construct, protocol)\
              return copy; //return a copy, don't displace immutable object fields
            })
            .then(
              () => null /*"success"*/
              /** or
          notes.find((x) => x._id === c._id)
            ? this.db
              .post(c)
              .then(() => null)
              .catch(standardCatch)
          : deletion(c) && set(db, c);
          */
            )
            .catch(standardCatch);
    this.read = async (db, notes /*={}*/) =>
      //let notes = {};
      await db
        .allDocs({ include_docs: true })
        .then(
          (
            allNotes //new Promise cannot handle JSON objects, Promise.all() doesn't
          ) =>
            Promise.all(
              allNotes.rows.map(async (n) => await (notes[n.doc.key] = n.doc))
            )
          // && and .then() are functionally the same;
        )
        .catch(standardCatch);
    this.optsForPouchDB = {
      revs_limit: 1,
      auto_compaction: true //zipped...
    };
    //return name
    return {
      read: this.read,
      set: this.set,
      destroy: this.destroy,
      deletion: this.deletion,
      optsForPouchDB
    };
  }
}
export class RSA {
  //Key-Box device query Asymmetric-Encryption
  constructor(name) {
    PouchDB.plugin(upsert);
    const title = "rsaPrivateKeys";
    const map = new Pouchredux();
    Object.keys(map).map((x) => {
      return (this[x] = map[x]);
    });
    this.db = new PouchDB(title, this.optsForPouchDB);
  }
  deleteKey = (keybox) => this.deletion(keybox, this.db);

  //deleteKeys = async () => await destroy(this.db);
  setPrivateKey = (key) => this.set(this.db, key);
  readPrivateKeys = async (notes = {}) =>
    //let notes = {};
    await this.read(this.db, notes);
}

const firestore = getFirestore(firebase);
class Controls extends React.Component {
  state = {};
  revert = (x) => {
    x.ref
      .updateMetadata({
        customMetadata: {
          public: false
        },
        metadata: {
          description: "no description",
          modified: new Date()
        }
      })
      .then(() => this.props.unloadGreenBlue())
      .catch((err) => console.log(err.message));
  };
  confirmRating = (x) => {
    x.ref
      .updateMetadata({
        customMetadata: {
          ageAppropriate: true
        },
        metadata: {
          description: "no description",
          modified: new Date()
        }
      })
      .then(() => {
        this.props.unloadGreenBlue();
        var folderReference = `personalCaptures/${this.props.auth.uid}`;
        //this.props.getFolders(folderReference);
        var pathReference = `${folderReference}/${"*"}`;
        this.props.getVideos(pathReference);
      })
      .catch((err) => console.log(err.message));
  };
  applyApropos = (x) => {
    this.props.loadGreenBlue("sending to deepai for rating...");
    x.ref
      .updateMetadata({
        customMetadata: {
          public: true
        },
        metadata: {
          description: "no description",
          modified: new Date()
        }
      })
      .then(async () => {
        if (!x.customMetadata || !x.customMetadata.ageAppropriate) {
          this.deepai = window.deepai;
          this.deepai.setApiKey("fbc3602b-4af4-4b5e-81fb-8a4407b75eab");
          var output = await this.deepai.callStandardApi("content-moderation", {
            image: x.gsUrl
          });
          var result = output.output;
          if (result) {
            console.log(result);
            console.log("deepai nudity score " + result.nsfw_score);
            if (result.nsfw_score > 0.7) {
              window.alert(
                "we cannot store this video, it does not pass our nudity test"
              );
              //move to pouchdb
              //delete from cloud storage
            } else if (result.nsfw_score) {
              this.confirmRating(x);
            } else {
              this.revert(x);
              return window.alert(result);
            }
          } else {
            this.revert(x);
            return window.alert(
              "file moderation analysis error, will not add ageAppropriate tag"
            );
          }
        } else {
          this.confirmRating(x);
        }
      })
      .catch((err) => console.log(err.message));
  };
  delete = (x) => {
    var answer = "";
    getDocs(
      query(collection(firestore, "chatMeta"), where("gsUrl", "==", x.gsUrl))
    ).then((querySnapshot) => {
      if (querySnapshot.empty) {
        answer = window.confirm(
          "delete this from your cloud? 1) we do not have a backup."
        );
      } else {
        let q = 0;
        let references = [];
        querySnapshot.docs.forEach((doc) => {
          q++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            references.push(foo);
          }
        });
        if (
          querySnapshot.docs.length === q &&
          this.state.references !== references
        ) {
          this.setState({ references });
          answer = window.confirm(
            "delete this from your cloud? 1) we do not have a backup. " +
              "2) the following posts will lose this reference forever" +
              references.toString()
          );
        }
      }
    });
    if (answer) {
      var filename = x.name + x.contentType.split("/")[1].toLowerCase();
      var pathReference =
        `personalCaptures/${this.props.auth.uid}/${x.folder}/` + filename;
      var itemRef = this.storageRef.child(pathReference);
      itemRef
        .delete()
        .then((snapshot) => {
          console.log(snapshot);
        })
        .catch((err) => console.log(err.message));
    }
  };
  saveHere = async (x) => {
    console.log(x);
    var topic = this.props.topic ? this.props.topic : "*";
    var message = x.name; //+"."+ x.type.split("/")[1].toLowerCase();
    var pathReference = `${this.props.threadId}/${topic}`;
    var answer = window.confirm(`save ${message} on ${pathReference}`);
    if (answer) {
      addDoc(collection(firestore, this.props.collection), {
        message,
        topic,
        type: x.contentType,
        time: new Date(),
        authorId: this.props.auth.uid,
        entityId: this.props.entityId ? this.props.entityId : null,
        entityType: this.props.entityType ? this.props.entityType : "users",
        threadId: this.props.threadId,
        gsUrl: x.gsUrl
      })
        .then(() => {
          console.log(
            `${x.name}.${x.contentType.split("/")[1]}` +
              " added to " +
              `${this.props.threadId}/${x.folder ? x.folder : "*"}`
          );
        })
        .catch((err) => console.log(err.message));

      /*itemRef
              .delete()
              .then(() => {
                // File deleted successfully
                itemRef
                  .put(this.state.blob)
                  .then((snapshot) => {
                    console.log(snapshot);
                    console.log(
                      `${x.name}.${x.type.split("/")[1]}` +
                        " added to " +
                        `${this.props.threadId}/${x.folder}`
                    );
                    this.props.getVideos(pathReference);
                  })
                  .catch((err) => console.log(err.message));*/
    }
  };
  remove = () => {
    deleteDoc(doc(firestore, "chatMeta", this.props.x.id))
      .then(() => console.log("deleted " + this.props.x.id))
      .catch((err) => console.log(err.message));
  };
  render() {
    const { x } = this.props;
    const { hovered, hoveree } = this.state;
    return (
      <div>
        {
          <div
            onMouseEnter={() => this.setState({ showTitle: true })}
            onMouseLeave={() => this.setState({ showTitle: false })}
            style={{
              borderRadius: "3px",
              padding: "2px",
              textIndent: "23px",
              bottom: "8px",
              fontSize: "8px",
              position: "absolute",
              borderBottom:
                x.customMetadata && x.customMetadata.public
                  ? "2px blue"
                  : "0px solid",
              backgroundColor:
                x.customMetadata && x.customMetadata.ageAppropriate
                  ? "rgb(20,20,230)"
                  : "grey"
            }}
          >
            {this.state.showTitle
              ? x.name
              : x.customMetadata && x.customMetadata.ageAppropriate
              ? "PG"
              : "Not-rated"}
          </div>
        }
        <div
          onMouseEnter={() => this.setState({ hovered: true })}
          onMouseLeave={() => this.setState({ hovered: false })}
          //airplane air plane
          className="fa fa-send-o"
          style={{
            zIndex: "9999",
            color:
              x.customMetadata && x.customMetadata.ageAppropriate
                ? "blue"
                : hovered
                ? "white"
                : "grey",
            borderRadius: "6px",
            padding: "2px",
            left: "8px",
            top: "8px",
            fontSize: "12px",
            position: "absolute",
            backgroundColor: "rgb(20,20,30)"
          }}
          onClick={
            !x.customMetadata || !x.customMetadata.public
              ? () => this.applyApropos(x)
              : () => this.props.threadId && this.saveHere(x)
          }
        />
        <div
          onMouseEnter={() => this.setState({ hoveree: true })}
          onMouseLeave={() => this.setState({ hoveree: false })}
          style={{
            zIndex: "9999",
            color: hoveree ? "white" : "grey",
            borderRadius: "6px",
            padding: "2px",
            right: "8px",
            top: "8px",
            fontSize: "12px",
            position: "absolute",
            backgroundColor: "rgb(20,20,30)"
          }}
          onClick={
            this.props.inCloud ? () => this.delete(x) : () => this.remove()
          }
        >
          &times;
        </div>
        <div
          style={{
            zIndex: "9999",
            color: hoveree ? "white" : "grey",
            borderRadius: "6px",
            padding: "2px",
            right: "8px",
            bottom: "8px",
            fontSize: "12px",
            position: "absolute",
            backgroundColor: "rgb(20,20,30)"
          }}
        >
          {x.vintage}
        </div>
      </div>
    );
  }
}
class Image extends React.Component {
  state = { deletedItems: [], swipe: "super", opening: true };
  render() {
    const { x, wide } = this.props;
    if (!this.state.deletedItems.includes(x.id)) {
      return (
        <div
          style={{
            position: "relative",
            height: "min-content"
          }}
        >
          <Controls
            x={x}
            unloadGreenBlue={this.props.unloadGreenBlue}
            getVideos={this.props.getVideos}
            inCloud={this.props.inCloud}
          />
          <img
            onError={() => this.setState({ error: true })}
            style={{
              transition: ".3s ease-in",
              height: "auto",
              width: wide ? "100%" : "63px"
            }}
            src={x.gsUrl}
            alt={x.name}
          />
        </div>
      );
    } else return null;
  }
}
class Video extends React.Component {
  constructor(props) {
    super(props);
    this[props.x.name] = React.createRef();
  }
  render() {
    const { x } = this.props;
    this[x.name].src = x.gsUrl;
    return this.props.meAuth === undefined ||
      (x.customMetadata && x.customMetadata.public) ? (
      <div onClick={this.props.getUserInfo}>&bull;</div>
    ) : (
      <div
        style={{
          position: "relative",
          height: "min-content"
        }}
      >
        <Controls
          x={x}
          unloadGreenBlue={this.props.unloadGreenBlue}
          getVideos={this.props.getVideos}
          inCloud={this.props.inCloud}
        />
        <video
          onError={(err) => this.setState({ error: err.message })}
          ref={this[x.name]}
        >
          <p>Audio stream not available. </p>
        </video>
      </div>
    );
  }
}
class Paper extends React.Component {
  render() {
    const { x } = this.props;
    return this.props.meAuth === undefined ||
      (x.customMetadata && x.customMetadata.public) ? (
      <div onClick={this.props.getUserInfo}>&bull;</div>
    ) : (
      <iframe
        onError={() => this.setState({ error: true })}
        style={{
          margin: "10px",
          marginBottom: "0px",
          overflow: "auto",
          marginTop: "5px",
          border: "3px solid",
          borderRadius: "10px",
          height: "180px",
          width: "126px"
        }}
        src={x.gsUrl}
        title={x.name}
      />
    );
  }
}
class Files extends React.Component {
  constructor(props) {
    super(props);
    let rsaPrivateKeys = new RSA();
    this.state = {
      swipe: "grid",
      chosenHighlight: "",
      int: 3,
      rsaPrivateKeys,
      videos: []
    };
  }
  componentDidUpdate = async (prevProps) => {
    if (this.state.opening !== this.state.lastOpening) {
      this.setState({ lastOpening: this.state.opening }, () => {
        if (this.state.opening) {
          this.clearIn = setInterval(
            () => this.setState({ int: this.state.int - 1 }),
            1000
          );
        } else {
          this.setState({ int: 3 }, () => clearInterval(this.clearIn));
        }
      });
    }
    if (
      this.props.auth !== undefined &&
      this.props.videos !== prevProps.videos &&
      this.state.vintageName !== this.state.lastVintageName
    ) {
      this.setState({ lastVintageName: this.state.vintageName }, async () => {
        console.log(this.props.videos);
        await this.state.rsaPrivateKeys
          .readPrivateKeys()
          .then(async (keysOutput) => {
            const keyBoxes = Object.values(keysOutput);
            if (keyBoxes) {
              let p = 0;
              let videos = [];
              const accountBox = keyBoxes.find(
                (x) =>
                  x._id === this.props.auth.uid &&
                  this.state.vintageName === x.vintage
              );
              this.props.videos.map(async (x) => {
                p++;
                var foo = { ...x };
                var readFile = new FileReader();
                await fetch(x.gsUrl, {
                  "Access-Control-Allow-Origin": "*"
                })
                  .then((blob) => blob.blob())
                  .then((img) => {
                    if (!/image/.test(img.type)) {
                      return null; //not an image
                    }

                    readFile.readAsDataURL(img);
                    /*var reader = new FileReader();
                    reader.readAsArrayBuffer(img);
                    FileReader.readAsDataURL:
                    "returns base64 that contains many characters, 
                    and use more memory than blob url, but removes
                    from memory when you don't use it (by garbage collector)"*/
                  })
                  .catch((err) =>
                    this.setState(
                      {
                        Errorf: err.message,
                        Photo: null
                      },
                      () => console.log("REACT-LOCAL-PHOTO: " + err.message)
                    )
                  );

                //readFile.onerror = (err) => console.log(err.message);
                readFile.onloadend = (reader) => {
                  this.setState({ readFile }, async () => {
                    if (reader.target.readyState === 2) {
                      const gsUrl =
                        foo.vintage === accountBox.vintage
                          ? await rsa.decrypt(
                              reader.target.result,
                              accountBox.key,
                              "SHA-256",
                              {
                                name: "RSA-PSS"
                              }
                            )
                          : reader.target.result;
                      if (gsUrl) {
                        foo.gsUrl = gsUrl;
                        videos.push(foo);
                      }
                    }
                  });
                };
              });
              if (p === this.props.videos.length) this.setState({ videos });
            }
          });
      });
    }
  };
  render() {
    const { isAuthor } = this.props;
    const { swipe, chosenHighlight } = this.state;

    var folders = ["Miscellaneous"];
    this.state.videos &&
      this.state.videos.map(
        (x) =>
          x.topic &&
          !folders.includes(specialFormatting(x.topic)) &&
          folders.push(specialFormatting(x.topic))
      );
    var videos = this.state.videos.sort(
      (a, b) => a.gsUrl === chosenHighlight - b.gsUrl
    );

    return (
      <div
        style={{
          width: "100%"
        }}
      >
        <div style={{ position: "absolute", right: "4px" }}>files</div>
        <div
          style={{
            position: "relative",
            width: "min-content",
            display: "flex",
            justifyContent: "flex-start"
          }}
        >
          <div
            className="fa fa-folder"
            style={{
              padding: "4px 0px",
              width: "36px",
              textAlign: "center",
              border: "1px solid"
            }}
          />
          {this.state.addFolder && isAuthor ? (
            <form
              style={{ width: "min-content" }}
              onSubmit={(e) => {
                e.preventDefault();
                var entry = this.state.newFolder;
                this.setState(
                  {
                    addFolder: null,
                    newFolder: ""
                  },
                  () =>
                    entry !== "" &&
                    (folders = [
                      ...folders.filter((parent) => parent !== entry),
                      entry
                    ])
                );
              }}
            >
              <input
                style={{ width: "min-content" }}
                placeholder="new folder"
                onChange={(e) =>
                  this.setState({
                    newFolder: specialFormatting(e.target.value)
                  })
                }
                value={this.state.newFolder}
              />
            </form>
          ) : (
            <select
              style={{ width: "min-content", minWidth: "100px" }}
              value={this.state.selectedFolder}
              onChange={(e) =>
                this.setState({ selectedFolder: e.target.value })
              }
            >
              {folders.map((parent, i) => (
                <option key={i}>{parent}</option>
              ))}
            </select>
          )}
          {/**
          
                {this.props.folders && this.props.folders.includes("*") && (
                  <select
                    value={this.state.videoFolder}
                    onChange={(e) => {
                      var videoFolder = e.target.value;
                      this.setState({ videoFolder });
                      var folderReference = `personalCaptures/${this.props.auth.uid}`;
                      var pathReference = `${folderReference}/${this.state.videoFolder}`;
                      this.props.getVideos(pathReference);
                    }}
                    style={{ width: "100%" }}
                  >
                    {this.props.folders.map((x) => {
                      return <option key={x}>{x}</option>;
                    })}
                  </select>
                )}
          */}
          {isAuthor && (
            <div
              onClick={() =>
                this.setState({
                  addFolder: !this.state.addFolder,
                  newFolder: "",
                  folders: this.state.addFolder
                    ? folders.filter(
                        (parent) => parent !== this.state.newFolder
                      )
                    : folders
                })
              }
              style={{
                padding: "3px 0px",
                width: "36px",
                textAlign: "center",
                border: "1px solid"
              }}
            >
              {this.state.addFolder ? "-" : "+"}
            </div>
          )}
        </div>
        <div style={{ width: "100%", display: "flex" }}>
          <div
            style={{
              textDecoration: swipe === "highlight" ? "underline" : "none",
              height: "30px",
              width: "50%",
              display: "flex",
              justifyContent: "center"
            }}
            onClick={() => {
              if (chosenHighlight) {
                this.setState({ chosenHighlight: "" });
              } else {
                this.setState({ swipe: "highlight" });
              }
            }}
          >
            highlight
          </div>

          <div
            style={{
              borderLeft: "1px solid",
              textDecoration: swipe === "grid" ? "underline" : "none",
              height: "30px",
              width: "50%",
              display: "flex",
              justifyContent: "center"
            }}
            onClick={() => this.setState({ swipe: "grid" })}
          >
            grid
          </div>
        </div>
        {this.props.user.vintages && (
          <select
            onChange={(e) => this.setState({ vintageName: e.target.value })}
          >
            {this.props.user.vintages.map((x) => {
              return <option>{x}</option>;
            })}
          </select>
        )}
        <div
          style={{
            backgroundColor: "rgb(230,100,170)",
            paddingBottom: "20px",
            height: "min-content",
            display: "flex",
            position: "relative",
            width: "100%",
            flexWrap: "wrap"
          }}
        >
          {videos.map((x, i) => {
            if (x.topic === this.props.selectedFolder) {
              const type = x.contentType ? x.contentType : x.type;
              //const mine = this.props.inCloud || isAuthor;
              const highlight =
                swipe !== "grid" &&
                (x.gsUrl === chosenHighlight ||
                  (chosenHighlight === "" && i === 0));
              const openingThisOne = x.gsUrl === this.state.opening;
              return (
                <div
                  key={this.props.threadId + x.gsURL}
                  onMouseEnter={() =>
                    swipe !== "grid" &&
                    this.setState({ opening: x.gsUrl }, () => {
                      clearTimeout(this.holding);
                      this.holding = setTimeout(() => {
                        this.setState({ opening: false }, () => {
                          window.open(x.gsUrl);
                        });
                      }, 3000);
                    })
                  }
                  onMouseLeave={() => {
                    this.state.opening &&
                      this.setState({ opening: false }, () =>
                        clearTimeout(this.holding)
                      );
                  }}
                  style={{
                    border: !highlight ? "0px solid" : "3px solid",
                    borderRadius: !highlight ? "0px" : "10px",
                    width: !highlight ? "100%" : "30%",
                    position: "relative",
                    height: "min-content"
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      color: "rgb(210,210,225)",
                      top: "0px",
                      right: "0px",
                      opacity: openingThisOne ? 1 : 0,
                      backgroundColor: openingThisOne
                        ? "rgba(40,40,80,1)"
                        : "rgba(40,40,80,.4)",
                      zIndex: "1000",
                      position: "absolute",
                      padding: "20px 0px",
                      width: openingThisOne ? "100%" : "0%",
                      transition: openingThisOne
                        ? "3s ease-out"
                        : ".3s ease-in",
                      minWidth: "max-content"
                    }}
                  >
                    opening in&nbsp;{this.state.int}
                  </div>
                  {/*mine && (
                    <Controls
                      collection={this.props.collection}
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      loadGreenBlue={this.props.loadGreenBlue}
                      topic={this.props.topic}
                      x={x}
                      getVideos={this.props.getVideos}
                      auth={this.props.auth}
                      entityId={this.props.entityId}
                      entityType={this.props.entityType}
                      threadId={this.props.threadId}
                    />
                  )*/}
                  {type.includes("video") ? (
                    <Video
                      wide={highlight}
                      x={x}
                      threadId={this.props.threadId}
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      getVideos={this.props.getVideos}
                      inCloud={this.props.inCloud}
                    />
                  ) : type.includes("image") ? (
                    <Image
                      wide={highlight}
                      x={x}
                      threadId={this.props.threadId}
                      unloadGreenBlue={this.props.unloadGreenBlue}
                      getVideos={this.props.getVideos}
                      inCloud={this.props.inCloud}
                    />
                  ) : (
                    type.includes("application/pdf") && (
                      <Paper
                        wide={highlight}
                        x={x}
                        threadId={this.props.threadId}
                        unloadGreenBlue={this.props.unloadGreenBlue}
                        getVideos={this.props.getVideos}
                        inCloud={this.props.inCloud}
                      />
                    )
                  )}
                  {this.state.requestConfirmDelete && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        this.setState({ requestConfirmDelete: false });
                        if (this.state.requestConfirmDelete === "delete") {
                          deleteDoc(doc(firestore, "chatMeta", x.id))
                            .then(() => {
                              this.setState({
                                deletedItems: [...this.state.deletedItems, x.id]
                              });
                              window.alert("item deleted successful");
                            })
                            .catch((err) => console.log(err.message));
                        } else
                          window.alert(`to delete, enter "delete" exactly`);
                      }}
                    >
                      <input
                        onChange={(e) =>
                          this.setState({
                            requestConfirmDelete: e.target.value
                          })
                        }
                        className="input"
                        placeholder="delete"
                      />
                      <div
                        onClick={() =>
                          this.setState({ requestConfirmDelete: false })
                        }
                      >
                        &times;
                      </div>
                    </form>
                  )}
                  {swipe !== "grid" &&
                    (x.gsUrl === chosenHighlight ||
                      (chosenHighlight === "" && i === 0)) && (
                      <div
                        onClick={() => {
                          if (isAuthor) {
                            var answer = window.confirm("delete?");
                            if (answer) {
                              this.setState({ requestConfirmDelete: true });
                            }
                          } else if (x.gsUrl !== chosenHighlight) {
                            this.props.chooseHighlight(x.gsUrl);
                          }
                        }}
                      >
                        1 of {videos.length}
                      </div>
                    )}
                </div>
              );
            } else return null;
          })}
        </div>
      </div>
    );
  }
}
export default Files;
