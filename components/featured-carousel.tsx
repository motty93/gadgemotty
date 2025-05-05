'use client'

import type { ArticleData } from '@/lib/markdown'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface FeaturedCarouselProps {
  articles: ArticleData[]
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  if (!articles.length) return null

  return (
    <div className="relative mb-6">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {articles.map((article) => (
            <div
              key={article.slug}
              className="flex-[0_0_100%] min-w-0 pl-4 sm:flex-[0_0_50%] md:flex-[0_0_33.33%]"
            >
              <div className="relative h-44 sm:h-48 md:h-52 mx-2 overflow-hidden rounded-lg group">
                <Link href={`/articles/${article.slug}`}>
                  <Image
                    src={article.image || '/placeholder.svg'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded mb-1">
                      {article.category}
                    </span>
                    <h3 className="text-white text-base font-bold mb-1 line-clamp-2">{article.title}</h3>
                    <span className="text-xs text-gray-300 block">{article.createdAt}</span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        aria-label="前へ"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        aria-label="次へ"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="flex justify-center mt-4 gap-2">
        {articles.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === selectedIndex ? 'bg-gray-800 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`スライド ${index + 1} に移動`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
