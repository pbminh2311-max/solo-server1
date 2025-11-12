// Kết nối tới server Render
const socket = io("https://solo-server1.onrender.com");

socket.on("playerUpdate", (data) => {
    console.log("Dữ liệu từ server:", data);
});

// Gửi vị trí khi di chuyển
function movePlayer(x, y) {
    socket.emit("move", {x, y});
}
