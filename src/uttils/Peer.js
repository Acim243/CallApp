import React, { useEffect, useRef, useState } from 'react'
import {Peer as PeerInit} from "peerjs";

function Peer() {
    const peerInstance = useRef(null);
    const remoteRef = useRef(null);
    const localRef = useRef(null);
    const [peerId, setPeerId] = useState("");
    const [remoteId, setRemoteId] = useState("");

    const call = (remoteId) => {
        const getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;
        getUserMedia(
          { video: false, audio: true }, stream => {
            localRef.current.srcObject = stream;
            localRef.current.play();
            const call = peerInstance.current.call(remoteId, stream);
            call.on("stream", function (remoteStream) {
              // Show stream in some video/canvas element.
              remoteRef.current.srcObject = remoteStream;
              remoteRef.current.play();
            });
          },
          function (err) {
            console.log("Failed to get local stream", err);
          }
        );
      };

      const endCall = (remoteId) => {
        const call = peerInstance.current.call(remoteId, stream);
        call.close();
      }




    useEffect(() => {
        const peer = new PeerInit();
        peerInstance.current = peer;
        peer.on("open", (id) => {
          console.log("My peer ID is: " + id);
          setPeerId(id);
        });
        console.log({peer});
        peer.on("call", (call) => {
          console.log("call", call);
          const getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
          getUserMedia(
            { video: false, audio: true }, stream => {
              localRef.current.srcObject = stream;
              localRef.current.play();
              call.answer(stream);
              call.on("stream", function (remoteStream) {
                // Show stream in some video/canvas element.
                remoteRef.current.srcObject = remoteStream;
                remoteRef.current.play();
              });
            },
            function (err) {
              console.log("Failed to get local stream", err);
            }
          );
        });
      }, []);


      return {
        peerId,
        remoteId,
        localRef,
        remoteRef,
        call,
        setRemoteId
    }
 
}

export default Peer