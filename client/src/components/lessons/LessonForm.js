import React, { useState } from 'react';

const LessonForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement lesson creation/edit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer/Modifier une leçon</h2>
      <div>
        <label>Titre</label>
        <input name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Contenu</label>
        <textarea name="content" value={formData.content} onChange={handleChange} required />
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default LessonForm; 