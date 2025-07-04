import React from "react";
import "../../styles/LegalPage.css"; // Assuming you have a CSS file for styling

const AGBPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="subtitle">Gültig ab: [Datum einfügen]</p>

        <div className="legal-section">
          <h2>1. Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für die Nutzung der Website 
            SpaetiFinder und aller damit verbundenen Dienste. Durch die Nutzung unserer Website stimmen Sie 
            diesen AGB zu.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Leistungsbeschreibung</h2>
          <p>
            SpaetiFinder ist eine Plattform, die es Nutzern ermöglicht, Informationen über Spätverkaufsstellen 
            (Spätis) zu finden, zu bewerten und zu teilen. Die Dienste umfassen:
          </p>
          <ul>
            <li>Suche nach Spätis in der Umgebung</li>
            <li>Bewertung und Kommentierung von Spätis</li>
            <li>Hinzufügen neuer Spätis zur Datenbank</li>
            <li>Bearbeitung bestehender Informationen</li>
            <li>Community-Features und Nutzerprofile</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Nutzerregistrierung und -konto</h2>
          <h3>Registrierung</h3>
          <p>
            Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. Bei der Registrierung 
            müssen Sie wahre und vollständige Angaben machen.
          </p>
          
          <h3>Kontosicherheit</h3>
          <p>
            Sie sind verpflichtet, Ihre Zugangsdaten geheim zu halten und uns unverzüglich zu informieren, 
            wenn Sie Grund zur Annahme haben, dass Dritte Kenntnis von Ihren Zugangsdaten erlangt haben.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Nutzerverhalten und Content</h2>
          <h3>Verbotene Inhalte</h3>
          <p>Sie verpflichten sich, keine Inhalte zu veröffentlichen, die:</p>
          <ul>
            <li>Rechtswidrig, beleidigend, diffamierend oder diskriminierend sind</li>
            <li>Gewalt verherrlichen oder zu Gewalt aufrufen</li>
            <li>Pornographische oder sexuell explizite Inhalte enthalten</li>
            <li>Spam, Werbung oder unerwünschte Nachrichten darstellen</li>
            <li>Falsche oder irreführende Informationen enthalten</li>
            <li>Urheberrechte oder andere Rechte Dritter verletzen</li>
          </ul>

          <h3>Bewertungen und Kommentare</h3>
          <p>
            Bewertungen und Kommentare sollen ehrlich und auf eigenen Erfahrungen basieren. 
            Falsche oder manipulative Bewertungen sind nicht gestattet.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Geistiges Eigentum</h2>
          <p>
            Durch das Hochladen von Inhalten gewähren Sie uns eine nicht-exklusive, kostenlose Lizenz 
            zur Nutzung, Vervielfältigung und Verbreitung dieser Inhalte im Rahmen unserer Dienste.
          </p>
          <p>
            Die Website und alle Inhalte (außer nutzergenerierten Inhalten) sind urheberrechtlich geschützt.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Moderation und Löschung</h2>
          <p>
            Wir behalten uns das Recht vor, Inhalte zu moderieren, zu bearbeiten oder zu löschen, 
            die gegen diese AGB verstoßen. Nutzerkonten können bei wiederholten Verstößen gesperrt werden.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Haftungsausschluss</h2>
          <p>
            Die Informationen auf unserer Plattform werden von der Community bereitgestellt. 
            Wir übernehmen keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der Informationen.
          </p>
          <p>
            Unsere Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, außer bei Schäden 
            aus der Verletzung von Leben, Körper und Gesundheit.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Änderungen der AGB</h2>
          <p>
            Wir behalten uns vor, diese AGB zu ändern. Wesentliche Änderungen werden den Nutzern 
            mit angemessener Frist mitgeteilt. Die Fortsetzung der Nutzung nach einer Änderung 
            gilt als Zustimmung zu den neuen AGB.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Kündigung</h2>
          <p>
            Beide Parteien können das Nutzungsverhältnis jederzeit ohne Angabe von Gründen kündigen. 
            Bei schwerwiegenden Verstößen können wir Konten sofort sperren.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Anwendbares Recht und Gerichtsstand</h2>
          <p>
            Es gilt deutsches Recht. Gerichtsstand für alle Streitigkeiten ist [Ihr Gerichtsstand], 
            sofern der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder 
            öffentlich-rechtliches Sondervermögen ist.
          </p>
        </div>

        <div className="legal-section">
          <h2>11. Kontakt</h2>
          <p>
            Bei Fragen zu diesen AGB wenden Sie sich bitte an:<br />
            <strong>E-Mail:</strong> [ihre.email@example.com]<br />
            <strong>Anschrift:</strong> [Ihre vollständige Adresse]
          </p>
        </div>

        <div className="legal-section">
          <h2>12. Salvatorische Klausel</h2>
          <p>
            Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, 
            bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AGBPage;
