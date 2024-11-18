"use client";

import Autoplay from "embla-carousel-autoplay";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./CarouselDots";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { NextButton, PrevButton, usePrevNextButtons } from "./CarouselArrows";

/* API reference for Embla Carousel can be found here:
https://www.embla-carousel.com/api/ */

export type CarouselProps = {
  slides: Array<JSX.Element>;
  carouselOptions?: EmblaOptionsType;
  autoplay?: boolean;
  autoplayOptions?: object;
  dots?: boolean;
  dotsMargin?: number;
  arrows?: boolean;
  setEmblaApi?: (api: EmblaCarouselType) => void;
};

const Carousel = ({
  slides,
  carouselOptions,
  autoplay = false,
  autoplayOptions = {
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    rootNode: (emblaRoot: HTMLElement) => emblaRoot.parentElement,
  },
  dots = true,
  dotsMargin = 3,
  arrows = false,
  setEmblaApi,
}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    carouselOptions,
    autoplay ? [Autoplay(autoplayOptions)] : [WheelGesturesPlugin()]
  );

  const hasMultiplePages = emblaApi
    ? emblaApi.scrollSnapList().length > 1
    : false;

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <>
      <div className="m-auto carousel">
        <div className="overflow-hidden p-4" ref={emblaRef}>
          <div className="flex touch-pan-y touch-pinch-zoom -ml-[var(--slide-spacing)]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="relative flex grow-0 shrink-0 
                min-w-0 pl-[var(--slide-spacing)]
                basis-[var(--slide-size)]
                sm:basis-[var(--slide-size-sm)]
                md:basis-[var(--slide-size-md)]
                lg:basis-[var(--slide-size-lg)]
                xl:basis-[var(--slide-size-xl)]
                "
              >
                {slide}
              </div>
            ))}
          </div>
        </div>
      </div>

      {hasMultiplePages && (
        <div className="flex items-center mt-3 justify-center relative">
          {dots && (
            <div className="flex justify-center gap-3">
              {scrollSnaps.map((_, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={`mt-${dotsMargin} size-4 rounded-lg border-[2px] border-blue-medium ${
                    index === selectedIndex ? " bg-slate-700" : "bg-blue-bg"
                  }`}
                />
              ))}
            </div>
          )}

          {arrows && (
            <div className="hidden sm:flex absolute items-center justify-self-end right-0">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Carousel;
