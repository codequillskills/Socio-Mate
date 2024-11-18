# SocioMate - Social Media Application

SocioMate is a modern social media platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to connect, share posts, and interact with others.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies) 
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🌓 Light/Dark mode support
- 👤 User authentication (Login/Register)
- 📝 Create, read, update, and delete posts
- 💬 Comment system
- ❤️ Like/Unlike posts
- 🔄 Follow/Unfollow users
- 👤 User profiles with bio and profile picture
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Technologies

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- React Confirm Alert

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (File uploads)
- Bcrypt.js (Password hashing)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codequillskills/Socio-Mate.git
   ```

2. Install dependencies:
   ```bash
   cd Socio-Mate
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Create a .env file in the root directory with required environment variables as mentioned in the .env.example file

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Usage

1. Register an account or login if you already have one
2. Create and share posts with your network
3. Interact with other users' posts through likes and comments
4. Follow other users to see their content in your feed
5. Customize your profile with a bio and profile picture

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
