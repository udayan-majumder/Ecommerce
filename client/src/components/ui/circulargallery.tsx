import React, { useState, useEffect, useRef } from "react";

interface CardItem {
  image: string;
  text: string;
}

interface CircularGalleryProps {
  items?: CardItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  cardWidth?: number;
  cardHeight?: number;
  cardGap?: number;
}

const CircularGallery: React.FC<CircularGalleryProps> = ({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 16px system-ui",
  scrollSpeed = 2,
  scrollEase = 0.05,
  cardWidth = 480,
  cardHeight = 360,
  cardGap = 32,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [targetOffset, setTargetOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>(null);

  const defaultItems: CardItem[] = [
    { image: "https://picsum.photos/seed/1/600/450?grayscale", text: "Bridge" },
    {
      image: "https://picsum.photos/seed/2/600/450?grayscale",
      text: "Desk Setup",
    },
    {
      image: "https://picsum.photos/seed/3/600/450?grayscale",
      text: "Waterfall",
    },
    {
      image: "https://picsum.photos/seed/4/600/450?grayscale",
      text: "Strawberries",
    },
    {
      image: "https://picsum.photos/seed/5/600/450?grayscale",
      text: "Deep Diving",
    },
    {
      image: "https://picsum.photos/seed/6/600/450?grayscale",
      text: "Train Track",
    },
    {
      image: "https://picsum.photos/seed/7/600/450?grayscale",
      text: "Santorini",
    },
    {
      image: "https://picsum.photos/seed/8/600/450?grayscale",
      text: "Blurry Lights",
    },
    {
      image: "https://picsum.photos/seed/9/600/450?grayscale",
      text: "New York",
    },
    {
      image: "https://picsum.photos/seed/10/600/450?grayscale",
      text: "Good Boy",
    },
    {
      image: "https://picsum.photos/seed/11/600/450?grayscale",
      text: "Coastline",
    },
    {
      image: "https://picsum.photos/seed/12/600/450?grayscale",
      text: "Palm Trees",
    },
  ];

  const galleryItems = items && items.length ? items : defaultItems;
  const totalWidth = (cardWidth + cardGap) * galleryItems.length;

  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  };

  const animate = () => {
    setCurrentOffset((prev) => {
      const newOffset = lerp(prev, targetOffset, scrollEase);
      const diff = Math.abs(newOffset - targetOffset);

      if (diff < 0.1) {
        setIsAnimating(false);
        return targetOffset;
      }

      return newOffset;
    });
  };

  useEffect(() => {
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, targetOffset, scrollEase]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMouseDown = false;
    let startX = 0;
    let startOffset = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      startX = e.clientX;
      startOffset = currentOffset;
      container.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaX = e.clientX - startX;
      const newTarget = startOffset + deltaX * scrollSpeed;

      setTargetOffset(newTarget);
      setIsAnimating(true);
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      container.style.cursor = "grab";
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -cardWidth - cardGap : cardWidth + cardGap;
      setTargetOffset((prev) => prev + delta);
      setIsAnimating(true);
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);
    container.addEventListener("wheel", handleWheel);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [currentOffset, scrollSpeed, cardWidth, cardGap]);

  // Auto-scroll animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetOffset((prev) => {
        const newOffset = prev - (cardWidth + cardGap) * 0.5;
        // Reset when all cards have passed
        if (Math.abs(newOffset) >= totalWidth) {
          return 0;
        }
        return newOffset;
      });
      setIsAnimating(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalWidth, cardWidth, cardGap]);

  const getBendStyle = (index: number) => {
    const centerX = window.innerWidth / 2;
    const cardCenter =
      index * (cardWidth + cardGap) + currentOffset + cardWidth / 2;
    const distance = Math.abs(cardCenter - centerX);
    const maxDistance = window.innerWidth / 2;
    const bendFactor = Math.min(distance / maxDistance, 1);

    const rotateY = bendFactor * bend * (cardCenter < centerX ? 1 : -1);
    const translateZ = -bendFactor * 50;

    return {
      transform: `perspective(1000px) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      transition: isAnimating ? "transform 0.1s ease-out" : "none",
    };
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing relative"
      style={{
        background: "rgba(39, 38, 38, 0.18)",
        perspective: "1000px",
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div
        className="flex items-center h-full relative z-10"
        style={{
          transform: `translateX(${currentOffset}px)`,
          width: `${totalWidth * 2}px`,
        }}
      >
        {/* First set of cards */}
        {galleryItems.map((item, index) => (
          <div
            key={`first-${index}`}
            className="flex-shrink-0 group"
            style={{
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              marginRight: `${cardGap}px`,
              ...getBendStyle(index),
            }}
          >
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.text}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    borderRadius: `${borderRadius * 100}%`,
                  }}
                />
              </div>

              <div className="p-8 flex-shrink-0">
                <h3
                  className="text-2xl font-bold text-center leading-tight"
                  style={{
                    color: textColor,
                    fontFamily: font.includes("px")
                      ? font.split(" ").slice(2).join(" ")
                      : font,
                    fontSize: font.includes("px")
                      ? font.match(/\d+/)?.[0] + "px"
                      : "18px",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {item.text}
                </h3>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}

        {/* Second set of cards for seamless loop */}
        {galleryItems.map((item, index) => (
          <div
            key={`second-${index}`}
            className="flex-shrink-0 group"
            style={{
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              marginRight: `${cardGap}px`,
              ...getBendStyle(index + galleryItems.length),
            }}
          >
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.text}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    borderRadius: `${borderRadius * 100}%`,
                  }}
                />
              </div>

              <div className="p-8 flex-shrink-0">
                <h3
                  className="text-2xl font-bold text-center leading-tight"
                  style={{
                    color: textColor,
                    fontFamily: font.includes("px")
                      ? font.split(" ").slice(2).join(" ")
                      : font,
                    fontSize: font.includes("px")
                      ? font.match(/\d+/)?.[0] + "px"
                      : "18px",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {item.text}
                </h3>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation hints */}
    </div>
  );
};

export default CircularGallery;
