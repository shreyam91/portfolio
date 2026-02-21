"use client";
import React from "react";
import { testimonials, companies } from "@/data";

const Clients = () => {
  return (
    <section id="testimonials" className="py-20 px-4">
      <h1 className="heading mb-16">
        Kind words from
        <span className="text-purple"> satisfied clients</span>
      </h1>

      <div className="max-w-4xl mx-auto">
        {testimonials.length === 1 ? (
          // Single testimonial - centered and modern
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative group">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              
              {/* Main testimonial card */}
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-white/10 rounded-3xl p-12 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                
                {/* Quote icon */}
                <div className="mb-6">
                  <svg className="w-12 h-12 text-blue-400 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4.817v10.609h-10.8zm-13.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4.9v10.609h-10.901z"/>
                  </svg>
                </div>

                {/* Testimonial content */}
                <blockquote className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 font-light">
                  "{testimonials[0].quote}"
                </blockquote>

                {/* Author info */}
                <div className="flex items-center justify-between">
                  <div>
                    <cite className="text-white font-semibold text-lg not-italic">
                      {testimonials[0].name}
                    </cite>
                    <p className="text-blue-300 text-sm mt-1">
                      {testimonials[0].title}
                    </p>
                  </div>
                  
                  {/* Decorative element with company image */}
                  <div className="relative w-16 h-16  p-0.5">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      {/* <span className="text-white font-bold text-xl z-10">
                        {testimonials[0].name.charAt(0)}
                      </span> */}
                      {companies[0] && (
                        <img 
                          src={companies[0].img} 
                          alt={companies[0].name}
                          className="absolute inset-0 w-full h-full object-cover opacity-90"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Multiple testimonials - grid layout (for future use)
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:border-white/20 transition-all duration-300">
                    <blockquote className="text-gray-300 leading-relaxed mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <cite className="text-white font-semibold not-italic">
                        {testimonial.name}
                      </cite>
                      <p className="text-blue-300 text-sm mt-1">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Clients;
