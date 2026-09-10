// Define the interface for a house
export interface Images {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  full: string;
}

// Create the array of images based on the public/images directory
const images: Images[] = [
  {
    id: 1,
    title: "Dark Mood",
    description: "A dark themed image.",
    thumbnail: "/images/dark.jpg",
    full: "/images/dark.jpg",
  },
  {
    id: 2,
    title: "Light Mood",
    description: "A light themed image.",
    thumbnail: "/images/light.jpg",
    full: "/images/light.jpg",
  },
  {
    id: 3,
    title: "Insect macro",
    description: "A close-up macro shot of an insect.",
    thumbnail: "/images/insect.jpg",
    full: "/images/insect.jpg",
  },
  {
    id: 4,
    title: "House in the Mountains",
    description:
      "A serene and tranquil retreat, this house offers peace away from the city.",
    thumbnail: "/images/mountains.jpeg",
    full: "/images/mountains.jpeg",
  },
  {
    id: 5,
    title: "Railway Station",
    description: "An evocative shot of a railway station.",
    thumbnail: "/images/station.jpg",
    full: "/images/station.jpg",
  },
  {
    id: 6,
    title: "Golden Sunset",
    description: "A beautiful golden sunset scenery.",
    thumbnail: "/images/sunset.jpg",
    full: "/images/sunset.jpg",
  },
  {
    id: 7,
    title: "Lone Tree",
    description: "A solitary tree standing in the landscape.",
    thumbnail: "/images/tree.jpg",
    full: "/images/tree.jpg",
  },
  {
    id: 8,
    title: "Forest Trees",
    description: "A lush view of forest trees.",
    thumbnail: "/images/trees.jpg",
    full: "/images/trees.jpg",
  },
  {
    id: 9,
    title: "Water Drops",
    description: "Macro photography of water droplets.",
    thumbnail: "/images/water-drops.jpg",
    full: "/images/water-drops.jpg",
  },
];

export default images;
