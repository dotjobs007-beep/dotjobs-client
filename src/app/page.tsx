import Authentication from "@/Component/Authentication";
import Footer from "@/Component/Footer/Footer";
import Category from "@/Component/Landing/Category";
import Hero from "@/Component/Landing/Hero";

export default function Home() {
  return (
    <>
      <div className="lg:px-15 px-4">
        <Hero />
        <Category />
        {/* <Authentication /> */}
      </div>
      <Footer />
    </>
  );
}
