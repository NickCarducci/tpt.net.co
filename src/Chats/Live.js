import firebase from ".././init-firebase";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import React from "react";
const firestore = getFirestore(firebase);
class MuteCover extends React.Component {
  render() {
    const { localPeerConnection } = this.props;
    if (localPeerConnection) {
      return (
        <div style={{ width: "100%" }}>
          {localPeerConnection.getAudioTracks().length > 0 && (
            <div
              onClick={() =>
                localPeerConnection.getAudioTracks()[0].enabled
                  ? () =>
                      (localPeerConnection.getAudioTracks()[0].enabled = false)
                  : () =>
                      (localPeerConnection.getAudioTracks()[0].enabled = true)
              }
              style={{
                zIndex: "5",
                display: "flex",
                position: "absolute",
                bottom: "0px",
                backgroundColor: "red"
              }}
            >
              mute
            </div>
          )}
          {localPeerConnection.getAudioTracks().length > 0 && (
            <div
              onClick={() =>
                localPeerConnection.getVideoTracks()[0].enabled
                  ? () =>
                      (localPeerConnection.getVideoTracks()[0].enabled = false)
                  : () =>
                      (localPeerConnection.getVideoTracks()[0].enabled = true)
              }
              style={{
                right: "0px",
                zIndex: "5",
                display: "flex",
                position: "absolute",
                bottom: "0px",
                backgroundColor: "red"
              }}
            >
              cover
            </div>
          )}
        </div>
      );
    } else return null;
  }
}
class LiveChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    window.localPeerConnection = null;
    this.localPeerConnection = window.localPeerConnection;
  }
  componentWillUnmount = () => {
    if (!this.props.isPost) {
      if (this.localPeerConnection) {
        //get candidate
        this.localPeerConnection.removeEventListener(
          "icecandidate",
          this.establishCandidacy
        );

        this.localPeerConnection.removeEventListener(
          "iceconnectionstatechange",
          this.iceconnectionChange
        );

        this.localPeerConnection.removeEventListener(
          "signalingstatechange",
          this.signalChange
        );

        this.localPeerConnection.removeEventListener(
          "connectionstatechange",
          this.connectionChange
        );

        this.localPeerConnection.removeEventListener(
          "icegatheringstatechange",
          this.gatheringChange
        );
      }
      if (this.stream) {
        this.stream.getVideoTracks().forEach((track) => {
          this.stream.removeTrack(track);
          track.stop();
        });
        this.stream.getAudioTracks().forEach((track) => {
          this.stream.removeTrack(track);
          track.stop();
        });
      }
      this.localPeerConnection &&
        this.localPeerConnection.removeStream(
          this.props.video.current.srcObject
        );
    }
  };
  iceconnectionChange = (event) => {
    console.log(event);
    console.log("ice connection changed");
  };

  signalChange = () => {
    if (this.localPeerConnection.connectionState === "have-local-offer") {
      console.log("you offered a connection");
    } else if (
      this.localPeerConnection.connectionState === "have-remote-offer"
    ) {
      console.log("they offered a connection");
    } else if (
      this.localPeerConnection.connectionState === "have-local-pranswer"
    ) {
      console.log("you accepted the connection");
    } else if (
      this.localPeerConnection.connectionState === "have-remote-pranswer"
    ) {
      console.log("they accepted the connection");
    } else if (this.localPeerConnection.connectionState === "stable") {
      console.log("connection made");
    }
  };
  connectionChange = () => {
    if (this.localPeerConnection.connectionState === "new") {
      console.log("connection " + this.localPeerConnection.connectionState);
    } else if (this.localPeerConnection.connectionState === "checking") {
      console.log("connection " + this.localPeerConnection.connectionState);
    } else if (this.localPeerConnection.connectionState === "connecting") {
      console.log("connection " + this.localPeerConnection.connectionState);
    } else if (this.localPeerConnection.connectionState === "connected") {
      console.log("connection " + this.localPeerConnection.connectionState);
    } else if (this.localPeerConnection.connectionState === "disconnected") {
      console.log("connection " + this.localPeerConnection.connectionState);
    } else if (this.localPeerConnection.connectionState === "closed") {
      console.log("connection " + this.localPeerConnection.connectionState);
    } else if (this.localPeerConnection.connectionState === "failed") {
      console.log(
        "connection error " + this.localPeerConnection.connectionState
      );
    } else
      return console.log(
        "connection error " + this.localPeerConnection.connectionState
      );
  };
  gatheringChange = () => {
    if (this.localPeerConnection.iceGatheringState === "gathering") {
      console.log("gathering " + this.localPeerConnection.iceGatheringState);
    } else if (this.localPeerConnection.iceGatheringState === "complete") {
      console.log("gathering " + this.localPeerConnection.iceGatheringState);
    } else
      return console.log(
        "gathering " + this.localPeerConnection.iceGatheringState
      );
  };

  establishCandidacy = (event) => {
    //const connection = event.target;
    const candidate = event.candidate;

    if (candidate) {
      /*const newIceCandidate = new RTCIceCandidate(candidate);
      const otherPeer = getOtherPeer(connection);*/

      var json = candidate.toJSON();
      json.roomId = this.props.room.id;
      json.authorId = this.props.auth.uid;

      addDoc(collection(firestore, "candidates", json));
    }
  };
  goLive = async () => {
    if (!this.props.isPost) {
      if (!this.localPeerConnection) {
        console.log("no stream.  calling RTCPeerConnection");
        // mount variables
        const servers = {
          iceServers: [
            {
              urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302"
              ]
            }
          ],
          iceCandidatePoolSize: 10
        };
        this.localPeerConnection = window.localPeerConnection;
        this.localPeerConnection = new RTCPeerConnection(servers);
        // add listeners to variables
        this.localPeerConnection.addEventListener(
          "icecandidate",
          this.establishCandidacy
        );
        this.localPeerConnection.addEventListener(
          "icegatheringstatechange",
          this.gatheringChange
        );
        this.localPeerConnection.addEventListener(
          "connectionstatechange",
          this.connectionChange
        );
        this.localPeerConnection.addEventListener(
          "signalingstatechange",
          this.signalChange
        );
        this.localPeerConnection.addEventListener(
          "iceconnectionstatechange",
          this.iceconnectionChange
        );
      }
      this.localPeerConnection.addStream(this.props.video.current.srcObject);
      this.setState({ live: true });
      const offer = await this.localPeerConnection.createOffer();
      await this.localPeerConnection.setLocalDescription(offer);

      var roomWithOffer = { ...this.props.room };
      roomWithOffer.offers = roomWithOffer.answers.push(this.props.auth.uid);
      roomWithOffer["offer" + this.props.auth.uid] = {
        type: offer.type,
        sdp: offer.sdp
      };
      await updateDoc(
        doc(firestore, "rooms", this.props.threadId),
        roomWithOffer
      );

      this.props.room.offers &&
        !this.props.room.offers.includes(this.props.auth.uid) &&
        this.props.room.offers.map(async (x) => {
          if (x !== this.props.auth.uid) {
            const offer = this.props.room["offer" + x];
            await this.localPeerConnection.setRemoteDescription(offer);
            const answer = await this.localPeerConnection.createAnswer();
            await this.localPeerConnection.setLocalDescription(answer);

            var roomWithAnswer = { ...this.props.room };
            roomWithAnswer.answers = roomWithAnswer.answers.push(
              this.props.auth.uid
            );
            roomWithAnswer["answer" + this.props.auth.uid] = {
              type: answer.type,
              sdp: answer.sdp
            };
            return await updateDoc(
              doc(firestore, "rooms", this.props.room.id),
              roomWithAnswer
            );
          } else return null;
        });
    } else {
    }
  };
  componentDidUpdate = (prevProps) => {
    if (!this.props.isPost) {
      if (
        this.localPeerConnection &&
        this.props.room &&
        this.props.room.id !== prevProps.room.id
      ) {
        onSnapshot(
          query(
            collection(firestore, "candidates"),
            where("roomId", "==", this.props.room.id)
          ),
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                if (change.doc.exists) {
                  var candidato = change.doc.data();
                  delete candidato.authorId;
                  delete candidato.roomId;
                  const candidate = new RTCIceCandidate(candidato);
                  this.localPeerConnection.addIceCandidate(candidate);
                  candidate.onaddstream = (event) => {
                    //var src = window.URL.createObjectURL(event.stream);
                    //theirVideo
                  };
                }
              }
              if (change.type === "modified") {
                var candidatm = change.doc.data();
                console.log("modified candidate: ", candidatm);
                //const candidate = new RTCIceCandidate(candidatm);
                //this.localPeerConnection.addIceCandidate(candidate);
              }
              if (change.type === "removed") {
                var candidatr = change.doc.data();
                console.log("removed candidate: ", candidatr);
                //const candidate = new RTCIceCandidate(candidatr);
                //this.localPeerConnection.addIceCandidate(candidate);
              }
            });
          }
        );
        if (
          !this.localPeerConnection.currentRemoteDescription &&
          this.props.room.answer
        ) {
          this.props.room.answers.map(async (x) => {
            if (x !== this.props.auth.uid) {
              var ok = this.props.room["answer" + x];
              const answer = new RTCSessionDescription(ok);
              return await this.localPeerConnection.setRemoteDescription(
                answer
              );
            } else return null;
          });

          console.log("Set remote description: ", this.props.room.answer);
        }
      }
    }
  };

  render() {
    var { videos, room, stream, recording } = this.props;
    return (
      <div>
        <div
          style={{
            display: "flex",
            right: "10px",
            position: "absolute",
            top: "10px"
          }}
        >
          {stream && !recording && videos.length === 0 && (
            <div onClick={() => this.goLive()} style={{ color: "white" }}>
              {room.offers && !room.offers.includes(this.props.auth.uid) ? (
                "join" //livestream
              ) : (
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid",
                    flexDirection: "column",
                    display: "flex"
                  }}
                >
                  &#9880;
                  <div
                    style={{
                      fontSize: "12px"
                    }}
                  >
                    live
                  </div>{" "}
                </div>
              )}
            </div>
          )}
        </div>
        {stream && (
          <video
            //live video
            style={{
              left: "50%",
              opacity: "1",
              zIndex: "5",
              display: "flex",
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "white",
              color: "white"
            }}
            ref={this.props.video}
          >
            <p>Audio stream not available. </p>
          </video>
        )}

        <MuteCover localPeerConnection={this.localPeerConnection} />
      </div>
    );
  }
}
export default React.forwardRef((props, ref) => (
  <LiveChat {...props} video={ref} />
));
