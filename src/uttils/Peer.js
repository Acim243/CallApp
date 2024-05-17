import React, { useEffect, useRef, useState } from 'react';
import { Peer as PeerInit } from 'peerjs';
import { message } from 'antd';

function Peer() {
  const peerInstance = useRef(null);
  const remoteRef = useRef(null);
  const localRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [calls, setCalls] = useState({});

  const call = (remoteId) => {
    const getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    
    getUserMedia({ video: false, audio: true })
      .then((stream) => {
        localRef.current.srcObject = stream;
        localRef.current.play();
        
        const call = peerInstance.current.call(remoteId, stream);
        setCalls((prevCalls) => ({ ...prevCalls, [remoteId]: call }));
        
        call.on('stream', (remoteStream) => {
          remoteRef.current.srcObject = remoteStream;
          remoteRef.current.play();
        });

        call.on('close', () => {
          console.log('Call ended');
        });
      })
      .catch((err) => {
        console.error('Failed to get local stream', err);
      });
  };

  const endCall = (remoteId) => {
    const call = calls[remoteId];
    if (call) {
      call.close();
      setCalls((prevCalls) => {
        const { [remoteId]: _, ...remainingCalls } = prevCalls;
        return remainingCalls;
      });
    }
  };

  useEffect(() => {
    const peer = new PeerInit();
    peerInstance.current = peer;
    
    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setPeerId(id);
    });

    peer.on('call', (call) => {
      console.log('Receiving a call', call);
      
      const getUserMedia =
        navigator.mediaDevices.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      
      getUserMedia({ video: false, audio: true })
        .then((stream) => {
          localRef.current.srcObject = stream;
          localRef.current.play();
          
          call.answer(stream);
          setCalls((prevCalls) => ({ ...prevCalls, [call.peer]: call }));
          
          call.on('stream', (remoteStream) => {
            remoteRef.current.srcObject = remoteStream;
            remoteRef.current.play();
          });

          call.on('close', () => {
            console.log('Call ended');
            message.info('Call Ended');
          });
        })
        .catch((err) => {
          console.error('Failed to get local stream', err);
        });
    });

    return () => {
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
    };
  }, []);

  return {
    peerId,
    remoteId,
    localRef,
    remoteRef,
    call,
    endCall,
    setRemoteId
  };
}

export default Peer;
