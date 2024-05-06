import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export {MySwal}

export const showAlert = ({title, icon, withConfirm = false , setModalOpen, position = 'center'}) => {
    
  if(!withConfirm){
   return MySwal.fire({
        position: position,
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 1500
      })
    }else{
     return MySwal.fire({
        position: position,
        icon: icon,
        title: title,
        showConfirmButton: true,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          setModalOpen(false)
        }
      })
    }
}

const MyToast = MySwal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
export const  Toast = ({title, icon = 'success'}) => {
  return MyToast.fire({title, icon})
}