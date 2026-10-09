import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Review } from "@/types";
import ReviewCard from "@/components/ReviewCard";
import WhatsAppButton from "@/components/WhatsAppButton";

const VALUES = [
  {
    title: "Nothing pre-made",
    body: "Every cake is baked to order, from scratch — no frozen stock, no shortcuts, ever.",
  },
  {
    title: "Built around you",
    body: "We design from your reference photos and ideas, not a catalogue of fixed templates.",
  },
  {
    title: "Fast, honest quotes",
    body: "A firm quote within 24 hours, with no hidden costs added later.",
  },
];

export default function About() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    api
      .get("/reviews")
      .then((res) => setReviews(res.data.reviews.slice(0, 3)))
      .catch(() => setReviews([]));
  }, []);

  return (
    <div>
      {/* Our Story */}
      <div className="wrap py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow">Our story</span>
            <h1 className="heading text-[32px] sm:text-[42px] mt-3 mb-5">Baked from a home kitchen, built on referrals.</h1>
            <p className="text-ink-soft leading-relaxed mb-4">
              Esra Cakes started the way most good bakeries do — with one cake for a friend's birthday, made because
              a store-bought one wasn't going to cut it. That cake led to another, then a wedding order, then a
              waitlist.
            </p>
            <p className="text-ink-soft leading-relaxed">
              Today we still work the same way: every order is a conversation first, a cake second. No templates, no
              guesswork — just your flavours, your theme, and your date, baked fresh.
            </p>
          </div>
          <div className="cake-scene !h-[360px]" aria-hidden="true">
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
        </div>
      </div>

      {/* Why Esra Cakes */}
      <div className="wrap">
        <section className="bg-paper rounded-[32px] py-14 px-6 sm:px-10 mb-8">
          <div className="section-head">
            <span className="eyebrow">Why Esra Cakes</span>
            <h2 className="heading">Three things we don't compromise on.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-blush-soft rounded-card p-6 border border-berry-dark/[0.08]">
                <h3 className="font-serif text-[18px] font-semibold text-berry-dark mb-2">{v.title}</h3>
                <p className="text-[14.5px] text-ink-soft">{v.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Baking philosophy + fresh ingredients */}
      <div className="wrap py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-surface p-7">
            <span className="eyebrow">Our philosophy</span>
            <h3 className="font-serif text-[22px] font-semibold text-berry-dark mt-2 mb-3">Flavour first, decoration second.</h3>
            <p className="text-[14.5px] text-ink-soft leading-relaxed">
              A beautiful cake that doesn't taste good is a missed opportunity. We test every flavour combination
              before it goes on the menu, and every custom request gets a real tasting conversation, not a guess.
            </p>
          </div>
          <div className="card-surface p-7">
            <span className="eyebrow">Fresh ingredients</span>
            <h3 className="font-serif text-[22px] font-semibold text-berry-dark mt-2 mb-3">Sourced, not stockpiled.</h3>
            <p className="text-[14.5px] text-ink-soft leading-relaxed">
              Butter, cream, and fruit are bought fresh for each week's orders. Nothing sits in a freezer waiting to
              be used — if it's in your cake, it was bought for your cake.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      {reviews.length > 0 && (
        <div className="wrap py-8">
          <div className="section-head">
            <span className="eyebrow">In their words</span>
            <h2 className="heading">What customers say.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="wrap py-8 pb-16">
        <div className="cta-block rounded-[32px] py-16 px-6 sm:px-12 text-center text-cream">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>
            Let's talk cake
          </span>
          <h2 className="heading text-cream text-[28px] sm:text-[36px] my-4">Ready to design yours?</h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/order" className="btn btn-primary">
              Start your order →
            </Link>
            <WhatsAppButton className="btn btn-ghost !border-cream/40 !text-cream hover:!bg-cream/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
