import axios from 'axios';
import { useState, useEffect } from "react";
import instance from './Instance';

function ApiFetch({url, params, triggerfetch, setGlobalData}) {
    const [result, setResult] = useState(null);
    const [datas, setDatas] = useState(null);

    const inputData = async ({ url, payload, update=false, checkDate = false, useInstanse=true, showSwal}) => {
          if(useInstanse){
              if(!update){
              return instance.post(`${url}`, payload, {showSwal})
              .then((response) => {
                setDatas(response.data);
                return response
              });
            }else{
               return instance.put(`${url}`, payload, {showSwal})
                .then((response) => {
                  setDatas(response.data);
                  return response
                });
            }
            }
            };
    
            const getFetch = async ({ url, params = '', setResultdata, setGlobalData, setLoadingTo, showSwal }) => {
              try {
              
                const response = await instance.get(`${url}${params}`, { showSwal });
              
              
                if (setResultdata) {
                  setResultdata(response.data);
                  if (response?.data?.result) {
                    setResultdata(response.data.result);
                  }
                }
              
                return response;
              } catch (error) {
                // Handle any errors here
                console.error('Error in getFetch:', error);
              
                if (setResultdata) {
                  setResultdata([]);
                }
              
                if (setGlobalData) {
                  dispatch(setGlobalData([]));
                }
                throw error;
              }
            }
            
    
    const reFetch = () => {
      getFetch({url, setResultdata : setResult})
    }
    
    if(url){
        useEffect(() => {
            getFetch({url : url, params : params, setResultdata : setResult, setGlobalData : setGlobalData})
        }, [url, params, datas, triggerfetch])
    
    }
    

     return { result, getFetch, inputData, reFetch};

}


export default ApiFetch;