"use client";

import { motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Faut-il avoir de l'expérience en artisanat ou en résine pour participer ?",
    a: "Non, aucune expérience préalable n'est requise. La formation est conçue pour démarrer de zéro et vous emmener jusqu'à un niveau professionnel. Notre format intensif sur 3 jours est structuré pour permettre à chaque participant, quel que soit son niveau de départ, de produire des créations commercialisables dès la fin de la formation. Nous couvrons les bases techniques, les bonnes pratiques de sécurité, les erreurs à éviter, puis les techniques avancées et les astuces de finition.",
  },
  {
    q: "Le matériel est-il fourni pendant la formation ?",
    a: "Oui, tout le matériel nécessaire (résine époxy, colorants, moules, outils, supports) est inclus dans le tarif de la formation complète. Vous n'avez besoin d'apporter que vous-même, votre créativité, et éventuellement un carnet pour prendre des notes. Les créations que vous réaliserez pendant les ateliers pratiques sont à vous et vous les emporterez à la fin.",
  },
  {
    q: "Que se passe-t-il si je ne peux pas venir aux dates prévues ?",
    a: "Si vous êtes dans l'incapacité de venir, contactez-nous au plus tôt via WhatsApp ou par email. Selon le délai de prévenance, nous pourrons soit reporter votre inscription à une prochaine session, soit vous rembourser partiellement. Les frais d'inscription (5 000 FCFA) ne sont pas remboursables car ils servent à réserver votre place. Les frais de formation complets sont remboursables à hauteur de 70 % si l'annulation est faite au moins 7 jours avant le début de la formation.",
  },
  {
    q: "L'attestation de participation est-elle reconnue ?",
    a: "L'attestation de participation est délivrée par Zohar Décor et atteste que vous avez suivi avec succès la formation professionnelle en résine époxy. Elle précise les modules couverts, la durée de la formation (3 jours intensifs) et les techniques maîtrisées. Bien qu'il ne s'agisse pas d'un diplôme d'État, elle constitue un sérieux atout pour votre CV, vos demandes de financement, votre communication commerciale et la crédibilité de votre future activité artisanale.",
  },
  {
    q: "Comment fonctionne le paiement en plusieurs étapes ?",
    a: "Le processus est simple : vous remplissez d'abord le formulaire d'inscription, puis vous choisissez votre formule de paiement. Vous pouvez payer soit les 5 000 FCFA d'inscription seule (pour réserver votre place), soit les 25 000 FCFA pour l'inscription et la formation complète. Le paiement se fait via FeexPay, qui accepte MTN MoMo, Moov Money, Celtiis Cash et les cartes bancaires. Vous recevez instantanément un reçu par email et un message WhatsApp de confirmation avec votre numéro d'inscription.",
  },
  {
    q: "Que se passe-t-il après la formation ?",
    a: "Après la formation, vous bénéficiez d'un suivi d'un mois pendant lequel vous pouvez poser des questions, partager vos créations et recevoir des conseils. Vous repartez avec un support de cours complet, vos créations, votre attestation, et surtout une expertise concrète pour démarrer votre activité. Nous vous orientons également sur les fournisseurs de matériel au Bénin, les prix à pratiquer, les canaux de vente (WhatsApp, Instagram, marchés artisanaux) et les démarches pour officialiser votre micro-entreprise.",
  },
  {
    q: "Combien de places sont disponibles et pourquoi limiter à 10 ?",
    a: "Nous limitons volontairement la session à 10 places pour garantir un encadrement personnalisé et de qualité. La résine époxy demande de la précision, de la patience et un suivi individuel, surtout pendant les ateliers pratiques. Avec un petit groupe, chaque participant reçoit l'attention nécessaire, peut poser toutes ses questions, et repart avec des créations dont il est vraiment fier. C'est aussi ce qui rend cette formation premium et justifie l'investissement.",
  },
  {
    q: "Puis-je payer en plusieurs fois pour la formation complète ?",
    a: "Pour la session 2026, le règlement complet est demandé à l'inscription. Toutefois, si vous avez un projet sérieux et des contraintes de trésorerie, contactez-nous directement par WhatsApp : nous étudions au cas par cas la possibilité d'un échelonnement (50 % à l'inscription, 50 % au premier jour de la formation). Cette option est soumise à acceptation et ne s'applique qu'aux dossiers complets et motivés.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-beige/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blanc premium-shadow mb-4">
            <HelpCircle className="w-7 h-7 text-[#C9A227]" />
          </div>
          <p className="text-xs font-medium text-[#C9A227] tracking-[0.3em] uppercase mb-3">
            Questions fréquentes
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-noir mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Vous avez des questions ?
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Tout ce que vous devez savoir avant de vous inscrire. Si votre
            question n'est pas listée ci-dessous, contactez-nous directement par
            WhatsApp ou par email — nous répondons généralement sous 24 heures.
          </p>
          <div className="section-divider w-32 mx-auto mt-6" />
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="bg-blanc rounded-2xl premium-shadow border border-beige px-6 data-[state=open]:border-[#C9A227]/40"
                >
                  <AccordionTrigger className="text-left text-noir font-semibold hover:no-underline py-5 text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
