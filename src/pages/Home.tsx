import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Headline, Copy, Button, Spacer, Grid, TeaserTextImage } from '../components/NEWComponents';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--new-neutral-50)', padding: '80px 0' }}>
        <div className="container">
          <Grid>
            <div className="col-span-6 col-span-full-md">
              <Headline variant="v1">Sicher. Zuverlässig. <span style={{ color: 'var(--new-primary)' }}>NEW</span>.</Headline>
              <Copy variant="intro">
                Wir sind Ihr Partner für Energie, Wasser und Mobilität in der Region. 
                Mit unserem neuen Schadensportal können Sie Vorfälle schnell und unkompliziert melden.
              </Copy>
              <Spacer size={32} />
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button variant="primary" onClick={() => navigate("/new-report")}>Schaden melden</Button>
                <Button variant="secondary" onClick={() => navigate("/login")}>Zum Dashboard</Button>
              </div>
            </div>
            <div className="col-span-6 col-span-full-md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '10rem' }}>🏢</div>
            </div>
          </Grid>
        </div>
      </section>

      <Spacer size={64} />

      {/* Features Section */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <Headline variant="v2">Unser Service für Sie</Headline>
          <Copy variant="medium">
            Die NEW Gruppe steht für Qualität und Kundennähe. Unser digitales Schadensportal 
            ermöglicht eine transparente und effiziente Abwicklung Ihrer Anliegen.
          </Copy>
        </div>

        <Spacer size={48} />

        <Grid>
          <div className="col-span-4 col-span-full-sm card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚡</div>
            <Headline variant="h3">Strom & Energie</Headline>
            <Copy>Störungen im Stromnetz oder an Verteilerkästen können Sie hier direkt melden.</Copy>
          </div>
          <div className="col-span-4 col-span-full-sm card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💧</div>
            <Headline variant="h3">Wasserversorgung</Headline>
            <Copy>Rohrbrüche oder Unregelmäßigkeiten in der Wasserqualität werden priorisiert behandelt.</Copy>
          </div>
          <div className="col-span-4 col-span-full-sm card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💡</div>
            <Headline variant="h3">Beleuchtung</Headline>
            <Copy>Defekte Straßenlaternen können Sie präzise lokalisieren und an uns übermitteln.</Copy>
          </div>
        </Grid>
      </section>

      <Spacer size={64} />

      {/* Teaser Section */}
      <section className="container">
        <TeaserTextImage 
          title="Digital & Effizient"
          text="Verfolgen Sie den Status Ihrer Meldung in Echtzeit. Unser Team wird automatisch benachrichtigt und leitet die notwendigen Schritte ein."
          imageSrc="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80"
          imageAlt="Techniker bei der Arbeit"
          ctaText="Jetzt starten"
          onCtaClick={() => navigate("/login")}
        />
        
        <TeaserTextImage 
          title="Für die Region"
          text="Als lokaler Versorger liegt uns das Wohl unserer Kunden am Herzen. Wir arbeiten täglich daran, die Infrastruktur in Ihrer Nähe zu verbessern."
          imageSrc="https://images.unsplash.com/photo-1573164067505-19a2779c73b2?auto=format&fit=crop&w=800&q=80"
          imageAlt="Moderne Stadtlandschaft"
          reverse={true}
        />
      </section>

      <Spacer size={64} />

      {/* CTA Section */}
      <section style={{ backgroundColor: 'var(--new-primary)', padding: '64px 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <Headline variant="v2" style={{ color: 'white' }}>Helfen Sie mit, unsere Stadt sicher zu machen.</Headline>
          <Copy variant="medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Jede Meldung zählt. Gemeinsam sorgen wir für eine funktionierende Infrastruktur.
          </Copy>
          <Spacer size={32} />
          <Button variant="secondary" style={{ borderColor: 'white', color: 'white' }} onClick={() => navigate("/new-report")}>
            Jetzt Schaden melden
          </Button>
        </div>
      </section>
    </div>
  );
}
