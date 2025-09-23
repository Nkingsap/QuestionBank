import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const QuestionPaper = () => {
  // State management
  const [currentState, setCurrentState] = useState({
    view: 'main',
    year: null,
    semester: null,
    examType: null
  });

  const [questionsDB, setQuestionsDB] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);

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
  const loadQuestionsFromFirebase = async (year, semester, examType) => {
    if (!db) {
      return [];
    }

    try {
      const snapshot = await db.collection('questions')
        .where('year', '==', parseInt(year))
        .where('semester', '==', parseInt(semester))
        .where('examType', '==', examType)
        .orderBy('timestamp', 'desc')
        .get();
      
      const questions = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        questions.push({
          id: doc.id,
          name: data.name,
          url: data.url,
          uploadDate: data.uploadDate,
          fileName: data.fileName
        });
      });
      
      return questions;
    } catch (error) {
      console.error('Error loading from Firebase:', error);
      return [];
    }
  };

  // Utility functions
  const getOrdinal = (num) => {
    const ordinals = ['', '1st', '2nd', '3rd', '4th'];
    return ordinals[num];
  };

  const getQuestionKey = (year, semester, examType) => {
    return `${year}_${semester}_${examType}`;
  };

  // Storage functions
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

  // Navigation functions
  const showMain = () => {
    setCurrentState({ view: 'main', year: null, semester: null, examType: null });
  };

  const showYear = (year) => {
    setCurrentState({ ...currentState, view: 'semester', year });
  };

  const showYearView = () => {
    setCurrentState({ ...currentState, view: 'semester' });
  };

  const showSemester = (semester) => {
    setCurrentState({ ...currentState, view: 'exam', semester });
  };

  const showExamTypes = () => {
    setCurrentState({ ...currentState, view: 'exam' });
  };

  const showExam = (examType) => {
    setCurrentState({ ...currentState, view: 'questions', examType });
    loadQuestions(currentState.year, currentState.semester, examType);
  };

  // Question loading with Firebase integration
  const loadQuestions = async (year, semester, examType) => {
    setIsLoading(true);
    
    try {
      let loadedQuestions;
      
      if (db && firebaseInitialized) {
        // Load from Firebase first
        loadedQuestions = await loadQuestionsFromFirebase(year, semester, examType);
      } else {
        // Fallback to localStorage
        const key = getQuestionKey(year, semester, examType);
        loadedQuestions = questionsDB[key] || [];
      }
      
      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback to localStorage on error
      const key = getQuestionKey(year, semester, examType);
      setQuestions(questionsDB[key] || []);
    } finally {
      setIsLoading(false);
    }
  };

  // Download function
  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${filename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Modal functions
  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setModalImage(null);
    document.body.style.overflow = 'auto';
  };

  // Handle modal backdrop click
  const handleModalBackdropClick = (e) => {
    if (e.target.classList.contains('question-paper-modal')) {
      closeModal();
    }
  };

  // Render functions for different views
  const renderMainView = () => (
    <div className="question-paper-years-grid">
      {[1, 2, 3, 4].map(year => (
        <div key={year} className="question-paper-year-card" onClick={() => showYear(year)}>
          <h2 className="question-paper-year-card-title">{getOrdinal(year)} Year</h2>
          <p className="question-paper-year-card-subtitle">{getOrdinal(year)} Year Question Papers</p>
        </div>
      ))}
    </div>
  );

  const renderSemesterView = () => (
    <div className="question-paper-view">
      <button className="question-paper-back-btn" onClick={showMain}>← Back to Years</button>
      <h2 className="question-paper-view-title">{getOrdinal(currentState.year)} Year Question Papers</h2>
      <div className="question-paper-grid">
        {[1, 2].map(semester => (
          <div key={semester} className="question-paper-card" onClick={() => showSemester(semester)}>
            <h3 className="question-paper-card-title">Semester {semester}</h3>
            <p className="question-paper-card-subtitle">{semester === 1 ? 'First' : 'Second'} Semester</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExamView = () => {
    const examTypes = [
      { key: 'weekly', name: 'Weekly Test', desc: 'Weekly Test Papers' },
      { key: 'cia1', name: 'CIA 1', desc: 'First Internal Assessment' },
      { key: 'cia2', name: 'CIA 2', desc: 'Second Internal Assessment' },
      { key: 'endsem', name: 'End Semester', desc: 'End Semester Exam' }
    ];

    return (
      <div className="question-paper-view">
        <button className="question-paper-back-btn" onClick={showYearView}>← Back to Semesters</button>
        <h2 className="question-paper-view-title">{getOrdinal(currentState.year)} Year - Semester {currentState.semester}</h2>
        <div className="question-paper-grid">
          {examTypes.map(exam => (
            <div key={exam.key} className="question-paper-card" onClick={() => showExam(exam.key)}>
              <h3 className="question-paper-card-title">{exam.name}</h3>
              <p className="question-paper-card-subtitle">{exam.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuestionsView = () => {
    const examNames = {
      'weekly': 'Weekly Test',
      'cia1': 'CIA 1', 
      'cia2': 'CIA 2',
      'endsem': 'End Semester Exam'
    };

    return (
      <div className="question-paper-view">
        <button className="question-paper-back-btn" onClick={showExamTypes}>← Back to Exam Types</button>
        <h2 className="question-paper-view-title">
          {getOrdinal(currentState.year)} Year - Semester {currentState.semester} - {examNames[currentState.examType]}
        </h2>
        
        <div className="question-paper-questions-container">
          {isLoading ? (
            <div className="question-paper-loading">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="question-paper-no-questions">
              No question papers available for this section.<br />
              Contact admin to upload question papers.
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={index} className="question-paper-question-item">
                <div className="question-paper-question-header">
                  <h3 className="question-paper-question-title">{question.name || `Question Paper ${index + 1}`}</h3>
                  <div className="question-paper-question-actions">
                    <button className="question-paper-action-btn" onClick={() => openModal(question.url)}>
                      👁️ View
                    </button>
                    <button 
                      className="question-paper-action-btn question-paper-download-btn" 
                      onClick={() => downloadImage(question.url, question.name || `Question_Paper_${index + 1}`)}
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
               
                <div className="question-paper-question-meta">
                  <span>Uploaded: {question.uploadDate}</span>
                  <span>{question.fileName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="question-paper-container">
      {/* Header */}
      <div className="question-paper-header">
        <h1 className="question-paper-header-title">Question Bank</h1>
        <p className="question-paper-header-subtitle">Don Bosco College Autonomous Maram</p>
        <p className="question-paper-header-desc">Bachelor of Computer Application</p>
      </div>

      {/* Main Content */}
      <div className="question-paper-main-container">
        {currentState.view === 'main' && renderMainView()}
        {currentState.view === 'semester' && renderSemesterView()}
        {currentState.view === 'exam' && renderExamView()}
        {currentState.view === 'questions' && renderQuestionsView()}
      </div>

      {/* Modal - ONLY THIS PART IS FIXED */}
      {modalImage && (
        <div className="question-paper-modal" onClick={handleModalBackdropClick}>
          <div className="question-paper-modal-content">
            <img src={modalImage} alt="Question Paper" className="question-paper-modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPaper;
