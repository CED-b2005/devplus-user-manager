    function openModal() {
      document.getElementById("userModal").style.display = "flex";
    }

    function closeModal() {
      document.getElementById("userModal").style.display = "none";
      document.getElementById("userForm").reset();
      document.getElementById("userId").value = "";
    }

    // Đóng popup khi click ra ngoài
    window.onclick = function (e) {
      const modal = document.getElementById("userModal");
      if (e.target === modal) {
        closeModal();
      }
    };


// API endpoint
const API_URL = "https://jsonplaceholder.typicode.com/users";
console.log(API_URL);

// Lấy dữ liệu người dùng từ sessionStorage
const getUsersFromSession = () => {
  const users = sessionStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// Lưu dữ liệu người dùng vào sessionStorage
const saveUsersToSession = (users) => {
  sessionStorage.setItem('users', JSON.stringify(users));
};

// Hiển thị danh sách người dùng lên bảng
const renderUserTable = () => {
  const users = getUsersFromSession();
  const tableBody = document.querySelector('#userTable tbody');
  tableBody.innerHTML = ''; // Clear current table rows
  
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.website}</td>
      <td>
        <button onclick="editUser(${user.id})">Edit</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Thêm người dùng mới
const addUser = (user) => {
  const users = getUsersFromSession();
  users.push(user);
  saveUsersToSession(users);
  renderUserTable();
};

// Cập nhật người dùng
const updateUser = (updatedUser) => {
  const users = getUsersFromSession();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsersToSession(users);
    renderUserTable();
  }
};

// Xóa người dùng
const deleteUser = (userId) => {
  let users = getUsersFromSession();
  users = users.filter(user => user.id !== userId);
  saveUsersToSession(users);
  renderUserTable();
};

// Chỉnh sửa thông tin người dùng
const editUser = (userId) => {
  openModal();
  const users = getUsersFromSession();
  const user = users.find(u => u.id === userId);
  if (user) {
    document.getElementById('userId').value = user.id;
    document.getElementById('name').value = user.name;
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    document.getElementById('website').value = user.website;
  }
};

// Xử lý form submit
document.getElementById('userForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const userId = document.getElementById('userId').value;
  const name = document.getElementById('name').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const website = document.getElementById('website').value;

  const user = {
    id: userId ? parseInt(userId) : Date.now(),  // Nếu không có ID, dùng thời gian hiện tại làm ID
    name,
    username,
    email,
    phone,
    website,
  };

  if (userId) {
    updateUser(user);
  } else {
    addUser(user);
  }

  // Clear form fields
  document.getElementById('userForm').reset();
  document.getElementById('userId').value = '';
});

// Lấy dữ liệu từ API và lưu vào sessionStorage khi lần đầu tiên mở trang
const loadInitialData = async () => {
  if (!sessionStorage.getItem('users')) {
    const response = await fetch(API_URL);
    const users = await response.json();
    saveUsersToSession(users);
    renderUserTable();
  } else {
    renderUserTable();
  }
};

// Khởi động ứng dụng
loadInitialData();