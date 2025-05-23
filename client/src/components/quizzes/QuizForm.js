import React, { useState } from 'react';

const QuizForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    questions: [] // Placeholder for questions
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement quiz creation/edit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer/Modifier un quizz</h2>
      <div>
        <label>Titre</label>
        <input name="title" value={formData.title} onChange={handleChange} required />
      </div>
      {/* TODO: Add questions fields here */}
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default QuizForm; 