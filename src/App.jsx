import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import instance from "./uttils/Instance";
import { getMachineId } from "./helper/helper";
import Peer from "./uttils/Peer";
import { Button } from "antd";
import ApiFetch from "./uttils/ApiFetch";
import { MySwal, Toast } from "./uttils/Swal";
import { CiCircleCheck, CiCircleMinus } from "react-icons/ci";
import Each from "./component/Each";
import { FaCircleUser } from "react-icons/fa6";
import Loading from "./component/Loading";
import { FcEndCall } from "react-icons/fc";


function App() {

  const url = 'peer/list'
  const {result : listUser, getFetch, inputData, reFetch} = ApiFetch({url})
  const {peerId, remoteId, call, endCall, setRemoteId, localRef, remoteRef, calls} = Peer({reFetch})
  const [loading, setLoading] = useState(false)
  console.log({remoteRef})

  console.log(getMachineId(), "machine id");
  const timeoutIdRef = useRef(null);
  const popupShownRef = useRef(false); // Ref untuk melacak apakah popup sudah muncul


  useEffect(() => {
    if (peerId !== '') {
      // Clear the previous timeout if exists
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      // Set a new timeout
      timeoutIdRef.current = setTimeout(() => {
        setLoading(true); // Set loading to true before starting the fetch
        getFetch({
          url: `peer/find/${getMachineId()}`,
        })
          .then((res) => {
            console.log({ res });
            const payload = {
              uuid: getMachineId(),
              nama: localStorage.getItem('username'),
              peerid: peerId,
            };
            inputData({
              url: `peer/save/${getMachineId()}`,
              payload,
              showSwal: false,
            }).finally(() => {
              console.log('finally');
              setLoading(false); // Set loading to false after operation completes
            });
          })
          .catch((err) => {
            console.log({ err });
            setLoading(false); // Set loading to false after operation completes
            if (err?.response?.status === 404 && peerId !== '' && !popupShownRef.current) {
              popupShownRef.current = true; // Set popup shown flag to true
              MySwal.fire({
                title: 'Submit your username',
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off',
                },
                showCancelButton: false,
                confirmButtonText: 'Simpan',
                showLoaderOnConfirm: true,
                preConfirm: async (name) => {
                  if (!name) {
                    MySwal.showValidationMessage('Username tidak boleh kosong');
                  }
                  return name;
                },
              }).then(async (result) => {
                if (result.isConfirmed) {
                  localStorage.setItem('username', result.value);
                  const payload = {
                    uuid: getMachineId(),
                    nama: result.value,
                    peerid: peerId,
                  };

                  setLoading(true); // Set loading to true before starting the save
                  await inputData({
                    url: `peer/save/${getMachineId()}`,
                    payload: payload,
                    showSwal: false,
                  })
                  .then(() => {
                    
                    Toast({title : 'Username tersimpan', icon : 'success'})
                  })
                  .catch((err) => {
                    console.log({ err });
                    Toast({title : 'Username gagal tersimpan', icon : 'error'})
                  })
                  .finally(() => {
                    setLoading(false); // Set loading to false after operation completes
                  });
                }
              });
            }
          });
      }, 500); // Adjust the delay as necessary
    }
  }, [peerId]);
  
const handleSubmit = e => {
  e.stopPropagation()
  e.preventDefault()
  console.log('calling', remoteId)
  call(remoteId)
}


const isPeerConnected = peerId != '' ? true : false
const isRemoteConnected = remoteId != '' ? true : false


  return (
    <main className="w-full h-screen bg-gray-50">
      {loading && <Loading />}
      {/* <div className="text-black text-xs">My ID : {peerId}</div> */}
      <div className="flex justify-center">
        <div>
          <video ref={localRef} autoPlay muted />
        </div>
        <div>
          <video ref={remoteRef} autoPlay />
        </div>
      </div>
        <div style={{ 
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
         }} className="flex justify-center w-1/2 shadow-inner h-1/2 self-center drop-shadow-2xl bg-white relative">
         {!isPeerConnected ? <CiCircleMinus className="absolute left-0 text-black"/>  : <CiCircleCheck className="text-green-400 absolute left-0 bg-gray-50" />}
         {isPeerConnected && <div className=" absolute ml-5 left-0 text-black text-xs w-full">connected to peer</div>}
          <div className="w-full h-full flex-col flex">
              <div className="w-full  h-[45%] "></div>
              <div className="w-full   h-full flex justify-center flex-wrap gap-3">
                  <Each
                    of={listUser?.filter((item) => item.uuid != getMachineId())}
                    // of={listUser}
                    render={data => <div className="relative text-black h-20 w-20 shadow-md flex justify-center items-center">
                      <FaCircleUser title={`connect to ${data.nama}`} id={data.peerid} onClick={e => call(e.target.id)} className="w-[81%] h-[81%] cursor-pointer"/>
                      <FcEndCall onClick={e => endCall(data.peerid)} className="absolute right-0 bottom-0 w-[25%]  h-[25%] cursor-pointer bg-black rounded-full p-1"/>
                      </div>}
                  />
              </div>
          </div>
        </div>
       <div className="flex justify-center w-full">
        <form onSubmit={handleSubmit}>
        <input value={remoteId} onChange={(e) => setRemoteId(e.target.value)} />
        <Button htmlType="submit" >call</Button>
        </form>
      </div>  
    </main>
  );
}

export default App;
