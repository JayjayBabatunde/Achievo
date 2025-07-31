import './App.css';
import Benefits from './components/landingPageComponents/Benefits';
import Nav from './components/landingPageComponents/Nav';
import Showcase from './components/landingPageComponents/Showcase';
import Features from './components/landingPageComponents/Features'


function App() {
  return (
    <div className="h-screen overflow-x-hidden flex flex-col">
      <div className="relative min-h-[100vh] bg-[url(/bg.jpg)] bg-cover bg-no-repeat bg-center overflow-hidden">
        <div className="absolute bg-gradient-to-b from-black/60 to-transparent -z-10"></div>

        <Nav />
        <Showcase />
      </div>


      <div className='pt-[50px]'>
        <Benefits />
      </div>
      {/* <Features /> */}
      {/* <Testimonial />
      <ContactForm />
      <Footer /> */}
    </div>
  );
}

export default App;

// https://coolors.co/gradients
