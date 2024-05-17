import axios from "axios";
import Swal from "sweetalert2";
// import { message } from "antd";
// import { setLoading } from "@states/loading/loadingSlice";
// import  store  from "@states/index"




const instance = axios.create({
  baseURL: 'https://pdekv1heal.sharedwithexpose.com/api',
  // headers: { "Access-Control-Allow-Origin": "*" },
});



instance.interceptors.response.use(
  function (response) {
    if (['put', 'post'].includes(response?.config?.method.toLowerCase())) {
      if (['200', '201', 200, 201].includes(response?.status)) {
        if (response?.config?.showSwal === false) {
          // store.dispatch(setLoading(false));
          return response;
        }
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Data Tersimpan",
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (response?.data?.error) {
        if (response?.config?.showSwal === false) {
          // store.dispatch(setLoading(false));
          return response;
        }
        console.log("response data", response);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Data Gagal Tersimpan",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
    // store.dispatch(setLoading(false));
    return response;
  },
  function (error) {
    console.log({ error });
    if (error?.config?.showSwal === false) {
      // store.dispatch(setLoading(false));
      return response;
    }
    // store.dispatch(setLoading(false));
    if (['post', 'put'].includes(error?.config?.method)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Data Gagal Tersimpan",
        showConfirmButton: false,
        timer: 1000,
      });
    }
    // if (error?.config?.method === "get" && error?.code === "ERR_NETWORK") {
    //   message.error('Network Error');
    // }
    return Promise.reject(error);
  }
);

export default instance;
