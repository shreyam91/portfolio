"use client";
import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { cn } from "@/lib/utils";

const Grid = () => {
  return (
    <section id="about" className=" text-white">
      <BentoGrid className="w-full py-20">
        {gridItems.map((item, i) => (
          <BentoGridItem
            id={item.id}
            key={i}
            title={
              item.id === 6 ? (
                <>
                <p className="text-white"> The best way to grow is to </p>
                <PointerHighlight
                  rectangleClassName="border-white/20 leading-loose"
                  pointerClassName="text-yellow-500 h-3 w-3"
                  containerClassName="inline-block mr-1"
                >
                  <span className="text-white">{item.title}</span>
                </PointerHighlight>
                </>
              ) : (
                <span className="text-white">{item.title}</span>
              )
            }
            description={item.description}
            className={cn(item.className, "bg-black/50 backdrop-blur-sm")}
            img={item.img}
            imgClassName={item.imgClassName}
            titleClassName={cn(item.titleClassName, "text-white")}
            spareImg={item.spareImg}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Grid;
