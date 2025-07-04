import React from "react";
import "../../styles/LegalPage.css"; // Assuming you have a CSS file for styling

const DatenschutzPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Datenschutz</h1>
        <p className="subtitle">Einfach erklärt für unser Hobbyprojekt</p>

        <div className="legal-section">
          <h2>Was wir sammeln und warum</h2>
          <p>
            SpaetiFinder ist ein kostenloses Hobbyprojekt für Freunde und Familie. 
            Wir sammeln nur die Daten, die nötig sind, damit die App funktioniert.
          </p>
          
          <h3>Bei der Anmeldung speichern wir:</h3>
          <ul>
            <li><strong>Benutzername</strong> - um dich in der App anzuzeigen</li>
            <li><strong>E-Mail Adresse</strong> - falls wir dich kontaktieren müssen</li>
            <li><strong>Passwort</strong> - verschlüsselt gespeichert für die Anmeldung</li>
          </ul>

          <h3>Wenn du die App nutzt, speichern wir:</h3>
          <ul>
            <li><strong>Deine Bewertungen</strong> - um sie anderen Nutzern zu zeigen</li>
            <li><strong>Deine Favoriten</strong> - um sie in deinem Profil anzuzeigen</li>
            <li><strong>Spätis, die du hinzufügst</strong> - um sie in der App zu zeigen</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Was wir NICHT machen</h2>
          <ul>
            <li>❌ Deine Daten an andere verkaufen</li>
            <li>❌ Werbung oder Marketing</li>
            <li>❌ Tracking für kommerzielle Zwecke</li>
            <li>❌ Deine Daten ohne deine Erlaubnis weitergeben</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Deine Rechte</h2>
          <p>Du kannst jederzeit:</p>
          <ul>
            <li>✅ Deine Daten einsehen und ändern</li>
            <li>✅ Dein Konto löschen</li>
            <li>✅ Einzelne Bewertungen löschen</li>
            <li>✅ Eine Kopie deiner Daten anfordern</li>
          </ul>
          <p>Schreib einfach eine E-Mail an: <strong>spaetify@gmail.com</strong></p>
        </div>

        <div className="legal-section">
          <h2>Technische Details</h2>
          <p>
            <strong>Speicherort:</strong> Deine Daten werden sicher auf deutschen/europäischen Servern gespeichert.<br />
            <strong>Verschlüsselung:</strong> Passwörter sind verschlüsselt, Verbindungen sind über HTTPS gesichert.<br />
            <strong>Löschung:</strong> Wenn du dein Konto löschst, werden alle deine Daten entfernt.
          </p>
        </div>

        <div className="legal-disclaimer">
          <p>
            <strong>Bei Fragen:</strong> Dies ist ein Hobbyprojekt unter Freunden. 
            Falls du Fragen zum Datenschutz hast, schreib einfach eine E-Mail! 😊
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatenschutzPage;
