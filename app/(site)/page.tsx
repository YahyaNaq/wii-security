import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Services from "../components/sections/Services";
import HowItWorks from "../components/sections/HowItWorks";
import Cities from "../components/sections/Cities";
import Gallery from "../components/sections/Gallery";
import Testimonials from "../components/sections/Testimonials";
import Faqs from "../components/sections/Faqs";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Testimonials />
      <HowItWorks />
      <Cities />
      <Faqs limit={5} />
    </>
  );
}
