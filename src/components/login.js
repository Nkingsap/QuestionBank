import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const AdminPanel = () => {
  // State management
  const [questionsDB, setQuestionsDB] = useState({});
  const [uploadProgress, setUploadProgress] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Form state for admin panel
  const [uploadForm, setUploadForm] = useState({
    year: '1',
    semester: '1',
    examType: 'weekly',
    questionName: '',
    files: []
  });

  // Firebase state
  const [db, setDb] = useState(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // Firebase configuration
    const firebaseConfig = {
      apiKey: "your-api-key",
      authDomain: "your-auth-domain",
      projectId: "your-project-id",
      storageBucket: "your-storage-bucket",
      messagingSenderId: "your-messaging-sender-id",
      appId: "your-app-id"
    };

  useEffect(() => {
    // Load Firebase scripts
    const loadFirebaseScripts = async () => {
      if (typeof firebase === 'undefined') {
        // Load Firebase App
        const firebaseApp = document.createElement('script');
        firebaseApp.src = 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-app-compat.min.js';
        document.head.appendChild(firebaseApp);

        // Load Firebase Firestore
        const firebaseFirestore = document.createElement('script');
        firebaseFirestore.src = 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-firestore-compat.min.js';
        document.head.appendChild(firebaseFirestore);

        // Wait for scripts to load
        await new Promise((resolve) => {
          let loadedCount = 0;
          const onLoad = () => {
            loadedCount++;
            if (loadedCount === 2) resolve();
          };
          firebaseApp.onload = onLoad;
          firebaseFirestore.onload = onLoad;
        });
      }
      
      initializeFirebase();
    };

    loadFirebaseScripts();
    loadQuestionsFromStorage();
  }, []);
  // Initialize Firebase
  const initializeFirebase = async () => {
    try {
      // Initialize Firebase using the global firebase object
      if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        const firestore = firebase.firestore();
        setDb(firestore);
        setFirebaseInitialized(true);
        console.log('Firebase initialized successfully');
      } else {
        throw new Error('Firebase SDK not loaded');
      }
    } catch (error) {
      console.warn('Firebase initialization failed. Using localStorage fallback:', error);
      setDb(null);
      setFirebaseInitialized(false);
    }
  };

  // Firebase functions
  const saveQuestionToFirebase = async (year, semester, examType, questionData) => {
    if (!db) {
      throw new Error('Firebase not configured');
    }

    try {
      await db.collection('questions').add({
        year: parseInt(year),
        semester: parseInt(semester),
        examType: examType,
        name: questionData.name,
        url: questionData.url,
        uploadDate: questionData.uploadDate,
        fileName: questionData.fileName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      throw error;
    }
  };

  // Utility functions
  const getQuestionKey = (year, semester, examType) => {
    return `${year}_${semester}_${examType}`;
  };

  // Storage functions
  const saveQuestionsToStorage = (newQuestionsDB) => {
    try {
      localStorage.setItem('questionBank', JSON.stringify(newQuestionsDB));
      setQuestionsDB(newQuestionsDB);
    } catch (e) {
      console.warn('localStorage not available');
    }
  };

  const loadQuestionsFromStorage = () => {
    try {
      const stored = localStorage.getItem('questionBank');
      if (stored) {
        setQuestionsDB(JSON.parse(stored));
      }
    } catch (e) {
      setQuestionsDB({});
    }
  };

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'upload_preset'); // Replace with your upload preset
    formData.append('cloud_name', 'cloud_name'); // Replace with your cloud name

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/cloudname/image/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } 
    catch (error) {
      throw new Error('Failed to upload to Cloudinary: ' + error.message);
    }
  };

  // Upload questions function with Firebase integration
  const uploadQuestions = async () => {
    if (!uploadForm.files.length) {
      alert('Please select at least one image file.');
      return;
    }

    if (!uploadForm.questionName.trim()) {
      alert('Please enter a name for the question paper.');
      return;
    }

    setIsUploading(true);
    setUploadProgress('');

    try {
      const files = Array.from(uploadForm.files);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = files.length > 1 ? `${uploadForm.questionName} - Part ${i + 1}` : uploadForm.questionName;
        setUploadProgress(`Uploading "${fileName}" (${i + 1} of ${files.length})...`);
        
        // Upload to Cloudinary
        const url = await uploadToCloudinary(file);
        
        // Create question data
        const questionData = {
          url: url,
          name: fileName,
          uploadDate: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          fileName: file.name
        };
        
        // Save to Firebase (primary) or localStorage (fallback)
        if (db && firebaseInitialized) {
          try {
            await saveQuestionToFirebase(uploadForm.year, uploadForm.semester, uploadForm.examType, questionData);
            console.log('Question saved to Firebase');
          } catch (error) {
            console.warn('Firebase save failed, falling back to localStorage:', error);
            // Fallback to localStorage
            const newQuestionsDB = { ...questionsDB };
            const key = getQuestionKey(uploadForm.year, uploadForm.semester, uploadForm.examType);
            
            if (!newQuestionsDB[key]) {
              newQuestionsDB[key] = [];
            }
            newQuestionsDB[key].push(questionData);
            saveQuestionsToStorage(newQuestionsDB);
          }
        } else {
          // Use localStorage
          const newQuestionsDB = { ...questionsDB };
          const key = getQuestionKey(uploadForm.year, uploadForm.semester, uploadForm.examType);
          
          if (!newQuestionsDB[key]) {
            newQuestionsDB[key] = [];
          }
          newQuestionsDB[key].push(questionData);
          saveQuestionsToStorage(newQuestionsDB);
        }
      }

      setUploadProgress('Upload completed successfully!');
      
      // Reset form
      setUploadForm({
        year: '1',
        semester: '1',
        examType: 'weekly',
        questionName: '',
        files: []
      });

      setTimeout(() => {
        setUploadProgress('');
      }, 5000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(`Upload failed: ${error.message}`);
      setTimeout(() => {
        setUploadProgress('');
      }, 8000);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="question-paper-container">
      {/* Header */}
      <div className="question-paper-header">
        <h1 className="question-paper-header-title">Admin Panel</h1>
        <p className="question-paper-header-subtitle">Question Bank Management</p>
        <p className="question-paper-header-desc">Upload and Manage Question Papers</p>
      </div>

      <div className="question-paper-main-container">
        <div className="question-paper-view">
          <h2 className="question-paper-admin-title">Admin Panel</h2>
          
          

          <div className="question-paper-upload-form">
            <div className="question-paper-form-group">
              <label className="question-paper-label">Year:</label>
              <select 
                className="question-paper-select"
                value={uploadForm.year}
                onChange={(e) => setUploadForm({...uploadForm, year: e.target.value})}
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div className="question-paper-form-group">
              <label className="question-paper-label">Semester:</label>
              <select 
                className="question-paper-select"
                value={uploadForm.semester}
                onChange={(e) => setUploadForm({...uploadForm, semester: e.target.value})}
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
            <div className="question-paper-form-group">
              <label className="question-paper-label">Exam Type:</label>
              <select 
                className="question-paper-select"
                value={uploadForm.examType}
                onChange={(e) => setUploadForm({...uploadForm, examType: e.target.value})}
              >
                <option value="weekly">Weekly Test</option>
                <option value="cia1">CIA 1</option>
                <option value="cia2">CIA 2</option>
                <option value="endsem">End Semester</option>
              </select>
            </div>
            <div className="question-paper-form-group">
              <label className="question-paper-label">Question Paper Name:</label>
              <input 
                type="text"
                className="question-paper-input"
                placeholder="Enter question paper name"
                value={uploadForm.questionName}
                onChange={(e) => setUploadForm({...uploadForm, questionName: e.target.value})}
              />
            </div>
            <div className="question-paper-form-group">
              <label className="question-paper-label">Select Images:</label>
              <input 
                type="file"
                className="question-paper-input"
                accept="image/*"
                multiple
                onChange={(e) => setUploadForm({...uploadForm, files: e.target.files})}
              />
            </div>
            <button 
              className={`question-paper-upload-btn ${isUploading ? 'question-paper-upload-btn-disabled' : ''}`}
              onClick={uploadQuestions}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Questions'}
            </button>
            {uploadProgress && (
              <div className="question-paper-upload-progress">{uploadProgress}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;