import React from 'react';

export default function About() {
  return (
    <section className="py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="reveal">
                <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-8">About Us</h2>
                <p className="text-sm font-medium text-white/40 mb-8 border-l-2 border-brand pl-4">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
                <div className="space-y-6 text-white/60 text-sm leading-relaxed">
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                    <p>
                        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets.
                    </p>
                </div>
            </div>

            {/* Image Composition */}
            <div className="reveal delay-100 relative">
                <div className="absolute -top-4 -right-4 w-24 h-48 bg-brand rounded-r-2xl z-0"></div>
                <div className="relative z-10 rounded-2xl overflow-hidden h-[500px]">
                    <img 
                      src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/8a7b8eac-464a-490c-a52e-814cce537a55_3840w.jpg" 
                      alt="Man with bag" 
                      className="cursor-pointer w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                      onClick={() => window.location.href='https://instasize.com/p/2a4be630c9b4c1b0c111ff8079f212f216f0fc4cede39ecb8a0b3f181ea417e0'} 
                      role="button" 
                      tabIndex={0} 
                    />
                </div>
            </div>
        </div>
    </section>
  );
}
