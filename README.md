# Question Bank Portal 

A comprehensive web application for managing and accessing question papers for xxx college. This platform provides students with organized access to question papers across different years, semesters, and examination types.

## 🚀 Features

- **Multi-year Support**: Access question papers for 1st through 4th year
- **Semester Organization**: Separate sections for each semester
- **Exam Type Categories**: Weekly tests, CIA 1, CIA 2, and End Semester exams
- **Image Viewer**: Built-in modal viewer for question papers
- **Download Functionality**: Direct download of question papers
- **Admin Panel**: Secure upload interface for administrators
- **Responsive Design**: Mobile-first design that works on all devices
- **Firebase Integration**: Cloud storage and authentication
- **Cloudinary Integration**: Image hosting and optimization

## 🛠️ Technologies Used

### Frontend
- **React** - User interface framework
- **React Router** - Client-side routing
- **Bootstrap** - Responsive UI components
- **CSS3** - Custom styling with gradients and animations

### Backend Services
- **Firebase Firestore** - Cloud database
- **Firebase Authentication** - User authentication
- **Cloudinary** - Image storage and delivery

### Development Tools
- **Create React App** - Development environment
- **Web Vitals** - Performance monitoring

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nkingsap/QuestionBank.git
   cd trypo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database and Authentication
   - Update the Firebase configuration in `src/components/login.js` and `src/components/qs.js`

4. **Configure Cloudinary**
   - Sign up at [Cloudinary](https://cloudinary.com)
   - Create an upload preset named `qbank22`
   - Note your cloud name from the dashboard
   - Update the Cloudinary configuration in upload functions

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AboutUs.js          # About page component
│   ├── home.js             # Homepage component
│   ├── NavBar.js           # Navigation bar component
│   ├── qs.js               # Main question papers component
│   ├── login.js            # Admin panel component
│   └── loginform.js        # Login form component
├── assets/
│   └── img/                # Social media icons and images
├── App.js                  # Main application component
├── App.css                 # Global application styles
├── AboutUs.css             # About page styles
├── home.css                # Homepage styles
├── NavBar.css              # Navigation styles
├── loginform.css           # Login form styles
└── components/
    └── qs.css              # Question papers page styles
```

## 🎯 Usage

### For Students
1. **Browse Question Papers**
   - Navigate to the homepage
   - Select your year (1st-4th year)
   - Choose semester (1 or 2)
   - Pick exam type (Weekly, CIA 1, CIA 2, End Semester)

2. **View and Download**
   - Click "View" to see the question paper in a modal
   - Click "Download" to save the question paper locally

### For Administrators
1. **Access Admin Panel**
   - Navigate to `/loginform` and authenticate
   - Access the admin panel at `/login`

2. **Upload Question Papers**
   - Select year, semester, and exam type
   - Enter question paper name
   - Choose image files (supports multiple uploads)
   - Click upload to save to cloud storage

## 🔐 Authentication

The application uses Firebase Authentication for securing the admin panel. Only authenticated users can access the upload functionality.

**Default Admin Routes:**
- `/loginform` - Login page
- `/login` - Admin panel (requires authentication)

## 📱 Responsive Design

The application is designed with a mobile-first approach:
- **Mobile**: Optimized touch interface and vertical layouts
- **Tablet**: Balanced grid layouts
- **Desktop**: Full-featured horizontal navigation

## 🎨 Design Features

- **Dark Theme**: Modern dark gradient background
- **Glassmorphism**: Translucent cards with backdrop blur
- **Smooth Animations**: CSS transitions and hover effects
- **Professional Typography**: Clean, readable font hierarchy
- **Interactive Elements**: Hover states and click feedback

## 🔧 Configuration

### Firebase Setup
Update the Firebase configuration in the relevant components:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### Cloudinary Setup
Update the Cloudinary configuration in upload functions:

```javascript
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'uploadpreset'); // Your upload preset name
  formData.append('cloud_name', 'your-cloud-name'); // Your Cloudinary cloud name

  const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
};
```

**Cloudinary Configuration Steps:**
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Go to Settings → Upload → Add upload preset
3. Create an unsigned upload preset named `qbank22`
4. Set the following options:
   - **Signing Mode**: Unsigned
   - **Resource Type**: Image
   - **Format**: Auto
   - **Quality**: Auto
   - **Access Rights**: Public Read
5. Copy your Cloud Name from the dashboard
6. Replace `your-cloud-name` in the upload URL with your actual cloud name

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables for Firebase
3. Deploy automatically on push to main branch

### Netlify Deployment
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure redirects for React Router

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 👥 Team

- **Nkingsapbe** - Lead Developer & Backend Developer
- **Misherutso Lohe** - Frontend Developer
- **Vincent** - UI/UX Designer


## 🐛 Bug Reports

If you find any bugs or have feature requests, please create an issue in the GitHub repository with:
- Description of the bug/feature
- Steps to reproduce (for bugs)
- Expected behavior
- Screenshots (if applicable)

## 📞 Contact

For questions or support, reach out through:

- Instagram: [@nkingsap](https://instagram.com/nkingsap)

---

**Don Bosco College Autonomous Question Bank Portal** - Empowering students with comprehensive learning resources.
