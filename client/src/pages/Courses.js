import React, { useState } from 'react';
import './Courses.css';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Tous les cours' },
    { id: 'web', name: 'Développement Web' },
    { id: 'mobile', name: 'Développement Mobile' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' }
  ];

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Explorez nos cours</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button>Rechercher</button>
        </div>
      </div>

      <div className="courses-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="courses-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((course) => (
          <div key={course} className="course-card">
            <div className="course-image">
              <img src={`/images/course-${course}.jpg`} alt={`Course ${course}`} />
              <div className="course-level">Débutant</div>
            </div>
            <div className="course-content">
              <h3>Introduction au Développement Web</h3>
              <p>Apprenez les bases du développement web moderne</p>
              <div className="course-meta">
                <span>4.5 ⭐</span>
                <span>1200 étudiants</span>
              </div>
              <div className="course-price">
                <span className="price">49.99 €</span>
                <button className="enroll-button">S'inscrire</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button>Précédent</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>Suivant</button>
      </div>
    </div>
  );
};

export default Courses; 