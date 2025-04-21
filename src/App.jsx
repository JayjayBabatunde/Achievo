import './App.css';
import ContactForm from './components/ContactForm';
import Features from './components/Features';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Showcase from './components/Showcase';
import Testimonial from './components/Testimonial';

function App() {
  return (
    <div className="h-screen overflow-x-hidden flex flex-col">
      <Nav />
      <Showcase />
      <Features />
      <Testimonial />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
