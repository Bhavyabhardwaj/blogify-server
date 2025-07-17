<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=50&duration=4000&pause=1000&color=FFFFFF&background=000000&center=true&vCenter=true&width=800&height=100&lines=CONTENTLY-SERVER" alt="Contently-server" />

</div>


<div align="center">
  
  **Created by [Bhavyabhardwaj](https://github.com/Bhavyabhardwaj)**
  
 
  
</div>


## 🎯 Getting Started.!

### Prerequisites

Make sure you have the following installed:

- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) `v16+`
- ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) `v8+`

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/Bhavyabhardwaj/Contently-server.git

# Navigate to project directory
cd Contently-server

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🌟 Features

- ✨ Modern and responsive design
- 🚀 High performance
- 📱 Mobile-friendly
- 🔒 Secure by default
- 🎨 Customizable themes

## 📚 Usage

Add your usage examples here:

```javascript
// Example code snippet
const example = "Hello, World!";
console.log(example);
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔁 Open a Pull Request

## 📄 License

This project is licensed under the **Not specified** License.

## 🙏 Acknowledgments

- Thanks to all contributors who helped make this project better
- Special thanks to the open-source community

---

<div align="center">
  <strong>⭐ Star this repository if you find it helpful!</strong>
  
  <br/>
  
  <a href="https://github.com/Bhavyabhardwaj/Contently-server">
    <img src="https://img.shields.io/badge/View%20on-GitHub-black?style=for-the-badge&logo=github" alt="View on GitHub"/>
  </a>
</div>

## 🚀 Deployment on Render

1. **Set Environment Variables**
   - Create a `.env` file in the root of your server directory with the following variables:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=10000 # Render sets this automatically, but you can default to 4000
```

2. **Build & Start Commands for Render**
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

3. **Prisma**
   - The `postinstall` script will run `prisma generate` and `tsc` automatically after install.
   - If you use migrations, add a migration step in the Render dashboard: `npx prisma migrate deploy`

4. **CORS**
   - Make sure your `CLIENT_URL` is included in the CORS origin array in `src/server.ts`.

---

## 🛠️ Required Environment Variables

Create a `.env.example` file with:

```env
DATABASE_URL=
JWT_SECRET=
CLERK_SECRET_KEY=
CLIENT_URL=
PORT=4000
```
