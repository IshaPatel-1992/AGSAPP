import React from 'react';
import aboutImage from '../assets/AboutUs/Team1.jpg';
import UIButton from '../components/ui/UIButtons';

export default function AboutSection() {
return ( <section id="aboutsection" className="py-24 px-6 bg-white"> <div className="max-w-6xl mx-auto text-center lg:text-left">
    {/* Heading */}
    <h2 className="text-3xl md:text-5xl lg:text-6xl mb-16 font-heading font-extrabold text-brand-maple">
      About Us
    </h2>

    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

      {/* Text */}
      <div className="lg:w-1/2 space-y-6 text-justify lg:text-justify animation-fadeIn">
        <p className="text-base md:text-lg leading-relaxed text-brand-text max-w-prose mx-auto lg:mx-0">
          <strong className="text-brand-saffron">Airdrie Gujarati Samaj</strong> is a nonprofit cultural
          and charitable association dedicated to promoting <strong>community spirit</strong>,
          preserving <strong>Gujarati heritage</strong>, and fostering a welcoming environment for families.
        </p>

        <p className="text-base md:text-lg leading-relaxed text-brand-text max-w-prose mx-auto lg:mx-0">
          We organize <strong>festivals, workshops, cultural performances</strong>, and
          <strong> community gatherings</strong> throughout the year—bringing people together,
          supporting newcomers, and strengthening our community bonds.
        </p>

        <p className="text-base md:text-lg leading-relaxed text-brand-text max-w-prose mx-auto lg:mx-0">
          Our initiatives also promote <strong>education</strong>, <strong>social welfare</strong>,
          and collaboration with other cultural organizations, helping create a connected and engaged community.
        </p>

        <p className="text-base md:text-lg leading-relaxed text-brand-text max-w-prose mx-auto lg:mx-0">
          Our mission is to inspire <strong>belonging, pride, and cultural appreciation</strong> within
          the Gujarati and Airdrie communities. Join us in celebrating tradition, building unity, and
          creating a bright cultural future.
        </p>
      </div>

      {/* Image */}
      <div className="lg:w-1/2 flex justify-center">
        <img
          src={aboutImage}
          alt="Gujarati Community"
          loading="lazy"
          className="rounded-3xl shadow-xl object-cover w-full max-w-[550px] h-auto transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>

    {/* CTA */}
    <div className="bg-gradient-to-r from-brand-mint to-brand-cream p-8 rounded-3xl shadow-2xl mt-24 space-y-6 w-full">
      <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-brand-maple">
        Become a Member
      </h3>

      <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
        Ready to join? Enjoy exclusive events, cultural programs, and community benefits.
      </p>

      <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
        <UIButton to="/membershipinfo" variant="saffron">Join Us</UIButton>
        <UIButton to="/ourteam" variant="green">Our Team</UIButton>
      </div>
    </div>
  </div>
</section>

);
}
