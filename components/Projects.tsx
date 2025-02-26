"use client";

import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image";  // Import the Image component

import { projects } from "@/data";
import { PinContainer } from "./ui/Pin";

const Projects = () => {
  return (
    <div id="projects" className="py-20">
      <h1 className="heading">
        A small section of{" "}
        <span className="text-purple"> Projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map((item) => (
          <div
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
            key={item.id}
          >
            <PinContainer title="https://github.com/shreyam91">
              <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                <div
                  className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                  style={{ backgroundColor: "#13162D" }}
                >
                  <Image
                    src="/bg.png"
                    alt="background image"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-50" // Add any styles you want
                  />
                </div>
                <Image
                  src={item.img}
                  alt="cover"
                  width={500} // Set width based on design
                  height={300} // Set height based on design
                  className="z-10 absolute bottom-0"
                />
              </div>

              <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {item.title}
              </h1>

              <p
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {item.des}
              </p>

              <div className="flex items-center justify-between mt-7 mb-3">
                <div className="flex items-center">
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <Image
                        src={icon}
                        alt="icon"
                        width={24} // Set width for icons
                        height={24} // Set height for icons
                        className="p-2"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center">
                  <a
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                   >
                    <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                      Check Live Code
                    </p>
                  </a>
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
