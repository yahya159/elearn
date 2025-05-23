import React from 'react';
import { Link } from 'react-router-dom';
import { CourseCard } from '../components/courses';
import './Home.css';

const Home = () => {
  const featuredCourses = [
    {
      _id: '1',
      title: 'Introduction au Développement Web',
      description: 'Apprenez les bases du développement web avec HTML, CSS et JavaScript.',
      price: 49.99,
      level: 'Débutant',
      thumbnail: '/images/default-course.jpg'
    },
    {
      _id: '2',
      title: 'React.js Avancé',
      description: 'Maîtrisez React.js avec des concepts avancés et des bonnes pratiques.',
      price: 69.99,
      level: 'Avancé',
      thumbnail: '/images/default-course.jpg'
    },
    {
      _id: '3',
      title: 'Node.js et Express',
      description: 'Créez des applications backend robustes avec Node.js et Express.',
      price: 59.99,
      level: 'Intermédiaire',
      thumbnail: '/images/default-course.jpg'
    }
  ];

  const categories = [
    {
      id: 1,
      name: 'Développement Web',
      icon: 'fas fa-code',
      count: 25
    },
    {
      id: 2,
      name: 'Développement Mobile',
      icon: 'fas fa-mobile-alt',
      count: 15
    },
    {
      id: 3,
      name: 'Science des Données',
      icon: 'fas fa-chart-bar',
      count: 20
    },
    {
      id: 4,
      name: 'Design',
      icon: 'fas fa-paint-brush',
      count: 18
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <h1>Apprenez à votre rythme</h1>
        <p>Découvrez des milliers de cours en ligne et développez vos compétences</p>
        <div className="hero-buttons">
          <Link to="/courses" className="primary-button">Explorer les cours</Link>
          <Link to="/register" className="secondary-button">Commencer gratuitement</Link>
        </div>
      </section>

      <section className="featured-courses">
        <h2>Cours populaires</h2>
        <div className="courses-grid">
          {featuredCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>

      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>1000+</h3>
            <p>Cours disponibles</p>
          </div>
          <div className="stat-item">
            <h3>5000+</h3>
            <p>Étudiants actifs</p>
          </div>
          <div className="stat-item">
            <h3>200+</h3>
            <p>Instructeurs experts</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support disponible</p>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>Catégories populaires</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <i className={category.icon}></i>
              <h3>{category.name}</h3>
              <p>{category.count} cours</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 