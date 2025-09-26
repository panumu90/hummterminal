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
          --brand-2: #1e90ff;
          --muted: #a8b3cf;
          --txt: #e8efff;
          --shadow: 0 10px 30px rgba(15,31,70,.35);
          --radius: 18px;
          --ring: 0 0 0 3px rgba(30,144,255,.35);
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
              <p>Olen nyt perehtynyt syvällisesti humm group oy:n toimintaan, sen liiketoiminnallisiin tunnuslukuihin, kilpailijoihin ja pohtinut minkalaista arvoa voisin yritykselle tuoda, vai voisinko ollenkaan...</p>
              <p>Erikoisosaamiseni keskittyy kahteen avainasaan: <strong>järjestelmäintegraatioihin</strong> ja <strong>tekoälyn strategiseen hyödyntämiseen</strong> organisaatiossa. Hallitsen API-integraatiot, CRM-järjestelmien kytkennät, automaatiotyökalut ja datan siirtämisen eri järjestelmien välillä saumattomasti.</p>
              <p>Tekoälyosaamiseni kattaa GPT-mallien hyödyntämisen, embedding-teknologiat, RAG (Retrieval-Augmented Generation) -arkkitehtuurit ja fine-tuning-prosessit. Osaan rakentaa AI-strategioita, implementoida niitä käytännössä ja mitata niiden liiketoimintavaikutuksia. Tämä sovellus toimii konkreettisena näyttönä kyvyistäni.</p>
              <p>Usean vuoden kokemus suurien pörssiyhtiöiden seuraamisesta ja analysoimisesta antaa minulle pohjaa ja ymmärrystä, kuinka menestyneitä organisaatioita johdetaan.</p>
              <p>Lähestymistapani liiketoimintaan on Steve Jobsin kaltainen, asiakaskokemus edellä , teknologia seuraa perästä (mutta en ole aivan yhtä mulkku. Olen oikeasti ihan hyvä tyyppi.) Minulla on nyt selkeä visio, kuinka lähtisin hoitamaan tech lead -roolia.</p>
              <p>Haluan olla mukana jossain merkityksellisessä ja luoda oikeaa arvoa, siksi haen tähän tehtävään. Koen, että pystyn toimialan ulkopuolelta, mutta siihen nyt perehtyneenä tarjoamaan ajatuksia ja roadmappeja hummille, joihin muut eivät kykene.</p>
              <p>Yrityksen talousluvut eivät ole erityisen vahvat, mutta tase on vahva</p>
              <p>Kilpailijoihin perehtyessäni huomasin, että monet hyödyntävät jo tekoälyä ja automaatiota → voisinko tuoda arvoa tuomalla tähän käytännön osaamista?</p>
              <p>Arvoa voisin ehkä tuoda ainakin kolmella tavalla: (1) tehokkuuden parantaminen, (2) uusien palvelumallien ideointi, (3) asiakaskokemuksen kehittäminen teknologian avulla.</p>
              <p>Tulen täysin toisesta maailmasta ja luulen, että juuri jotain uutta Humm kaipaakin</p>
              <h3>Henkilökohtaiset ominaisuudet</h3>
              <p><strong>profiili:</strong></p>
              <ul>
                <li>Innovatiivisuus ja uteliaisuus uusia teknologioita kohtaan</li>
                <li>Ongelmanratkaisukyky ja analyyttinen ajattelu</li>
                <li>Itseohjautuvuus ja proaktiivisuus</li>
                <li>Joustavuus ja sopeutumiskyky</li>
                <li>Kyky johtaa ja kehittää tiimiä</li>
                <li>Muutosjohtamisen taidot</li>
              </ul>
              <h3>Miksi nämä ominaisuudet ovat tärkeitä:</h3>
              <ul>
                <li>Tekoälyala kehittyy nopeasti, joten jatkuva oppiminen on välttämätöntä</li>
                <li>Pienessä yrityksessä on usein monimutkaisia ongelmia, jotka vaativat luovia ratkaisuja</li>
                <li>Resurssipula edellyttää itseohjautuvuutta ja kykyä toimia itsenäisesti</li>
                <li>Nopeasti muuttuvassa ympäristössä joustavuus on valttia</li>
                <li>Tiimin johtaminen ja kehittäminen ovat keskeisiä, jotta uudet teknologiat saadaan vietyä käytäntöön</li>
                <li>Muutosjohtamisen avulla voidaan hallita siirtymää kohti tekoälyn hyödyntämistä ilman, että henkilöstö kokee liiallista epävarmuutta</li>
              </ul>
            </div>
          </section>

          <section className="section card pad collapsible-section" aria-labelledby="h-rooli">
            <h2 id="h-rooli">Tech Lead -rooli</h2>
            <div className="collapsible-content collapsed" data-section="rooli">
              <div className="preview-content">
                <p>Rooli on erityisen vaativa, koska Humm Group on pieni yritys, joka on vasta aloittamassa tekoälymatkaansa. Tech Leadin on oltava sekä tekninen asiantuntija että strateginen ajattelija...</p>
              </div>
              <div className="full-content">
                <p>Rooli on erityisen vaativa, koska Humm Group on pieni yritys, joka on vasta aloittamassa tekoälymatkaansa. Tech Leadin on oltava sekä tekninen asiantuntija että strateginen ajattelija, joka pystyy rakentamaan tekoälyosaamista yritykseen käytännössä.</p>
                <h3>Jatkuva kehitys - elinehto AI-maailmassa</h3>
                <p>Tekoälyala kehittyy eksponentiaalisesti. Jatkuva oppiminen ja kehittyminen eivät ole vain hyviä ominaisuuksia - ne ovat <strong>elinehtoja</strong> Tech Leadille AI-maailmassa. Seuraan aktiivisesti alan tutkimusta, kokeilen uusia teknologioita, osallistun AI-yhteisöihin ja teen jatkuvasti proof-of-concept -toteutuksia. Tämä varmiistaa, että Humm Group pysyy teknologisen kehityksen kärjessä.</p>
                <ul>
                  <li>Asiakaskokemuksen konsultointi ja asiakaspalvelun ulkoistus ovat alueita, joilla tekoäly voi tuottaa merkittävää arvoa</li>
                  <li>Korkea henkilöstökustannusosuus (tyypillisesti 60-70% palveluyrityksissä) tarkoittaa, että automoinnilla on suuri potentiaali</li>
                  <li>Asiakaspalvelun laadun parantaminen tekoälyllä voi suoraan vaikuttaa asiakastyytyväisyyteen ja säilyttämiseen</li>
                  <li>Hummin täytyy kuitenkin säilyttää "oman brändinsä värit", eli yhdistelmä inhimillisyydestä ja teknologiasta</li>
                  <li>Humm Groupin ydinliiketoiminta on asiakaskokemuksen parantaminen, joten Tech Leadin on ymmärrettävä tätä liiketoimintaa syvällisesti</li>
                  <li>Teknologian on tuotettava mitattavaa arvoa asiakkaille ja yritykselle, pelkkä hype ei riitä</li>
                  <li>Tech Leadin on kyettävä yhdistämään teknologinen ratkaisu liiketoiminnan tavoitteisiin (samat kpi:t?)</li>
                </ul>
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
                <h3>Kommunikointi ja läpinäkyvyys</h3>
                <ul>
                  <li>Pidä säännöllisiä palavereita johdon ja tiimin kanssa</li>
                  <li>Jaa tietoa avoimesti edistymisestä ja haasteista</li>
                  <li>Varmista, että kaikki ymmärtävät tekemisen merkityksen</li>
                </ul>
                <h3>Joustavuus ja iteratiivisuus</h3>
                <ul>
                  <li>Ole valmis muuttamaan suunnitelmia tarpeen mukaan</li>
                  <li>Hyödynnä nopeita kokeiluja ja oppimista</li>
                  <li>Vältä liian suuria ja hitaita hankkeita alussa</li>
                </ul>
                <h3>Liiketoiminnan arvon tuottaminen</h3>
                <ul>
                  <li>Keskity hankkeisiin, jotka tuottavat nopeasti arvoa</li>
                  <li>Varmista, että teknologian investoinnit tuottavat ROI:a</li>
                  <li>Mittaa ja viesti liiketoiminnallisia vaikutuksia</li>
                </ul>
                <h3>Kulttuurin muutos</h3>
                <ul>
                  <li>Tue tekoälyosaamisen kehittämistä koko organisaatiossa</li>
                  <li>Varmista, että teknologia ei ole itseisarvo vaan työkalu</li>
                  <li>Rakenna kokeilukulttuuria ja jatkuvaan oppimiseen</li>
                </ul>
                <p>Tämä lähestymistapa mahdollistaa systemaattisen ja hallitun lähdön Tech Lead -rooliin, jossa uusi johtaja ehtii ensin ymmärtää yrityksen ja sen tarpeet ennen kuin ryhtyy tekemään suuria muutoksia. Samalla se varmistaa, että ensimmäiset toimenpiteet tuottavat nopeasti arvoa ja vahvistavat luottamusta teknologian kehittämiseen.</p>
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
                <p>Tech Lead -rooli on strategisesti tärkeä Humm Group Oy:lle tekoälyn hyödyntämisessä ja kilpailuedun saavuttamisessa. Onnistunut Tech Lead pystyy yhdistämään teknologisen osaamisen, liiketoimintaymmärryksen ja johtamistaidot.</p>
                <p>Tekoälyn strateginen hyödyntäminen voi tuoda Humm Groupille merkittäviä hyötyjä:</p>
                <ul>
                  <li>Asiakaskokemuksen parantaminen</li>
                  <li>Operatiivisen tehokkuuden lisääminen</li>
                  <li>Uusien palveluiden kehittäminen</li>
                  <li>Päätöksenteon tukeminen</li>
                </ul>
                <p>Seurattava dashboard on tärkeä työkalu Tech Leadille, joka mahdollistaa strategian ja toteutuksen jatkuvan seurannan, läpinäkyvyyden ja päätöksenteon tukemisen.</p>
                <p>Onnistunut tekoälyn käyttöönotto edellyttää selkeää strategiaa, johdon sitoutumista ja systemaattista toteutusta. Tekoälyn käyttöönotto tarjoaa Humm Group Oy:lle mahdollisuuden erottua kilpailijoista, parantaa operatiivista tehokkuutta ja luoda uusia liiketoimintamahdollisuuksia.</p>
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