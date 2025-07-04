import React from "react";
import "../../styles/LegalPage.css"; // Assuming you have a CSS file for styling

const ImpressumPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Impressum</h1>
        <p className="subtitle">Angaben gemäß § 5 TMG</p>

        <div className="legal-section">
          <h2>Betreiber der Website</h2>
          <p>
            <strong>Jonathan Senf</strong><br />
            Berlin, Deutschland<br />
            <strong>E-Mail:</strong> spaetify@gmail.com
          </p>
          <p>
            <em>Dies ist ein privates Hobbyprojekt für Freunde und Familie.</em>
          </p>
        </div>

        <div className="legal-section">
          <h2>Über diese Website</h2>
          <p>
            SpaetiFinder ist ein kostenloses Hobbyprojekt, um Spätis in der Umgebung zu finden und zu bewerten. 
            Diese Seite wird nicht kommerziell betrieben und dient dem Austausch unter Freunden und Familie.
          </p>
          <p>
            Die Informationen über Spätis werden von der Community bereitgestellt. 
            Wir übernehmen keine Gewähr für Richtigkeit oder Aktualität der Daten.
          </p>
        </div>

        <div className="legal-disclaimer">
          <p><strong>Hinweis:</strong> Dies ist ein privates Projekt. Bei Fragen oder Problemen einfach eine E-Mail schreiben! 😊</p>
        </div>
      </div>
    </div>
  );
};

export default ImpressumPage;
