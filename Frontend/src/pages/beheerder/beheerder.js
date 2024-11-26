
import React, { useState, useEffect } from 'react';
import './global.scss';

function AdminPage() {

  const users = [
    { id: 1, name: 'Gebruiker 1' },
    { id: 2, name: 'Gebruiker 2' },
    { id: 3, name: 'Gebruiker 3' }
  ];

  return (
    <div>
      {/* Titel van de beheerderpagina */}
      <h1>Beheerderspagina</h1>

      {/* Lijst van gebruikers */}
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      {/* Knop om nieuwe gebruikers toe te voegen */}
      <button>Voeg nieuwe gebruiker toe</button>
    </div>
  );
}

// Exporteer de AdminPage-component
export default AdminPage;
