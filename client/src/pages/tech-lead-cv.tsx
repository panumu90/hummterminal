import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TechLeadCV() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Scroll to section functionality
    const handlePillClick = (event: Event) => {
      const button = event.target as HTMLButtonElement;
      const targetId = button.getAttribute('data-target');
      if (targetId) {
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Active section highlighting
    const setActive = (id: string) => {
      const pills = document.querySelectorAll('.pill');
      pills.forEach(pill => {
        pill.setAttribute('aria-current', 
          pill.getAttribute('data-target') === id ? 'true' : 'false'
        );
      });
    };

    // Intersection observer for active section
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) {
        setActive('#' + visible[0].target.id);
      }
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
    });

    // Show/hide scroll to top button
    const handleScroll = () => {
      const toTop = document.getElementById('toTop');
      if (window.scrollY > 600) {
        toTop?.classList.add('show');
      } else {
        toTop?.classList.remove('show');
      }
    };

    // Scroll to top functionality
    const handleToTopClick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Collapsible sections functionality
    const handleReadMoreClick = (event: Event) => {
      const button = event.target as HTMLButtonElement;
      const target = button.getAttribute('data-target');
      const content = document.querySelector(`[data-section="${target}"]`);
      
      if (content) {
        const isCollapsed = content.classList.contains('collapsed');
        if (isCollapsed) {
          content.classList.remove('collapsed');
          content.classList.add('expanded');
          button.textContent = 'Näytä vähemmän';
        } else {
          content.classList.add('collapsed');
          content.classList.remove('expanded');
          button.textContent = 'Lue lisää';
          // Scroll to section header when collapsing
          const sectionHeader = content.closest('.collapsible-section')?.querySelector('h2');
          if (sectionHeader) {
            sectionHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    // Add event listeners
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Section navigation pills
    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
      pill.addEventListener('click', handlePillClick);
    });

    // Observe sections for active highlighting - only pills with data-target
    const sections = Array.from(pills)
      .filter(pill => pill.getAttribute('data-target'))  // Only pills with data-target
      .map(pill => document.querySelector(pill.getAttribute('data-target')!))
      .filter(Boolean);
    sections.forEach(section => section && io.observe(section));

    // Back to top button
    const toTopButton = document.getElementById('toTop');
    toTopButton?.addEventListener('click', handleToTopClick);

    // Read more buttons
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(btn => {
      btn.addEventListener('click', handleReadMoreClick);
    });

    // Cleanup
    return () => {
      document.removeEventListener('scroll', handleScroll);
      pills.forEach(pill => {
        pill.removeEventListener('click', handlePillClick);
      });
      sections.forEach(section => section && io.unobserve(section));
      toTopButton?.removeEventListener('click', handleToTopClick);
      readMoreButtons.forEach(btn => {
        btn.removeEventListener('click', handleReadMoreClick);
      });
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --bg: #0a1530;
          --bg-elev: #0f1f46;
          --brand: #103a7a;
          --brand-2: #2563eb;
          --muted: #a8b3cf;
          --txt: #e8efff;
          --shadow: 0 10px 30px rgba(15,31,70,.35);
          --radius: 18px;
          --ring: 0 0 0 3px rgba(37,99,235,.35);
        }
        
        .cv-page {
          min-height: 100vh;
          margin: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          color: var(--txt);
          background: radial-gradient(1200px 600px at 20% -10%, #182a57 0%, transparent 60%), 
                     radial-gradient(800px 600px at 100% 0%, #0c2b5f 0%, transparent 50%), 
                     var(--bg);
          line-height: 1.6;
          scroll-behavior: smooth;
        }
        
        .wrap { 
          width: min(1000px, 92vw); 
          margin-inline: auto; 
        }
        
        .cv-header { 
          position: sticky; 
          top: 0; 
          z-index: 20; 
          background: rgba(10,21,48,.65); 
          backdrop-filter: saturate(140%) blur(8px); 
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        
        .head { 
          display: grid; 
          grid-template-columns: 1fr auto; 
          gap: 12px; 
          align-items: center; 
          padding: 16px 0; 
        }
        
        .name { 
          font-weight: 800; 
          letter-spacing: .4px; 
          font-size: clamp(1.3rem, 1.2vw + 1rem, 1.8rem);
        }
        
        .tag { 
          color: var(--muted);
        }
        
        .sectionnav { 
          position: sticky; 
          top: 66px; 
          z-index: 19; 
          background: rgba(10,21,48,.55); 
          backdrop-filter: saturate(140%) blur(8px); 
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        
        .sectionnav .wrap { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 8px; 
          padding: 10px 0;
        }
        
        .pill { 
          appearance: none; 
          border: 1px solid rgba(255,255,255,.14); 
          background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)); 
          color: var(--txt); 
          padding: 8px 12px; 
          border-radius: 999px; 
          cursor: pointer; 
          font-weight: 600; 
          letter-spacing: .2px; 
          transition: transform .08s ease, box-shadow .08s ease, background .2s ease;
        }
        
        .pill:hover { 
          transform: translateY(-1px); 
          box-shadow: var(--shadow);
        }
        
        .pill[aria-current="true"] { 
          background: linear-gradient(180deg, var(--brand-2), var(--brand)); 
          border-color: transparent; 
          box-shadow: var(--ring);
        }
        
        .section { 
          padding: 28px 0;
        }
        
        .content-subtitle {
          color: var(--brand-2);
          font-size: 1.1rem;
          font-weight: 700;
          margin: 24px 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .skill-highlight {
          background: rgba(37,99,235,.08);
          border: 1px solid rgba(37,99,235,.2);
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
        }
        
        .skill-highlight p {
          margin: 8px 0;
        }
        
        .philosophy-text {
          background: rgba(255,255,255,.04);
          border-left: 3px solid var(--brand-2);
          padding: 16px;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          margin: 20px 0;
        }
        
        .value-proposition {
          background: linear-gradient(135deg, rgba(37,99,235,.1), rgba(16,58,122,.1));
          border-radius: 16px;
          padding: 20px;
          margin: 24px 0;
        }
        
        .value-proposition h4 {
          margin: 0 0 16px 0;
          color: var(--txt);
        }
        
        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }
        
        .value-item {
          background: rgba(255,255,255,.06);
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-size: 0.9rem;
        }
        
        .role-intro {
          background: rgba(255,255,255,.02);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }
        
        .lead-text {
          font-size: 1.1rem;
          line-height: 1.7;
        }
        
        .highlight-section {
          color: var(--brand-2);
          font-size: 1.2rem;
          margin: 28px 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .emphasis-box {
          background: linear-gradient(135deg, rgba(37,99,235,.08), rgba(16,58,122,.06));
          border: 1px solid rgba(37,99,235,.15);
          border-radius: 16px;
          padding: 24px;
          margin: 16px 0;
        }
        
        .critical-text {
          background: linear-gradient(90deg, #ef4444, #dc2626);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          font-size: 1.1em;
        }
        
        .commitment-list {
          margin: 16px 0;
          background: rgba(255,255,255,.04);
          border-radius: 8px;
          padding: 16px;
        }
        
        .commitment-list p {
          margin: 6px 0;
          font-size: 0.95rem;
        }
        
        .result-text {
          background: rgba(34,197,94,.1);
          border: 1px solid rgba(34,197,94,.2);
          border-radius: 8px;
          padding: 12px;
          margin-top: 16px;
          text-align: center;
          font-weight: 600;
        }
        
        .enhanced-list {
          background: rgba(255,255,255,.02);
          border-radius: 12px;
          padding: 20px;
          margin: 16px 0;
        }
        
        .enhanced-list ul {
          list-style: none;
          padding: 0;
        }
        
        .enhanced-list li {
          padding: 8px 0;
          padding-left: 24px;
          position: relative;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        
        .enhanced-list li:last-child {
          border-bottom: none;
        }
        
        .enhanced-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--brand-2);
          font-weight: bold;
        }
        
        /* Better spacing and visual hierarchy */
        .section {
          padding: 32px 0;
        }
        
        .section.card {
          background: rgba(255,255,255,.02);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.06);
          margin: 24px 0;
          transition: all 0.3s ease;
        }
        
        .section.card:hover {
          background: rgba(255,255,255,.03);
          border-color: rgba(37,99,235,.2);
          transform: translateY(-2px);
        }
        
        .section.pad {
          padding: 32px;
        }
        
        /* Enhanced content spacing */
        .content > * + * {
          margin-top: 20px;
        }
        
        .full-content > * + * {
          margin-top: 20px;
        }
        
        /* Chip styling improvements */
        .chip {
          display: inline-block;
          background: linear-gradient(135deg, var(--brand-2), var(--brand));
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin: 4px 8px 4px 0;
          box-shadow: 0 2px 8px rgba(37,99,235,.3);
          border: 1px solid rgba(255,255,255,.1);
        }
        
        /* Better responsive text sizing */
        .content-subtitle {
          font-size: clamp(1rem, 2vw, 1.2rem);
        }
        
        .highlight-section {
          font-size: clamp(1.1rem, 2.5vw, 1.3rem);
        }
        
        /* Improved mobile spacing */
        @media (max-width: 768px) {
          .section.pad {
            padding: 20px;
          }
          
          .value-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .commitment-list {
            padding: 12px;
          }
          
          .emphasis-box {
            padding: 16px;
          }
        }
        
        .cv-page h1, .cv-page h2, .cv-page h3 { 
          line-height: 1.2; 
          margin: .2rem 0 .6rem;
        }
        
        .cv-page h1 { 
          font-size: clamp(1.8rem, 2.2vw + 1rem, 2.8rem);
        }
        
        .cv-page h2 { 
          font-size: clamp(1.2rem, 1.1vw + 1rem, 1.6rem);
        }
        
        .cv-page p.lead { 
          color: #d7e3ff;
        }
        
        .card { 
          background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02)); 
          border: 1px solid rgba(255,255,255,.08); 
          border-radius: var(--radius); 
          box-shadow: var(--shadow);
        }
        
        .pad { 
          padding: 20px;
        }
        
        .cv-page ul { 
          margin: 0; 
          padding-left: 1.1rem;
        }
        
        .cv-page li { 
          margin: .2rem 0;
        }
        
        .eyebrow { 
          color: var(--muted); 
          text-transform: uppercase; 
          letter-spacing: .12em; 
          font-size: .8rem; 
          font-weight: 700;
        }
        
        .chip { 
          display: inline-block; 
          padding: 6px 10px; 
          border-radius: 999px; 
          border: 1px solid rgba(255,255,255,.14); 
          margin: 4px 6px 0 0; 
          font-size: .9rem;
        }
        
        .toTop { 
          position: fixed; 
          right: 18px; 
          bottom: 18px; 
          border-radius: 999px; 
          border: 1px solid rgba(255,255,255,.18); 
          padding: 10px 12px; 
          background: rgba(30,144,255,.85); 
          color: #021128; 
          font-weight: 800; 
          cursor: pointer; 
          display: none; 
          z-index: 30;
        }
        
        .toTop.show { 
          display: block;
        }
        
        .cv-footer { 
          color: var(--muted); 
          border-top: 1px solid rgba(255,255,255,.08); 
          padding: 32px 0 50px;
        }

        /* Collapsible sections styles */
        .collapsible-content {
          position: relative;
        }

        .collapsible-content.collapsed .full-content {
          display: none;
        }

        .collapsible-content.expanded .preview-content {
          display: none;
        }

        .collapsible-content.collapsed .preview-content {
          display: block;
          position: relative;
        }

        .collapsible-content.collapsed .preview-content::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3rem;
          background: linear-gradient(transparent, var(--bg-elev));
          pointer-events: none;
        }

        .read-more-btn {
          margin-top: 1rem;
          padding: 8px 16px;
          background: linear-gradient(180deg, var(--brand-2), var(--brand));
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .read-more-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow);
        }
      `}</style>

      {/* Back button */}
      <div className="wrap" style={{ paddingTop: '1rem' }}>
        <Link href="/">
          <button className="pill" style={{ marginBottom: '1rem' }} data-testid="back-to-home">
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Palaa takaisin
          </button>
        </Link>
      </div>

      <div className="cv-page" data-testid="tech-lead-cv-page">
        <header className="cv-header" role="banner">
          <div className="wrap head">
            <div>
              <div className="name">Panu Murtokangas · Tech Lead – rooli ja Humm Group Oy</div>
              <div className="tag">Web‑pohjainen CV (darkblue‑teema) • Asiakaskokemus edellä, teknologia tuottaa arvoa</div>
            </div>
          </div>
        </header>

        <nav className="sectionnav" aria-label="Osionavigaatio">
          <div className="wrap" id="sectionButtons">
            <button className="pill" data-target="#h-sum" data-testid="nav-summary">Tiivistelmä</button>
            <button className="pill" data-target="#h-mietteet" data-testid="nav-thoughts">Mietteitäni</button>
            <button className="pill" data-target="#h-rooli" data-testid="nav-role">Rooli</button>
            <button className="pill" data-target="#h-success" data-testid="nav-success">Onnistumisen tekijät</button>
            <button className="pill" data-target="#h-yhteenveto" data-testid="nav-summary-final">Yhteenveto</button>
            <button className="pill" data-target="#h-oma" data-testid="nav-why-me">Miksi minä</button>
          </div>
        </nav>

        <main className="wrap" role="main">
          <section className="section collapsible-section" aria-labelledby="h-sum">
            <p className="eyebrow">Tiivistelmä</p>
            <h1 id="h-sum">Tech Lead -hakemus Humm Group Oy:lle</h1>
            <div className="collapsible-content collapsed" data-section="summary">
              <div className="preview-content">
                <p className="lead">Asiakaskokemus ensin – teknologia seuraa. Tällä sivulla esittelen web‑pohjaisen CV:ni ja lähestymistapani Tech Lead -rooliin...</p>
              </div>
              <div className="full-content">
                <p className="lead">Asiakaskokemus ensin – teknologia seuraa. Tällä sivulla esittelen web‑pohjaisen CV:ni, mietteeni ja lähestymistapani Tech Lead -rooliin Humm Group Oy:llä. Kaikki alla oleva teksti on hakemuksen pohjana ja sisältää alkuperäiset mietteeni.</p>
              </div>
              <button className="read-more-btn" data-target="summary" data-testid="read-more-summary">Lue lisää</button>
            </div>
          </section>

          <section className="section card pad" aria-labelledby="h-mietteet">
            <h2 id="h-mietteet">Mietteitäni</h2>
            <div className="content">
              <h3 className="content-subtitle">💼 Analyysi ja lähtökohdat</h3>
              <p>Olen perehtynyt syvällisesti <strong>Humm Group Oy:n</strong> toimintaan, liiketoiminnallisiin tunnuslukuihin ja kilpailijoihin. Pohdin tarkkaan, minkälaista arvoa voisin yritykselle tuoda.</p>
              
              <h3 className="content-subtitle">🎯 Ydinosaaminen</h3>
              <p>Erikoisosaamiseni keskittyy kahteen kriittiseen alueeseen:</p>
              <div className="skill-highlight">
                <p><strong>1. Järjestelmäintegraatiot:</strong> API-integraatiot, CRM-järjestelmien kytkennät, automaatiotyökalut ja datan siirtäminen eri järjestelmien välillä saumattomasti.</p>
                <p><strong>2. Tekoälyn strateginen hyödyntäminen:</strong> GPT-mallien hyödyntäminen, embedding-teknologiat, RAG-arkkitehtuurit ja fine-tuning-prosessit.</p>
              </div>
              
              <h3 className="content-subtitle">🚀 Käytännön osaamisen todistus</h3>
              <p>Osaan rakentaa <strong>AI-strategioita</strong>, implementoida niitä käytännössä ja mitata liiketoimintavaikutuksia. <em>Tämä sovellus toimii konkreettisena näyttönä kyvyistäni.</em></p>
              
              <h3 className="content-subtitle">💡 Liiketoimintaymmärrys</h3>
              <p>Usean vuoden kokemus suurten pörssiyhtiöiden analysoinnista antaa perspektiiviä menestyneiden organisaatioiden johtamiseen.</p>
              
              <p className="philosophy-text">Lähestymistapani: <strong>asiakaskokemus edellä, teknologia seuraa</strong>. Haluan olla mukana merkityksellisessä työssä ja luoda todellista arvoa.</p>
              
              <div className="value-proposition">
                <h4>🎯 Kolme arvonluontitapaa Hummille:</h4>
                <div className="value-grid">
                  <div className="value-item">📈 <strong>Tehokkuuden parantaminen</strong></div>
                  <div className="value-item">💡 <strong>Uusien palvelumallien ideointi</strong></div>
                  <div className="value-item">🎨 <strong>Asiakaskokemuksen kehittäminen</strong></div>
                </div>
              </div>
              
              <h3 className="content-subtitle">🔍 Markkinaanalyysi</h3>
              <p>Kilpailijoihin perehtyessäni huomasin, että monet hyödyntävät jo tekoälyä ja automaatiota. <strong>Voisin tuoda arvoa käytännön AI-osaamisella.</strong></p>
              <h3 className="content-subtitle">👤 Henkilökohtaiset vahvuudet</h3>
              <div className="enhanced-list">
                <ul>
                  <li><strong>Innovatiivisuus</strong> ja uteliaisuus uusia teknologioita kohtaan</li>
                  <li><strong>Ongelmanratkaisukyky</strong> ja analyyttinen ajattelu</li>
                  <li><strong>Itseohjautuvuus</strong> ja proaktiivisuus</li>
                  <li><strong>Joustavuus</strong> ja sopeutumiskyky</li>
                  <li><strong>Tiimin johtaminen</strong> ja kehittäminen</li>
                  <li><strong>Muutosjohtamisen</strong> taidot</li>
                </ul>
              </div>
              
              <h3 className="content-subtitle">❓ Miksi nämä ovat kriittisiä Tech Leadille</h3>
              <div className="enhanced-list">
                <ul>
                  <li>Tekoälyala kehittyy nopeasti → <strong>jatkuva oppiminen on välttämätöntä</strong></li>
                  <li>Pienessä yrityksessä on monimutkaisia ongelmia → <strong>luovuus ja ratkaisukeskeisyys</strong></li>
                  <li>Resurssipula edellyttää → <strong>itseohjautuvuutta ja itsenäistä toimintaa</strong></li>
                  <li>Nopea muutos → <strong>joustavuus on kilpailuetu</strong></li>
                  <li>Teknologian käyttöönotto → <strong>tiimin johtaminen on avain</strong></li>
                  <li>AI-siirtymä → <strong>muutosjohtaminen ilman henkilöstön epävarmuutta</strong></li>
                </ul>
              </div>
            </div>
          </section>

          <section className="section card pad collapsible-section" aria-labelledby="h-rooli">
            <h2 id="h-rooli">Tech Lead -rooli</h2>
            <div className="collapsible-content collapsed" data-section="rooli">
              <div className="preview-content">
                <p>Rooli on erityisen vaativa, koska Humm Group on pieni yritys, joka on vasta aloittamassa tekoälymatkaansa. Tech Leadin on oltava sekä tekninen asiantuntija että strateginen ajattelija...</p>
              </div>
              <div className="full-content">
                <div className="role-intro">
                  <p className="lead-text">Rooli on erityisen vaativa, koska <strong>Humm Group</strong> on pieni yritys, joka on vasta aloittamassa tekoälymatkaansa. Tech Leadin on oltava sekä <strong>tekninen asiantuntija</strong> että <strong>strateginen ajattelija</strong>.</p>
                </div>
                
                <h3 className="highlight-section">⚡ Jatkuva kehitys - elinehto AI-maailmassa</h3>
                <div className="emphasis-box">
                  <p>Tekoälyala kehittyy <strong>eksponentiaalisesti</strong>. Jatkuva oppiminen ja kehittyminen eivät ole vain hyviä ominaisuuksia - ne ovat <span className="critical-text">elinehtoja</span> Tech Leadille AI-maailmassa.</p>
                  
                  <div className="commitment-list">
                    <p><strong>Sitoudun:</strong></p>
                    <p>🔬 Seuraamaan aktiivisesti alan tutkimusta</p>
                    <p>🧪 Kokeilemaan uusia teknologioita</p>
                    <p>🤝 Osallistumaan AI-yhteisöihin</p>
                    <p>⚙️ Tekemään jatkuvasti proof-of-concept -toteutuksia</p>
                  </div>
                  
                  <p className="result-text">Tämä varmistaa, että <strong>Humm Group pysyy teknologisen kehityksen kärjessä</strong>.</p>
                </div>
                
                <h3 className="content-subtitle">🎯 Liiketoiminnan ymmärrys ja mahdollisuudet</h3>
                <div className="enhanced-list">
                  <ul>
                    <li><strong>Asiakaskokemus & ulkoistus:</strong> Merkittävä arvopotentiaali tekoälyllä</li>
                    <li><strong>Henkilöstökustannukset:</strong> 60-70% osuus → automaation suuri potentiaali</li>
                    <li><strong>Palvelun laatu:</strong> AI parantaa asiakastyytyväisyyttä ja säilyttämistä</li>
                    <li><strong>Brändi-identiteetti:</strong> Säilytä "Hummin värit" - inhimillisyys + teknologia</li>
                    <li><strong>Ydinliiketoiminta:</strong> Asiakaskokemus → syvä liiketoimintaymmärrys pakollinen</li>
                    <li><strong>Arvotuotto:</strong> Mitattava hyöty, ei pelkkää hypetä</li>
                    <li><strong>Strateginen linkitys:</strong> Teknologia → liiketoiminnan tavoitteet & KPI:t</li>
                  </ul>
                </div>
              </div>
              <button className="read-more-btn" data-target="rooli" data-testid="read-more-role">Lue lisää</button>
            </div>
          </section>

          <section className="section card pad collapsible-section" aria-labelledby="h-success">
            <h2 id="h-success">Keskeiset onnistumisen tekijät</h2>
            <div className="collapsible-content collapsed" data-section="success">
              <div className="preview-content">
                <p>Systemaattinen lähestymistapa Tech Lead -roolin onnistumiseen keskittyen kommunikointiin, joustavuuteen, arvon tuottamiseen ja kulttuurin muutokseen...</p>
              </div>
              <div className="full-content">
                <h3 className="content-subtitle">💬 Kommunikointi ja läpinäkyvyys</h3>
                <div className="enhanced-list">
                  <ul>
                    <li><strong>Säännölliset palaverit</strong> johdon ja tiimin kanssa</li>
                    <li><strong>Avoin tiedonjako</strong> edistymisestä ja haasteista</li>
                    <li><strong>Merkityksen kirkastaminen</strong> - kaikki ymmärtävät tekemisen tarkoituksen</li>
                  </ul>
                </div>
                
                <h3 className="content-subtitle">🔄 Joustavuus ja iteratiivisuus</h3>
                <div className="enhanced-list">
                  <ul>
                    <li><strong>Ketteryys:</strong> Valmius muuttaa suunnitelmia tarpeen mukaan</li>
                    <li><strong>Nopeat kokeilut:</strong> Oppiminen ja validointi ennen isoja investointeja</li>
                    <li><strong>Realistinen sizing:</strong> Vältä liian suuria ja hitaita hankkeita alussa</li>
                  </ul>
                </div>
                
                <h3 className="content-subtitle">💰 Liiketoiminnan arvon tuottaminen</h3>
                <div className="enhanced-list">
                  <ul>
                    <li><strong>Quick wins:</strong> Keskity hankkeisiin, jotka tuottavat nopeasti arvoa</li>
                    <li><strong>ROI-fokus:</strong> Teknologiainvestointien tuottavuuden varmistaminen</li>
                    <li><strong>Mittaaminen:</strong> Liiketoiminnallisten vaikutusten seuranta ja viestintä</li>
                  </ul>
                </div>
                
                <h3 className="content-subtitle">🎭 Kulttuurin muutos</h3>
                <div className="enhanced-list">
                  <ul>
                    <li><strong>Osaamisen kehitys:</strong> Teko älyosaaminen koko organisaatiossa</li>
                    <li><strong>Teknologia työkaluna:</strong> Ei itseisarvo vaan väline tavoitteisiin</li>
                    <li><strong>Kokeilukulttuuri:</strong> Jatkuva oppiminen ja rohkeus testata</li>
                  </ul>
                </div>
                
                <div className="philosophy-text">
                  <strong>Strateginen lähestymistapa:</strong> Systemaattinen ja hallittu aloitus Tech Lead -rooliin. Ensin ymmärrys yrityksestä ja tarpeista, sitten toimenpiteet. Ensimmäiset projektit tuottavat nopeasti arvoa ja vahvistavat luottamusta teknologian kehittämiseen.
                </div>
              </div>
              <button className="read-more-btn" data-target="success" data-testid="read-more-success">Lue lisää</button>
            </div>
          </section>

          <section className="section card pad collapsible-section" aria-labelledby="h-yhteenveto">
            <h2 id="h-yhteenveto">Yhteenveto</h2>
            <div className="collapsible-content collapsed" data-section="yhteenveto">
              <div className="preview-content">
                <p>Tech Lead -rooli on strategisesti tärkeä Humm Group Oy:lle tekoälyn hyödyntämisessä ja kilpailuedun saavuttamisessa...</p>
              </div>
              <div className="full-content">
                <div className="role-intro">
                  <p className="lead-text">Tech Lead -rooli on <strong>strategisesti kriittinen</strong> Humm Group Oy:lle tekoälyn hyödyntämisessä ja kilpailuedun saavuttamisessa. Onnistunut Tech Lead yhdistää teknologisen osaamisen, liiketoimintaymmärryksen ja johtamistaidot.</p>
                </div>
                
                <h3 className="content-subtitle">🚀 AI:n strategiset hyödyt Hummille</h3>
                <div className="value-proposition">
                  <div className="value-grid">
                    <div className="value-item">👥 <strong>Asiakaskokemuksen parantaminen</strong></div>
                    <div className="value-item">⚡ <strong>Operatiivisen tehokkuuden lisääminen</strong></div>
                    <div className="value-item">🎯 <strong>Uusien palveluiden kehittäminen</strong></div>
                    <div className="value-item">📊 <strong>Päätöksenteon tukeminen</strong></div>
                  </div>
                </div>
                
                <h3 className="content-subtitle">📈 Seuranta ja läpinäkyvyys</h3>
                <p className="philosophy-text">Seurattava dashboard on <strong>välttämätön työkalu</strong> Tech Leadille - mahdollistaa strategian ja toteutuksen jatkuvan seurannan, läpinäkyvyyden ja päätöksenteon tukemisen.</p>
                
                <div className="result-text">
                  <strong>Lopputulos:</strong> Onnistunut tekoälyn käyttöönotto edellyttää selkeää strategiaa, johdon sitoutumista ja systemaattista toteutusta. AI tarjoaa Hummille mahdollisuuden erottua kilpailijoista ja luoda uusia liiketoimintamahdollisuuksia.
                </div>
              </div>
              <button className="read-more-btn" data-target="yhteenveto" data-testid="read-more-summary-final">Lue lisää</button>
            </div>
          </section>

          <section className="section card pad" aria-labelledby="h-oma">
            <h2 id="h-oma">Miksi minä</h2>
            <p>Olen ideaali Tech Lead Humm Groupille, koska yhdistän teknisen tekoälyosaamisen syvään ymmärrykseen asiakaskokemusliiketoiminnastanne. Lähestymistapani on käytännönläheinen: aloitan perehtymällä yrityksenne nykytilaan, prosesseihin ja asiakkaiden tarpeisiin ennen kuin ehdän ratkaisuja.</p>
            <p>Rakentaisin tekoälystrategianne vaiheittain, keskittyen ensin nopeisiin tuloksiin ja arvon tuottamiseen. Aloittaisin pienistä, konkreettisista pilotointihankkeista, jotka osoittavat teknologian potentiaalin ja tuottavat mitattavaa hyötyä liiketoiminnalle. Tämä lähestymistapa minimoisi riskejä ja rakentaisi luottamusta teknologian kehittämiseen.</p>
            <div>
              <span className="chip">Innovatiivinen</span>
              <span className="chip">Analyyttinen</span>
              <span className="chip">Muutosjohtaja</span>
              <span className="chip">Asiakaskokemus edellä</span>
            </div>
          </section>
        </main>

        <footer className="wrap cv-footer" role="contentinfo">
          <small>&copy; <span id="y">{year}</span> Panu Murtokangas • Web‑CV Humm Groupille. Teema: darkblue.</small>
        </footer>

        <button className="toTop" id="toTop" aria-label="Takaisin alkuun" data-testid="back-to-top">
          ▲
        </button>
      </div>
    </>
  );
}