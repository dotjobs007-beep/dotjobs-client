import Footer from "@/Component/Footer/Footer";
import Category from "@/Component/Landing/Category";
import Hero from "@/Component/Landing/Hero";

export default function Home() {
  return (
    <>
      <div className="lg:px-[6rem] px-4 mb-20">
        <Hero />
        <Category />
        {/* <Authentication /> */}
      </div>{" "}
    </>
  );
}
