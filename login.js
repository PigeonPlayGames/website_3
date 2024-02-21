// Mock database using local storage
const users = JSON.parse(localStorage.getItem('users')) || [];

function findUser(username) {
    return users.find(user => user.username === username);
}

document.getElementById('loginBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = findUser(username);

    if (user && user.password === password) {
        alert('Login successful!');
        localStorage.setItem('currentUser', JSON.stringify(user));
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('gamePage').style.display = 'flex';
    } else {
        alert('Invalid username or password');
    }
});

document.getElementById('registerBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Username and password cannot be empty');
        return;
    }

    if (findUser(username)) {
        alert('Username is already taken');
        return;
    }

    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful, you can now login');
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    document.getElementById('gamePage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
});
