function generateUniqueDeviceUuid() {
  // Mengambil waktu saat ini dalam milidetik dan mengonversinya ke bentuk heksadesimal
  const timestamp = new Date().getTime().toString(16).slice(-6); // Mengambil 6 karakter terakhir

  // Mengambil tinggi dan lebar layar dan mengonversinya ke bentuk heksadesimal
  const screenWidth = window.screen.width.toString(16).slice(-2); // Mengambil 2 karakter terakhir
  const screenHeight = window.screen.height.toString(16).slice(-2); // Mengambil 2 karakter terakhir

  // Membuat bagian acak tambahan dengan panjang yang lebih pendek
  const randomPart = Math.random().toString(16).substr(2, 6); // Mengambil 6 karakter acak

  // Menggabungkan semua elemen untuk membentuk UUID unik
  const uniqueUuid = `${timestamp}-${screenWidth}-${screenHeight}-${randomPart}`;
  return uniqueUuid;
}

// Contoh penggunaan
console.log("Generated UUID:", generateUniqueDeviceUuid());


export function getMachineId() {
  let machineId = localStorage.getItem("MachineId");

  if (!machineId) {
    machineId =  generateUniqueDeviceUuid();
    localStorage.setItem("MachineId", machineId);
  }

  return machineId;
}