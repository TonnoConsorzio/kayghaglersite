import { BookOpen, Truck, ShieldCheck, Brain } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import translations from '../data/translations.json';

export default function Features() {
  const { language } = useLanguage();
  const t = translations[language].features;

  const features = [
    { icon: <BookOpen size={19} aria-hidden="true" />, label: t.content },
    { icon: <Truck size={19} aria-hidden="true" />, label: t.shipping },
    { icon: <Brain size={19} aria-hidden="true" />, label: t.knowledge },
    { icon: <ShieldCheck size={19} aria-hidden="true" />, label: t.secure }
  ];

  return (
    <section className="features reveal delay-200">
        <div className="features-grid">
            {features.map((feature, i) => (
                <div key={i} className="feature-item">
                    <div className="feature-icon">
                        {feature.icon}
                    </div>
                    <span>{feature.label}</span>
                </div>
            ))}
        </div>
    </section>
  );
}
