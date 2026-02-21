export const navItems = [
    { name: "Home", link: "#home" },
    { name: "About", link: "#about" },
    { name: "Projects", link: "#projects" },
    { name: "Testimonials", link: "#testimonials" },
    { name: "Contact", link: "#contact" },
    { name: "Blog", link: "/blog" },
    { name: "Photos", link: "/photos" },
  ];
  
  export const gridItems = [
    {
      id: 1,
      title: "I prioritize project deadline and try to give my best in every project.",
      description: "",
      className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
      imgClassName: "w-full h-full",
      titleClassName: "justify-end",
      img: "/b1.svg",
      spareImg: "",
    },
    {
      id: 2,
      title: "I'm very flexible with time zone communications",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "",
      spareImg: "",
    },
    {
      id: 3,
      title: "My tech stack",
      description: "I constantly try to improve",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-center",
      img: "",
      spareImg: "",
    },
    {
      id: 4,
      title: "Tech enthusiast with a passion for development.",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "/grid.svg",
      spareImg: "/b4.svg",
    },
  
    {
      id: 5,
      title: "Currently building a personal project",
      description: "Task Management",
      className: "md:col-span-3 md:row-span-2",
      imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
      titleClassName: "justify-center md:justify-start lg:justify-center",
      img: "/b5.svg",
      spareImg: "/grid.svg",
    },
    {
      id: 6,
      title: "Collabrate",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-center md:max-w-full max-w-60 text-center",
      img: "",
      spareImg: "",
    },
  ];
  
  export const projects = [
    {
      id: 1,
      title: "HerbalMG - Medical eCommerce Platform",
      tech:"Javascript, React, Node.js, Express, PostgreSQL",
      des: "HerbalMG is a full-stack medical eCommerce platform designed to provide users with a seamless and secure way to purchase healthcare and herbal products online. The platform focuses on performance, scalability, and user-friendly design while ensuring secure transactions and smooth order management. I developed the complete system from frontend to backend, including payment processing and third-party service integrations.",
      img: "/herbalmgName.png",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg"],
      github: "https://github.com/shreyam91/herbal-mg",
      liveLink:"https://herbalmg.com/",
    },
    // {
    //   id: 2,
    //   title: "Real-time Tracker",
    //   tech:"Javascript, Socket.io",
    //   des: "A real-time tracker is a tool or system that provides live, up-to-date information about the status or location of an object, person, or event. It typically uses technologies like GPS, RFID, or internet connectivity to monitor and display data continuously. Real-time trackers are commonly used for fleet management, logistics, asset tracking, and personal safety applications.",
    //   img: "/realtime-tracker.jpg",
    //   iconLists: ["/re.svg", "/tail.svg" ],
    //   github: "https://github.com/shreyam91/Realtime-Tracker",
    //   liveLink:"",
    // },
    {
      id: 3,
      title: "Task Scribe - ToDo & Note taking App",
      tech:"React,JS,Express",
      des: "This intuitive app enables seamless task organization by allowing you to create to-do lists and prioritize daily activities. With a built-in notes feature, you can capture ideas, reminders, and detailed task descriptions in one convenient location. The integrated AI also offers helpful suggestions for various tasks.",
      img: "/task.jpg",
      iconLists: ["/next.svg", "/tail.svg", "/ts.svg", ],
      github: "https://github.com/shreyam91/TaskScribe",
      liveLink:"",
    },
    {
      id: 4,
      title: "Algo-Visualizer",
      tech:"JAVA,Apache POI",
      des: "Welcome to the Algorithm Visualizer project! This is an interactive web-based tool designed to help users visualize various algorithms in computer science. The goal of this project is to provide an intuitive and engaging way to understand how different algorithms work by animating their steps and processes.",
      img: "/algo.webp",
      iconLists: ["/java.svg"],
      github: "https://github.com/shreyam91/Algo-Visualizer",
      liveLink:"",
    },
    {
      id: 5,
      title: "Remote Patient Management System",
      tech:"React,JS,Express, MongoDB",
      des: "The Remote Patient Management System (RPMS) is a web-based platform designed to manage and monitor patient health remotely. This system allows healthcare providers to monitor patient conditions, track vitals, schedule appointments, and communicate with patients from a distance. It is particularly useful for remote consultations, and managing chronic conditions where regular in-person visits are not feasible.",
      img: "/remote.png",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", ],
      github: "https://github.com/shreyam91/Remote-patient-management-system",
      liveLink:"",
    },
    {
      id: 6,
      title: "E-Commerce Website",
      tech:"React, JS, Express, MongoDB",
      des: "An eCommerce website is an online platform that allows businesses or individuals to buy and sell products or services over the internet. It typically includes features like product listings, a shopping cart, secure checkout, and payment processing. Users can browse items, compare prices, read reviews, and make purchases from the comfort of their home.",
      img: "/e-commerce.jpg",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", ],
      github: "https://github.com/shreyam91/ExploreAttire#",
      liveLink:"https://exploreattire-frontend.vercel.app/",
    },
  ];

  export const companies = [
    {
      id: 1,
      name: "herbalmg",
      img: "/herbalmg.png",
      nameImg: "/herbalmgName.png",
    }
  ]
  
  export const testimonials = [
    {
  quote:
    "Working with Shreyam on HerbalMG was a great experience. He delivered a fully functional medical eCommerce platform with a seamless user experience and a secure, scalable backend architecture. From building the React frontend to developing the Node.js and Express backend with PostgreSQL, and integrating the payment gateway, SMS API, delivery API, and ImageKit — everything was executed with professionalism and precision. His technical expertise, problem-solving skills, and attention to detail made the entire process smooth and efficient. I highly recommend him for any full-stack development project.",
  name: "Mohit Sharma",
  title: "Founder, HerbalMG (Medical eCommerce Platform)",
}
  ];
  
  
  export const workExperience = [
    {
      id: 1,
      title: "Full Stack Engineer Intern",
      desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
      className: "md:col-span-2",
      thumbnail: "/exp1.svg",
    },
    {
      id: 2,
      title: "Jr. Software Engineer",
      desc: "Designed and developed portal for patients to interact with health professionals.",
      className: "md:col-span-2", // change to md:col-span-2
      thumbnail: "/exp4.svg",
    },
    {
      id: 3,
      title: "Freelance App Dev Project",
      desc: "Led the dev of a web app for a client, from initial concept to deployment on internet.",
      className: "md:col-span-2", // change to md:col-span-2
      thumbnail: "/exp3.svg",
    },
    // {
    //   id: 4,
    //   title: "Lead Frontend Developer",
    //   desc: "Developed and maintained user-facing features using modern frontend technologies.",
    //   className: "md:col-span-2",
    //   thumbnail: "/exp4.svg",
    // },
  ];
  
  export const socialMedia = [
    {
      id: 1,
      img: "/git.svg",
      link:"https://github.com/shreyam91",
    },
    {
      id: 2,
      img: "/link.svg",
      link:"https://www.linkedin.com/in/shreyam-kanaujiya/",
    },
  ];