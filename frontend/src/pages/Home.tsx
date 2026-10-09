import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Review } from "@/types";
import ReviewCard from "@/components/ReviewCard";
import WhatsAppButton from "@/components/WhatsAppButton";

const FLAVOURS = [
  { name: "Chocolate Truffle", tag: "Dark cocoa, ganache-filled", cls: "f1" },
  { name: "Red Velvet", tag: "Cream cheese frosting", cls: "f2" },
  { name: "Pistachio Rose", tag: "Light, floral, nutty", cls: "f3" },
  { name: "Salted Caramel", tag: "Buttery, deep, sweet-salt", cls: "f4" },
  { name: "Black Forest", tag: "Cherries & dark chocolate", cls: "f5" },
  { name: "Lemon Blueberry", tag: "Bright, tart, summer-fresh", cls: "f6" },
];

const OCCASIONS = ["Birthdays", "Weddings", "Anniversaries", "Baby showers", "Corporate events", "Just because"];

const STEPS = [
  { num: "01", title: "Tell us the vision", body: "Flavour, size, design references, and the date you need it by." },
  { num: "02", title: "We sketch it", body: "You'll get a design mock-up and a firm quote back within 24 hours." },
  { num: "03", title: "We bake & decorate", body: "Fresh ingredients, hand-piped detail — made to order, never frozen stock." },
  { num: "04", title: "Delivered fresh", body: "Pickup or doorstep delivery, timed for the moment it's meant for." },
];

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    api
      .get("/reviews")
      .then((res) => setReviews(res.data.reviews.slice(0, 1)))
      .catch(() => setReviews([]));
  }, []);

  const featuredReview = reviews[0];

  return (
    <>
      {/* HERO */}
      <div className="wrap">
        <section className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-12 items-center py-16 md:py-20 text-center md:text-left">
          <div>
            <span className="eyebrow">Custom cakes · Baked to order</span>
            <h1 className="heading text-[38px] sm:text-[48px] lg:text-[64px] leading-[1.05] mt-4 mb-5">
              Every cake
              <br />
              <em className="not-italic font-serif italic text-berry font-semibold">tells your story.</em>
            </h1>
            <p className="text-[18px] text-ink-soft max-w-[480px] mx-auto md:mx-0 mb-8">
              Esra Cakes designs and hand-decorates custom cakes for birthdays, weddings, and everything worth
              celebrating — built around your flavours, your theme, and your date.
            </p>
            <div className="flex gap-4 flex-wrap justify-center md:justify-start">
              <Link to="/order" className="btn btn-primary">
                Start your order →
              </Link>
              <Link to="/gallery" className="btn btn-ghost">
                See past cakes
              </Link>
            </div>
            <div className="hero-stats flex gap-8 mt-11 flex-wrap justify-center md:justify-start">
              <div className="text-left">
                <b className="block font-serif text-[26px] text-berry-dark">500+</b>
                <span className="text-[13px] text-ink-soft">cakes baked</span>
              </div>
              <div className="text-left">
                <b className="block font-serif text-[26px] text-berry-dark">24 hrs</b>
                <span className="text-[13px] text-ink-soft">to get your quote</span>
              </div>
              <div className="text-left">
                <b className="block font-serif text-[26px] text-berry-dark">100%</b>
                <span className="text-[13px] text-ink-soft">made to order</span>
              </div>
            </div>
          </div>

          <div className="cake-scene" aria-hidden="true">
            <div className="plate" />
            <div className="cake">
              <div className="tier tier-1" />
              <div className="tier tier-2" />
              <div className="tier tier-3">
                <div className="candle">
                  <div className="flame" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PROCESS */}
      <div className="wrap">
        <section className="bg-paper rounded-[32px] py-14 px-6 sm:px-10 my-6" id="process">
          <div className="section-head mx-auto md:mx-0">
            <span className="eyebrow">The process</span>
            <h2 className="heading">From idea to icing, in four steps.</h2>
            <p>No templates, no guesswork — every order starts with a conversation about what you actually want.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.num} className="bg-blush-soft rounded-card p-7 border border-berry-dark/[0.08]">
                <span className="font-serif italic font-semibold text-[15px] text-gold block mb-3.5">{s.num}</span>
                <h3 className="font-serif text-[19px] font-semibold text-berry-dark mb-2">{s.title}</h3>
                <p className="text-[14.5px] text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FLAVOURS */}
      <div className="wrap">
        <section className="py-16" id="flavours">
          <div className="section-head">
            <span className="eyebrow">Pick a flavour</span>
            <h2 className="heading">A starting point — every cake is built from here.</h2>
            <p>Mix, match, or bring your own combination. These are the six our customers reorder most.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FLAVOURS.map((f) => (
              <div key={f.name} className={`flavour-card ${f.cls}`}>
                <h3 className="text-white text-[20px] font-semibold mb-1">{f.name}</h3>
                <span className="text-[13px] opacity-85">{f.tag}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* OCCASIONS */}
      <div className="wrap">
        <section className="py-8">
          <div className="occasions-band rounded-[32px] py-14 px-6 sm:px-10 text-center">
            <span className="eyebrow" style={{ color: "var(--gold)" }}>
              Made for the moment
            </span>
            <h2 className="heading text-cream text-[28px] sm:text-[36px] lg:text-[42px] mt-3.5 mb-7">
              Whatever you're celebrating, there's a cake for it.
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {OCCASIONS.map((o) => (
                <span key={o} className="chip">
                  {o}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* TRUST / REVIEWS */}
      <div className="wrap">
        <section className="py-16" id="trust">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-10 items-center">
            <div>
              <p className="font-serif italic text-[22px] sm:text-[28px] text-berry-dark leading-snug">
                "
                {featuredReview
                  ? featuredReview.message
                  : "We sent a blurry photo of my daughter's favourite cartoon and Esra Cakes turned it into the actual cake — down to the colours. It didn't taste like a bakery cake either, it tasted homemade."}
                "
              </p>
              <p className="mt-4 text-[14px] text-ink-soft not-italic font-sans">
                — {featuredReview ? featuredReview.name : "A repeat customer, third order this year"}
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="card-surface p-5">
                <b className="font-serif text-[28px] text-berry block">4.9 / 5</b>
                <span className="text-[13.5px] text-ink-soft">average customer rating</span>
              </div>
              <div className="card-surface p-5">
                <b className="font-serif text-[28px] text-berry block">48 hrs</b>
                <span className="text-[13.5px] text-ink-soft">minimum notice for standard orders</span>
              </div>
              <div className="card-surface p-5">
                <b className="font-serif text-[28px] text-berry block">0</b>
                <span className="text-[13.5px] text-ink-soft">pre-made stock — everything is baked fresh per order</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="wrap">
        <section className="py-8 pb-16">
          <div className="cta-block rounded-[32px] py-16 px-6 sm:px-12 text-center text-cream">
            <span className="eyebrow" style={{ color: "var(--gold)" }}>
              Ready when you are
            </span>
            <h2 className="heading text-cream text-[28px] sm:text-[36px] lg:text-[42px] my-4">Let's design your cake.</h2>
            <p className="text-cream/85 max-w-[480px] mx-auto mb-8 text-[16px]">
              Tell us your flavour, occasion, and date — we'll come back with a design and a quote within a day.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <WhatsAppButton
                className="btn"
                message="Hi Esra Cakes! I'd like to start a custom cake order."
              >
                <span style={{ background: "var(--gold)", color: "var(--berry-dark)", boxShadow: "0 10px 24px -10px rgba(200,155,60,.6)" }} className="px-6 py-3.5 rounded-full font-bold text-[15px] inline-flex items-center">
                  Message us on WhatsApp
                </span>
              </WhatsAppButton>
              <Link to="/gallery" className="btn btn-ghost !border-cream/40 !text-cream hover:!bg-cream/10">
                View full gallery
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
