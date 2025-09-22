import navIcone1 from "../assets/img/nav-icon1.svg";
import navIcone2 from "../assets/img/nav-icon2.svg";
import navIcone3 from "../assets/img/nav-icon3.svg";
export const AboutUs = () => {
  const teamMembers = [
    {
      name: "Nkingsapbe",
      role: "Lead Developer",
      description: "Full-stack developer with expertise in React and Node.js. Passionate about creating intuitive user experiences.",
      skills: ["React", "Node.js", "MongoDB", "UI/UX"]
    },
    {
      name: "Misherutso Lohe",
      role: "Frontend Developer",
      description: "Creative frontend developer specializing in modern web technologies and responsive design.",
      skills: ["React", "CSS3", "JavaScript", "Design"]
    },
    {
      name: "Nkingsapbe",
      role: "Backend Developer",
      description: "Backend specialist focused on database optimization and API development for scalable applications.",
      skills: ["Python", "PostgreSQL", "API Design", "DevOps"]
    },
    {
      name: "Vincent",
      role: "UI/UX Designer",
      description: "Designer dedicated to crafting beautiful and functional interfaces that enhance user learning experiences.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"]
    }
  ];

  return (
    <div className="about-container" id ="aboutus">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">About Our Question Bank</h1>
          <p className="hero-subtitle">
            Empowering students and educators with comprehensive learning resources
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="content-section">
          {/* Mission Section */}
          <div className="mission-section">
            <h2>Our Mission</h2>
            <p className="mission-text">
              We believe that quality education should be accessible to everyone. Our question bank platform 
              was born from the idea that students deserve comprehensive, well-organized study materials that 
              help them excel in their academic journey. We've created a platform that not only provides 
              extensive question collections but also adapts to different learning styles and academic levels.
            </p>
          </div>

          {/* Story Section */}
          <div className="story-section">
            <h2>Our Story</h2>
            <p className="story-text">
              What started as a college project among friends has evolved into a comprehensive learning platform. 
              We noticed the lack of organized, accessible question banks for students preparing for various 
              examinations. Combining our diverse skills in development, design, and education, we set out to 
              create something that would make a real difference in students' lives.
            </p>
          </div>
          <div className="features-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>Comprehensive Question Banks</h3>
                <p>Thousands of carefully curated questions across multiple subjects and difficulty levels.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Smart Practice Mode</h3>
                <p>Adaptive learning system that focuses on your weak areas and tracks your progress.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Detailed Analytics</h3>
                <p>Get insights into your performance with comprehensive analytics and progress tracking.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌟</div>
                <h3>User-Friendly Interface</h3>
                <p>Clean, intuitive design that makes studying enjoyable and efficient.</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="team-section">
            <h2 className="team-title">Meet Our Team</h2>
            <p className="team-subtitle">
              The passionate individuals behind your learning experience
            </p>
            
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  <div className="member-avatar">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <p className="member-description">{member.description}</p>
                    <div className="member-skills">
                      {member.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact-section">
            <h2>Get In Touch</h2>
            <p>
              Have questions, suggestions, or feedback? We'd love to hear from you! 
              Our team is always working to improve and expand our question bank to better serve your learning needs.
            </p>
            <span className="contact-us">
            <div className="social-icon">
                <a href="https://facebook.com/nking.sap.9">
                    <img src={navIcone2} alt="facebook"/>
                </a>
                <a href="https://wa.me/919863330216">
                    <img src={navIcone1} alt="whatsapp"/>
                </a>
                <a href="https://instagram.com/nkingsap">
                    <img src={navIcone3} alt="instagram"/>
                </a>
            </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;