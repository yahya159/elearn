import React from 'react';
import { useSelector } from 'react-redux';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {user?.name}</p>
      </div>

      <div className="dashboard-grid">
        {/* Enrolled Courses */}
        <div className="dashboard-card enrolled-courses">
          <h2>Mes cours</h2>
          <div className="courses-list">
            {[1, 2, 3].map((course) => (
              <div key={course} className="course-item">
                <img src={`/images/course-${course}.jpg`} alt={`Course ${course}`} />
                <div className="course-info">
                  <h3>Introduction au Développement Web</h3>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: '60%' }}></div>
                  </div>
                  <p>60% complété</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <h2>Activité récente</h2>
          <div className="activity-list">
            {[1, 2, 3, 4].map((activity) => (
              <div key={activity} className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-book"></i>
                </div>
                <div className="activity-info">
                  <p>Vous avez complété la leçon "Introduction à HTML"</p>
                  <span>Il y a 2 heures</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="dashboard-card certificates">
          <h2>Mes certificats</h2>
          <div className="certificates-list">
            {[1, 2].map((cert) => (
              <div key={cert} className="certificate-item">
                <i className="fas fa-certificate"></i>
                <div className="certificate-info">
                  <h3>Certificat de Développement Web</h3>
                  <p>Obtenu le 15 Mars 2024</p>
                </div>
                <button className="download-btn">Télécharger</button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-card quick-stats">
          <h2>Statistiques rapides</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <i className="fas fa-book"></i>
              <div className="stat-info">
                <h3>5</h3>
                <p>Cours suivis</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-check-circle"></i>
              <div className="stat-info">
                <h3>3</h3>
                <p>Cours terminés</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-certificate"></i>
              <div className="stat-info">
                <h3>2</h3>
                <p>Certificats</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-clock"></i>
              <div className="stat-info">
                <h3>24h</h3>
                <p>Temps d'étude</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 