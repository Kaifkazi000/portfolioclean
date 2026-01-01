"use client";

import CertificationIcon from "./CertificationIcon";
import { useTheme } from "../contexts/ThemeContext";

export default function Certifications() {
  const { theme } = useTheme()
  const dark = theme === "dark"
  return (
    <section id="certifications" className="py-16 px-4">
      <h2 className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-8 text-center ${dark ? "text-white" : "text-white"}`}>
        Certifications / Badges
      </h2>

      <div className={`grid grid-cols-4 md:grid-cols-4 gap-6 am:gap-6 md-gap-8 1g: gap-1 md:gap-10 lg:gap-12 max-w-4xl mx-auto place-items-center`}>
        <CertificationIcon
        name="navodita"
        link="navodita.pdf"
        imageSrc="navodita.webp"/>

        <CertificationIcon
          name="Assureme"
          link="https://www.linkedin.com/in/kaifkazi000?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
          imageSrc="asureme.jpg"
          ></CertificationIcon>
          <CertificationIcon
          name="code unnati"
          link="codeunnaticrt.pdf"
          imageSrc="codeunnati.png"
          ></CertificationIcon>
          <CertificationIcon name="Microsoft Learn" 
          link = "https://learn.microsoft.com/en-us/users/kaifkazi-9562/achievements"
          imageSrc="images5.png" ></CertificationIcon>
        <CertificationIcon name="apna collage" 
          link = "apnacollage.pdf"
          imageSrc="apnacollage.png" ></CertificationIcon>
          
      </div>
    </section>
  );
}
